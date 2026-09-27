import type { ReactNode } from 'react'

/**
 * 长文排版组件：把整段文字拆成短段落，并对关键信息（数字与单位、引号内术语）
 * 加烫金色下划线，提升案例详情页的可读性。
 */

// 按句读切句（保留标点），再按目标长度聚合成短段落
function toParagraphs(text: string): string[][] {
  const sentences = text.match(/[^。！？!?]+[。！？!?]?/g) ?? [text]
  const paras: string[][] = []
  let cur: string[] = []
  let len = 0
  for (const s of sentences) {
    cur.push(s)
    len += s.length
    if (len >= 90 && cur.length >= 2) {
      paras.push(cur)
      cur = []
      len = 0
    }
  }
  if (cur.length) paras.push(cur)
  return paras
}

// 关键信息：数字+单位（含 3到5、数百、上千 等）、引号/书名号内的术语
const KEY_RE =
  /(\d+(?:\.\d+)?(?:[到~—-]\d+(?:\.\d+)?)?(?:余|多)?(?:个|种|步|层|类|倍|页|天|小时|分钟|人|%|％|次|项|条|款|年|月|日|周|万|亿|千|百)?|[「『“"]([^「『“"」』”"]{2,24})[」』”"]|《[^》]{2,20})/g

function renderInline(text: string) {
  const parts: ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  let k = 0
  KEY_RE.lastIndex = 0
  while ((m = KEY_RE.exec(text)) !== null) {
    // 纯数字但无单位且不构成数量表达的不高亮（如年份 2024 单独出现）
    const hit = m[0]
    const bareNumber = /^\d{4}$/.test(hit) && m.index > 0 && text[m.index - 1] !== '年'
    if (m.index > last) parts.push(text.slice(last, m.index))
    parts.push(
      bareNumber ? (
        hit
      ) : (
        <span key={k++} className="underline decoration-gold decoration-2 underline-offset-4 text-ink">
          {hit}
        </span>
      ),
    )
    last = m.index + hit.length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

export function Prose({ body }: { body: string }) {
  const paras = toParagraphs(body)
  return (
    <div className="space-y-4">
      {paras.map((p, i) => (
        <p key={i} className="leading-relaxed text-[1.0625rem] text-navy/75">
          {p.map((s, j) => (
            <span key={j}>{renderInline(s)}</span>
          ))}
        </p>
      ))}
    </div>
  )
}
