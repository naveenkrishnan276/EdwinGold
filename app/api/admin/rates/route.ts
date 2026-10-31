import { NextResponse, type NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getChennaiRates, saveChennaiRates } from '@/lib/rates/store'

function getExpectedPin(): string {
  return process.env.ADMIN_RATE_PIN?.trim() || '1234'
}

export async function GET(request: NextRequest) {
  const data = getChennaiRates()
  const hasCustomPin = Boolean(process.env.ADMIN_RATE_PIN?.trim())

  return NextResponse.json({
    data,
    isDefaultPin: !hasCustomPin,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pin, rates, note } = body

    const expectedPin = getExpectedPin()
    if (!pin || pin.trim() !== expectedPin) {
      return NextResponse.json(
        { error: 'Invalid Admin PIN. Please check your passcode and try again.' },
        { status: 401 },
      )
    }

    const rate24K = Number(rates?.['24K'])
    const rate22K = Number(rates?.['22K'])
    const rate18K = rates?.['18K'] !== undefined && rates?.['18K'] !== '' ? Number(rates['18K']) : undefined

    if (!Number.isFinite(rate24K) || rate24K <= 0) {
      return NextResponse.json({ error: 'Please enter a valid 24K gold rate per gram.' }, { status: 400 })
    }

    if (!Number.isFinite(rate22K) || rate22K <= 0) {
      return NextResponse.json({ error: 'Please enter a valid 22K gold rate per gram.' }, { status: 400 })
    }

    if (rate18K !== undefined && (!Number.isFinite(rate18K) || rate18K <= 0)) {
      return NextResponse.json({ error: 'Please enter a valid 18K gold rate per gram.' }, { status: 400 })
    }

    const updated = saveChennaiRates({
      '24K': rate24K,
      '22K': rate22K,
      '18K': rate18K,
      note: note?.trim(),
    })

    // Bust Next.js cache so the live website shows the updated numbers immediately
    try {
      revalidatePath('/')
      revalidatePath('/gold-rate')
    } catch (e) {
      // Revalidation in non-static contexts is safe to ignore
    }

    return NextResponse.json({
      success: true,
      message: 'Chennai gold rates updated successfully!',
      data: updated,
    })
  } catch (error) {
    console.error('[admin/rates] Update error:', error)
    return NextResponse.json({ error: 'Failed to update rates. Invalid request format.' }, { status: 500 })
  }
}
