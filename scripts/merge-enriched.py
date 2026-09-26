#!/usr/bin/env python3
"""把 data/enriched/<id>.json 的扩写内容合并进 data/cases.json。
扩写文件由分析批次产出，只覆盖 problem/solution/human/result，新增 steps/quotes。"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cases_path = os.path.join(ROOT, 'data', 'cases.json')
enriched_dir = os.path.join(ROOT, 'data', 'enriched')

cases = json.load(open(cases_path))
by_id = {c['id']: c for c in cases}
merged, skipped = 0, []
for f in sorted(os.listdir(enriched_dir)):
    if not f.endswith('.json'): continue
    cid = f[:-5]
    if cid not in by_id:
        skipped.append((cid, 'id 不在 cases.json')); continue
    e = json.load(open(os.path.join(enriched_dir, f)))
    c = by_id[cid]
    for k in ['problem', 'solution', 'human', 'result']:
        if e.get(k): c[k] = e[k]
    if e.get('steps'): c['steps'] = e['steps']
    if e.get('quotes'): c['quotes'] = e['quotes']
    merged += 1

json.dump(cases, open(cases_path, 'w'), ensure_ascii=False, indent=1)
print(f'merged: {merged}, skipped: {skipped}')
S = [c for c in cases if c['detail_tier'] == 'S']
with_steps = sum(1 for c in S if c.get('steps'))
with_quotes = sum(1 for c in S if c.get('quotes'))
print(f'S级 {len(S)} 条：有步骤 {with_steps}，有引文 {with_quotes}')
