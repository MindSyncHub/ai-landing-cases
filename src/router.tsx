import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

/**
 * Minimal zero-dependency hash router.
 * Hash-based so it works on GitHub Pages static hosting with no server
 * config — refresh and shareable deep links both work.
 */

function readHash(): string {
  const raw = window.location.hash.replace(/^#/, '')
  const path = raw.split('?')[0] || '/'
  return path.startsWith('/') ? path : '/' + path
}

interface RouterCtx {
  path: string
  navigate: (to: string) => void
}

const Ctx = createContext<RouterCtx>({ path: '/', navigate: () => {} })

export function HashRouter({ children }: { children: ReactNode }) {
  const [path, setPath] = useState<string>(() => {
    if (!window.location.hash) window.location.hash = '#/'
    return readHash()
  })

  useEffect(() => {
    const onHash = () => setPath(readHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [path])

  const navigate = (to: string) => {
    const clean = to.startsWith('/') ? to : '/' + to
    window.location.hash = '#' + clean
  }

  const value = useMemo(() => ({ path, navigate }), [path])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useRouter() {
  return useContext(Ctx)
}

/** Match a route pattern like "/case/:id" against the current path. */
function matchPattern(
  pattern: string,
  path: string,
): Record<string, string> | null {
  const pp = pattern.split('/').filter(Boolean)
  const cp = path.split('/').filter(Boolean)
  if (pattern !== '*' && pp.length !== cp.length) return null
  const params: Record<string, string> = {}
  for (let i = 0; i < pp.length; i++) {
    if (pp[i].startsWith(':')) {
      params[pp[i].slice(1)] = decodeURIComponent(cp[i])
    } else if (pp[i] !== cp[i]) {
      return null
    }
  }
  return params
}

export interface RouteDef {
  path: string
  render: (params: Record<string, string>) => ReactNode
}

export function Routes({ routes }: { routes: RouteDef[] }) {
  const { path } = useRouter()
  for (const r of routes) {
    const params = matchPattern(r.path, path)
    if (params) return <>{r.render(params)}</>
  }
  const fallback = routes.find((r) => r.path === '*')
  return <>{fallback ? fallback.render({}) : null}</>
}

export function Link({
  to,
  className,
  children,
  onClick,
}: {
  to: string
  className?: string
  children: ReactNode
  onClick?: () => void
}) {
  const { navigate } = useRouter()
  return (
    <a
      href={'#' + (to.startsWith('/') ? to : '/' + to)}
      className={className}
      onClick={(e) => {
        e.preventDefault()
        onClick?.()
        navigate(to)
      }}
    >
      {children}
    </a>
  )
}
