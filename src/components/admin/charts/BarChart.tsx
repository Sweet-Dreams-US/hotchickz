import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMeasure } from '@/lib/useMeasure'
import type { ChartPoint } from './AreaChart'

interface BarChartProps {
  data: ChartPoint[]
  height?: number
  color?: string
  format?: (value: number) => string
}

/** Animated vertical bar chart — bars grow from the baseline on mount. */
export function BarChart({
  data,
  height = 220,
  color = '#E4231B',
  format = (v) => `${v}`,
}: BarChartProps) {
  const [ref, width] = useMeasure<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)

  const padX = 4
  const padTop = 26
  const padBottom = 26
  const innerW = Math.max(width - padX * 2, 1)
  const innerH = Math.max(height - padTop - padBottom, 1)
  const max = Math.max(...data.map((d) => d.value)) || 1
  const slot = innerW / Math.max(data.length, 1)
  const barW = Math.min(slot * 0.62, 48)

  return (
    <div ref={ref} style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height}>
          {data.map((d, i) => {
            const barH = (d.value / max) * innerH
            const x = padX + i * slot + (slot - barW) / 2
            const y = padTop + innerH - barH
            const active = hover === i
            return (
              <g
                key={i}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <rect
                  x={padX + i * slot}
                  y={padTop}
                  width={slot}
                  height={innerH}
                  fill="transparent"
                />
                <motion.rect
                  x={x}
                  width={barW}
                  rx={5}
                  fill={color}
                  opacity={active ? 1 : 0.82}
                  initial={{ height: 0, y: padTop + innerH }}
                  animate={{ height: barH, y }}
                  transition={{ duration: 0.7, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                />
                {(data.length <= 9 || active) && (
                  <text
                    x={x + barW / 2}
                    y={y - 7}
                    textAnchor="middle"
                    className="fill-bone font-heading"
                    style={{ fontSize: 10, fontWeight: 800 }}
                  >
                    {format(d.value)}
                  </text>
                )}
                <text
                  x={padX + i * slot + slot / 2}
                  y={height - 8}
                  textAnchor="middle"
                  className="fill-smoke font-sans"
                  style={{ fontSize: 10 }}
                >
                  {d.label}
                </text>
              </g>
            )
          })}
        </svg>
      )}
    </div>
  )
}
