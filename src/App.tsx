import { Chrome } from './components/Chrome'
import { Routes, type RouteDef } from './router'
import { Home } from './pages/Home'
import { CaseIndex } from './pages/CaseIndex'
import { CaseDetail } from './pages/CaseDetail'
import { Patterns } from './pages/Patterns'
import { PatternDetail } from './pages/PatternDetail'
import { Insights } from './pages/Insights'

const routes: RouteDef[] = [
  { path: '/', render: () => <Home /> },
  { path: '/cases', render: () => <CaseIndex /> },
  { path: '/case/:id', render: (p) => <CaseDetail id={p.id} /> },
  { path: '/patterns', render: () => <Patterns /> },
  { path: '/pattern/:id', render: (p) => <PatternDetail id={p.id} /> },
  { path: '/insights', render: () => <Insights /> },
  { path: '*', render: () => <Home /> },
]

export default function App() {
  return (
    <Chrome>
      <Routes routes={routes} />
    </Chrome>
  )
}
