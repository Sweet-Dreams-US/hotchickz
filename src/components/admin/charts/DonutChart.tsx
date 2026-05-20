import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

export interface DonutSlice {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  data: DonutSlice[]
  size?: number
  centerValue?: string
  centerLabel?: string
}

/** Donut breakdown with a hover-highlighted legend. */
export function DonutChart({
  data,
  size = 168,
  centerValue,
  centerLabel,
}: DonutChartProps) {
  const [hover, setHover] = useState<number | null>(null)
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1
  const stroke = 24
  const radius = (size - stroke - 6) / 2
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <div className="flex flex-col items-center gap-5">
      <svg width={size} height={size} className="shrink-0">
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#231A15"
            strokeWidth={stroke}
          />
          {data.map((slice, i) => {
            const dash = (slice.value / total) * circumference
            const node = (
              <motion.circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth={hover === i ? stroke + 5 : stroke}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                initial={{ opacity: 0 }}
                animate={{ opacity: hover === null || hover === i ? 1 : 0.4 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: 'pointer' }}
              />
            )
            offset += dash
            return node
          })}
        </g>
        {(centerValue || centerLabel) && (
          <g>
            <text
              x={size / 2}
              y={size / 2 - 2}
              textAnchor="middle"
              className="fill-bone font-display"
              style={{ fontSize: 26 }}
            >
              {centerValue}
            </text>
            <text
              x={size / 2}
              y={size / 2 + 16}
              textAnchor="middle"
              className="fill-smoke font-heading"
              style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.12em' }}
            >
              {centerLabel?.toUpperCase()}
            </text>
          </g>
        )}
      </svg>

      <ul className="w-full space-y-2">
        {data.map((slice, i) => {
          const pct = Math.round((slice.value / total) * 100)
          return (
            <li
              key={slice.label}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors',
                hover === i && 'bg-char/60',
              )}
            >
              <span
                className="h-3 w-3 shrink-0 rounded-sm"
                style={{ backgroundColor: slice.color }}
              />
              <span className="flex-1 font-sans text-sm text-bone">
                {slice.label}
              </span>
              <span className="font-heading text-xs font-extrabold text-smoke">
                {pct}%
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
