import { Link } from '../router'
import { Kicker } from '../components/primitives'
import { DIM_LABELS, DIM_NAMES, patterns, cases } from '../data/cases'

const PATTERN_WHEN: Record<string, { use: string; fail: string }> = {
  m1: {
    use: '企业说不清自己要什么，或需求与现场实况对不上。',
    fail: '拿着现成方案找场景，技术先行。',
  },
  m2: {
    use: '已有成熟业务流程，瓶颈在初筛、录入等重复环节。',
    fail: 'AI 入口脱离原流程，员工要多开一个新工具。',
  },
  m3: {
    use: '老师傅经验、分散文档是主要资产，模型发挥不出来。',
    fail: '把文档扔进知识库就当做完，没有验收标准。',
  },
  m4: {
    use: '出错代价高，需要把可靠性当工程指标管理。',
    fail: '只看演示效果，没有评测集和回退方案。',
  },
  m5: {
    use: '已有标杆场景，需要让使用自下而上扩散。',
    fail: '靠行政命令推广，没有种子用户和催化剂。',
  },
}

const DIM_QUESTIONS: Record<string, string> = {
  entry: '从哪扇门进现场',
  human_ai: '人和 AI 怎么分工',
  knowledge: 'AI 靠什么知识干活',
  validation: '怎么证明真的有效',
  diffusion: '用法怎么扩散开来',
}

const DIM_EXPLAIN: Record<string, Record<string, string>> = {
  entry: {
    'field-diagnosis': '先进现场走完工作流再谈技术',
    'pilot-cut': '选边界清晰的小切口先做试点',
    'product-embed': 'AI 直接嵌入已有产品功能',
    'foundation-first': '先建数据底座再谈应用',
  },
  human_ai: {
    'human-led-ai-assist': '人全程主导，AI 只辅助',
    'ai-screen-human-decide': 'AI 出初稿，人拍板',
    'ai-execute-human-supervise': 'AI 执行，人抽查监督',
    'auto-with-fallback': '全自动，异常转人工',
  },
  knowledge: {
    tacit: '老师傅脑子里的隐性经验',
    rules: '制度、规则、SOP',
    documents: '文档知识库',
    'process-data': '业务系统里的过程数据',
    synthetic: '人工构造的合成数据',
  },
  validation: {
    'eval-first': '先建评测集再上线',
    'pilot-ab': '小流量试点对照',
    'baseline-compare': '和人工基线比效果',
    unverified: '来源方未披露验证方式',
  },
  diffusion: {
    'top-down': '管理层推动自上而下铺开',
    'bottom-up': '员工自发用起来',
    productization: '做成产品对外输出',
    'catalyst-network': '种子用户+催化者网络扩散',
  },
}

const DIM_KEYS = Object.keys(DIM_NAMES) as (keyof typeof DIM_LABELS)[]

function BigNo({ no }: { no: string }) {
  return (
    <div className="font-serif text-5xl md:text-6xl font-semibold text-gold leading-none">
      {no}
    </div>
  )
}

