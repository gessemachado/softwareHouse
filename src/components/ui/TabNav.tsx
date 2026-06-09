import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, AlignJustify, BarChart2, Lightbulb, Fingerprint } from 'lucide-react'

const tabs = [
  { label: 'Visão Geral',              path: '/visao-geral',              icon: LayoutDashboard },
  { label: 'Index',                     path: '/dashboard',                icon: BarChart2       },
  { label: 'Inteligência Comercial',   path: '/inteligencia-comercial',   icon: Lightbulb       },
  { label: 'Software House',           path: '/software-house',           icon: AlignJustify    },
  { label: 'Finger',                   path: '/finger',                   icon: Fingerprint     },
]

export function TabNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="flex items-center gap-0 mb-6 mt-4 border-b border-bh-border/50">
      {tabs.map(({ label, path, icon: Icon }) => {
        const active = location.pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all cursor-pointer -mb-px ${
              active
                ? 'text-bh-primary border-b-2 border-bh-primary'
                : 'text-bh-muted border-b-2 border-transparent hover:text-bh-text hover:border-bh-border'
            }`}
          >
            <Icon size={14} className={active ? 'text-bh-primary' : ''} />
            {label}
          </button>
        )
      })}
    </div>
  )
}
