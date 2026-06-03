import { useState } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { TabNav } from '../components/ui/TabNav'
import { Modal } from '../components/ui/Modal'
import { ArrowRight, Target, TrendingUp, TrendingDown, LayoutGrid } from 'lucide-react'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SETORES = [
  { nome: 'Bebidas',          desconto: 27.25, margem_pct: 20, venda: 3120000, margem: 624000  },
  { nome: 'Hortifruti',       desconto:  0.00, margem_pct: 27, venda: 1870000, margem: 505000  },
  { nome: 'Açougue',          desconto:  7.00, margem_pct: 22, venda: 1750000, margem: 384000  },
  { nome: 'Mercearia',        desconto: 21.25, margem_pct: 13, venda: 2620000, margem: 341000  },
  { nome: 'Padaria',          desconto:  7.00, margem_pct: 28, venda:  998000, margem: 279000  },
  { nome: 'Frios & Laticínios', desconto: 12.00, margem_pct: 19, venda: 1250000, margem: 237000 },
  { nome: 'Limpeza',          desconto: 27.25, margem_pct: 14, venda:  562000, margem:  79000  },
  { nome: 'Higiene',          desconto: 12.00, margem_pct: 16, venda:  313000, margem:  50000  },
]

// Matriz de afinidade de cesta (% de cupons que contêm ambos os setores)
// Linhas: Bebidas, Mercearia, Hortifruti, Açougue, Frios, Padaria, Limpeza, Higiene
const SETORES_MATRIX = [
  { label: 'Bebidas',            abrev: 'BEB' },
  { label: 'Mercearia',          abrev: 'MER' },
  { label: 'Hortifruti',         abrev: 'HOR' },
  { label: 'Açougue',            abrev: 'AÇO' },
  { label: 'Frios & Laticínios', abrev: 'FRI' },
  { label: 'Padaria',            abrev: 'PAD' },
  { label: 'Limpeza',            abrev: 'LIM' },
  { label: 'Higiene',            abrev: 'HIG' },
]

//  null = diagonal  |  number = afinidade %
const MATRIX_DATA: (number | null)[][] = [
  //BEB  MER  HOR  AÇO  FRI  PAD  LIM  HIG
  [null,  64,  58,  61,  49,  42,  31,  22],  // Bebidas
  [  84, null, 67,  55,  52,  48,  44,  33],  // Mercearia
  [  58,  67, null, 72,  51,  57,  29,  24],  // Hortifruti
  [  61,  55,  72, null, 46,  38,  27,  19],  // Açougue
  [  49,  52,  51,  48, null, 53,  25,  21],  // Frios
  [  42,  48,  57,  38,  53, null, 23,  26],  // Padaria
  [  31,  44,  29,  27,  25,  23, null, 58],  // Limpeza
  [  22,  33,  24,  19,  21,  26,  58, null], // Higiene
]

// Células com oportunidade fiscal (row, col)
const OPORT_FISCAL = new Set(['0-2','0-3','0-5','1-0','1-2','1-5','2-0','2-3','3-0','4-2','5-1','6-1','6-4'])

// Oportunidades: maior afinidade × maior diferença de carga tributária
const MIGRACOES = [
  { de: 'Bebidas',   de_desc: 27.25, para: 'Hortifruti', para_desc:  0.00, afinidade: 58 },
  { de: 'Mercearia', de_desc: 21.25, para: 'Hortifruti', para_desc:  0.00, afinidade: 67 },
  { de: 'Bebidas',   de_desc: 27.25, para: 'Açougue',    para_desc:  7.00, afinidade: 61 },
  { de: 'Bebidas',   de_desc: 27.25, para: 'Padaria',    para_desc:  7.00, afinidade: 42 },
  { de: 'Limpeza',   de_desc: 27.25, para: 'Hortifruti', para_desc:  0.00, afinidade: 29 },
  { de: 'Mercearia', de_desc: 21.25, para: 'Açougue',    para_desc:  7.00, afinidade: 55 },
]

// ─── Mock itens por setor ─────────────────────────────────────────────────────

interface ItemSetor { nome: string; unidades: number; receita: number }