export function Guide() {
  const sCount = cases.filter((c) => c.tier === 'S').length

  return (
    <div>
      {/* Hero */}
      <div className="bg-navy text-cream">
        <div className="px-5 md:px-10 py-16 md:py-24 max-w-[1400px] mx-auto">
          <Kicker className="text-gold">READER'S GUIDE · 使用指南</Kicker>
          <div className="h-px w-full bg-cream/25 my-5" />
          <h1 className="font-serif text-4xl md:text-6xl font-semibold leading-tight">
            这本年鉴怎么用
          </h1>
          <p className="mt-6 max-w-2xl text-cream/70 leading-relaxed">
            网上不缺 AI 案例的流水账，缺的是可检索、可对照、能支持决策的整理。
            我们给每个案例套了同一套分析框架——分级、模式、五维标签、决策五问——
            这一页把框架讲清楚，让你三分钟知道去哪找答案。
          </p>
        </div>
      </div>

      {/* 01 三种用法 */}
      <section className="border-b border-navy/10">
        <div className="px-5 md:px-10 py-14 md:py-20 max-w-[1400px] mx-auto grid md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <BigNo no="01" />
            <h2 className="mt-3 font-serif text-2xl font-semibold text-ink">
              三种用法
            </h2>
            <p className="mt-2 font-mono uppercase tracking-[0.14em] text-[0.5625rem] text-navy/40">
              START FROM YOUR QUESTION
            </p>
          </div>
          <div className="md:col-span-9 grid sm:grid-cols-3 gap-px bg-navy/15 border border-navy/15">
            {[
              {
                t: '查痛点',
                d: '案例索引页按痛点标签筛选——经验传承、客服提效、文档检索、研发提效……先找和自己处境像的案例，再读它的做法。',
                link: '/cases',
                ln: '去案例索引',
              },
              {
                t: '选模式',
                d: '不知道从何下手时，先读模式库。五种落地模式各有适用信号和反模式，对照自己企业现在的处境选一条路。',
                link: '/patterns',
                ln: '去模式库',
              },
              {
                t: '做决策',
                d: `S 级案例附有决策五问：投入多大、周期多长、前置条件是什么、什么时候会失败、方法能不能搬到自己行业。${sCount} 条 S 级案例是给决策用的。`,
                link: '/cases',
                ln: '看 S 级案例',
              },
            ].map((x) => (
              <div key={x.t} className="bg-cream p-6 flex flex-col">
                <h3 className="font-serif text-xl font-semibold text-navy">
                  {x.t}
                </h3>
                <p className="mt-3 text-sm text-navy/65 leading-relaxed flex-1">
                  {x.d}
                </p>
                <Link
                  to={x.link}
                  className="mt-5 font-mono uppercase tracking-[0.16em] text-[0.625rem] text-gold hover:text-navy transition-colors"
                >
                  {x.ln} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 02 案例怎么读 */}
      <section className="bg-bluegray/40 border-b border-navy/10">
        <div className="px-5 md:px-10 py-14 md:py-20 max-w-[1400px] mx-auto grid md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <BigNo no="02" />
            <h2 className="mt-3 font-serif text-2xl font-semibold text-ink">
              案例怎么读
            </h2>
            <p className="mt-2 font-mono uppercase tracking-[0.14em] text-[0.5625rem] text-navy/40">
              ANATOMY OF A CASE
            </p>
          </div>
          <div className="md:col-span-9">
            <div className="grid sm:grid-cols-2 gap-px bg-navy/15 border border-navy/15">
              {[
                ['背景 · Problem', '企业是谁、痛在哪、过去怎么解决、为什么旧办法失效。'],
                ['做法 · Solution', 'FDE 的完整技术路线和落地顺序：先进现场还是先做数据、怎么嵌入原流程、验收标准是什么。'],
                ['人机分工 · Human', '人保留了什么决策权，AI 承担了哪个环节，组织里的角色怎么变化。'],
                ['效果 · Result', '量化结果、项目周期、投入和踩过的坑。披露数字未经独立审计，读的时候保留这个心眼。'],
              ].map(([t, d]) => (
                <div key={t} className="bg-cream p-6">
                  <h3 className="font-serif text-lg font-semibold text-navy">
                    {t}
                  </h3>
                  <p className="mt-2 text-sm text-navy/65 leading-relaxed">
                    {d}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-navy/65 leading-relaxed">
              S 级案例额外附三块内容：
              <span className="text-navy font-medium">决策五问</span>
              （投入/周期/前置条件/失败模式/可迁移性）、
              <span className="text-navy font-medium">落地步骤</span>
              （把做法拆成按顺序执行的 3–5 步）、
              <span className="text-navy font-medium">原文引文</span>
              （讲述人第一人称的原话摘录，可核对转述是否走样）。每条案例末尾标注证据口径，说明哪些是公开事实、哪些只是来源方披露。
            </p>
          </div>
        </div>
      </section>

      {/* 03 收录与分级 */}
      <section className="border-b border-navy/10">
        <div className="px-5 md:px-10 py-14 md:py-20 max-w-[1400px] mx-auto grid md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <BigNo no="03" />
            <h2 className="mt-3 font-serif text-2xl font-semibold text-ink">
              收录与分级
            </h2>
            <p className="mt-2 font-mono uppercase tracking-[0.14em] text-[0.5625rem] text-navy/40">
              WHAT GETS IN, AND WHY
            </p>
          </div>
          <div className="md:col-span-9 space-y-0 border border-navy/15 divide-y divide-navy/15">
            {[
              ['S', `${sCount} 条`, '有公开一手来源（PDF 原文/官方案例库），做过完整五维分析。给要做决策的人读。'],
              ['标准', '15 条', '信息来源可靠但细节有限，未做深度分析，作对照样本收录。'],
              ['概览', '2 条', '只有公开报道级别信息，保留线索价值。'],
            ].map(([t, n, d]) => (
              <div key={t} className="flex items-baseline gap-6 p-6 bg-cream">
                <span className="font-serif text-3xl font-semibold text-gold w-20 shrink-0">
                  {t}
                </span>
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-navy/40 w-16 shrink-0">
                  {n}
                </span>
                <p className="text-sm text-navy/65 leading-relaxed">{d}</p>
              </div>
            ))}
            <div className="p-6 bg-cream">
              <p className="text-sm text-navy/65 leading-relaxed">
                收录口径：只收进入生产环境的真实落地，不收发布会 demo 和概念验证。
                分级看信息密度，不看作案例好不好——B、C 档里同样有值得抄的做法。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 04 五种模式 */}
      <section className="bg-bluegray/40 border-b border-navy/10">
        <div className="px-5 md:px-10 py-14 md:py-20 max-w-[1400px] mx-auto grid md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <BigNo no="04" />
            <h2 className="mt-3 font-serif text-2xl font-semibold text-ink">
              五种落地模式
            </h2>
            <p className="mt-2 font-mono uppercase tracking-[0.14em] text-[0.5625rem] text-navy/40">
              FIVE PATTERNS
            </p>
            <Link
              to="/patterns"
              className="mt-4 inline-block font-mono uppercase tracking-[0.16em] text-[0.625rem] text-gold hover:text-navy transition-colors"
            >
              模式库 →
            </Link>
          </div>
          <div className="md:col-span-9 divide-y divide-navy/15 border-y border-navy/15">
            {patterns.map((p) => (
              <div key={p.id} className="py-5 grid md:grid-cols-12 gap-3 md:gap-6">
                <div className="md:col-span-1 font-serif text-2xl font-semibold text-gold">
                  {p.no}
                </div>
                <div className="md:col-span-3">
                  <Link
                    to={`/pattern/${p.id}`}
                    className="font-serif text-lg font-semibold text-navy hover:text-gold transition-colors"
                  >
                    {p.name}
                  </Link>
                  <p className="mt-1 text-sm text-navy/65">{p.summary}</p>
                </div>
                <div className="md:col-span-4 text-sm text-navy/65 leading-relaxed">
                  <span className="font-mono uppercase tracking-[0.14em] text-[0.5625rem] text-navy/40">
                    适用信号 ·{' '}
                  </span>
                  {PATTERN_WHEN[p.id]?.use}
                </div>
                <div className="md:col-span-4 text-sm text-navy/65 leading-relaxed">
                  <span className="font-mono uppercase tracking-[0.14em] text-[0.5625rem] text-navy/40">
                    反模式 · 何时失败 ·{' '}
                  </span>
                  {PATTERN_WHEN[p.id]?.fail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 五维标签 */}
      <section className="border-b border-navy/10">
        <div className="px-5 md:px-10 py-14 md:py-20 max-w-[1400px] mx-auto grid md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <BigNo no="05" />
            <h2 className="mt-3 font-serif text-2xl font-semibold text-ink">
              五维分析标签
            </h2>
            <p className="mt-2 font-mono uppercase tracking-[0.14em] text-[0.5625rem] text-navy/40">
              FIVE DIMENSIONS
            </p>
          </div>
          <div className="md:col-span-9 space-y-6">
            <p className="text-sm text-navy/65 leading-relaxed">
              每个 S 级案例都按同一组维度拆解。五个维度各回答一个问题，取值的含义全库统一：
            </p>
            {DIM_KEYS.map((k) => (
              <div key={k} className="border border-navy/15">
                <div className="px-5 py-3 bg-navy/[0.06] flex flex-wrap items-baseline gap-3">
                  <span className="font-serif text-lg font-semibold text-navy">
                    {DIM_NAMES[k]}
                  </span>
                  <span className="font-mono uppercase tracking-[0.14em] text-[0.5625rem] text-gold">
                    {DIM_QUESTIONS[k]}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-navy/10 divide-x-0">
                  {Object.keys(DIM_LABELS[k]).map((v) => (
                    <div key={v} className="bg-cream px-5 py-4">
                      <div className="text-sm font-semibold text-navy">
                        {DIM_LABELS[k][v]}
                      </div>
                      <div className="mt-1 text-xs text-navy/55 leading-relaxed">
                        {DIM_EXPLAIN[k][v]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06 溯源 */}
      <section>
        <div className="px-5 md:px-10 py-14 md:py-20 max-w-[1400px] mx-auto grid md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <BigNo no="06" />
            <h2 className="mt-3 font-serif text-2xl font-semibold text-ink">
              来源与溯源
            </h2>
            <p className="mt-2 font-mono uppercase tracking-[0.14em] text-[0.5625rem] text-navy/40">
              PROVENANCE
            </p>
          </div>
          <div className="md:col-span-9 space-y-4 text-sm text-navy/65 leading-relaxed">
            <p>
              案例全部来自公开一手来源：Datawhale《FDE 案例 100》PDF 原文、各公司官方博客与案例库、公开演讲整理。原文留存于仓库 data/raw/ 目录，每条案例附来源链接，可逐条核对。
            </p>
            <p>
              我们不做二手转引：其他案例库的整理（如义道）只作对照，不作为溯源依据。案例事实归原始来源方，分析框架（分级、模式、五维标签、决策五问）由墨予镜建立，点评部分是我们的判断。
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
