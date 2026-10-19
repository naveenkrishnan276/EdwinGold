const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const inrWhole = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export function formatINR(value: number, { whole = false } = {}): string {
  return (whole ? inrWhole : inr).format(value)
}

export function formatGrams(value: number): string {
  return `${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 3 }).format(value)} g`
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(iso)) + ' IST'
}

export function formatAge(minutes: number): string {
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 48) return `${hours} hr${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} days ago`
}
