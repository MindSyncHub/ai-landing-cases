import type { ReactNode } from 'react'

/**
 * 长文排版组件：识别 data 字段里的轻量标记，按语义渲染。
 *
 * 支持语法（data/*.json 的 problem / solution / human / result 字段）：
 *   - 空行分段
 *   - "- " 无序列表、"1. " 有序列表（连续行；同一张列表换行书写会续进同一列表）
 *   - 列表项下缩进的行 = 该项的续段（可再含引用块、嵌套列表）
 *   - "> " 引用（原文口径、验收标准等）
 *   - **加粗**（关键判断、术语）
 */

type Seg = { type: 'text' | 'quote'; text: string }
type ListKind = 'ul' | 'ol'
interface ListItem {
  segs: Seg[]
  child: { kind: ListKind; items: ListItem[] } | null
}
type Block =
  | { kind: 'p'; text: string }
  | { kind: 'quote'; text: string }
  | { kind: 'list'; list: { kind: ListKind; items: ListItem[] } }

const UL_RE = /^[-•]\s+(.*)$/
const OL_RE = /^\d+[.、]\s*(.*)$/
const QT_RE = /^>\s?(.*)$/

const indentOf = (line: string) => line.length - line.trimStart().length

export function parseBlocks(body: string): Block[] {
  const lines = body.split('\n')
  const blocks: Block[] = []
  let curList: { kind: ListKind; items: ListItem[] } | null = null
  let nested: { kind: ListKind; items: ListItem[]; indent: number } | null = null
  let pBuf = ''

  const flushP = () => {
    if (pBuf) {
      blocks.push({ kind: 'p', text: pBuf })
      pBuf = ''
    }
  }
  const flushList = () => {
    flushNested()
    if (curList) {
      blocks.push({ kind: 'list', list: curList })
      curList = null
    }
  }
  const flushNested = () => {
    if (nested && curList && curList.items.length) {
      curList.items[curList.items.length - 1].child = {
        kind: nested.kind,
        items: nested.items,
      }
    }
    nested = null
  }
  const lastItem = () => curList!.items[curList!.items.length - 1]

  for (const raw of lines) {
    const line = raw.trimEnd()
    const t = line.trim()
    if (t === '') continue

    const ind = indentOf(line)
    const ul = t.match(UL_RE)
    const ol = t.match(OL_RE)
    const qt = t.match(QT_RE)

    if (ul || ol) {
      const kind: ListKind = ul ? 'ul' : 'ol'
      const text = (ul ?? ol)![1]
      if (nested && curList) {
        if (ind >= nested.indent && kind === nested.kind) {
          nested.items.push({ segs: [{ type: 'text', text }], child: null })
          continue
        }
        flushNested()
      }
      if (curList && ind === 0) {
        // 顶层新列表项：同类型续进当前列表，否则换列表
        if (kind === curList.kind) {
          curList.items.push({ segs: [{ type: 'text', text }], child: null })
          continue
        }
        flushList()
      }
      if (curList && ind > 0) {
        // 缩进的列表行 = 上一项的嵌套列表
        nested = { kind, indent: ind, items: [{ segs: [{ type: 'text', text }], child: null }] }
        continue
      }
      flushP()
      curList = { kind, items: [{ segs: [{ type: 'text', text }], child: null }] }
      continue
    }

    if (qt) {
      if (curList && ind > 0) {
        // 列表项内的引用段
        lastItem().segs.push({ type: 'quote', text: qt[1] })
      } else {
        flushList()
        flushP()
        blocks.push({ kind: 'quote', text: qt[1] })
      }
      continue
    }

    // 普通文本
    if (curList && ind > 0) {
      // 列表项的续段
      lastItem().segs.push({ type: 'text', text: t })
      continue
    }
    flushList()
    pBuf += pBuf ? t : t // 顶层次行直接并入段落（原文语义已在数据里用空行分层）
  }
  flushList()
  flushP()
  return blocks
}

function renderInline(text: string): ReactNode {
  const parts: ReactNode[] = []
  const re = /\*\*([^*]+)\*\*/g
  let last = 0
  let m: RegExpExecArray | null
  let k = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    parts.push(
      <strong key={k++} className="font-semibold">
        {m[1]}
      </strong>,
    )
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

function renderQuote(text: string, nested: boolean) {
  return (
    <blockquote
      className={`border-l-2 border-gold font-serif leading-relaxed ${
        nested ? 'ml-1 mt-2 pl-3 text-[0.95rem]' : 'pl-4 py-1 text-[1.0625rem]'
      } text-ink/85`}
    >
      {renderInline(text)}
    </blockquote>
  )
}

function renderList(list: { kind: ListKind; items: ListItem[] }, nested: boolean) {
  const Tag = list.kind === 'ul' ? 'ul' : 'ol'
  return (
    <Tag
      className={`${nested ? 'mt-2 space-y-1.5' : 'space-y-2'} leading-relaxed text-[1.0625rem] text-navy/75 ${
        list.kind === 'ul' ? 'list-disc' : 'list-decimal'
      } marker:text-gold ${nested ? 'pl-4' : 'pl-5'}`}
    >
      {list.items.map((item, i) => (
        <li key={i}>
          {item.segs.map((s, j) =>
            s.type === 'quote' ? (
              <span key={j}>{renderQuote(s.text, true)}</span>
            ) : j === 0 ? (
              renderInline(s.text)
            ) : (
              <p key={j} className="mt-2">
                {renderInline(s.text)}
              </p>
            ),
          )}
          {item.child && renderList(item.child, true)}
        </li>
      ))}
    </Tag>
  )
}

export function Prose({ body }: { body: string }) {
  const blocks = parseBlocks(body)
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => {
        if (b.kind === 'p')
          return (
            <p key={i} className="leading-relaxed text-[1.0625rem] text-navy/75">
              {renderInline(b.text)}
            </p>
          )
        if (b.kind === 'quote') return <span key={i}>{renderQuote(b.text, false)}</span>
        return <span key={i} className="block">{renderList(b.list, false)}</span>
      })}
    </div>
  )
}
