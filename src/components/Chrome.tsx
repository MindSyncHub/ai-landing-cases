import type { ReactNode } from 'react'
import { Link, useRouter } from '../router'

interface NavItem {
  path: string
  cn: string
  en: string
  page: string
}

const NAV: NavItem[] = [
  { path: '/', cn: '封面', en: 'COVER', page: '01' },
  { path: '/cases', cn: '案例索引', en: 'INDEX', page: '02' },
  { path: '/patterns', cn: '模式库', en: 'PATTERNS', page: '03' },
  { path: '/insights', cn: '数据洞察', en: 'INSIGHTS', page: '04' },
]

const TOTAL = '04'

function activeNav(path: string): NavItem {
  if (path === '/') return NAV[0]
  if (path.startsWith('/cases') || path.startsWith('/case/')) return NAV[1]
  if (path.startsWith('/patterns') || path.startsWith('/pattern/'))
    return NAV[2]
  if (path.startsWith('/insights')) return NAV[3]
  return NAV[0]
}

export function Chrome({ children }: { children: ReactNode }) {
  const { path } = useRouter()
  const current = activeNav(path)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Masthead nav */}
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-navy/15">
        {/* Running header thin bar */}
        <div className="flex items-center justify-between px-5 md:px-10 py-2 border-b border-navy/10">
          <span className="font-mono uppercase tracking-[0.18em] text-[0.625rem] text-navy/60">
            {current.cn} · {current.en}
          </span>
          <span className="font-mono uppercase tracking-[0.18em] text-[0.625rem] text-navy/60">
            {current.page} / {TOTAL}
          </span>
        </div>
        {/* Title + nav */}
        <nav className="flex items-center justify-between px-5 md:px-10 py-4">
          <Link to="/" className="group flex items-baseline gap-2">
            <span className="font-serif text-lg md:text-xl font-semibold text-navy">
              企业 AI 落地案例年鉴
            </span>
            <span className="font-mono uppercase tracking-[0.18em] text-[0.5625rem] text-gold hidden sm:inline">
              ANNUAL
            </span>
          </Link>
          <ul className="flex items-center gap-5 md:gap-8">
            {NAV.slice(1).map((n) => {
              const isActive = current.path === n.path
              return (
                <li key={n.path}>
                  <Link
                    to={n.path}
                    className={`font-mono uppercase tracking-[0.14em] text-[0.6875rem] transition-colors ${
                      isActive
                        ? 'text-gold'
                        : 'text-navy/70 hover:text-navy'
                    }`}
                  >
                    <span className="hidden md:inline">{n.en}</span>
                    <span className="md:hidden">{n.cn}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      {/* Running footer thin bar */}
      <footer className="border-t border-navy/15 bg-cream">
        <div className="flex items-center justify-between px-5 md:px-10 py-4">
          <span className="font-mono uppercase tracking-[0.18em] text-[0.625rem] text-navy/60">
            AI CASE YEARBOOK — 案例年鉴
          </span>
          <span className="font-mono uppercase tracking-[0.18em] text-[0.625rem] text-navy/60">
            {current.en} · {current.page}/{TOTAL}
          </span>
        </div>
        <div className="px-5 md:px-10 pb-8 pt-2">
          <p className="font-mono text-[0.625rem] text-navy/40 uppercase tracking-[0.14em]">
            © 2026 · 一本可检索的在线年鉴 · A searchable annual of AI in
            production
          </p>
        </div>
      </footer>
    </div>
  )
}
