import { useState, useRef } from 'react'
import {
  X, ChevronUp, ChevronDown,
  ChevronRight, RotateCcw, Check, GripVertical,
} from 'lucide-react'
import {
  useDashboardConfig, type SectionConfig,
  CARD_LABELS,
} from '../../contexts/DashboardConfigContext'

const CARD_INNER: Record<string, { id: string; label: string }[]> = {
  c_desconto: [
    { id: 'c_desconto.disponivel',  label: 'Disponível' },
    { id: 'c_desconto.aproveitado', label: 'Aproveitado' },
    { id: 'c_desconto.total',       label: 'Total Disponibilizado' },
  ],
  c_nao_aprov: [
    { id: 'c_nao_aprov.total',        label: 'NÃO APROV. (total)' },
    { id: 'c_nao_aprov.mesma_trib',   label: 'Mesma Tributação' },
    { id: 'c_nao_aprov.somente_item', label: 'Somente um Item' },
    { id: 'c_nao_aprov.nao_aceitou',  label: 'Cliente não aceitou' },
  ],
  c_op_prod: [
    { id: 'c_op_prod.nao_atuou',      label: 'NÃO ATUOU (total)' },
    { id: 'c_op_prod.m_negativa',     label: 'M. Negativa' },
    { id: 'c_op_prod.custo_zero',     label: 'Custo Zero' },
    { id: 'c_op_prod.exclusao_loja',  label: 'Exclusão Loja' },
    { id: 'c_op_prod.blacklist',      label: 'Blacklist' },
  ],
  c_gauge: [
    { id: 'c_gauge.pedidos',        label: 'Pedidos' },
    { id: 'c_gauge.intermediacoes', label: 'Intermediações' },
    { id: 'c_gauge.conversao',      label: 'Conversão' },
    { id: 'c_gauge.nao_conversao',  label: 'Não Converteu' },
  ],
  c_tributacao: [
    { id: 'c_tributacao.tributado', label: 'Tributado' },
    { id: 'c_tributacao.isento',    label: 'Isento' },
  ],
  c_debitos: [
    { id: 'c_debitos.antes',    label: 'Antes' },
    { id: 'c_debitos.depois',   label: 'Depois' },
    { id: 'c_debitos.economia', label: 'Economia' },
  ],
}

const SECTION_ICONS: Record<string, string> = {
  cards: '🃏', vendas: '📊', cadastros: '👥', metricas: '📈',
}

interface Props { onClose: () => void }

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onToggle() }}
      className={`relative w-10 h-[22px] rounded-full transition-colors shrink-0 ${on ? 'bg-orange-500' : 'bg-[#2a2a2a]'}`}
    >
      <span
        className="absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow transition-transform"
        style={{ transform: on ? 'translateX(18px)' : 'translateX(0)' }}
      />
    </button>
  )
}

