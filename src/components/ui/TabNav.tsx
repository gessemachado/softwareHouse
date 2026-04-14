import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, AlignJustify } from 'lucide-react'

const tabs = [
  { label: 'Visão Geral', path: '/visao-geral', icon: LayoutDashboard },
  { label: 'Software House', path: '/software-house', icon: AlignJustify },
]

export function TabNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="flex items-center gap-1 mb-6 mt-4">
      {tabs.map(({ label, path, icon: Icon }) => {
        const active = location.pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer border ${
              active
                ? 'bg-bh-primary text-white border-bh-primary'
                : 'text-bh-text bg-bh-surface border-bh-border hover:bg-bh-surface2'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        )
      })}
    </div>
  )
}
