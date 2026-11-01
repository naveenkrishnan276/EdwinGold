export interface BranchConfig {
  name: string
  tagline: string
  descriptor: string
  address: {
    streetAddress: string
    landmark: string
    locality: string
    city: string
    region: string
    postalCode: string
    country: string
  }
  contact: {
    phone: string
    whatsapp: string
    email: string
  }
  hours: string[]
  maps: {
    directionsUrl: string
    embedUrl: string
  }
  updatedAt: string
}

