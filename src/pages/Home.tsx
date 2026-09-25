import { Link } from '../router'
import {
  patterns,
  cases,
  casesByPattern,
  stats,
  knowledgeLabel,
} from '../data/cases'
import { IllustrationSlot, Kicker, StatMatrix } from '../components/primitives'

export function Home() {
  return (
    <div>
      {/* Hero — dark navy with ghost character */}
      <section className="relative bg-navy overflow-hidden">
        {/* Ghost character */}
        <span
          aria-hidden
          className="pointer-events-none select-none absolute -right-10 md:right-6 top-1/2 -translate-y-1/2 font-serif font-black text-cream/[0.06] leading-none text-[22rem] md:text-[34rem]"
        >
          案
        </span>

        <div className="relative px-5 md:px-10 pt-20 pb-16 md:pt-28 md:pb-24 max-w-[1400px] mx-auto">
          <Kicker className="text-gold">
            THE 2026 ANNUAL · 落地案例年鉴
          </Kicker>
          <div className="h-px w-full bg-cream/20 my-6" />

          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-8">
              <h1 className="font-serif text-cream font-semibold leading-[1.05] text-5xl md:text-7xl">
                企业 AI 落地
                <br />
                案例年鉴
              </h1>
              <p className="mt-8 max-w-xl text-cream/70 text-base md:text-lg leading-relaxed">
                这不是一份营销白皮书，而是一本可以检索的年鉴。我们记录 AI
                真正进入生产环境的方式——按模式归档，按行业索引，附上我们的判断。
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/cases"
                  className="font-mono uppercase tracking-[0.14em] text-[0.6875rem] text-navy bg-gold px-6 py-3 hover:bg-gold/90 transition-colors"
                >
                  翻阅案例索引
                </Link>
                <Link
                  to="/patterns"
                  className="font-mono uppercase tracking-[0.14em] text-[0.6875rem] text-cream border border-cream/30 px-6 py-3 hover:border-cream/60 transition-colors"
                >
                  五种落地模式
                </Link>
              </div>
            </div>
          </div>

          {/* Stat matrix */}
          <div className="mt-16 md:mt-20 border-t border-cream/20 pt-10">
            <StatMatrix
              onDark
              stats={[
                { value: String(stats.total), label: '案例总数 · Cases' },
                { value: String(stats.tierS), label: 'S 级 · Tier S' },
                { value: String(stats.patterns).padStart(2, '0'), label: '落地模式 · Patterns' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 4:3 illustration slot */}
      <section className="px-5 md:px-10 py-14 md:py-20 max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5">
            <Kicker className="text-gold">ABOUT THIS YEARBOOK · 关于本书</Kicker>
            <div className="h-px w-full bg-navy/15 my-4" />
            <p className="font-serif text-2xl md:text-3xl leading-snug text-ink">
              我们相信，判断一项技术是否成熟，要看它<span className="text-gold">在真实工作流里的样子</span>，而不是发布会上的样子。
            </p>
            <p className="mt-6 text-navy/60 leading-relaxed">
              每个案例都拆解为背景、做法、效果与我们的点评四节，力求还原落地的全貌与代价。
            </p>
          </div>
          <div className="md:col-span-7">
            <IllustrationSlot
              ratio="4:3"
              src={`${import.meta.env.BASE_URL}illustrations/home-yearbook.webp`}
              label="年鉴档案室 · Yearbook Archive"
            />
          </div>
        </div>
      </section>

      {/* Pattern entries */}
      <section className="bg-bluegray/40 border-y border-navy/10">
        <div className="px-5 md:px-10 py-16 md:py-24 max-w-[1400px] mx-auto">
          <Kicker className="text-gold">FIVE PATTERNS · 五种落地模式</Kicker>
          <div className="h-px w-full bg-navy/15 my-4" />
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-ink mb-12">
            AI 进入生产环境的五种姿态
          </h2>

          <div className="border-t border-navy/15">
            {patterns.map((p) => (
              <Link
                key={p.id}
                to={`/pattern/${p.id}`}
                className="group grid md:grid-cols-12 gap-4 md:gap-8 items-baseline py-8 border-b border-navy/15 hover:bg-cream transition-colors -mx-3 px-3"
              >
                <div className="md:col-span-2">
                  <span className="font-serif text-5xl md:text-6xl font-semibold text-navy group-hover:text-gold transition-colors">
                    {p.no}
                  </span>
                </div>
                <div className="md:col-span-4">
                  <h3 className="font-serif text-2xl font-semibold text-ink">
                    {p.name}
                  </h3>
                  <span className="font-mono uppercase tracking-[0.16em] text-[0.625rem] text-navy/50">
                    {p.nameEn}
                  </span>
                </div>
                <div className="md:col-span-5">
                  <p className="text-navy/70 leading-relaxed">{p.summary}</p>
                </div>
                <div className="md:col-span-1 md:text-right">
                  <span className="font-mono text-[0.625rem] text-navy/40">
                    {casesByPattern(p.id).length} 例
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / latest strip */}
      <section className="px-5 md:px-10 py-16 md:py-20 max-w-[1400px] mx-auto">
        <Kicker className="text-gold">FROM THE INDEX · 索引精选</Kicker>
        <div className="h-px w-full bg-navy/15 my-4" />
        <div className="grid md:grid-cols-3 gap-px bg-navy/15 border border-navy/15">
          {cases
            .filter((c) => c.tier === 'S')
            .slice(0, 3)
            .map((c) => (
            <Link
              key={c.id}
              to={`/case/${c.id}`}
              className="group bg-cream p-7 hover:bg-bluegray/40 transition-colors"
            >
              <span className="font-mono uppercase tracking-[0.16em] text-[0.625rem] text-navy/50">
                {c.industry} · {knowledgeLabel(c)}
              </span>
              <h3 className="mt-3 font-serif text-2xl font-semibold text-ink group-hover:text-gold transition-colors">
                {c.company}
              </h3>
              <p className="mt-1 text-sm text-navy/50">{c.scenario}</p>
              <p className="mt-3 text-sm text-navy/60 leading-relaxed line-clamp-3">
                {c.problem}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
