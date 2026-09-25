import { Link } from '../router'
import { patterns, casesByPattern } from '../data/cases'
import { Kicker } from '../components/primitives'

export function Patterns() {
  return (
    <div className="px-5 md:px-10 py-12 md:py-16 max-w-[1400px] mx-auto">
      <Kicker className="text-gold">CHAPTER 03 · 模式库</Kicker>
      <div className="h-px w-full bg-navy/15 my-4" />
      <h1 className="font-serif text-4xl md:text-5xl font-semibold text-ink">
        模式库
      </h1>
      <p className="mt-4 max-w-xl text-navy/60 leading-relaxed">
        我们把 AI 进入生产环境的方式归纳为五种模式。它们不是技术分类，而是价值落地的姿态。
      </p>

      <div className="mt-12 grid md:grid-cols-2 gap-px bg-navy/15 border border-navy/15">
        {patterns.map((p) => (
          <Link
            key={p.id}
            to={`/pattern/${p.id}`}
            className="group bg-cream p-8 md:p-10 hover:bg-bluegray/40 transition-colors"
          >
            <div className="flex items-start justify-between">
              <span className="font-serif text-6xl md:text-7xl font-semibold text-navy group-hover:text-gold transition-colors leading-none">
                {p.no}
              </span>
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-navy/40">
                {casesByPattern(p.id).length} 例
              </span>
            </div>
            <h2 className="mt-6 font-serif text-2xl font-semibold text-ink">
              {p.name}
            </h2>
            <div className="mt-1 font-mono uppercase tracking-[0.16em] text-[0.625rem] text-navy/50">
              {p.nameEn}
            </div>
            <p className="mt-4 text-navy/70 leading-relaxed">{p.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
