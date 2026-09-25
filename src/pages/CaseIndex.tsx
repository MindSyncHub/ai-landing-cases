import { useMemo, useState } from 'react'
import { Link } from '../router'
import {
  cases,
  industries,
  sourceTypes,
  tiers,
  knowledgeLabel,
  painPointLabels,
  type Tier,
} from '../data/cases'
import { Kicker, TierBadge } from '../components/primitives'

type Filter = {
  pain: string | null
  industry: string | null
  source: string | null
  tier: Tier | null
}

function FilterGroup({
  label,
  options,
  active,
  onPick,
}: {
  label: string
  options: string[]
  active: string | null
  onPick: (v: string | null) => void
}) {
  return (
    <div className="py-5 border-b border-navy/15">
      <div className="font-mono uppercase tracking-[0.16em] text-[0.625rem] text-navy/50 mb-3">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onPick(null)}
          className={`font-mono text-[0.6875rem] uppercase tracking-[0.1em] px-3 py-1.5 border transition-colors ${
            active === null
              ? 'border-gold text-gold'
              : 'border-navy/15 text-navy/60 hover:border-navy/40'
          }`}
        >
          全部
        </button>
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onPick(o)}
            className={`text-[0.8125rem] px-3 py-1.5 border transition-colors ${
              active === o
                ? 'border-gold text-gold bg-gold/5'
                : 'border-navy/15 text-navy/70 hover:border-navy/40'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

export function CaseIndex() {
  const [filter, setFilter] = useState<Filter>({
    pain: null,
    industry: null,
    source: null,
    tier: null,
  })

  const painOptions = [
    ...new Set(cases.flatMap((c) => painPointLabels(c))),
  ].sort()

  const filtered = useMemo(
    () =>
      cases.filter(
        (c) =>
          (!filter.pain || painPointLabels(c).includes(filter.pain)) &&
          (!filter.industry || c.industry === filter.industry) &&
          (!filter.source || knowledgeLabel(c) === filter.source) &&
          (!filter.tier || c.tier === filter.tier),
      ),
    [filter],
  )

  return (
    <div className="px-5 md:px-10 py-12 md:py-16 max-w-[1400px] mx-auto">
      <Kicker className="text-gold">CHAPTER 02 · 案例索引</Kicker>
      <div className="h-px w-full bg-navy/15 my-4" />
      <h1 className="font-serif text-4xl md:text-5xl font-semibold text-ink">
        案例索引
      </h1>
      <p className="mt-4 max-w-xl text-navy/60 leading-relaxed">
        按行业、知识来源与档位检索。目录式排版，每一行都是一个进入生产环境的故事。
      </p>

      <div className="mt-12 grid md:grid-cols-12 gap-10">
        {/* Filters */}
        <aside className="md:col-span-3">
          <div className="md:sticky md:top-36">
            <div className="font-mono uppercase tracking-[0.16em] text-[0.625rem] text-navy/60 border-b border-navy/15 pb-3">
              筛选 · FILTER
            </div>
            <FilterGroup
              label="业务痛点 · PAIN POINT"
              options={painOptions}
              active={filter.pain}
              onPick={(v) => setFilter((f) => ({ ...f, pain: v }))}
            />
            <FilterGroup
              label="行业 · INDUSTRY"
              options={industries}
              active={filter.industry}
              onPick={(v) => setFilter((f) => ({ ...f, industry: v }))}
            />
            <FilterGroup
              label="知识来源 · SOURCE"
              options={sourceTypes}
              active={filter.source}
              onPick={(v) => setFilter((f) => ({ ...f, source: v }))}
            />
            <FilterGroup
              label="档位 · TIER"
              options={tiers}
              active={filter.tier}
              onPick={(v) => setFilter((f) => ({ ...f, tier: v as Tier | null }))}
            />
          </div>
        </aside>

        {/* Listing */}
        <div className="md:col-span-9">
          <div className="flex items-baseline justify-between border-b-2 border-navy/80 pb-3">
            <span className="font-mono uppercase tracking-[0.16em] text-[0.625rem] text-navy/60">
              目录 · CONTENTS
            </span>
            <span className="font-mono text-[0.625rem] text-navy/50">
              {String(filtered.length).padStart(2, '0')} / {cases.length} 例
            </span>
          </div>

          {filtered.length === 0 ? (
            <p className="py-16 text-center text-navy/50 font-mono text-sm uppercase tracking-[0.14em]">
              无匹配案例 · No matches
            </p>
          ) : (
            <ul>
              {filtered.map((c, i) => (
                <li key={c.id}>
                  <Link
                    to={`/case/${c.id}`}
                    className="group grid grid-cols-12 gap-3 items-baseline py-5 border-b border-navy/15 hover:bg-bluegray/40 transition-colors -mx-3 px-3"
                  >
                    <span className="col-span-2 md:col-span-1 font-mono text-sm text-navy/40">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="col-span-10 md:col-span-6 flex items-start gap-3">
                      <div>
                        <span className="font-serif text-xl md:text-2xl font-semibold text-ink group-hover:text-gold transition-colors">
                          {c.company}
                        </span>
                        <span className="block mt-0.5 text-sm text-navy/50">
                          {c.scenario}
                        </span>
                      </div>
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
          )}
        </div>
      </div>
    </div>
  )
}