export function DashboardConfigModal({ onClose }: Props) {
  const {
    sections, setSections, resetSections,
    cardVis, applyCardVis, resetCardVis,
    cardOrder, setCardOrder, resetCardOrder,
  } = useDashboardConfig()

  const [draftSections, setDraftSections] = useState<SectionConfig[]>([...sections])
  const [draftCardVis,  setDraftCardVis]  = useState<Record<string, boolean>>({ ...cardVis })
  const [draftCardOrder, setDraftCardOrder] = useState<string[]>([...cardOrder])
  const [selectedSection, setSelectedSection] = useState<string>(sections[0]?.id ?? '')
  const [expandedCards,   setExpandedCards]   = useState<Set<string>>(new Set())

  // drag state for card ordering
  const dragIdxRef = useRef<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

  function toggleSection(id: string) {
    setDraftSections(d => d.map(s => s.id === id ? { ...s, visible: !s.visible } : s))
  }
  function moveUp(i: number) {
    if (i === 0) return
    setDraftSections(d => { const n = [...d]; [n[i-1], n[i]] = [n[i], n[i-1]]; return n })
  }
  function moveDown(i: number) {
    if (i === draftSections.length - 1) return
    setDraftSections(d => { const n = [...d]; [n[i], n[i+1]] = [n[i+1], n[i]]; return n })
  }
  function toggleCard(id: string) {
    setDraftCardVis(d => ({ ...d, [id]: d[id] === false ? true : false }))
  }
  function toggleExpandCard(id: string) {
    setExpandedCards(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  function moveCardUp(i: number) {
    if (i === 0) return
    setDraftCardOrder(d => { const n = [...d]; [n[i-1], n[i]] = [n[i], n[i-1]]; return n })
  }
  function moveCardDown(i: number) {
    if (i === draftCardOrder.length - 1) return
    setDraftCardOrder(d => { const n = [...d]; [n[i], n[i+1]] = [n[i+1], n[i]]; return n })
  }

  // drag handlers
  function handleDragStart(i: number) { dragIdxRef.current = i }
  function handleDragOver(e: React.DragEvent, i: number) {
    e.preventDefault()
    setDragOverIdx(i)
  }
  function handleDrop(i: number) {
    const from = dragIdxRef.current
    if (from === null || from === i) { setDragOverIdx(null); return }
    setDraftCardOrder(d => {
      const n = [...d]
      const [item] = n.splice(from, 1)
      n.splice(i, 0, item)
      return n
    })
    dragIdxRef.current = null
    setDragOverIdx(null)
  }
  function handleDragEnd() { dragIdxRef.current = null; setDragOverIdx(null) }

  function handleReset() {
    resetSections()
    resetCardVis()
    resetCardOrder()
    onClose()
  }
  function handleSave() {
    setSections(draftSections)
    applyCardVis(draftCardVis)
    setCardOrder(draftCardOrder)
    onClose()
  }

  const selectedSec = draftSections.find(s => s.id === selectedSection)
  const isCardsSection = selectedSection === 'cards'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }} onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl flex flex-col"
        style={{ background: '#0d0d0d', height: '580px' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 shrink-0">
          <div>
            <h2 className="text-white text-lg font-bold">Configurar Dashboard</h2>
            <p className="text-[#555] text-xs mt-0.5">Reordene e configure visibilidade dos cards</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-[#555] hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Split body */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT panel — section list */}
          <div className="w-56 shrink-0 border-r border-white/5 overflow-y-auto py-3 px-3 space-y-1">
            <p className="text-[#333] text-[9px] font-bold tracking-widest uppercase px-2 pb-1">Seções</p>
            {draftSections.map((section, i) => {
              const isSelected = selectedSection === section.id
              return (
                <div key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 cursor-pointer transition-all border ${
                    isSelected
                      ? 'border-orange-500/30 bg-orange-500/10'
                      : 'border-transparent hover:bg-white/[0.04]'
                  } ${!section.visible && !isSelected ? 'opacity-40' : ''}`}>

                  <span className="text-sm leading-none shrink-0">{SECTION_ICONS[section.id] ?? '▪'}</span>
                  <span className={`flex-1 text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-[#777]'}`}>
                    {section.label}
                  </span>

                  <div className="flex flex-col gap-0.5 shrink-0" onClick={e => e.stopPropagation()}>
                    <button onClick={() => moveUp(i)} disabled={i === 0}
                      className="w-4 h-3.5 flex items-center justify-center rounded text-[#444] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                      <ChevronUp size={9} />
                    </button>
                    <button onClick={() => moveDown(i)} disabled={i === draftSections.length - 1}
                      className="w-4 h-3.5 flex items-center justify-center rounded text-[#444] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                      <ChevronDown size={9} />
                    </button>
                  </div>

                  <Toggle on={section.visible} onToggle={() => toggleSection(section.id)} />
                </div>
              )
            })}
          </div>

          {/* RIGHT panel */}
          <div className="flex-1 overflow-y-auto py-4 px-4">

            {/* Section header */}
            {selectedSec && (
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <div>
                  <p className="text-white text-sm font-bold">{selectedSec.label}</p>
                  <p className="text-[#555] text-[11px] mt-0.5">
                    {isCardsSection
                      ? 'Arraste para reordenar · toggle para ocultar'
                      : 'Sem cards individuais'}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  selectedSec.visible ? 'bg-orange-500/15 text-orange-400' : 'bg-white/5 text-[#555]'
                }`}>
                  {selectedSec.visible ? 'Visível' : 'Oculta'}
                </span>
              </div>
            )}

            {/* Cards section — draggable list */}
            {isCardsSection ? (
              <div className="space-y-2">
                {draftCardOrder.map((cardId, i) => {
                  const isExpanded = expandedCards.has(cardId)
                  const cardOn     = draftCardVis[cardId] !== false
                  const inner      = CARD_INNER[cardId] ?? []
                  const isDragOver = dragOverIdx === i
                  return (
                    <div key={cardId}
                      draggable
                      onDragStart={() => handleDragStart(i)}
                      onDragOver={e => handleDragOver(e, i)}
                      onDrop={() => handleDrop(i)}
                      onDragEnd={handleDragEnd}
                      className={`rounded-xl border overflow-hidden transition-all ${
                        isDragOver ? 'border-orange-500/50 bg-orange-500/5' : 'border-white/[0.07]'
                      }`}>
                      {/* Card row */}
                      <div className={`flex items-center gap-2 px-3 py-3 transition-colors ${cardOn ? 'bg-white/[0.03]' : 'bg-transparent'}`}>
                        {/* Position badge */}
                        <span className="text-[#333] text-[10px] font-mono w-4 text-center shrink-0">{i + 1}</span>

                        {/* Drag handle */}
                        <span className="text-[#333] hover:text-[#666] cursor-grab active:cursor-grabbing shrink-0">
                          <GripVertical size={14} />
                        </span>

                        {/* Expand toggle */}
                        <button onClick={() => toggleExpandCard(cardId)}
                          className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-[#555] hover:text-white transition-colors shrink-0">
                          <ChevronRight size={12} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>

                        <span className={`flex-1 text-sm font-semibold ${cardOn ? 'text-white' : 'text-[#444]'}`}>
                          {CARD_LABELS[cardId]}
                        </span>

                        {/* Arrow controls */}
                        <div className="flex flex-col gap-0.5 shrink-0">
                          <button onClick={() => moveCardUp(i)} disabled={i === 0}
                            className="w-4 h-3.5 flex items-center justify-center rounded text-[#444] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                            <ChevronUp size={9} />
                          </button>
                          <button onClick={() => moveCardDown(i)} disabled={i === draftCardOrder.length - 1}
                            className="w-4 h-3.5 flex items-center justify-center rounded text-[#444] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                            <ChevronDown size={9} />
                          </button>
                        </div>

                        <span className="text-[#2a2a2a] text-[10px] mr-2 font-mono">{inner.length} itens</span>
                        <Toggle on={cardOn} onToggle={() => toggleCard(cardId)} />
                      </div>

                      {/* Inner items */}
                      {isExpanded && (
                        <div className="border-t border-white/5">
                          {inner.map(item => {
                            const innerOn = draftCardVis[item.id] !== false
                            return (
                              <div key={item.id}
                                className={`flex items-center gap-3 px-5 py-2.5 border-b border-white/[0.04] last:border-0 transition-opacity ${innerOn ? 'opacity-100' : 'opacity-40'}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2a2a2a] shrink-0 ml-1" />
                                <span className={`flex-1 text-xs ${innerOn ? 'text-[#aaa]' : 'text-[#444]'}`}>
                                  {item.label}
                                </span>
                                <Toggle on={innerOn} onToggle={() => toggleCard(item.id)} />
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              /* Non-cards sections */
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                  <span className="text-2xl">{SECTION_ICONS[selectedSection] ?? '▪'}</span>
                </div>
                <p className="text-[#444] text-sm font-semibold">Sem cards configuráveis</p>
                <p className="text-[#333] text-xs mt-1">Use o toggle ao lado para ocultar a seção</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 shrink-0">
          <button onClick={handleReset}
            className="flex items-center gap-2 text-[#555] hover:text-white text-xs font-semibold transition-colors">
            <RotateCcw size={13} />
            Restaurar padrão
          </button>
          <div className="flex items-center gap-2">
            <button onClick={onClose}
              className="px-4 py-2 rounded-lg border border-white/10 text-[#666] hover:text-white text-xs font-semibold transition-colors">
              Cancelar
            </button>
            <button onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-colors">
              <Check size={13} />
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
