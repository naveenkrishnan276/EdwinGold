import { NextResponse, type NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getBranchConfig, saveBranchConfig } from '@/lib/branch/store'

function getExpectedPin(): string {
  return process.env.ADMIN_RATE_PIN?.trim() || ''
}

export async function GET() {
  const data = await getBranchConfig()
  const hasCustomPin = Boolean(process.env.ADMIN_RATE_PIN?.trim())

  return NextResponse.json({
    data,
    isDefaultPin: !hasCustomPin,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pin, address, contact, hours, maps } = body

    const expectedPin = getExpectedPin()
    if (!expectedPin || !pin || pin.trim() !== expectedPin) {
      return NextResponse.json(
        { error: 'Invalid Admin PIN. Please check your passcode and try again.' },
        { status: 401 },
      )
    }

    const updated = await saveBranchConfig({
      ...(address ? { address } : {}),
      ...(contact ? { contact } : {}),
      ...(Array.isArray(hours) ? { hours } : {}),
      ...(maps ? { maps } : {}),
    })

    try {
      revalidatePath('/')
      revalidatePath('/contact')
      revalidatePath('/about')
      revalidatePath('/gold-rate')
    } catch {
      // Revalidation in non-static contexts is safe to ignore
    }

    return NextResponse.json({
      success: true,
      message: 'Branch details & location updated successfully!',
      data: updated,
    })
  } catch (error) {
    console.error('[admin/branch] Update error:', error)
    return NextResponse.json({ error: 'Failed to update branch location. Invalid request format.' }, { status: 500 })
  }
}