const ITENS_SETOR: Record<string, { subtitulo: string; skus: number; ticket: number; mais: ItemSetor[]; menos: ItemSetor[] }> = {
  'Bebidas': {
    subtitulo: 'Cervejas, refri, vinhos, destilados · carga 27,25%',
    skus: 25, ticket: 22.21,
    mais: [
      { nome: 'Cerveja Pilsen Lata 350ml',   unidades: 29733, receita: 535000 },
      { nome: 'Refrigerante Cola 2L',         unidades: 15472, receita: 325000 },
      { nome: 'Vinho Tinto Reserva 750ml',    unidades: 10111, receita: 243000 },
      { nome: 'Cerveja Long Neck 355ml',      unidades:  7308, receita: 197000 },
      { nome: 'Água Mineral 1,5L',            unidades:  5599, receita: 168000 },
      { nome: 'Suco de Uva Integral 1L',      unidades:  8184, receita: 147000 },
      { nome: 'Energético 250ml',             unidades:  6278, receita: 132000 },
      { nome: 'Whisky 12 anos 1L',            unidades:  4990, receita: 120000 },
      { nome: 'Refrigerante Guaraná 2L',      unidades:  4075, receita: 110000 },
      { nome: 'Vodka 1L',                     unidades:  3399, receita: 102000 },
      { nome: 'Cerveja Puro Malte 600ml',     unidades:  5290, receita:  95000 },
      { nome: 'Água com Gás 500ml',           unidades:  4259, receita:  89000 },
      { nome: 'Espumante Brut 750ml',         unidades:  3518, receita:  84000 },
    ],
    menos: [
      { nome: 'Licor 700ml',                  unidades:  1757, receita:  53000 },
      { nome: 'Tônica 350ml',                 unidades:  2011, receita:  54000 },
      { nome: 'Cerveja IPA 473ml',            unidades:  2333, receita:  56000 },
      { nome: 'Vinho Branco Seco 750ml',      unidades:  2753, receita:  58000 },
      { nome: 'Refrigerante Limão 600ml',     unidades:  3321, receita:  60000 },
      { nome: 'Chá Gelado 1,5L',              unidades:  2084, receita:  62000 },
      { nome: 'Cachaça Premium 700ml',        unidades:  2378, receita:  64000 },
      { nome: 'Cerveja Sem Álcool 350ml',     unidades:  2783, receita:  67000 },
      { nome: 'Gin 1L',                       unidades:  3314, receita:  70000 },
      { nome: 'Suco de Laranja 1L',           unidades:  4038, receita:  73000 },
      { nome: 'Isotônico 500ml',              unidades:  2539, receita:  76000 },
      { nome: 'Refrigerante Laranja 350ml',   unidades:  2984, receita:  80000 },
      { nome: 'Espumante Brut 750ml',         unidades:  3518, receita:  84000 },
    ],
  },
  'Hortifruti': {
    subtitulo: 'Frutas, verduras, legumes · carga 0,00%',
    skus: 18, ticket: 14.50,
    mais: [
      { nome: 'Banana Prata kg',        unidades: 22100, receita: 265000 },
      { nome: 'Tomate Salada kg',       unidades: 18400, receita: 221000 },
      { nome: 'Cebola kg',              unidades: 15300, receita: 184000 },
      { nome: 'Batata Inglesa kg',      unidades: 14200, receita: 170000 },
      { nome: 'Alface un',              unidades: 12900, receita: 155000 },
      { nome: 'Limão Taiti kg',         unidades: 11500, receita: 138000 },
      { nome: 'Maçã Fuji kg',           unidades: 10200, receita: 122000 },
      { nome: 'Laranja Pera kg',        unidades:  9800, receita: 118000 },
      { nome: 'Cenoura kg',             unidades:  8700, receita: 104000 },
      { nome: 'Alho Graúdo kg',         unidades:  7600, receita:  91000 },
    ],
    menos: [
      { nome: 'Kiwi kg',                unidades:  1200, receita:  28000 },
      { nome: 'Aspargo un',             unidades:  1500, receita:  32000 },
      { nome: 'Rúcula un',              unidades:  1800, receita:  36000 },
      { nome: 'Morango bandeja',        unidades:  2100, receita:  40000 },
      { nome: 'Abobrinha kg',           unidades:  2400, receita:  44000 },
      { nome: 'Pimentão Vermelho kg',   unidades:  2700, receita:  48000 },
      { nome: 'Brócolis un',            unidades:  3000, receita:  52000 },
      { nome: 'Couve-flor un',          unidades:  3200, receita:  56000 },
      { nome: 'Beterraba kg',           unidades:  3500, receita:  60000 },
      { nome: 'Pepino kg',              unidades:  3800, receita:  64000 },
    ],
  },
  'Mercearia': {
    subtitulo: 'Arroz, feijão, óleo, massas · carga 21,25%',
    skus: 32, ticket: 18.30,
    mais: [
      { nome: 'Arroz Branco 5kg',       unidades: 24500, receita: 490000 },
      { nome: 'Feijão Carioca 1kg',     unidades: 19800, receita: 396000 },
      { nome: 'Óleo de Soja 900ml',     unidades: 16200, receita: 324000 },
      { nome: 'Macarrão Espaguete 500g',unidades: 14100, receita: 282000 },
      { nome: 'Açúcar Cristal 1kg',     unidades: 12800, receita: 256000 },
      { nome: 'Farinha de Trigo 1kg',   unidades: 11500, receita: 230000 },
      { nome: 'Sal Refinado 1kg',       unidades: 10200, receita: 204000 },
      { nome: 'Café Torrado 500g',      unidades:  9100, receita: 182000 },
      { nome: 'Leite UHT 1L',           unidades:  8400, receita: 168000 },
      { nome: 'Molho de Tomate 340g',   unidades:  7700, receita: 154000 },
    ],
    menos: [
      { nome: 'Quinoa 500g',            unidades:  1100, receita:  38000 },
      { nome: 'Chia 250g',              unidades:  1400, receita:  42000 },
      { nome: 'Azeite Extra Virgem 1L', unidades:  1700, receita:  46000 },
      { nome: 'Granola 500g',           unidades:  2000, receita:  50000 },
      { nome: 'Linhaça 500g',           unidades:  2300, receita:  54000 },
      { nome: 'Creme de Leite 200g',    unidades:  2600, receita:  58000 },
      { nome: 'Farinha de Rosca 500g',  unidades:  2900, receita:  62000 },
      { nome: 'Fermento Biológico 10g', unidades:  3200, receita:  66000 },
      { nome: 'Gelatina 15g',           unidades:  3500, receita:  70000 },
      { nome: 'Achocolatado 400g',      unidades:  3800, receita:  74000 },
    ],
  },
}

