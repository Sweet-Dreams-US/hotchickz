/**
 * The Hot Chickz heat ladder — the brand's signature interactive motif.
 * Five levels, each with its own color drawn from the Tailwind `heat.*` ramp.
 */

export type HeatKey = 'none' | 'mild' | 'hot' | 'blaze' | 'reaper'

export interface HeatLevel {
  key: HeatKey
  name: string
  /** Lit flames on the 0–5 heat meter. */
  flames: number
  /** Hex pulled from tailwind theme `heat.*`. */
  color: string
  blurb: string
  scoville: string
}

export const HEAT_LEVELS: HeatLevel[] = [
  {
    key: 'none',
    name: 'No Spice',
    flames: 0,
    color: '#74B49A',
    blurb: 'All crunch, zero burn. The crust still slaps.',
    scoville: '0 SHU',
  },
  {
    key: 'mild',
    name: 'Mild',
    flames: 1,
    color: '#FFC230',
    blurb: 'A friendly warm-up. Flavor forward, gentle finish.',
    scoville: '~1K SHU',
  },
  {
    key: 'hot',
    name: 'Hot',
    flames: 2,
    color: '#FF6A14',
    blurb: 'The house standard. A real, honest sting.',
    scoville: '~15K SHU',
  },
  {
    key: 'blaze',
    name: 'Blaze',
    flames: 4,
    color: '#E4231B',
    blurb: 'Serious heat. Lips buzzing, eyes wide open.',
    scoville: '~80K SHU',
  },
  {
    key: 'reaper',
    name: 'Reaper',
    flames: 5,
    color: '#9A1140',
    blurb: 'Carolina Reaper mash. Sign the waiver. Regret optional.',
    scoville: '1.5M+ SHU',
  },
]

export const HEAT_BY_KEY: Record<HeatKey, HeatLevel> = HEAT_LEVELS.reduce(
  (acc, level) => {
    acc[level.key] = level
    return acc
  },
  {} as Record<HeatKey, HeatLevel>,
)

/** Default heat for a heatable item when first added to the bag. */
export const DEFAULT_HEAT: HeatKey = 'hot'
