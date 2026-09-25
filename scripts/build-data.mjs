/**
 * 数据生成：data/*.json（唯一事实源）→ src/data/generated.ts
 * 页面不直接读 JSON，构建前运行（npm run prebuild 自动执行）。
 */
import { readFileSync, writeFileSync } from 'node:fs'

const cases = JSON.parse(readFileSync('data/cases.json', 'utf8'))
const patterns = JSON.parse(readFileSync('data/patterns.json', 'utf8'))
const painPoints = JSON.parse(readFileSync('data/pain-points.json', 'utf8'))

const ts = `/** 本文件由 scripts/build-data.mjs 生成，勿手改。事实源：data/*.json */
export const CASES = ${JSON.stringify(cases, null, 1)} as const

export const PATTERNS = ${JSON.stringify(patterns, null, 1)} as const

export const PAIN_POINTS = ${JSON.stringify(painPoints.tags, null, 1)} as const
`

writeFileSync('src/data/generated.ts', ts)
console.log(
  `generated: ${cases.length} cases, ${patterns.length} patterns, ${painPoints.tags.length} pain tags`,
)