function getItensSetor(nome: string) {
  return ITENS_SETOR[nome] ?? {
    subtitulo: `Produtos do setor · carga ${SETORES.find(s => s.nome === nome)?.desconto.toFixed(2) ?? '0,00'}%`,
    skus: 15, ticket: 12.00,
    mais: Array.from({ length: 10 }, (_, i) => ({ nome: `Produto ${i + 1}`, unidades: (10 - i) * 1200, receita: (10 - i) * 35000 })),
    menos: Array.from({ length: 10 }, (_, i) => ({ nome: `Item ${i + 1}`, unidades: (i + 1) * 400, receita: (i + 1) * 18000 })),
  }
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function SetorModal({ setor, onClose }: { setor: typeof SETORES[0]; onClose: () => void }) {
  const dados = getItensSetor(setor.nome)

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={`${setor.nome} — itens vendidos`}
      subtitle={dados.subtitulo}
      icon={<Target size={22} />}
      footer={
        <>
          <span className="text-xs text-bh-subtle">Vendas estimadas dos últimos 12 meses · dados de demonstração</span>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-ghost">Fechar</button>
            <button onClick={onClose} className="btn-primary">
              <Target size={14} /> Ver detalhes
            </button>
          </div>
        </>
      }
    >
      {/* Stats */}
      <div
        className="grid grid-cols-4 gap-6 p-5 rounded-lg"
        style={{ background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {[
          { label: 'FATURAMENTO',      value: fmtBRL(setor.venda),             cor: '#ffffff' },
          { label: 'MARGEM',           value: fmtBRL(setor.margem),            cor: '#22c9a0' },
          { label: 'SKUS',             value: String(dados.skus),              cor: '#ffffff' },
          { label: 'TICKET MÉDIO/UN.', value: `R$ ${dados.ticket.toFixed(2)}`, cor: '#ffffff' },
        ].map(stat => (
          <div key={stat.label}>
            <p className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#4b5563' }}>
              {stat.label}
            </p>
            <p className="text-xl font-black tabular-nums" style={{ color: stat.cor }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-4">
        {/* Mais vendidos */}
        <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.018)' }}
          >
            <TrendingUp size={13} color="#22c9a0" />
            <span className="text-xs font-bold" style={{ color: '#22c9a0' }}>Top mais vendidos</span>
          </div>
          {dados.mais.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-2.5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            >
              <span className="text-[10px] w-5 flex-shrink-0 tabular-nums font-bold" style={{ color: '#374151' }}>
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{item.nome}</p>
                <p className="text-[10px] tabular-nums mt-0.5" style={{ color: '#4b5563' }}>
                  {item.unidades.toLocaleString('pt-BR')} un.
                </p>
              </div>
              <span className="text-xs font-bold tabular-nums flex-shrink-0" style={{ color: '#22c9a0' }}>
                {fmtBRL(item.receita)}
              </span>
            </div>
          ))}
        </div>

        {/* Menos vendidos */}
        <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.018)' }}
          >
            <TrendingDown size={13} color="#f87171" />
            <span className="text-xs font-bold" style={{ color: '#f87171' }}>Top menos vendidos</span>
          </div>
          {dados.menos.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-2.5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            >
              <span className="text-[10px] w-5 flex-shrink-0 tabular-nums font-bold" style={{ color: '#374151' }}>
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{item.nome}</p>
                <p className="text-[10px] tabular-nums mt-0.5" style={{ color: '#4b5563' }}>
                  {item.unidades.toLocaleString('pt-BR')} un.
                </p>
              </div>
              <span className="text-xs font-bold tabular-nums flex-shrink-0" style={{ color: '#f87171' }}>
                {fmtBRL(item.receita)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtBRL(v: number) {
  return v >= 1_000_000
    ? `R$ ${(v / 1_000_000).toFixed(2)}M`
    : `R$ ${(v / 1_000).toFixed(0)}K`
}


// ─── Section 1 ────────────────────────────────────────────────────────────────

type SortKey = 'venda' | 'margem'

function QuemMaisVende() {
  const [sort, setSort] = useState<SortKey>('venda')
  const [selectedSetor, setSelectedSetor] = useState<typeof SETORES[0] | null>(null)

  const maxVenda  = Math.max(...SETORES.map(s => s.venda))
  const maxMargem = Math.max(...SETORES.map(s => s.margem))

  const sorted = [...SETORES].sort((a, b) =>
    sort === 'venda' ? b.venda - a.venda : b.margem - a.margem
  )

  return (
    <section className="card-bh p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-bh-text font-bold text-base leading-tight">
            Quem mais vende não é quem mais rende
          </h2>
          <p className="text-xs mt-1" style={{ color: '#378ADD' }}>
            Venda vs. margem gerada por setor · clique para ver os itens
          </p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {(['venda', 'margem'] as SortKey[]).map(k => (
            <button
              key={k}
              onClick={() => setSort(k)}
              className="px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest transition-colors"
              style={sort === k
                ? { background: 'rgb(var(--bh-surface2))', color: 'rgb(var(--bh-text))', border: '1px solid rgba(255,255,255,0.12)' }
                : { background: 'transparent', color: 'rgb(var(--bh-subtle))', border: '1px solid transparent' }
              }
            >
              {k === 'venda' ? 'Venda' : 'Margem'}
            </button>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {sorted.map((s, i) => {
          const barVenda  = (s.venda  / maxVenda)  * 100
          const barMargem = (s.margem / maxMargem) * 100
          const isLast = i === sorted.length - 1

          return (
            <div key={s.nome}
              className="py-3 cursor-pointer hover:bg-white/[0.02] transition-colors rounded-lg"
              onClick={() => setSelectedSetor(s)}
              style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>

              {/* Nome + badges */}
              <div className="flex items-center gap-3 mb-2.5">
                <span className="text-sm font-bold text-bh-text w-36 flex-shrink-0">{s.nome}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{
                    background: s.desconto === 0 ? 'rgba(156,163,175,0.12)' : 'rgba(239,159,39,0.15)',
                    color: s.desconto === 0 ? '#9ca3af' : '#EF9F27',
                  }}>
                  {s.desconto.toFixed(2)}%
                </span>
                <span className="text-xs font-semibold ml-auto" style={{ color: 'rgb(var(--bh-subtle))' }}>
                  <span className="font-bold" style={{ color: '#22c9a0' }}>{s.margem_pct}%</span>
                  {' '}margem
                </span>
              </div>

              {/* Barra Venda */}
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-[10px] w-12 flex-shrink-0" style={{ color: 'rgb(var(--bh-subtle))' }}>Venda</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgb(var(--bh-surface2))' }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${barVenda}%`, background: '#6b7280' }} />
                </div>
                <span className="text-xs font-semibold tabular-nums w-20 text-right flex-shrink-0"
                  style={{ color: '#9ca3af' }}>
                  {fmtBRL(s.venda)}
                </span>
              </div>

              {/* Barra Margem */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] w-12 flex-shrink-0" style={{ color: 'rgb(var(--bh-subtle))' }}>Margem</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgb(var(--bh-surface2))' }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${barMargem}%`, background: '#22c9a0' }} />
                </div>
                <span className="text-xs font-semibold tabular-nums w-20 text-right flex-shrink-0"
                  style={{ color: '#22c9a0' }}>
                  {fmtBRL(s.margem)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 pt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: '#6b7280' }} />
          <span className="text-[10px]" style={{ color: 'rgb(var(--bh-subtle))' }}>Venda</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: '#22c9a0' }} />
          <span className="text-[10px]" style={{ color: 'rgb(var(--bh-subtle))' }}>Margem gerada</span>
        </div>
      </div>

      {selectedSetor && <SetorModal setor={selectedSetor} onClose={() => setSelectedSetor(null)} />}
    </section>
  )
}

// ─── Correlação Modal ────────────────────────────────────────────────────────

interface CorrelacaoCell { ri: number; ci: number; val: number }
interface ParItem { itemA: string; itemB: string; pct: number }

function getPares(setorA: string, setorB: string, afinidade: number): { maiores: ParItem[]; menores: ParItem[] } {
  const dadosA = getItensSetor(setorA)
  const dadosB = getItensSetor(setorB)
  const maisA  = dadosA.mais.map(i => i.nome)
  const maisB  = dadosB.mais.map(i => i.nome)
  const menosA = dadosA.menos.map(i => i.nome)
  const menosB = dadosB.menos.map(i => i.nome)

  const maiores: ParItem[] = Array.from({ length: 20 }, (_, i) => ({
    itemA: maisA[i % maisA.length],
    itemB: maisB[Math.floor(i / 3) % maisB.length],
    pct:   Math.max(Math.round(afinidade - i * 1.2), afinidade - 22),
  }))

  const menores: ParItem[] = Array.from({ length: 20 }, (_, i) => ({
    itemA: menosA[i % menosA.length],
    itemB: menosB[Math.floor(i / 3) % menosB.length],
    pct:   Math.min(6 + Math.round(i * 0.85), 20),
  }))

  return { maiores, menores }
}

function CorrelacaoParRow({ par, i, color }: { par: ParItem; i: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black"
        style={{ background: 'rgba(255,102,0,0.15)', color: '#ff6600' }}>
        {i + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: '#ff6600' }} />
          <span className="text-[11px] font-semibold text-bh-text truncate">{par.itemA}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px]" style={{ color: 'rgb(var(--bh-subtle))' }}>+</span>
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#22c9a0' }} />
          <span className="text-[11px] text-bh-muted truncate">{par.itemB}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0" style={{ width: 76 }}>
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgb(var(--bh-surface2))' }}>
          <div className="h-full rounded-full" style={{ width: `${par.pct}%`, background: color }} />
        </div>
        <span className="text-[10px] font-bold tabular-nums" style={{ color, width: 28, textAlign: 'right' }}>
          {par.pct}%
        </span>
      </div>
    </div>
  )
}

function CorrelacaoModal({ cell, onClose }: { cell: CorrelacaoCell; onClose: () => void }) {
  const setorA = SETORES_MATRIX[cell.ri]
  const setorB = SETORES_MATRIX[cell.ci]
  const descA  = SETORES.find(s => s.nome === setorA.label)?.desconto ?? 0
  const descB  = SETORES.find(s => s.nome === setorB.label)?.desconto ?? 0
  const { maiores, menores } = getPares(setorA.label, setorB.label, cell.val)

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={`${setorA.label} → ${setorB.label}`}
      subtitle={`Itens correlacionados · afinidade de cesta ${cell.val}%`}
      icon={<LayoutGrid size={22} />}
      footer={
        <span className="text-xs text-bh-subtle">
          % = frequência com que os dois itens aparecem no mesmo cupom · dados de demonstração
        </span>
      }
    >
      {/* Descrição */}
      <p className="text-sm text-bh-muted leading-relaxed">
        Quem leva itens de{' '}
        <strong className="text-bh-text">{setorA.label}</strong>{' '}
        <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded"
          style={{ background: 'rgba(239,159,39,0.18)', color: '#EF9F27' }}>
          {descA.toFixed(2)}%
        </span>{' '}
        também costuma levar estes de{' '}
        <strong className="text-bh-text">{setorB.label}</strong>{' '}
        <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded"
          style={{
            background: descB === 0 ? 'rgba(156,163,175,0.12)' : 'rgba(34,201,160,0.12)',
            color: descB === 0 ? '#9ca3af' : '#22c9a0',
          }}>
          {descB.toFixed(2)}%
        </span>{' '}
        — onde a margem pode migrar.
      </p>

      {/* Duas colunas */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={13} color="#22c9a0" />
            <span className="text-xs font-bold" style={{ color: '#22c9a0' }}>Top 20 maior afinidade</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {maiores.map((par, i) => (
              <CorrelacaoParRow key={i} par={par} i={i} color="#22c9a0" />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={13} color="#9ca3af" />
            <span className="text-xs font-bold" style={{ color: '#9ca3af' }}>Top 20 menor afinidade</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {menores.map((par, i) => (
              <CorrelacaoParRow key={i} par={par} i={i} color="#9ca3af" />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

// ─── Section 2 ────────────────────────────────────────────────────────────────

function heatColor(v: number): { bg: string; text: string } {
  // 0–20 very light, 80+ darkest teal
  if (v >= 80) return { bg: '#0b5e52', text: '#e2fff9' }
  if (v >= 65) return { bg: '#0d7a6a', text: '#e2fff9' }
  if (v >= 50) return { bg: '#0f9478', text: '#e2fff9' }
  if (v >= 38) return { bg: '#22c9a0', text: '#0d1f1a' }
  if (v >= 25) return { bg: '#6ee7cb', text: '#0d2d24' }
  return         { bg: '#b2f0e3', text: '#0d2d24' }
}

function CorrelacaoSetores() {
  const [selectedCell, setSelectedCell] = useState<CorrelacaoCell | null>(null)

  return (
    <section className="card-bh p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-bh-text font-bold text-base leading-tight">
            Correlação entre setores
          </h2>
          <p className="text-xs mt-1" style={{ color: '#378ADD' }}>
            Afinidade de cesta — % de cupons que contêm os dois grupos juntos · clique para ver os itens
          </p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded flex-shrink-0"
          style={{ background: 'rgb(var(--bh-surface2))', color: 'rgb(var(--bh-text))', border: '1px solid rgba(255,255,255,0.12)' }}>
          Matriz
        </span>
      </div>

      {/* Matrix */}
      <div className="overflow-x-auto">
        <table className="border-collapse w-full" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ width: '22%' }} />
              {SETORES_MATRIX.map(s => (
                <th key={s.abrev}
                  className="text-center text-[10px] font-bold uppercase tracking-widest pb-2"
                  style={{ color: 'rgb(var(--bh-subtle))' }}>
                  {s.abrev}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MATRIX_DATA.map((row, ri) => (
              <tr key={ri}>
                <td className="pr-4 py-1">
                  <span className="text-sm font-semibold text-bh-text whitespace-nowrap">
                    {SETORES_MATRIX[ri].label}
                  </span>
                </td>
                {row.map((val, ci) => {
                  const key = `${ri}-${ci}`
                  const isOport = OPORT_FISCAL.has(key)
                  if (val === null) {
                    return (
                      <td key={ci} className="p-1">
                        <div className="w-full h-12 rounded flex items-center justify-center"
                          style={{ background: 'rgb(var(--bh-surface2))' }}>
                          <span className="text-sm font-bold" style={{ color: 'rgb(var(--bh-subtle))' }}>—</span>
                        </div>
                      </td>
                    )
                  }
                  const { bg, text } = heatColor(val)
                  return (
                    <td key={ci} className="p-1">
                      <div className="relative w-[72px] h-12 rounded flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedCell({ ri, ci, val })}
                        style={{
                          background: bg,
                          border: isOport ? '2px solid #ff6600' : '2px solid transparent',
                        }}>
                        <span className="text-sm font-bold tabular-nums" style={{ color: text }}>
                          {val}
                        </span>
                        {isOport && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-black"
                            style={{ background: '#ff6600' }} />
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 pt-1 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {['#b2f0e3','#6ee7cb','#22c9a0','#0f9478','#0d7a6a','#0b5e52'].map(c => (
              <div key={c} className="w-5 h-3 rounded-sm" style={{ background: c }} />
            ))}
          </div>
          <span className="text-[10px]" style={{ color: 'rgb(var(--bh-subtle))' }}>
            Menor &nbsp;→&nbsp; Maior afinidade
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full border border-black inline-block flex-shrink-0"
            style={{ background: '#ff6600' }} />
          <span className="text-[10px]" style={{ color: 'rgb(var(--bh-subtle))' }}>
            Oportunidade fiscal — carga alta × carga baixa
          </span>
        </div>
      </div>

      {selectedCell && (
        <CorrelacaoModal cell={selectedCell} onClose={() => setSelectedCell(null)} />
      )}
    </section>
  )
}

// ─── Section 3 ────────────────────────────────────────────────────────────────

function TopOportunidades() {
  const [selectedCell, setSelectedCell] = useState<CorrelacaoCell | null>(null)

  function openModal(de: string, para: string, afinidade: number) {
    const ri = SETORES_MATRIX.findIndex(s => s.label === de)
    const ci = SETORES_MATRIX.findIndex(s => s.label === para)
    if (ri >= 0 && ci >= 0) setSelectedCell({ ri, ci, val: afinidade })
  }

  return (
    <section className="card-bh p-6 flex flex-col gap-4">
      {/* Header */}
      <div>
        <h2 className="text-bh-text font-bold text-base leading-tight">
          Top oportunidades de migração
        </h2>
        <p className="text-xs mt-1" style={{ color: '#378ADD' }}>
          Maior afinidade × maior diferença de carga · clique para ver os itens
        </p>
      </div>

      {/* List */}
      <div className="flex flex-col">
        {MIGRACOES.map((m, i) => {
          const isLast = i === MIGRACOES.length - 1
          return (
            <div key={i}
              className="flex items-center gap-4 py-2 cursor-pointer hover:bg-white/[0.02] transition-colors rounded-lg px-2 -mx-2"
              onClick={() => openModal(m.de, m.para, m.afinidade)}
              style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>

              {/* Rank circle */}
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black"
                style={{ background: 'rgba(255,102,0,0.15)', color: '#ff6600' }}>
                {i + 1}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Par de setores */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-bh-text">{m.de}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded tabular-nums"
                    style={{ background: 'rgba(239,159,39,0.18)', color: '#EF9F27' }}>
                    {m.de_desc.toFixed(2)}%
                  </span>
                  <ArrowRight size={13} color="rgb(var(--bh-subtle))" className="flex-shrink-0" />
                  <span className="text-sm font-bold text-bh-text">{m.para}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded tabular-nums"
                    style={{
                      background: m.para_desc === 0 ? 'rgba(156,163,175,0.12)' : 'rgba(34,201,160,0.12)',
                      color: m.para_desc === 0 ? '#9ca3af' : '#22c9a0',
                    }}>
                    {m.para_desc.toFixed(2)}%
                  </span>
                </div>

                {/* Barra de afinidade */}
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] flex-shrink-0" style={{ color: 'rgb(var(--bh-subtle))' }}>
                    afinidade
                  </span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden"
                    style={{ background: 'rgb(var(--bh-surface2))' }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${m.afinidade}%`, background: '#22c9a0' }} />
                  </div>
                  <span className="text-[10px] font-bold tabular-nums" style={{ color: '#22c9a0' }}>
                    {m.afinidade}%
                  </span>
                </div>
              </div>

            </div>
          )
        })}
      </div>

      {selectedCell && (
        <CorrelacaoModal cell={selectedCell} onClose={() => setSelectedCell(null)} />
      )}
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function InteligeniciaComercial() {
  return (
    <AppLayout title="" subtitle="" breadcrumb="">
      <TabNav />

      <div className="flex flex-col gap-2 mb-6">
        <p className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: 'rgb(var(--bh-subtle))' }}>
          Análise Estratégica
        </p>
        <h1 className="text-bh-text text-xl font-bold">Inteligência Comercial</h1>
      </div>

      <div className="flex flex-col gap-6">
        <QuemMaisVende />
        <div className="flex gap-6 items-start">
          <div className="flex-[3] min-w-0"><CorrelacaoSetores /></div>
          <div className="flex-[2] min-w-0"><TopOportunidades /></div>
        </div>
      </div>
    </AppLayout>
  )
}
