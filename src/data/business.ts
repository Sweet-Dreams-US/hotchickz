/**
 * Hot Chickz — business facts.
 * Sourced from hotchickz.com and the live Canva menu.
 */

export interface DayHours {
  day: string
  short: string
  label: string
  open: string // 24h "HH:MM"
  close: string
}

export const BUSINESS = {
  name: 'Hot Chickz',
  legalName: 'Hot Chickz — Hot Chicken',
  tagline: 'Halal hot chicken, done loud.',
  slogan: 'Happy Tears',
  blurb:
    'Nashville-style hot chicken out of Fort Wayne, Indiana. Hand-breaded, cooked to order, and dialed in from No Spice to Reaper. 100% halal.',
  established: 2024,
  halal: true,

  address: {
    street: '1716 E Pontiac St',
    city: 'Fort Wayne',
    state: 'IN',
    zip: '46803',
  },
  get addressLine(): string {
    return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zip}`
  },

  phone: '(260) 209-9496',
  phoneRaw: '+12602099496',
  altPhone: '(260) 745-7722',
  altPhoneRaw: '+12607457722',
  email: 'order@hotchickz.com',

  mapUrl:
    'https://www.google.com/maps/dir/?api=1&destination=1716+E+Pontiac+St,+Fort+Wayne,+IN+46803',

  socials: {
    instagram: 'https://instagram.com/hotchickz.chicken',
    facebook: 'https://facebook.com/61573269818674',
    tiktok: 'https://www.tiktok.com/@hotchickz.chicken',
  },

  /** Monday-first week. */
  hours: [
    { day: 'Monday', short: 'Mon', label: '11am – 10pm', open: '11:00', close: '22:00' },
    { day: 'Tuesday', short: 'Tue', label: '11am – 10pm', open: '11:00', close: '22:00' },
    { day: 'Wednesday', short: 'Wed', label: '11am – 10pm', open: '11:00', close: '22:00' },
    { day: 'Thursday', short: 'Thu', label: '11am – 10pm', open: '11:00', close: '22:00' },
    { day: 'Friday', short: 'Fri', label: '11am – 11pm', open: '11:00', close: '23:00' },
    { day: 'Saturday', short: 'Sat', label: '11am – 11pm', open: '11:00', close: '23:00' },
    { day: 'Sunday', short: 'Sun', label: '11am – 10pm', open: '11:00', close: '22:00' },
  ] as DayHours[],
} as const

/** Returns whether the shop is open right now, plus today's hours. */
export function getOpenState(now: Date = new Date()): {
  open: boolean
  today: DayHours
} {
  // JS getDay(): 0=Sun..6=Sat. Our array is Mon-first.
  const jsDay = now.getDay()
  const index = jsDay === 0 ? 6 : jsDay - 1
  const today = BUSINESS.hours[index]
  const minutes = now.getHours() * 60 + now.getMinutes()
  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }
  const open = minutes >= toMin(today.open) && minutes < toMin(today.close)
  return { open, today }
}
