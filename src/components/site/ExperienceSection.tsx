import { motion } from 'framer-motion'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Flame } from '@/components/brand/Flame'
import { asset } from '@/lib/asset'

const SHOTS = [
  { src: 'happy-customer.jpg', alt: 'A happy Hot Chickz customer at the storefront', rotate: -3 },
  { src: 'dipping.jpg', alt: 'Dipping hot chicken tenders in cheese sauce', rotate: 2.5 },
  { src: 'cheese-drip.jpg', alt: 'A cheese-dipped Hot Chickz tender', rotate: -2 },
  { src: 'kitchen.jpg', alt: 'Inside the Hot Chickz kitchen', rotate: 3 },
  { src: 'storefront-customer.jpg', alt: 'Picking up a Hot Chickz order', rotate: -2.5 },
]

/** The "Happy Tears" brand moment — real photos of real people + real heat. */
export function ExperienceSection() {
  return (
    <section className="relative overflow-hidden bg-char py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-flame-radial opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <Eyebrow>The Hot Chickz experience</Eyebrow>
          <h2 className="mt-3 font-display text-5xl leading-[0.85] text-bone sm:text-7xl">
            WE COOK FOR THE
          </h2>
          <span className="mt-1 inline-flex items-center gap-3">
            <Flame size={30} />
            <span className="font-script text-7xl leading-none text-flare neon-flare sm:text-8xl">
              happy tears
            </span>
            <Flame size={30} />
          </span>
          <p className="mt-5 max-w-xl font-sans leading-relaxed text-smoke">
            That first bite, the slow build, the watering eyes, the grin you
            can&apos;t fight — that&apos;s the Hot Chickz feeling. Real chicken,
            real heat, real Fort Wayne.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {SHOTS.map((shot, i) => (
            <motion.div
              key={shot.src}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0, rotate: shot.rotate }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ rotate: 0, y: -8, scale: 1.04, zIndex: 10 }}
              className={
                'overflow-hidden rounded-2xl border border-bone/10 shadow-plate' +
                (i === 2 ? ' col-span-2 sm:col-span-1' : '')
              }
            >
              <img
                src={asset(`assets/photos/${shot.src}`)}
                alt={shot.alt}
                loading="lazy"
                className="aspect-[3/4] h-full w-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
