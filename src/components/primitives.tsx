import type { ReactNode } from 'react'

/** Kicker: mono, uppercase, small — the editorial tag. */
export function Kicker({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={`font-mono uppercase tracking-[0.18em] text-[0.6875rem] font-medium ${className}`}
    >
      {children}
    </span>
  )
}

/** Section head: kicker + hairline + serif title. */
export function SectionHead({
  kicker,
  title,
  onDark = false,
}: {
  kicker: string
  title: string
  onDark?: boolean
}) {
  const kickerColor = onDark ? 'text-gold' : 'text-gold'
  const lineColor = onDark ? 'bg-cream/25' : 'bg-navy/15'
  const titleColor = onDark ? 'text-cream' : 'text-ink'
  return (
    <div className="mb-10">
      <Kicker className={kickerColor}>{kicker}</Kicker>
      <div className={`h-px w-full ${lineColor} my-4`} />
      <h2
        className={`font-serif ${titleColor} text-3xl md:text-4xl font-semibold leading-tight`}
      >
        {title}
      </h2>
    </div>
  )
}

/** Card: square corners, hairline border, no shadow, no radius. */
export function Card({
  children,
  className = '',
  onDark = false,
}: {
  children: ReactNode
  className?: string
  onDark?: boolean
}) {
  const border = onDark ? 'border-cream/20' : 'border-navy/15'
  return (
    <div className={`border ${border} ${className}`}>{children}</div>
  )
}

const RATIOS: Record<string, string> = {
  '4:3': 'aspect-[4/3]',
  '16:9': 'aspect-[16/9]',
  '21:9': 'aspect-[21/9]',
}

/** Illustration slot — renders image when src given, else navy placeholder. */
export function IllustrationSlot({
  ratio,
  label = 'ILLUSTRATION',
  src,
  className = '',
}: {
  ratio: '4:3' | '16:9' | '21:9'
  label?: string
  src?: string
  className?: string
}) {
  if (src) {
    return (
      <div className={`${RATIOS[ratio]} w-full ${className}`}>
        <img
          src={src}
          alt={label}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    )
  }
  return (
    <div
      className={`${RATIOS[ratio]} w-full bg-navy/[0.08] flex items-center justify-center ${className}`}
    >
      <div className="flex flex-col items-center gap-2">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-navy/30"
        >
          <rect x="3" y="4" width="18" height="16" />
          <path d="M3 16l5-5 4 4 3-3 6 6" />
          <circle cx="8.5" cy="9" r="1.5" />
        </svg>
        <span className="font-mono uppercase tracking-[0.2em] text-[0.625rem] text-navy/35">
          {label}
        </span>
      </div>
    </div>
  )
}

/** Big serif number for stat matrices. */
export function StatMatrix({
  stats,
  onDark = true,
}: {
  stats: { value: string; label: string; sub?: string }[]
  onDark?: boolean
}) {
  const labelColor = onDark ? 'text-cream/60' : 'text-navy/60'
  return (
    <div className="grid grid-cols-3 gap-px bg-transparent">
      {stats.map((s, i) => (
        <div key={i} className="pr-6">
          <div className="font-serif text-gold font-semibold leading-none text-[4rem] md:text-[5.5rem]">
            {s.value}
          </div>
          <div className={`mt-3 font-mono uppercase tracking-[0.16em] text-[0.6875rem] ${labelColor}`}>
            {s.label}
          </div>
          {s.sub && (
            <div className={`mt-1 text-sm ${labelColor}`}>{s.sub}</div>
          )}
        </div>
      ))}
    </div>
  )
}

/** Tier badge：S 金字方框；标准/概览为宽框弱色。 */
export function TierBadge({ tier }: { tier: string }) {
  const isS = tier === 'S'
  return (
    <span
      className={`inline-flex items-center justify-center px-1.5 h-6 border font-mono text-xs font-semibold shrink-0 ${
        isS
          ? 'w-6 border-gold text-gold'
          : 'border-navy/30 text-navy/50'
      }`}
    >
      {tier}
    </span>
  )
}
