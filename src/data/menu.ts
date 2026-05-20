/**
 * The Hot Chickz menu — transcribed from the live Canva menu, with
 * brand-voiced descriptions written for the storefront.
 *
 * Prices are stored in dollars. Use `round2()` from lib/format for any math.
 */

export type CategoryKey = 'meals' | 'platters' | 'tenders' | 'sides' | 'drinks'

export interface MenuCategory {
  key: CategoryKey
  name: string
  tagline: string
}

export interface OptionChoice {
  id: string
  label: string
  priceDelta?: number
}

export interface OptionGroup {
  id: string
  label: string
  required: boolean
  choices: OptionChoice[]
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: CategoryKey
  /** Heatable items show the heat-level picker on their card. */
  heatable: boolean
  options?: OptionGroup[]
  badge?: string
  featured?: boolean
  /** Filename inside public/assets/menu/ — components fall back gracefully. */
  image: string
}

export const CATEGORIES: MenuCategory[] = [
  { key: 'meals', name: 'Meals', tagline: 'Sliders & tenders — fries always included.' },
  { key: 'platters', name: 'Over Rice & Fries', tagline: 'Loaded platters, piled high.' },
  { key: 'tenders', name: 'Tender Boxes', tagline: 'By the half-dozen. Or by the ten.' },
  { key: 'sides', name: 'Sides', tagline: 'The supporting cast.' },
  { key: 'drinks', name: 'Drinks', tagline: 'Put the fire out.' },
]

