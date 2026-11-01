import 'server-only'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import type { BranchConfig } from './types'

export const DEFAULT_BRANCH: BranchConfig = {
  name: 'EDWIN GOLD',
  tagline: 'Your Gold. Your Value.',
  descriptor: 'CASH FOR GOLD',
  address: {
    streetAddress: 'Near Oragadam Bus Stop',
    landmark: 'Opposite Naidu Mall, Near Oragadam Bus Stop',
    locality: 'Ambattur',
    city: 'Chennai',
    region: 'Tamil Nadu',
    postalCode: '600053',
    country: 'India',
  },
  contact: {
    phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+91 98400 12345',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919840012345',
    email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'contact@edwingold.com',
  },
  hours: ['Mon–Sat: 10:00 AM – 8:00 PM', 'Sunday: 10:00 AM – 2:00 PM'],
  maps: {
    directionsUrl: 'https://maps.app.goo.gl/iCzQXCbe9vHUt9B3A?g_st=ic',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1942.7988!2d80.1529368!3d13.1265142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5263b65a3b0193%3A0xe18892ad5eb11a55!2sEdwin%20Gold!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  },
  updatedAt: new Date().toISOString(),
}

export async function getBranchConfig(): Promise<BranchConfig> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'branch').maybeSingle()
  if (error) throw new Error(`Unable to read branch settings: ${error.message}`)
  return (data?.value as BranchConfig | null) ?? DEFAULT_BRANCH
}

export function getBranchConfigSync(): BranchConfig {
  return DEFAULT_BRANCH
}

export async function saveBranchConfig(update: Partial<BranchConfig>): Promise<BranchConfig> {
  const current = await getBranchConfig()
  const merged: BranchConfig = {
    ...current,
    ...update,
    address: {
      ...current.address,
      ...(update.address || {}),
    },
    contact: {
      ...current.contact,
      ...(update.contact || {}),
    },
    maps: {
      ...current.maps,
      ...(update.maps || {}),
    },
    updatedAt: new Date().toISOString(),
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('site_settings').upsert({ key: 'branch', value: merged, updated_at: merged.updatedAt })
  if (error) throw new Error(`Unable to save branch settings: ${error.message}`)
  return merged
}
