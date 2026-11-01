import 'server-only'
import fs from 'node:fs'
import path from 'node:path'

interface KVConfig {
  url: string
  token: string
}

function getKVConfig(): KVConfig | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (url && token) {
    return { url: url.replace(/\/$/, ''), token }
  }
  return null
}

const memoryStore = new Map<string, unknown>()

/**
 * Serverless KV getter:
 * 1. Checks Upstash Redis / Vercel KV REST if env vars exist.
 * 2. Falls back to local file in /data/<key>.json if readable.
 * 3. Falls back to in-memory store or defaultValue.
 */
export async function kvGet<T>(key: string, defaultValue: T): Promise<T> {
  const kv = getKVConfig()
  if (kv) {
    try {
      const res = await fetch(`${kv.url}/get/${key}`, {
        headers: { Authorization: `Bearer ${kv.token}` },
        cache: 'no-store',
      })
      if (res.ok) {
        const json = await res.json()
        if (json.result !== null && json.result !== undefined) {
          const parsed = typeof json.result === 'string' ? JSON.parse(json.result) : json.result
          memoryStore.set(key, parsed)
          return parsed as T
        }
      }
    } catch (err) {
      console.warn(`[serverless-kv] KV read error for "${key}", falling back to local:`, err)
    }
  }

  // Check memory store
  if (memoryStore.has(key)) {
    return memoryStore.get(key) as T
  }

  // Fallback to local file in dev/node environment
  try {
    const filePath = path.join(process.cwd(), 'data', `${key}.json`)
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(raw) as T
      memoryStore.set(key, parsed)
      return parsed
    }
  } catch (err) {
    console.warn(`[serverless-kv] Local file read error for "${key}":`, err)
  }

  return defaultValue
}

/**
 * Synchronous getter for Next.js SSR / components that need synchronous initial data.
 * Returns in-memory cache or local file, and defaultValue if neither exists.
 */
export function kvGetSync<T>(key: string, defaultValue: T): T {
  if (memoryStore.has(key)) {
    return memoryStore.get(key) as T
  }

  try {
    const filePath = path.join(process.cwd(), 'data', `${key}.json`)
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(raw) as T
      memoryStore.set(key, parsed)
      return parsed
    }
  } catch {
    // Read failure is normal on read-only environments if file doesn't exist
  }

  return defaultValue
}

/**
 * Serverless KV setter:
 * 1. Writes to Upstash Redis / Vercel KV REST if env vars exist.
 * 2. Writes to local disk file in /data/<key>.json if disk is writable.
 * 3. Caches in memory.
 */
export async function kvSet<T>(key: string, value: T): Promise<void> {
  memoryStore.set(key, value)

  const kv = getKVConfig()
  if (kv) {
    try {
      await fetch(`${kv.url}/set/${key}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kv.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(typeof value === 'string' ? value : JSON.stringify(value)),
      })
    } catch (err) {
      console.error(`[serverless-kv] KV write error for "${key}":`, err)
    }
  }

  // Attempt local disk write
  try {
    const dir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    const filePath = path.join(dir, `${key}.json`)
    fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf-8')
  } catch {
    // On serverless read-only disk, ignore filesystem write error
  }
}
