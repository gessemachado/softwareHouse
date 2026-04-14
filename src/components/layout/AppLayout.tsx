import { type ReactNode } from 'react'
import { AlignJustify } from 'lucide-react'
import { Header } from './Header'

interface AppLayoutProps {
  title?: string
  subtitle?: string
  breadcrumb?: string
  children: ReactNode
}

export function AppLayout({ title = 'BuyHelp Desconto', subtitle = 'Gestão e análise das software house', breadcrumb = 'Software House', children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-bh-bg flex flex-col">
      <Header />

      {/* Page header */}
      {title && (
        <div className="px-8 pt-6 pb-4">
          {breadcrumb && (
            <div className="flex items-center gap-2 text-bh-muted text-sm mb-3">
              <AlignJustify size={14} />
              <span>{breadcrumb}</span>
            </div>
          )}
          <h1 className="text-bh-text text-2xl font-semibold">{title}</h1>
          {subtitle && <p className="text-bh-muted text-sm mt-1">{subtitle}</p>}
        </div>
      )}

      {/* Content */}
      <main className="flex-1 px-8 pb-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-bh-border px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-bh-muted text-xs">
            <div className="w-4 h-4 bg-bh-primary rounded flex items-center justify-center text-white font-bold" style={{ fontSize: '9px' }}>B</div>
            <span>© 2026 BuyHelp. Todos os direitos reservados.</span>
          </div>
          <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded font-medium">PROD</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-bh-muted">
          <a href="#" className="hover:text-bh-text transition-colors">Termos de Uso</a>
          <a href="#" className="hover:text-bh-text transition-colors">Privacidade</a>
          <a href="#" className="hover:text-bh-text transition-colors">Suporte</a>
          <a href="#" className="hover:text-bh-text transition-colors">Documentação</a>
        </div>
      </footer>
    </div>
  )
}
