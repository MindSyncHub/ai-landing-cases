import type { ReactNode } from 'react'

/**
 * 长文排版组件：识别 data 字段里的轻量标记，按语义渲染。
 *
 * 支持语法（data/*.json 的 problem / solution / human / result 字段）：
 *   - 空行分段
 *   - "- " 无序列表（连续行）
 *   - "1. " 有序列表（连续行）
 *   - "> " 引用（原文口径、验收标准等）
 *   - **加粗**（关键判断、术语）
 */

type Block =
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'ol'; items: string[] }
  | { kind: 'quote'; text: string }

export function parseBlocks(body: string): Block[] {
  const lines = body.split('\n')
  const blocks: Block[] = []
  let list: { kind: 'ul' | 'ol'; items: string[] } | null = null
  const flushList = () => {
    if (list) {
      blocks.push({ kind: list.kind, items: list.items })
      list = null
    }
  }
  for (const raw of lines) {
    const line = raw.trimEnd()
    const ul = line.match(/^[-•]\s+(.*)$/)
    const ol = line.match(/^\d+[.、]\s*(.*)$/)
    const qt = line.match(/^>\s?(.*)$/)
    if (ul) {
      if (!list || list.kind !== 'ul') {
        flushList()
        list = { kind: 'ul', items: [] }
      }
      list.items.push(ul[1])
    } else if (ol) {
      if (!list || list.kind !== 'ol') {
        flushList()
        list = { kind: 'ol', items: [] }
      }
      list.items.push(ol[1])
    } else if (qt) {
      flushList()
      blocks.push({ kind: 'quote', text: qt[1] })
    } else if (line.trim() === '') {
      flushList()
    } else {
      flushList()
      const last = blocks[blocks.length - 1]
      // 无空行衔接的普通行并入上一段（兼容未标记的旧数据）
      if (last && last.kind === 'p') last.text += line
      else blocks.push({ kind: 'p', text: line })
    }
  }
  flushList()
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
        if (b.kind === 'quote')
          return (
            <blockquote
              key={i}
              className="border-l-2 border-gold pl-4 py-1 font-serif text-[1.0625rem] text-ink/85 leading-relaxed"
            >
              {renderInline(b.text)}
            </blockquote>
          )
        const Tag = b.kind === 'ul' ? 'ul' : 'ol'
        return (
          <Tag
            key={i}
            className={`space-y-2 leading-relaxed text-[1.0625rem] text-navy/75 ${
              b.kind === 'ul' ? 'list-disc' : 'list-decimal'
            } marker:text-gold pl-5`}
          >
            {b.items.map((it, j) => (
              <li key={j}>{renderInline(it)}</li>
            ))}
          </Tag>
        )
      })}
    </div>
  )
}
