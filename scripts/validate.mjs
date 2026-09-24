#!/usr/bin/env node
// 数据校验：必填字段、档位与字段规则、标签合法性、ID 唯一、模式引用有效。
// 用法：npm test
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));

const cases = read('data/cases.json');
const patterns = read('data/patterns.json');
const painPoints = read('data/pain-points.json');
const tagIds = new Set((painPoints.tags || []).map((t) => t.id));
const tierEnum = ['S', '标准', '概览'];
const patternEnum = ['诊断型', '平台型', '助手型', '评测型'];

const errors = [];
const ids = new Set();
const patternIds = new Set(patterns.map((p) => p.id));

cases.forEach((c, i) => {
  const at = `cases[${i}] ${c.id || '(无id)'}`;
  if (!c.id) errors.push(`${at}: 缺 id`);
  else if (ids.has(c.id)) errors.push(`${at}: id 重复`);
  else ids.add(c.id);

  if (!tierEnum.includes(c.detail_tier)) errors.push(`${at}: detail_tier 非法（应为 ${tierEnum.join('/')}）`);

  for (const f of ['company', 'industry', 'scenario', 'problem', 'solution', 'human', 'result', 'url']) {
    if (!c[f] || !String(c[f]).trim()) errors.push(`${at}: 缺字段 ${f}`);
  }
  if (c.url && !c.url.startsWith('https://')) errors.push(`${at}: url 必须 https`);

  if (!Array.isArray(c.pain_points) || c.pain_points.length === 0) {
    errors.push(`${at}: pain_points 非空`);
  } else {
    c.pain_points.forEach((t) => { if (!tagIds.has(t)) errors.push(`${at}: 痛点标签未登记 ${t}`); });
  }

  if (!c.evidence_note) errors.push(`${at}: 缺 evidence_note（公开事实/来源方披露/编辑分析口径说明）`);

  if (c.detail_tier === 'S') {
    const d = c.decision_info || {};
    for (const f of ['effort', 'duration', 'prerequisites', 'failure_modes', 'transferability']) {
      if (!d[f] || !String(d[f]).trim()) errors.push(`${at}: S 级 decision_info.${f} 必填`);
    }
    if (!patternEnum.includes(c.delivery_pattern)) errors.push(`${at}: S 级 delivery_pattern 非法`);
    if (!Array.isArray(c.fde_actions) || c.fde_actions.length === 0) errors.push(`${at}: S 级 fde_actions 非空`);
    (c.pattern_links || []).forEach((p) => { if (!patternIds.has(p)) errors.push(`${at}: pattern_links 指向不存在的模式 ${p}`); });
  }
});

patterns.forEach((p, i) => {
  const at = `patterns[${i}] ${p.id || '(无id)'}`;
  if (!p.id) errors.push(`${at}: 缺 id`);
  for (const f of ['name', 'summary', 'signals', 'actions', 'anti_patterns']) {
    if (!p[f] || (Array.isArray(p[f]) && p[f].length === 0)) errors.push(`${at}: 缺字段 ${f}`);
  }
  if (!Array.isArray(p.case_refs) || p.case_refs.length < 2) errors.push(`${at}: case_refs 至少 2 条佐证案例`);
  (p.case_refs || []).forEach((r) => { if (!ids.has(r)) errors.push(`${at}: case_refs 指向不存在的案例 ${r}`); });
});

if (errors.length) {
  console.error(`校验失败 ${errors.length} 项：`);
  errors.forEach((e) => console.error('  - ' + e));
  process.exit(1);
}
console.log(`校验通过：案例 ${cases.length} 条，模式 ${patterns.length} 个，痛点标签 ${tagIds.size} 个。`);
