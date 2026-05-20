import { useId, useState } from 'react'
import { motion } from 'framer-motion'
import { useMeasure } from '@/lib/useMeasure'

export interface ChartPoint {
  label: string
  value: number
}

interface AreaChartProps {
  data: ChartPoint[]
  height?: number
  color?: string
  format?: (value: number) => string
}

/** Animated area + line chart with a hover read-out. */
export function AreaChart({
  data,
  height = 220,
  color = '#FF6A14',
  format = (v) => `${v}`,
}: AreaChartProps) {
  const [ref, width] = useMeasure<HTMLDivElement>()
  const gradientId = useId()
  const [hover, setHover] = useState<number | null>(null)

  const padX = 6
  const padTop = 18
  const padBottom = 28
  const innerW = Math.max(width - padX * 2, 1)
  const innerH = Math.max(height - padTop - padBottom, 1)
  const bottom = padTop + innerH

  const values = data.map((d) => d.value)
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  const span = hi - lo || 1
  const domainMin = lo - span * 0.15
  const domain = span * 1.3

  const xAt = (i: number) =>
    padX + (data.length <= 1 ? innerW / 2 : (i / (data.length - 1)) * innerW)
  const yAt = (v: number) =>
    padTop + innerH - ((v - domainMin) / domain) * innerH

  const linePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yAt(d.value).toFixed(1)}`)
    .join(' ')
  const areaPath = `${linePath} L ${xAt(data.length - 1).toFixed(1)} ${bottom} L ${xAt(0).toFixed(1)} ${bottom} Z`
  const labelStep = Math.max(1, Math.ceil(data.length / 6))

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const i = Math.round(((e.clientX - rect.left - padX) / innerW) * (data.length - 1))
    setHover(Math.max(0, Math.min(data.length - 1, i)))
  }

  const tipW = 86
  const tipX =
    hover !== null
      ? Math.max(padX, Math.min(width - padX - tipW, xAt(hover) - tipW / 2))
      : 0

  return (
    <div ref={ref} style={{ height }}>
      {width > 0 && (
        <svg
          width={width}
          height={height}
          onMouseMove={handleMove}
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.42} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          {[0, 0.5, 1].map((t) => (
            <line
              key={t}
              x1={padX}
              x2={width - padX}
              y1={padTop + t * innerH}
              y2={padTop + t * innerH}
              stroke="rgba(247,238,221,0.07)"
            />
          ))}

          <motion.path
            d={areaPath}
            fill={`url(#${gradientId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          />
          <motion.path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />

          {data.map((d, i) =>
            i % labelStep === 0 ? (
              <text
                key={i}
                x={xAt(i)}
                y={height - 8}
                textAnchor="middle"
                className="fill-smoke font-sans"
                style={{ fontSize: 10 }}
              >
                {d.label}
              </text>
            ) : null,
          )}

          {hover !== null && (
            <g>
              <line
                x1={xAt(hover)}
                x2={xAt(hover)}
                y1={padTop}
                y2={bottom}
                stroke={color}
                strokeDasharray="3 3"
                opacity={0.6}
              />
              <circle
                cx={xAt(hover)}
                cy={yAt(data[hover].value)}
                r={4.5}
                fill={color}
                stroke="#19120F"
                strokeWidth={2}
              />
              <rect
                x={tipX}
                y={2}
                width={tipW}
                height={31}
                rx={6}
                fill="#100B09"
                stroke="rgba(247,238,221,0.12)"
              />
              <text
                x={tipX + tipW / 2}
                y={15}
                textAnchor="middle"
                className="fill-bone font-heading"
                style={{ fontSize: 11, fontWeight: 800 }}
              >
                {format(data[hover].value)}
              </text>
              <text
                x={tipX + tipW / 2}
                y={27}
                textAnchor="middle"
                className="fill-smoke font-sans"
                style={{ fontSize: 9 }}
              >
                {data[hover].label}
              </text>
            </g>
          )}
        </svg>
      )}
    </div>
  )
}
