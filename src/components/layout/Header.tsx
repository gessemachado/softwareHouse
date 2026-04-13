import { Bell, Search, Store, ChevronDown, Sparkles, LayoutGrid } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-bh-nav border-b border-bh-border">
      <div className="flex items-center justify-between px-6 h-12">
        {/* Logo + Nav */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-bh-primary rounded flex items-center justify-center text-white font-bold text-sm">
              B
            </div>
            <span className="text-bh-primary font-semibold text-sm">BuyHelp</span>
          </div>
          <nav className="flex items-center gap-1">
            <a href="#" className="text-bh-primary text-sm font-medium px-3 py-1.5 rounded bg-bh-primary/10 flex items-center gap-1.5">
              Desconto
            </a>
            <a href="#" className="text-bh-muted text-sm px-3 py-1.5 rounded hover:text-bh-text transition-colors flex items-center gap-1.5">
              <LayoutGrid size={13} /> Produtos
            </a>
            <a href="#" className="text-bh-muted text-sm px-3 py-1.5 rounded hover:text-bh-text transition-colors flex items-center gap-1.5 border border-bh-border">
              Bhia · New <Sparkles size={12} className="text-bh-primary" />
            </a>
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button className="text-bh-muted text-xs hover:text-bh-text transition-colors flex items-center gap-1.5">
            <Store size={14} /> Selecione lojas/grupos
          </button>
          <button className="text-bh-muted hover:text-bh-text transition-colors">
            <Bell size={16} />
          </button>
          <button className="text-bh-muted hover:text-bh-text transition-colors">
            <Search size={16} />
          </button>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-7 h-7 rounded-full bg-bh-primary flex items-center justify-center text-white text-xs font-semibold">
              G
            </div>
            <span className="text-bh-text font-medium text-xs">Gessé</span>
            <span className="text-bh-muted text-xs">· Administrador</span>
            <ChevronDown size={12} className="text-bh-muted" />
          </div>
        </div>
      </div>
    </header>
  )
}
