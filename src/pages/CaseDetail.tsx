import { Link } from '../router'
import {
  caseById,
  patternById,
  casesByPattern,
  knowledgeLabel,
  DIM_LABELS,
  DIM_NAMES,
  painPointLabels,
  type Case,
} from '../data/cases'
import { Kicker, TierBadge } from '../components/primitives'

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-3">
      <div className="font-mono uppercase tracking-[0.16em] text-[0.5625rem] text-navy/40">
        {label}
      </div>
      <div className="mt-1 text-sm text-navy leading-snug">{value}</div>
    </div>
  )
}

function Section({
  no,
  kicker,
  title,
  body,
}: {
  no: string
  kicker: string
  title: string
  body: string
}) {
  if (!body) return null
  return (
    <section className="grid md:grid-cols-12 gap-4 md:gap-8 py-10 border-b border-navy/15">
      <div className="md:col-span-3">
        <span className="font-serif text-4xl font-semibold text-navy/20">
          {no}
        </span>
        <div className="mt-2">
          <Kicker className="text-gold">{kicker}</Kicker>
        </div>
      </div>
      <div className="md:col-span-9">
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-ink mb-4">
          {title}
        </h2>
        <p className="leading-relaxed text-[1.0625rem] text-navy/75">{body}</p>
      </div>
    </section>
  )
}

