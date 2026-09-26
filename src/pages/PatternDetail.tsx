import { Link } from '../router'
import {
  patternById,
  casesByPattern,
  patterns,
  knowledgeLabel,
} from '../data/cases'
import { IllustrationSlot, Kicker, TierBadge } from '../components/primitives'

export function PatternDetail({ id }: { id: string }) {
  const p = patternById(id)

  if (!p) {
    return (
      <div className="px-5 md:px-10 py-24 max-w-[1400px] mx-auto text-center">
        <p className="font-mono uppercase tracking-[0.14em] text-navy/50 text-sm">
          未找到该模式 · Pattern not found
        </p>
        <Link
          to="/patterns"
          className="inline-block mt-6 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-gold border border-gold px-5 py-2.5"
        >
          返回模式库
        </Link>
      </div>
    )
  }

  const list = casesByPattern(p.id)
  const idx = patterns.findIndex((x) => x.id === p.id)
  const next = patterns[(idx + 1) % patterns.length]

  return (
    <div className="px-5 md:px-10 py-12 md:py-16 max-w-[1400px] mx-auto">
      <Link
        to="/patterns"
        className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-navy/50 hover:text-gold transition-colors"
      >
        ← 模式库 · PATTERNS
      </Link>

      {/* Numbered section head */}
      <div className="mt-8 grid md:grid-cols-12 gap-6 items-end pb-8 border-b-2 border-navy/80">
        <div className="md:col-span-2">
          <span className="font-serif text-7xl md:text-8xl font-semibold text-gold leading-none">
            {p.no}
          </span>
        </div>
        <div className="md:col-span-10">
          <Kicker className="text-gold">CHAPTER {p.no} · {p.nameEn}</Kicker>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl font-semibold text-ink">
            {p.name}
          </h1>
        </div>
      </div>

      {/* 16:9 illustration */}
      <div className="mt-8">
        <IllustrationSlot
          ratio="16:9"
          src={
            {
              m1: `${import.meta.env.BASE_URL}illustrations/pattern-m1-validation.webp`,
              m2: `${import.meta.env.BASE_URL}illustrations/pattern-m2-copilot.webp`,
              m3: `${import.meta.env.BASE_URL}illustrations/pattern-m3-knowledge.webp`,
              m4: `${import.meta.env.BASE_URL}illustrations/pattern-m4-reliability.webp`,
              m5: `${import.meta.env.BASE_URL}illustrations/pattern-m5-spread.webp`,
            }[p.id]
          }
          label={`${p.name} · 模式插画`}
        />
      </div>

      {/* Description */}
      <div className="mt-10 grid md:grid-cols-12 gap-8">
        <div className="md:col-span-3">
          <Kicker className="text-navy/50">DEFINITION · 定义</Kicker>
        </div>
        <div className="md:col-span-9">
          <p className="font-serif text-xl md:text-2xl leading-relaxed text-navy mb-6">
            {p.summary}
          </p>
          <p className="text-navy/70 leading-relaxed text-[1.0625rem]">
            {p.definition}
          </p>
        </div>
      </div>

      {/* Signals / actions / anti-patterns */}
      <div className="mt-16 grid md:grid-cols-3 gap-px bg-navy/15 border border-navy/15">
        <div className="bg-cream p-7">
          <Kicker className="text-gold">SIGNALS</Kicker>
          <div className="mt-2 text-sm text-navy/50 mb-5">适用信号</div>
          <ul className="space-y-4">
            {p.signals.map((t, i) => (
              <li key={i} className="flex gap-3 text-[0.9375rem] leading-relaxed text-navy/80">
                <span className="font-serif text-gold shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-cream p-7">
          <Kicker className="text-gold">ACTIONS</Kicker>
          <div className="mt-2 text-sm text-navy/50 mb-5">关键动作</div>
          <ul className="space-y-4">
            {p.actions.map((t, i) => (
              <li key={i} className="flex gap-3 text-[0.9375rem] leading-relaxed text-navy/80">
                <span className="font-serif text-gold shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-cream p-7">
          <Kicker className="text-navy/40">ANTI-PATTERNS</Kicker>
          <div className="mt-2 text-sm text-navy/50 mb-5">反模式 · 什么时候会失败</div>
          <ul className="space-y-4">
            {p.antiPatterns.map((t, i) => (
              <li key={i} className="flex gap-3 text-[0.9375rem] leading-relaxed text-navy/60">
                <span className="font-serif text-navy/30 shrink-0">✕</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Case list under this pattern */}
      <div className="mt-16">
        <div className="flex items-baseline justify-between border-b-2 border-navy/80 pb-3">
          <Kicker className="text-gold">CASES · 本模式案例</Kicker>
          <span className="font-mono text-[0.625rem] text-navy/50">
            {String(list.length).padStart(2, '0')} 例
          </span>
        </div>
        <ul>
          {list.map((c, i) => (
            <li key={c.id}>
              <Link
                to={`/case/${c.id}`}
                className="group grid grid-cols-12 gap-3 items-baseline py-5 border-b border-navy/15 hover:bg-bluegray/40 transition-colors -mx-3 px-3"
              >
                <span className="col-span-2 md:col-span-1 font-mono text-sm text-navy/40">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="col-span-10 md:col-span-6 flex items-center gap-3">
                  <span className="font-serif text-xl md:text-2xl font-semibold text-ink group-hover:text-gold transition-colors">
                    {c.company}
                  </span>
                  <TierBadge tier={c.tier} />
                </div>
                <span className="hidden md:block md:col-span-3 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-navy/50">
                  {knowledgeLabel(c)}
                </span>
                <span className="col-span-12 md:col-span-2 md:text-right font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-navy/70">
                  {c.industry}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Next pattern */}
      <Link
        to={`/pattern/${next.id}`}
        className="group mt-14 flex items-center justify-between border-t border-navy/15 pt-8"
      >
        <span className="font-mono uppercase tracking-[0.16em] text-[0.625rem] text-navy/50">
          下一个模式 · Next
        </span>
        <span className="font-serif text-2xl font-semibold text-navy group-hover:text-gold transition-colors">
          {next.no} {next.name} →
        </span>
      </Link>
    </div>
  )
}
