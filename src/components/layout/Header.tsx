import { useEffect, useRef, useState } from 'react'
import { Bell, Search, Store, ChevronDown, Sparkles, LayoutGrid, Layers, X, Check, Sun, Moon } from 'lucide-react'
import { useLojaGrupo } from '../../contexts/LojaGrupoContext'
import { useTheme } from '../../contexts/ThemeContext'
import { CREDENCIADOS_MOCK, GRUPOS_MOCK, GRUPO_LOJAS } from '../../mocks/buyhelp-index.mock'
import type { CredenciadoOption } from '../../types/buyhelp-index.types'

// ─── Picker dropdown ──────────────────────────────────────────────────────────

const CRED_MAP = Object.fromEntries(CREDENCIADOS_MOCK.map(c => [c.uuid, c])) as Record<string, CredenciadoOption>

function LojaGrupoPicker({
  modo, credenciadoUuid, grupoUuid,
  onSelectGrupo, onSelectLoja, onClose,
}: {
  modo: 'loja' | 'grupo'
  credenciadoUuid: string
  grupoUuid: string
  onSelectGrupo: (uuid: string) => void
  onSelectLoja: (uuid: string) => void
  onClose: () => void
}) {
  const [search, setSearch] = useState('')
  const q = search.toLowerCase()

  return (
    <div
      className="absolute z-50 top-full mt-2 left-0 rounded-xl shadow-2xl border overflow-hidden flex flex-col"
      style={{
        background: 'rgb(var(--bh-bg))',
        borderColor: 'rgb(var(--bh-border) / 0.6)',
        width: 450,
        maxHeight: '75vh',
      }}
    >
      {/* Header */}
      <div
        className="shrink-0 p-3 flex flex-col gap-3"
        style={{
          background: 'rgb(var(--bh-surface2))',
          borderBottom: '1px solid rgb(var(--bh-border) / 0.4)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 pl-1">
            <Layers size={13} className="text-bh-primary" />
            <span className="text-sm font-semibold text-bh-text">
              Filtro Global – Loja/Grupo Econômico
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-bh-text transition-colors hover:bg-bh-surface"
            >
              <Check size={12} /> Todos
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-bh-text transition-colors hover:bg-bh-surface"
            >
              <X size={12} /> Fechar
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-bh-subtle" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filtrar por loja, grupo ou CNPJ..."
            autoFocus
            className="w-full rounded-md pl-9 pr-3 py-1.5 text-sm outline-none border bg-bh-surface border-bh-border text-bh-text"
          />
        </div>

        {/* Counter */}
        <span className="self-start px-2.5 py-0.5 rounded-full text-xs font-semibold bg-bh-secondary" style={{ color: '#fff' }}>
          1 de {CREDENCIADOS_MOCK.length} selecionadas
        </span>
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1">
        <div className="p-3 space-y-2">
          {GRUPOS_MOCK.map(grupo => {
            const lojas = (GRUPO_LOJAS[grupo.uuid] ?? []).map(uid => CRED_MAP[uid]).filter(Boolean)
            const grpMatch = grupo.nome.toLowerCase().includes(q)
            const filteredLojas = lojas.filter(l =>
              !q || grpMatch || l.nome.toLowerCase().includes(q) || l.cnpj.includes(search)
            )
            if (q && !grpMatch && filteredLojas.length === 0) return null

            const isGrupoSel = modo === 'grupo' && grupoUuid === grupo.uuid

            return (
              <div key={grupo.uuid} className="space-y-0.5">
                {/* Group row */}
                <button
                  onClick={() => { onSelectGrupo(grupo.uuid); onClose() }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors hover:bg-bh-surface"
                  style={{
                    background: isGrupoSel ? 'rgb(255 102 0 / 0.12)' : 'rgb(var(--bh-surface2))',
                    border: isGrupoSel ? '1px solid rgb(255 102 0 / 0.3)' : '1px solid transparent',
                  }}
                >
                  <div className="w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center"
                    style={{ borderColor: isGrupoSel ? '#ff6600' : 'rgb(var(--bh-subtle))' }}>
                    {isGrupoSel && <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff6600' }} />}
                  </div>
                  <Layers size={16} style={{ color: isGrupoSel ? '#ff6600' : 'rgb(var(--bh-muted))', flexShrink: 0 }} />
                  <span className="flex-1 text-sm font-medium text-bh-text">{grupo.nome}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-bh-secondary" style={{ color: '#fff' }}>
                    {lojas.length}
                  </span>
                </button>

                {/* Store rows */}
                <div className="ml-8 space-y-0.5">
                  {filteredLojas.map(loja => {
                    const isSel = modo === 'loja' && credenciadoUuid === loja.uuid
                    return (
                      <button
                        key={loja.uuid}
                        onClick={() => { onSelectLoja(loja.uuid); onClose() }}
                        className="w-full flex items-center gap-3 px-2 py-2 rounded-md text-left transition-colors hover:bg-bh-surface"
                        style={isSel
                          ? { background: 'rgb(255 102 0 / 0.08)', border: '1px solid rgb(255 102 0 / 0.2)' }
                          : { border: '1px solid transparent' }
                        }
                      >
                        <div className="w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center"
                          style={{ borderColor: isSel ? '#ff6600' : 'rgb(var(--bh-subtle))' }}>
                          {isSel && <div className="w-2 h-2 rounded-full" style={{ background: '#ff6600' }} />}
                        </div>
                        <Store size={14} style={{ color: isSel ? '#ff6600' : 'rgb(var(--bh-muted))', flexShrink: 0 }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm leading-tight text-bh-text">{loja.nome}</p>
                          <p className="text-xs mt-0.5 text-bh-muted">{loja.cnpj}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

export function Header() {
  const { modo, setModo, credenciadoUuid, setCredenciadoUuid, grupoUuid, setGrupoUuid, pickerOpen, setPickerOpen } = useLojaGrupo()
  const { theme, toggle } = useTheme()
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function h(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setPickerOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [setPickerOpen])

  const selectorLabel = modo === 'grupo'
    ? (GRUPOS_MOCK.find(g => g.uuid === grupoUuid)?.nome ?? 'Grupo')
    : (CREDENCIADOS_MOCK.find(c => c.uuid === credenciadoUuid)?.nome ?? 'Selecione lojas/grupos')

  return (
    <header className="bg-bh-nav border-b border-bh-border">
      <div className="flex items-center justify-between px-6 h-12">
        {/* Logo + Nav */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-bh-primary rounded flex items-center justify-center font-bold text-sm" style={{ color: '#fff' }}>
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

          {/* Picker trigger */}
          <div className="relative" ref={pickerRef}>
            <button
              onClick={() => setPickerOpen(!pickerOpen)}
              className="flex items-center gap-1.5 text-xs transition-colors hover:text-bh-text"
              style={{ color: pickerOpen ? '#ff6600' : 'rgb(var(--bh-muted))' }}
            >
              {modo === 'grupo'
                ? <Layers size={14} style={{ color: pickerOpen ? '#ff6600' : 'rgb(var(--bh-muted))' }} />
                : <Store  size={14} style={{ color: pickerOpen ? '#ff6600' : 'rgb(var(--bh-muted))' }} />
              }
              <span className="max-w-[180px] truncate">{selectorLabel}</span>
              <ChevronDown size={11} className={`transition-transform ${pickerOpen ? 'rotate-180 text-orange-500' : ''}`} />
            </button>

            {pickerOpen && (
              <LojaGrupoPicker
                modo={modo}
                credenciadoUuid={credenciadoUuid}
                grupoUuid={grupoUuid}
                onSelectGrupo={uuid => { setGrupoUuid(uuid); setModo('grupo') }}
                onSelectLoja={uuid => { setCredenciadoUuid(uuid); setModo('loja') }}
                onClose={() => setPickerOpen(false)}
              />
            )}
          </div>

          <button className="text-bh-muted hover:text-bh-text transition-colors">
            <Bell size={16} />
          </button>
          <button className="text-bh-muted hover:text-bh-text transition-colors">
            <Search size={16} />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="text-bh-muted hover:text-bh-text transition-colors"
            title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <div className="flex items-center gap-2 text-sm">
            <div className="w-7 h-7 rounded-full bg-bh-primary flex items-center justify-center text-xs font-semibold" style={{ color: '#fff' }}>
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
