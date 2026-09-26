import {
  countBy,
  countByFn,
  cases,
  patterns,
  casesByPattern,
  knowledgeLabel,
} from '../data/cases'
import { IllustrationSlot, Kicker } from '../components/primitives'

/** Horizontal bar chart — navy bars, gold for the leader. */
function BarList({
  data,
}: {
  data: { label: string; value: number }[]
}) {
  const max = Math.max(...data.map((d) => d.value))
  return (
    <div className="space-y-4">
      {data.map((d, i) => (
        <div key={d.label}>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-sm text-navy/80">{d.label}</span>
            <span className="font-mono text-xs text-navy/50">
              {String(d.value).padStart(2, '0')}
            </span>
          </div>
          <div className="h-3 w-full bg-navy/10">
            <div
              className={`h-full ${i === 0 ? 'bg-gold' : 'bg-navy'}`}
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Vertical column chart for pattern distribution. */
function ColumnChart({
  data,
}: {
  data: { label: string; sub: string; value: number }[]
}) {
  const max = Math.max(...data.map((d) => d.value))
  return (
    <div className="flex items-end justify-between gap-4 h-56">
      {data.map((d, i) => (
        <div key={d.label} className="flex-1 flex flex-col items-center h-full">
          <div className="flex-1 w-full flex items-end">
            <div
              className={`w-full ${i === 0 ? 'bg-gold' : 'bg-navy'} transition-all`}
              style={{ height: `${(d.value / max) * 100}%` }}
            />
          </div>
          <div className="mt-3 text-center">
            <div className="font-serif text-2xl font-semibold text-ink">
              {d.value}
            </div>
            <div className="font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-navy/50 mt-1">
              {d.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function Insights() {
  const byIndustry = countBy('industry')
  const bySource = countByFn(knowledgeLabel)
  const byTier = countBy('tier')
  const byPattern = patterns.map((p) => ({
    label: p.no,
    sub: p.name,
    value: casesByPattern(p.id).length,
  }))

  return (
    <div className="px-5 md:px-10 py-12 md:py-16 max-w-[1400px] mx-auto">
      <Kicker className="text-gold">CHAPTER 04 · 数据洞察</Kicker>
      <div className="h-px w-full bg-navy/15 my-4" />
      <h1 className="font-serif text-4xl md:text-5xl font-semibold text-ink">
        数据洞察
      </h1>
      <p className="mt-4 max-w-xl text-navy/60 leading-relaxed">
        把本年鉴收录的案例做一次横切。图表只用藏青与烫金两色——数据本身已经足够说话。
      </p>

      {/* 21:9 wide illustration */}
      <div className="mt-10">
        <IllustrationSlot
          ratio="21:9"
          src={`${import.meta.env.BASE_URL}illustrations/insights-data.webp`}
          label="数据洞察 · Data Gallery"
        />
      </div>

      {/* Headline numbers */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-navy/15 border border-navy/15">
        {[
          { v: String(cases.length), l: '样本案例 · Sample' },
          { v: String(byIndustry.length), l: '覆盖行业 · Industries' },
          { v: String(patterns.length), l: '落地模式 · Patterns' },
          {
            v: String(cases.filter((c) => c.tier === 'S').length),
            l: 'S 级案例 · Tier S',
          },
        ].map((s) => (
          <div key={s.l} className="bg-cream p-6">
            <div className="font-serif text-4xl md:text-5xl font-semibold text-gold leading-none">
              {s.v}
            </div>
            <div className="mt-3 font-mono uppercase tracking-[0.14em] text-[0.625rem] text-navy/50">
              {s.l}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-12 grid md:grid-cols-2 gap-x-16 gap-y-14">
        <div>
          <div className="flex items-baseline justify-between border-b border-navy/15 pb-3 mb-6">
            <Kicker className="text-gold">FIG. 01 · 行业分布</Kicker>
            <span className="font-mono text-[0.5625rem] text-navy/40">
              BY INDUSTRY
            </span>
          </div>
          <BarList data={byIndustry} />
        </div>

        <div>
          <div className="flex items-baseline justify-between border-b border-navy/15 pb-3 mb-6">
            <Kicker className="text-gold">FIG. 02 · 知识来源分布</Kicker>
            <span className="font-mono text-[0.5625rem] text-navy/40">
              BY SOURCE
            </span>
          </div>
          <BarList data={bySource} />
        </div>

        <div>
          <div className="flex items-baseline justify-between border-b border-navy/15 pb-3 mb-6">
            <Kicker className="text-gold">FIG. 03 · 模式分布</Kicker>
            <span className="font-mono text-[0.5625rem] text-navy/40">
              BY PATTERN
            </span>
          </div>
          <ColumnChart data={byPattern} />
        </div>

        <div>
          <div className="flex items-baseline justify-between border-b border-navy/15 pb-3 mb-6">
            <Kicker className="text-gold">FIG. 04 · 档位分布</Kicker>
            <span className="font-mono text-[0.5625rem] text-navy/40">
              BY TIER
            </span>
          </div>
          <BarList data={byTier} />
        </div>
      </div>
    </div>
  )
}
