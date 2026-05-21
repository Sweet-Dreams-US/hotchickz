/**
 * Hot Chickz catering — trays + mix-and-match packages.
 * Transcribed from the live Canva menu's catering section.
 */

export interface CateringTray {
  id: string
  name: string
  description: string
  serves: string
  /** Tray photo — pass through asset() at render time. */
  image: string
}

export interface CateringPackage {
  id: string
  name: string
  price: number
  trays: number
  sides: number
  feeds: string
  popular?: boolean
  blurb: string
}

export const CATERING_TRAYS: CateringTray[] = [
  {
    id: 'tray-1',
    name: 'Chicken Over Fries Tray',
    description: 'Two half-pans of chopped chicken piled over fries, with sauce.',
    serves: 'Serves 8–10',
    image: 'assets/photos/catering/over-fries.jpg',
  },
  {
    id: 'tray-2',
    name: 'Slider Tray',
    description: 'Ten chicken sliders, each loaded with dill, slaw and signature sauce.',
    serves: '10 sliders',
    image: 'assets/photos/catering/sliders.jpg',
  },
  {
    id: 'tray-3',
    name: 'Tender Tray',
    description: 'Twenty hand-breaded tenders with bread and sauce.',
    serves: '20 tenders',
    image: 'assets/photos/catering/tenders.jpg',
  },
]

export const CATERING_PACKAGES: CateringPackage[] = [
  {
    id: 'pkg-warmup',
    name: 'The Warm-Up',
    price: 100,
    trays: 2,
    sides: 2,
    feeds: 'Feeds 8–12',
    blurb: 'Pick any 2 trays and 2 sides. A solid spread for a small crew.',
  },
  {
    id: 'pkg-cookout',
    name: 'The Cookout',
    price: 150,
    trays: 3,
    sides: 4,
    feeds: 'Feeds 15–20',
    popular: true,
    blurb: 'Pick any 3 trays and 4 sides. The sweet spot for parties.',
  },
  {
    id: 'pkg-blockparty',
    name: 'The Block Party',
    price: 200,
    trays: 4,
    sides: 6,
    feeds: 'Feeds 25–35',
    blurb: 'Pick any 4 trays and 6 sides. Bring the whole block.',
  },
]

export const CATERING_NOTE =
  'Hot Chickz catering is your way — mix and match any trays you want, every package comes with sides. Please place catering orders at least 2 hours in advance so we can have it hot and ready for you.'