export const MENU: MenuItem[] = [
  // ---- MEALS ----------------------------------------------------------
  {
    id: 'm-slider-1',
    name: 'Single Slider Meal',
    description:
      'One hand-breaded chicken slider on a toasted potato bun — dill, slaw, signature sauce — with a side of fries.',
    price: 7.99,
    category: 'meals',
    heatable: true,
    image: 'slider-meal.jpg',
  },
  {
    id: 'm-tenders-2',
    name: 'Two-Tender Meal',
    description:
      'Two craggy, golden tenders dialed to your heat, a fistful of fries, with dill chips and sauce on the side.',
    price: 8.99,
    category: 'meals',
    heatable: true,
    image: 'two-tender-meal.jpg',
  },
  {
    id: 'm-combo',
    name: 'Slider + Tender Meal',
    description:
      "Can't choose? Don't. One loaded slider, one crispy tender, and fries to bridge the gap.",
    price: 9.99,
    category: 'meals',
    heatable: true,
    badge: 'Crowd Favorite',
    featured: true,
    image: 'combo-meal.jpg',
  },
  {
    id: 'm-slider-2',
    name: 'Double Slider Meal',
    description:
      'Two stacked sliders — double the dill, double the crunch — with fries and sauce.',
    price: 11.99,
    category: 'meals',
    heatable: true,
    image: 'double-slider-meal.jpg',
  },

  // ---- OVER RICE & FRIES ---------------------------------------------
  {
    id: 'p-rice',
    name: 'Chicken Over Rice',
    description:
      'Chopped hot chicken over seasoned rice, finished with cool white sauce and a hard hit of hot sauce.',
    price: 10.99,
    category: 'platters',
    heatable: true,
    badge: 'Most Popular',
    featured: true,
    image: 'over-rice.jpg',
  },
  {
    id: 'p-fries',
    name: 'Chicken Over Fries',
    description:
      'The classic — chopped tenders piled on fries with sauce. Simple, loud, gone in minutes.',
    price: 9.99,
    category: 'platters',
    heatable: true,
    image: 'over-fries.jpg',
  },
  {
    id: 'p-fries-mac',
    name: 'Over Fries + Mac',
    description:
      'Chopped chicken and fries, anchored with a scoop of three-cheese mac n’ cheese.',
    price: 11.99,
    category: 'platters',
    heatable: true,
    image: 'over-fries-mac.jpg',
  },
  {
    id: 'p-fries-slaw',
    name: 'Over Fries + Slaw',
    description:
      'Chopped chicken and fries with crisp, cold slaw to keep the heat honest.',
    price: 11.99,
    category: 'platters',
    heatable: true,
    image: 'over-fries-slaw.jpg',
  },
  {
    id: 'p-loaded',
    name: 'The Loaded Platter',
    description:
      'The everything platter — chopped chicken, fries, mac AND slaw, all under sauce. The full ride.',
    price: 12.99,
    category: 'platters',
    heatable: true,
    badge: 'Best Value',
    featured: true,
    image: 'loaded-platter.jpg',
  },

  // ---- TENDER BOXES ---------------------------------------------------
  {
    id: 't-6',
    name: '6-Tender Box',
    description:
      'Half a dozen hand-breaded tenders with toasted bread and sauce. Built to share — if you’re feeling generous.',
    price: 17.99,
    category: 'tenders',
    heatable: true,
    image: 'tender-box-6.jpg',
  },
  {
    id: 't-10',
    name: '10-Tender Box',
    description:
      'Ten tenders deep. Bread, sauce, and enough heat to feed the whole crew.',
    price: 27.99,
    category: 'tenders',
    heatable: true,
    badge: 'Feeds the Squad',
    image: 'tender-box-10.jpg',
  },

  // ---- SIDES ----------------------------------------------------------
  {
    id: 's-fries',
    name: 'Fries',
    description: 'Golden, craggy-edged, salted the second they leave the oil.',
    price: 3.99,
    category: 'sides',
    heatable: false,
    image: 'fries.jpg',
  },
  {
    id: 's-cheesy-fries',
    name: 'Cheesy Fries',
    description: 'Our fries drowned in molten cheese sauce. Zero regrets.',
    price: 5.99,
    category: 'sides',
    heatable: false,
    image: 'cheesy-fries.jpg',
  },
  {
    id: 's-rice',
    name: 'Seasoned Rice',
    description: 'Fluffy, lightly spiced — the calm under the storm.',
    price: 2.99,
    category: 'sides',
    heatable: false,
    image: 'rice.jpg',
  },
  {
    id: 's-mac',
    name: 'Mac n’ Cheese',
    description: 'Three-cheese, creamy, deeply comforting.',
    price: 2.49,
    category: 'sides',
    heatable: false,
    image: 'mac.jpg',
  },
  {
    id: 's-slaw',
    name: 'Coleslaw',
    description: 'Cold, crisp, tangy — your heat-level insurance policy.',
    price: 2.49,
    category: 'sides',
    heatable: false,
    image: 'slaw.jpg',
  },
  {
    id: 's-dill',
    name: 'Dill Chips',
    description: 'Crunchy dill rounds. The crust’s best friend.',
    price: 2.49,
    category: 'sides',
    heatable: false,
    image: 'dill-chips.jpg',
  },
  {
    id: 's-cheese-sauce',
    name: 'Cheese Sauce',
    description: 'A warm cup of liquid gold for dunking.',
    price: 1.49,
    category: 'sides',
    heatable: false,
    image: 'cheese-sauce.jpg',
  },
  {
    id: 's-hot-sauce',
    name: 'Extra Hot Chickz Sauce',
    description: 'The house sauce, on the side, by the cup.',
    price: 0.99,
    category: 'sides',
    heatable: false,
    image: 'hot-sauce.jpg',
  },

  // ---- DRINKS ---------------------------------------------------------
  {
    id: 'd-fountain',
    name: 'Fountain Drink',
    description: 'Ice-cold soda, your pick from the machine.',
    price: 1.99,
    category: 'drinks',
    heatable: false,
    image: 'fountain.jpg',
    options: [
      {
        id: 'size',
        label: 'Size',
        required: true,
        choices: [
          { id: 'small', label: 'Small' },
          { id: 'large', label: 'Large', priceDelta: 0.5 },
        ],
      },
    ],
  },
  {
    id: 'd-lemonade',
    name: 'Hot Chickz Lemonade',
    description: 'House lemonade — sweet, tart, and very, very cold.',
    price: 2.49,
    category: 'drinks',
    heatable: false,
    image: 'lemonade.jpg',
    options: [
      {
        id: 'flavor',
        label: 'Flavor',
        required: true,
        choices: [
          { id: 'original', label: 'Original' },
          { id: 'blue', label: 'Blue Raspberry' },
          { id: 'cherry', label: 'Cherry' },
          { id: 'watermelon', label: 'Watermelon' },
          { id: 'mix', label: 'Mix It Up' },
        ],
      },
    ],
  },
]

export const MENU_BY_ID: Record<string, MenuItem> = MENU.reduce(
  (acc, item) => {
    acc[item.id] = item
    return acc
  },
  {} as Record<string, MenuItem>,
)

export const FEATURED_ITEMS: MenuItem[] = MENU.filter((item) => item.featured)

export function itemsByCategory(category: CategoryKey): MenuItem[] {
  return MENU.filter((item) => item.category === category)
}
