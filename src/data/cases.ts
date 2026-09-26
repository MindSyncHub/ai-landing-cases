import { CASES, PATTERNS, PAIN_POINTS } from './generated'

/** 档位：S 深度 / 标准 / 概览（SPEC 2.3） */
export type Tier = 'S' | 'A' | 'B'

/** 档位汉字名：展示用 字母（汉字），紧凑处直接用字母 */
export const TIER_CN: Record<Tier, string> = {
  S: '深度',
  A: '标准',
  B: '概览',
}

export interface DecisionInfo {
  effort: string
  duration: string
  prerequisites: string
  failure_modes: string
  transferability: string
}

export interface Dimensions {
  entry: string
  human_ai: string
  knowledge: string
  validation: string
  diffusion: string
}

export interface Step {
  t: string
  d: string
}

export interface Quote {
  q: string
  ctx: string
}

export interface Case {
  id: string
  company: string
  industry: string
  scenario: string
  tier: Tier
  painPoints: string[]
  problem: string
  solution: string
  human: string
  result: string
  decisionInfo: DecisionInfo | null
  deliveryPattern: string | null
  fdeActions: string[]
  patternLinks: string[]
  steps: Step[]
  quotes: Quote[]
  evidenceNote: string
  url: string
  source: string
  dimensions: Dimensions
}

export interface Pattern {
  id: string
  no: string
  name: string
  nameEn: string
  summary: string
  definition: string
  signals: string[]
  actions: string[]
  antiPatterns: string[]
  caseRefs: string[]
}

/** 五维标签映射（dimensions 字段的受控词表） */
export const DIM_LABELS: Record<string, Record<string, string>> = {
  entry: {
    'field-diagnosis': '现场诊断',
    'pilot-cut': '小切口试点',
    'product-embed': '产品内嵌',
    'foundation-first': '基建先行',
  },
  human_ai: {
    'human-led-ai-assist': '人主导 · AI 辅助',
    'ai-screen-human-decide': 'AI 初筛 · 人决策',
    'ai-execute-human-supervise': 'AI 执行 · 人监督',
    'auto-with-fallback': '自动 + 人工回退',
  },
  knowledge: {
    tacit: '隐性经验',
    rules: '规则制度',
    documents: '文档知识库',
    'process-data': '业务数据',
    synthetic: '合成数据',
  },
  validation: {
    'eval-first': '评测先行',
    'pilot-ab': '试点对照',
    'baseline-compare': '基线对比',
    unverified: '未披露验证',
  },
  diffusion: {
    'top-down': '自上而下',
    'bottom-up': '自下而上',
    productization: '产品化',
    'catalyst-network': '催化剂网络',
  },
}

export const DIM_NAMES: Record<string, string> = {
  entry: '切入方式',
  human_ai: '人机分工',
  knowledge: '知识来源',
  validation: '验证方式',
  diffusion: '推广方式',
}

const PATTERN_EN: Record<string, string> = {
  m1: 'VALIDATION-LED',
  m2: 'EMBEDDED COPILOT',
  m3: 'KNOWLEDGE FIRST',
  m4: 'RELIABILITY ENGINEERING',
  m5: 'ORGANIC SPREAD',
}

export const painPointById: Record<string, string> = Object.fromEntries(
  PAIN_POINTS.map((t: { id: string; name: string }) => [t.id, t.name]),
)

export const cases: Case[] = CASES.map((c) => ({
  id: c.id,
  company: c.company,
  industry: c.industry,
  scenario: c.scenario,
  tier: c.detail_tier as Tier,
  painPoints: [...c.pain_points],
  problem: c.problem,
  solution: c.solution,
  human: c.human ?? '',
  result: c.result,
  decisionInfo: c.decision_info ?? null,
  deliveryPattern: c.delivery_pattern ?? null,
  fdeActions: [...(c.fde_actions ?? [])],
  patternLinks: [...(c.pattern_links ?? [])],
  steps: [...((c as { steps?: Step[] }).steps ?? [])],
  quotes: [...((c as { quotes?: Quote[] }).quotes ?? [])],
  evidenceNote: c.evidence_note ?? '',
  url: c.url ?? '',
  source: c.source ?? '',
  dimensions: { ...c.dimensions },
}))

export const patterns: Pattern[] = PATTERNS.map((p, i) => ({
  id: p.id,
  no: String(i + 1).padStart(2, '0'),
  name: p.name,
  nameEn: PATTERN_EN[p.id] ?? p.id.toUpperCase(),
  summary: p.summary,
  definition: p.definition,
  signals: [...p.signals],
  actions: [...p.actions],
  antiPatterns: [...p.anti_patterns],
  caseRefs: [...p.case_refs],
}))

const caseMap = new Map(cases.map((c) => [c.id, c]))
export function caseById(id: string): Case | undefined {
  return caseMap.get(id)
}
export const patternByIdMap = new Map(patterns.map((p) => [p.id, p]))
export function patternById(id: string): Pattern | undefined {
  return patternByIdMap.get(id)
}
export function casesByPattern(patternId: string): Case[] {
  const p = patternByIdMap.get(patternId)
  if (!p) return []
  return p.caseRefs
    .map((id) => caseMap.get(id))
    .filter((c): c is Case => Boolean(c))
}

const uniqSorted = (vals: string[]) => [...new Set(vals)].sort()

export const industries = uniqSorted(cases.map((c) => c.industry))
export const sourceTypes = uniqSorted(
  cases.map((c) => DIM_LABELS.knowledge[c.dimensions.knowledge] ?? c.dimensions.knowledge),
)
export const tiers: Tier[] = ['S', 'A', 'B']

export function knowledgeLabel(c: Case): string {
  return DIM_LABELS.knowledge[c.dimensions.knowledge] ?? c.dimensions.knowledge
}

export function painPointLabels(c: Case): string[] {
  return c.painPoints.map((id) => painPointById[id] ?? id)
}

export const stats = {
  total: cases.length,
  tierS: cases.filter((c) => c.tier === 'S').length,
  patterns: patterns.length,
  industries: industries.length,
}

/** 统计某字段的分布，返回按数量降序的 {label, value} 列表（Insights 图表用） */
export function countBy(
  key: 'industry' | 'tier',
): { label: string; value: number }[] {
  const m = new Map<string, number>()
  for (const c of cases) {
    const v = c[key]
    m.set(v, (m.get(v) ?? 0) + 1)
  }
  return [...m.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
}

export function countByFn(fn: (c: Case) => string): { label: string; value: number }[] {
  const m = new Map<string, number>()
  for (const c of cases) {
    const v = fn(c)
    m.set(v, (m.get(v) ?? 0) + 1)
  }
  return [...m.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
}