/** S 级专属：决策五问 */
function DecisionBlock({ c }: { c: Case }) {
  const d = c.decisionInfo
  if (!d) return null
  const rows: { label: string; value: string }[] = [
    { label: '投入', value: d.effort },
    { label: '周期', value: d.duration },
    { label: '前提条件', value: d.prerequisites },
    { label: '失败点', value: d.failure_modes },
    { label: '可复制性', value: d.transferability },
  ]
  return (
    <section className="grid md:grid-cols-12 gap-4 md:gap-8 py-10 border-b border-navy/15">
      <div className="md:col-span-3">
        <span className="font-serif text-4xl font-semibold text-navy/20">
          05
        </span>
        <div className="mt-2">
          <Kicker className="text-gold">DECISION INFO</Kicker>
        </div>
      </div>
      <div className="md:col-span-9">
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-ink mb-4">
          决策信息
        </h2>
        <dl>
          {rows.map((r) => (
            <div
              key={r.label}
              className="grid md:grid-cols-12 gap-2 py-4 border-b border-navy/10 last:border-b-0"
            >
              <dt className="md:col-span-2 font-mono uppercase tracking-[0.14em] text-[0.6875rem] text-gold pt-1">
                {r.label}
              </dt>
              <dd className="md:col-span-10 text-[0.9375rem] leading-relaxed text-navy/80">
                {r.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/** 五维标签条 */
function DimBar({ c }: { c: Case }) {
  return (
    <div className="mt-10 border border-navy/15">
      <div className="flex items-center justify-between px-5 py-3 border-b border-navy/15">
        <Kicker className="text-gold">FIVE DIMENSIONS</Kicker>
        <span className="font-mono text-[0.5625rem] text-navy/40">
          五维分析标签
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-navy/10">
        {(Object.keys(DIM_NAMES) as (keyof typeof DIM_LABELS)[]).map((k) => (
          <div key={k} className="bg-cream px-5 py-4">
            <div className="font-mono uppercase tracking-[0.14em] text-[0.5625rem] text-navy/40">
              {DIM_NAMES[k]}
            </div>
            <div className="mt-1.5 font-serif text-base font-semibold text-navy">
              {DIM_LABELS[k][c.dimensions[k]] ?? c.dimensions[k]}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CaseDetail({ id }: { id: string }) {
  const c = caseById(id)

  if (!c) {
    return (
      <div className="px-5 md:px-10 py-24 max-w-[1400px] mx-auto text-center">
        <p className="font-mono uppercase tracking-[0.14em] text-navy/50 text-sm">
          未找到该案例 · Case not found
        </p>
        <Link
          to="/cases"
          className="inline-block mt-6 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-gold border border-gold px-5 py-2.5"
        >
          返回索引
        </Link>
      </div>
    )
  }

  const linkedPatterns = c.patternLinks
    .map((pid) => patternById(pid))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
  const firstPattern = linkedPatterns[0]
  const related = firstPattern
    ? casesByPattern(firstPattern.id).filter((x) => x.id !== c.id)
    : []

  return (
    <div className="px-5 md:px-10 py-12 md:py-16 max-w-[1400px] mx-auto">
      <Link
        to="/cases"
        className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-navy/50 hover:text-gold transition-colors"
      >
        ← 案例索引 · INDEX
      </Link>

      {/* Title block */}
      <div className="mt-8 pb-8 border-b-2 border-navy/80">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <TierBadge tier={c.tier} />
          {linkedPatterns.map((p) => (
            <Link
              key={p.id}
              to={`/pattern/${p.id}`}
              className="font-mono uppercase tracking-[0.14em] text-[0.625rem] text-navy/60 hover:text-gold transition-colors"
            >
              {p.no} {p.name}
            </Link>
          ))}
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-ink leading-tight">
          {c.company}
        </h1>
        <p className="mt-3 font-serif text-xl md:text-2xl text-navy/60">
          {c.scenario}
        </p>
        {c.tier !== 'S' && (
          <p className="mt-4 inline-block border border-navy/25 px-4 py-2 text-sm text-navy/60">
            {c.tier}级案例：细节不足，暂未做深度分析，仅供参考。
          </p>
        )}
      </div>

      {/* Meta bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-navy/15 border-x border-b border-navy/15">
        <div className="bg-cream px-5">
          <Meta label="行业 · Industry" value={c.industry} />
        </div>
        <div className="bg-cream px-5">
          <Meta label="知识来源 · Source" value={knowledgeLabel(c)} />
        </div>
        <div className="bg-cream px-5">
          <Meta
            label="交付模式 · Delivery"
            value={c.deliveryPattern ?? '—'}
          />
        </div>
        <div className="bg-cream px-5">
          <Meta
            label="业务痛点 · Pain Points"
            value={painPointLabels(c).join(' / ') || '—'}
          />
        </div>
      </div>

      {/* Body sections */}
      <div className="mt-4">
        <Section no="01" kicker="BACKGROUND" title="背景" body={c.problem} />
        <Section no="02" kicker="APPROACH" title="做法" body={c.solution} />
        <Section no="03" kicker="HUMAN × AI" title="人机分工" body={c.human} />
        <Section no="04" kicker="OUTCOME" title="效果" body={c.result} />
        <DecisionBlock c={c} />

        {/* FDE 关键动作 */}
        {c.fdeActions.length > 0 && (
          <section className="grid md:grid-cols-12 gap-4 md:gap-8 py-10 border-b border-navy/15">
            <div className="md:col-span-3">
              <span className="font-serif text-4xl font-semibold text-navy/20">
                06
              </span>
              <div className="mt-2">
                <Kicker className="text-gold">FDE ACTIONS</Kicker>
              </div>
            </div>
            <div className="md:col-span-9">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-ink mb-4">
                FDE 关键动作
              </h2>
              <ul className="space-y-4">
                {c.fdeActions.map((a, i) => (
                  <li
                    key={i}
                    className="flex gap-4 text-[1.0625rem] leading-relaxed text-navy/80"
                  >
                    <span className="font-serif text-gold shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>

      <DimBar c={c} />

      {/* 来源与证据 */}
      <div className="mt-10 border border-navy/15 bg-bluegray/30 px-5 md:px-7 py-6">
        <Kicker className="text-navy/50">SOURCE & EVIDENCE</Kicker>
        {c.evidenceNote && (
          <p className="mt-3 text-sm leading-relaxed text-navy/70">
            证据口径:{c.evidenceNote}
          </p>
        )}
        {c.source && (
          <p className="mt-2 text-sm leading-relaxed text-navy/60">
            {c.source}
          </p>
        )}
        {c.url && (
          <a
            href={c.url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-gold border-b border-gold/40 hover:border-gold"
          >
            查看一手来源 →
          </a>
        )}
      </div>

      {/* Related — same pattern */}
      {related.length > 0 && (
        <div className="mt-12 pt-10 border-t border-navy/15">
          <Kicker className="text-gold">SAME PATTERN · 同模式案例</Kicker>
          <div className="h-px w-full bg-navy/15 my-4" />
          <div className="grid md:grid-cols-3 gap-px bg-navy/15 border border-navy/15">
            {related.slice(0, 3).map((r) => (
              <Link
                key={r.id}
                to={`/case/${r.id}`}
                className="group bg-cream p-6 hover:bg-bluegray/40 transition-colors"
              >
                <span className="font-mono uppercase tracking-[0.14em] text-[0.5625rem] text-navy/50">
                  {r.industry} · {knowledgeLabel(r)}
                </span>
                <h3 className="mt-2 font-serif text-xl font-semibold text-ink group-hover:text-gold transition-colors">
                  {r.company}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
