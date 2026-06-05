import { useState, useCallback, useMemo } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { TabNav } from '../components/ui/TabNav'
import { Modal } from '../components/ui/Modal'
import {
  ArrowRight, Target, TrendingUp, TrendingDown, LayoutGrid,
  BarChart2, Zap, Calendar, RefreshCw, MapPin, Award,
} from 'lucide-react'

// ─── Base Mock Data ───────────────────────────────────────────────────────────

const SETORES_BASE = [
  { nome: 'Bebidas',            desconto: 27.25, margem_pct: 20, venda: 3120000, margem: 624000  },
  { nome: 'Hortifruti',         desconto:  0.00, margem_pct: 27, venda: 1870000, margem: 505000  },
  { nome: 'Açougue',            desconto:  7.00, margem_pct: 22, venda: 1750000, margem: 384000  },
  { nome: 'Mercearia',          desconto: 21.25, margem_pct: 13, venda: 2620000, margem: 341000  },
  { nome: 'Padaria',            desconto:  7.00, margem_pct: 28, venda:  998000, margem: 279000  },
  { nome: 'Frios & Laticínios', desconto: 12.00, margem_pct: 19, venda: 1250000, margem: 237000  },
  { nome: 'Limpeza',            desconto: 27.25, margem_pct: 14, venda:  562000, margem:  79000  },
  { nome: 'Higiene',            desconto: 12.00, margem_pct: 16, venda:  313000, margem:  50000  },
]

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

const MATRIX_BASE: (number | null)[][] = [
  [null,  64,  58,  61,  49,  42,  31,  22],
  [  84, null, 67,  55,  52,  48,  44,  33],
  [  58,  67, null, 72,  51,  57,  29,  24],
  [  61,  55,  72, null, 46,  38,  27,  19],
  [  49,  52,  51,  48, null, 53,  25,  21],
  [  42,  48,  57,  38,  53, null, 23,  26],
  [  31,  44,  29,  27,  25,  23, null, 58],
  [  22,  33,  24,  19,  21,  26,  58, null],
]

const OPORT_FISCAL = new Set(['0-2','0-3','0-5','1-0','1-2','1-5','2-0','2-3','3-0','4-2','5-1','6-1','6-4'])

const MIGRACOES_BASE = [
  { de: 'Bebidas',   de_desc: 27.25, para: 'Hortifruti', para_desc:  0.00, afinidade: 58 },
  { de: 'Mercearia', de_desc: 21.25, para: 'Hortifruti', para_desc:  0.00, afinidade: 67 },
  { de: 'Bebidas',   de_desc: 27.25, para: 'Açougue',    para_desc:  7.00, afinidade: 61 },
  { de: 'Bebidas',   de_desc: 27.25, para: 'Padaria',    para_desc:  7.00, afinidade: 42 },
  { de: 'Limpeza',   de_desc: 27.25, para: 'Hortifruti', para_desc:  0.00, afinidade: 29 },
  { de: 'Mercearia', de_desc: 21.25, para: 'Açougue',    para_desc:  7.00, afinidade: 55 },
]

// ─── Credenciados ─────────────────────────────────────────────────────────────

interface CredenciadoPerf {
  nome: string; cidade: string; estado: string
  venda: number; margem: number; margem_pct: number
}

const CREDENCIADOS_PERF_BASE: CredenciadoPerf[] = [
  { nome: 'Supermercado Bom Preço Ltda',    cidade: 'Anápolis',       estado: 'GO', venda: 3120000, margem: 624000, margem_pct: 20 },
  { nome: 'Rede Farmácias Saúde SA',         cidade: 'São Paulo',      estado: 'SP', venda: 2870000, margem: 774900, margem_pct: 27 },
  { nome: 'Distribuidora Alpha Atacado SA',  cidade: 'Curitiba',       estado: 'PR', venda: 2620000, margem: 340600, margem_pct: 13 },
  { nome: 'Comercial Varejo Central Ltda',   cidade: 'Rio de Janeiro', estado: 'RJ', venda: 1750000, margem: 385000, margem_pct: 22 },
  { nome: 'Magazine Eletrônicos Ltda',       cidade: 'São Paulo',      estado: 'SP', venda: 1580000, margem: 300200, margem_pct: 19 },
  { nome: 'Posto Combustíveis BR Ltda',      cidade: 'Porto Alegre',   estado: 'RS', venda: 1250000, margem: 350000, margem_pct: 28 },
  { nome: 'Supermercados Norte Ltda',        cidade: 'Fortaleza',      estado: 'CE', venda:  875000, margem: 122500, margem_pct: 14 },
  { nome: 'Padaria e Confeitaria Real Ltda', cidade: 'Campo Grande',   estado: 'MS', venda:  562000, margem:  89920, margem_pct: 16 },
  { nome: 'Auto Peças Total Ltda',           cidade: 'Belo Horizonte', estado: 'MG', venda:  980000, margem: 215600, margem_pct: 22 },
  { nome: 'Academia FitMax SA',              cidade: 'Curitiba',       estado: 'PR', venda:  430000, margem:  90300, margem_pct: 21 },
]

// ─── Generators ───────────────────────────────────────────────────────────────

function seeded(n: number): number {
  const x = Math.abs(Math.sin(n * 9301 + 49297) * 233280)
  return x - Math.floor(x)
}

type Setores    = typeof SETORES_BASE
type MatrixData = (number | null)[][]
type Migracoes  = typeof MIGRACOES_BASE

function generateSetores(mes: string): Setores {
  const [y, m] = mes.split('-').map(Number)
  const base = y * 12 + m
  return SETORES_BASE.map((s, i) => {
    const f = 0.78 + seeded(base + i) * 0.44
    return {
      ...s,
      venda:      Math.round(s.venda      * f),
      margem:     Math.round(s.margem     * f),
      margem_pct: Math.min(40, Math.max(5, Math.round(s.margem_pct * (0.82 + seeded(base + i + 50) * 0.36)))),
    }
  })
}

function generateMatrix(mes: string): MatrixData {
  const [y, m] = mes.split('-').map(Number)
  const base = y * 12 + m
  return MATRIX_BASE.map((row, ri) =>
    row.map((val, ci) => {
      if (val === null) return null
      const delta = Math.round(seeded(base + ri * 9 + ci) * 20) - 10
      return Math.min(99, Math.max(10, (val as number) + delta))
    })
  )
}

function generateCredenciados(mes: string): CredenciadoPerf[] {
  const [y, m] = mes.split('-').map(Number)
  const base = y * 12 + m + 200
  return CREDENCIADOS_PERF_BASE.map((c, i) => {
    const f = 0.78 + seeded(base + i) * 0.44
    return {
      ...c,
      venda:      Math.round(c.venda      * f),
      margem:     Math.round(c.margem     * f),
      margem_pct: Math.min(40, Math.max(5, Math.round(c.margem_pct * (0.82 + seeded(base + i + 50) * 0.36)))),
    }
  })
}

function generateMigracoes(mes: string): Migracoes {
  const [y, m] = mes.split('-').map(Number)
  const base = y * 12 + m
  return MIGRACOES_BASE.map((mg, i) => ({
    ...mg,
    afinidade: Math.min(95, Math.max(15, Math.round(mg.afinidade + seeded(base + i * 7) * 20 - 10))),
  }))
}

const MESES = (() => {
  const nomes = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
  const result: { label: string; value: string }[] = []
  const now = new Date(2026, 5, 1)
  for (let i = 1; i <= 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    result.push({ label: `${nomes[d.getMonth()]} ${d.getFullYear()}`, value: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}` })
  }
  return result
})()

// ─── Item catalog ─────────────────────────────────────────────────────────────

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
      { nome: 'Arroz Branco 5kg',        unidades: 24500, receita: 490000 },
      { nome: 'Feijão Carioca 1kg',      unidades: 19800, receita: 396000 },
      { nome: 'Óleo de Soja 900ml',      unidades: 16200, receita: 324000 },
      { nome: 'Macarrão Espaguete 500g', unidades: 14100, receita: 282000 },
      { nome: 'Açúcar Cristal 1kg',      unidades: 12800, receita: 256000 },
      { nome: 'Farinha de Trigo 1kg',    unidades: 11500, receita: 230000 },
      { nome: 'Sal Refinado 1kg',        unidades: 10200, receita: 204000 },
      { nome: 'Café Torrado 500g',       unidades:  9100, receita: 182000 },
      { nome: 'Leite UHT 1L',            unidades:  8400, receita: 168000 },
      { nome: 'Molho de Tomate 340g',    unidades:  7700, receita: 154000 },
    ],
    menos: [
      { nome: 'Quinoa 500g',             unidades:  1100, receita:  38000 },
      { nome: 'Chia 250g',               unidades:  1400, receita:  42000 },
      { nome: 'Azeite Extra Virgem 1L',  unidades:  1700, receita:  46000 },
      { nome: 'Granola 500g',            unidades:  2000, receita:  50000 },
      { nome: 'Linhaça 500g',            unidades:  2300, receita:  54000 },
      { nome: 'Creme de Leite 200g',     unidades:  2600, receita:  58000 },
      { nome: 'Farinha de Rosca 500g',   unidades:  2900, receita:  62000 },
      { nome: 'Fermento Biológico 10g',  unidades:  3200, receita:  66000 },
      { nome: 'Gelatina 15g',            unidades:  3500, receita:  70000 },
      { nome: 'Achocolatado 400g',       unidades:  3800, receita:  74000 },
    ],
  },
}

function getItensSetor(nome: string) {
  return ITENS_SETOR[nome] ?? {
    subtitulo: `Produtos do setor · carga ${SETORES_BASE.find(s => s.nome === nome)?.desconto.toFixed(2) ?? '0,00'}%`,
    skus: 15, ticket: 12.00,
    mais:  Array.from({ length: 10 }, (_, i) => ({ nome: `Produto ${i + 1}`,  unidades: (10 - i) * 1200, receita: (10 - i) * 35000 })),
    menos: Array.from({ length: 10 }, (_, i) => ({ nome: `Item ${i + 1}`,     unidades: (i + 1) * 400,   receita: (i + 1) * 18000 })),
  }
}

function fmtBRL(v: number) {
  return v >= 1_000_000
    ? `R$ ${(v / 1_000_000).toFixed(2)}M`
    : `R$ ${(v / 1_000).toFixed(0)}K`
}

// ─── SetorModal ───────────────────────────────────────────────────────────────

function SetorModal({ setor, onClose }: { setor: Setores[0]; onClose: () => void }) {
  const dados = getItensSetor(setor.nome)

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={`${setor.nome} — itens vendidos`}
      subtitle={dados.subtitulo}
      icon={<Target size={22} />}
      bodyClassName="flex-1 overflow-hidden p-6 flex flex-col gap-4 min-h-0"
      footer={
        <>
          <span className="text-xs text-bh-subtle">Vendas estimadas · dados de demonstração</span>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-ghost">Fechar</button>
            <button onClick={onClose} className="btn-primary">
              <Target size={14} /> Ver detalhes
            </button>
          </div>
        </>
      }
    >
      <div
        className="grid grid-cols-4 gap-6 p-5 rounded-xl"
        style={{ background: 'rgb(var(--bh-surface2))', border: '1px solid rgb(var(--bh-border))' }}
      >
        {[
          { label: 'FATURAMENTO',      value: fmtBRL(setor.venda),             cor: '#ffffff' },
          { label: 'MARGEM',           value: fmtBRL(setor.margem),            cor: '#22c9a0' },
          { label: 'SKUS',             value: String(dados.skus),              cor: '#ffffff' },
          { label: 'TICKET MÉDIO/UN.', value: `R$ ${dados.ticket.toFixed(2)}`, cor: '#ffffff' },
        ].map(stat => (
          <div key={stat.label}>
            <p className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'rgb(var(--bh-subtle))' }}>
              {stat.label}
            </p>
            <p className="text-xl font-black tabular-nums" style={{ color: stat.cor }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        {[
          { items: dados.mais,  icon: <TrendingUp size={13} color="#22c9a0" />,  label: 'Top mais vendidos',  cor: '#22c9a0' },
          { items: dados.menos, icon: <TrendingDown size={13} color="#f87171" />, label: 'Top menos vendidos', cor: '#f87171' },
        ].map(col => (
          <div key={col.label} className="flex flex-col rounded-xl overflow-hidden min-h-0" style={{ border: '1px solid rgb(var(--bh-border))' }}>
            <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: '1px solid rgb(var(--bh-border))', background: 'rgb(var(--bh-surface2))' }}>
              {col.icon}
              <span className="text-xs font-bold" style={{ color: col.cor }}>{col.label}</span>
            </div>
            <div className="overflow-y-auto flex-1">
              {col.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5"
                  style={{ borderBottom: '1px solid rgb(var(--bh-border))' }}>
                  <span className="text-[10px] w-5 flex-shrink-0 tabular-nums font-bold" style={{ color: 'rgb(var(--bh-subtle))' }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{item.nome}</p>
                    <p className="text-[10px] tabular-nums mt-0.5" style={{ color: 'rgb(var(--bh-subtle))' }}>
                      {item.unidades.toLocaleString('pt-BR')} un.
                    </p>
                  </div>
                  <span className="text-xs font-bold tabular-nums flex-shrink-0" style={{ color: col.cor }}>
                    {fmtBRL(item.receita)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}

// ─── CorrelacaoModal ──────────────────────────────────────────────────────────

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
    <div className="flex items-center gap-3 px-4 py-2.5"
      style={{ borderBottom: '1px solid rgb(var(--bh-border))' }}>
      <span className="text-[10px] w-5 flex-shrink-0 tabular-nums font-bold"
        style={{ color: 'rgb(var(--bh-subtle))' }}>
        {i + 1}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: '#ff6600' }} />
          <p className="text-xs font-semibold text-white truncate">{par.itemA}</p>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#22c9a0' }} />
          <p className="text-[10px] truncate" style={{ color: 'rgb(var(--bh-subtle))' }}>{par.itemB}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0" style={{ width: 72 }}>
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgb(var(--bh-surface2))' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${par.pct}%`, background: color }} />
        </div>
        <span className="text-xs font-bold tabular-nums flex-shrink-0" style={{ color }}>
          {par.pct}%
        </span>
      </div>
    </div>
  )
}

function CorrelacaoModal({ cell, setores, onClose }: { cell: CorrelacaoCell; setores: Setores; onClose: () => void }) {
  const setorA = SETORES_MATRIX[cell.ri]
  const setorB = SETORES_MATRIX[cell.ci]
  const descA  = setores.find(s => s.nome === setorA.label)?.desconto ?? 0
  const descB  = setores.find(s => s.nome === setorB.label)?.desconto ?? 0
  const { maiores, menores } = getPares(setorA.label, setorB.label, cell.val)

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={`${setorA.label} → ${setorB.label}`}
      subtitle={`Itens correlacionados · afinidade de cesta ${cell.val}%`}
      icon={<LayoutGrid size={22} />}
      bodyClassName="flex-1 overflow-hidden p-6 flex flex-col gap-4 min-h-0"
      footer={
        <span className="text-xs text-bh-subtle">
          % = frequência com que os dois itens aparecem no mesmo cupom · dados de demonstração
        </span>
      }
    >
      <p className="flex-shrink-0 text-sm text-bh-muted leading-relaxed">
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
            color: descB === 0 ? 'rgb(var(--bh-muted))' : '#22c9a0',
          }}>
          {descB.toFixed(2)}%
        </span>{' '}
        — onde a margem pode migrar.
      </p>

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
        {[
          { items: maiores, icon: <TrendingUp size={13} color="#22c9a0" />, label: 'Top 20 maior afinidade', color: '#22c9a0' },
          { items: menores, icon: <TrendingDown size={13} color="rgb(var(--bh-muted))" />, label: 'Top 20 menor afinidade', color: 'rgb(var(--bh-muted))' },
        ].map(col => (
          <div key={col.label} className="flex flex-col rounded-xl overflow-hidden min-h-0"
            style={{ border: '1px solid rgb(var(--bh-border))' }}>
            <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: '1px solid rgb(var(--bh-border))', background: 'rgb(var(--bh-surface2))' }}>
              {col.icon}
              <span className="text-xs font-bold" style={{ color: col.color }}>{col.label}</span>
            </div>
            <div className="overflow-y-auto flex-1">
              {col.items.map((par, i) => (
                <CorrelacaoParRow key={i} par={par} i={i} color={col.color} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}

// ─── KPI Strip ────────────────────────────────────────────────────────────────

function KPIStrip({ setores }: { setores: Setores }) {
  const totalVenda  = useMemo(() => setores.reduce((a, s) => a + s.venda, 0), [setores])
  const totalMargem = useMemo(() => setores.reduce((a, s) => a + s.margem, 0), [setores])
  const altaTrib    = setores.filter(s => s.desconto > 15).length
  const margemPct   = totalVenda > 0 ? ((totalMargem / totalVenda) * 100).toFixed(1) : '0.0'

  const kpis = [
    {
      label: 'Volume Total',
      value: fmtBRL(totalVenda),
      sub: `${setores.length} setores ativos`,
      Icon: BarChart2,
      accent: '#22c9a0',
      bg: 'rgba(34,201,160,0.08)',
    },
    {
      label: 'Margem Gerada',
      value: fmtBRL(totalMargem),
      sub: `${margemPct}% sobre a venda`,
      Icon: TrendingUp,
      accent: '#22c9a0',
      bg: 'rgba(34,201,160,0.08)',
    },
    {
      label: 'Alta Tributação',
      value: `${altaTrib} setores`,
      sub: 'ICMS ST acima de 15%',
      Icon: Target,
      accent: '#ff6600',
      bg: 'rgba(255,102,0,0.08)',
    },
    {
      label: 'Oportunidades',
      value: `${OPORT_FISCAL.size}`,
      sub: 'pares fiscais mapeados',
      Icon: Zap,
      accent: '#EF9F27',
      bg: 'rgba(239,159,39,0.08)',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {kpis.map(k => (
        <div
          key={k.label}
          className="rounded-xl p-4 flex items-start gap-3 transition-all duration-200"
          style={{
            background: 'rgb(var(--bh-surface))',
            border: '1px solid rgb(var(--bh-border))',
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: k.bg }}
          >
            <k.Icon size={17} color={k.accent} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5"
              style={{ color: 'rgb(var(--bh-subtle))' }}>
              {k.label}
            </p>
            <p className="text-lg font-black tabular-nums leading-tight text-bh-text truncate">
              {k.value}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: 'rgb(var(--bh-muted))' }}>
              {k.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Quem Mais Vende ──────────────────────────────────────────────────────────

type SortKey = 'venda' | 'margem'

function QuemMaisVende({ setores }: { setores: Setores }) {
  const [sort, setSort]               = useState<SortKey>('venda')
  const [selectedSetor, setSelectedSetor] = useState<Setores[0] | null>(null)

  const maxVenda  = Math.max(...setores.map(s => s.venda))
  const maxMargem = Math.max(...setores.map(s => s.margem))
  const sorted    = [...setores].sort((a, b) => sort === 'venda' ? b.venda - a.venda : b.margem - a.margem)

  return (
    <section
      className="flex flex-col gap-5 rounded-xl p-5"
      style={{ background: 'rgb(var(--bh-surface))', border: '1px solid rgb(var(--bh-border))' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: 'rgba(255,102,0,0.12)' }}
          >
            <BarChart2 size={15} color="#ff6600" />
          </div>
          <div>
            <h2 className="text-bh-text font-bold text-sm leading-tight">
              Quem mais vende não é quem mais rende
            </h2>
            <p className="text-[11px] mt-0.5" style={{ color: 'rgb(var(--bh-muted))' }}>
              Venda vs. margem por setor · clique para ver os produtos
            </p>
          </div>
        </div>
        {/* Toggle */}
        <div
          className="flex rounded-lg overflow-hidden flex-shrink-0"
          style={{ border: '1px solid rgb(var(--bh-border))' }}
        >
          {(['venda', 'margem'] as SortKey[]).map(k => (
            <button
              key={k}
              onClick={() => setSort(k)}
              className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-150"
              style={sort === k
                ? { background: '#ff6600', color: '#fff' }
                : { background: 'transparent', color: 'rgb(var(--bh-subtle))' }
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
          const highTax   = s.desconto > 15

          return (
            <div
              key={s.nome}
              className="group relative rounded-xl p-3 cursor-pointer transition-colors duration-150 hover:bg-white/[0.03]"
              onClick={() => setSelectedSetor(s)}
            >
              {/* Accent bar */}
              <div
                className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: highTax ? '#ff6600' : '#22c9a0' }}
              />

              <div className="flex items-center gap-2.5 mb-2.5 pl-2">
                {/* Rank badge */}
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0"
                  style={{
                    background: i < 3 ? 'rgba(255,102,0,0.15)' : 'rgb(var(--bh-surface2))',
                    color: i < 3 ? '#ff6600' : 'rgb(var(--bh-muted))',
                  }}
                >
                  {i + 1}
                </span>
                <span className="font-semibold text-sm text-bh-text flex-1 truncate">{s.nome}</span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums flex-shrink-0"
                  style={{
                    background: s.desconto === 0 ? 'rgba(156,163,175,0.1)' : 'rgba(239,159,39,0.15)',
                    color: s.desconto === 0 ? 'rgb(var(--bh-muted))' : '#EF9F27',
                  }}
                >
                  {s.desconto.toFixed(2)}% ST
                </span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums flex-shrink-0"
                  style={{ background: 'rgba(34,201,160,0.1)', color: '#22c9a0' }}
                >
                  {s.margem_pct}% mg
                </span>
              </div>

              <div className="flex flex-col gap-1.5 pl-10">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] w-10 flex-shrink-0 font-medium" style={{ color: 'rgb(var(--bh-subtle))' }}>
                    Venda
                  </span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgb(var(--bh-surface2))' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${barVenda}%`, background: 'rgb(var(--bh-muted))' }}
                    />
                  </div>
                  <span className="text-[11px] font-bold tabular-nums w-16 text-right flex-shrink-0"
                    style={{ color: 'rgb(var(--bh-muted))' }}>
                    {fmtBRL(s.venda)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] w-10 flex-shrink-0 font-medium" style={{ color: 'rgb(var(--bh-subtle))' }}>
                    Margem
                  </span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgb(var(--bh-surface2))' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${barMargem}%`, background: 'linear-gradient(90deg, #22c9a0, #0f9478)' }}
                    />
                  </div>
                  <span className="text-[11px] font-bold tabular-nums w-16 text-right flex-shrink-0"
                    style={{ color: '#22c9a0' }}>
                    {fmtBRL(s.margem)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div
        className="flex items-center gap-5 pt-3 border-t flex-wrap"
        style={{ borderColor: 'rgb(var(--bh-border))' }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-1.5 rounded-full" style={{ background: 'rgb(var(--bh-muted))' }} />
          <span className="text-[10px]" style={{ color: 'rgb(var(--bh-subtle))' }}>Venda bruta</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-1.5 rounded-full" style={{ background: '#22c9a0' }} />
          <span className="text-[10px]" style={{ color: 'rgb(var(--bh-subtle))' }}>Margem gerada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-0.5 h-3 rounded-full" style={{ background: '#ff6600' }} />
          <span className="text-[10px]" style={{ color: 'rgb(var(--bh-subtle))' }}>Alta tributação</span>
        </div>
      </div>

      {selectedSetor && <SetorModal setor={selectedSetor} onClose={() => setSelectedSetor(null)} />}
    </section>
  )
}

// ─── Correlação entre setores ─────────────────────────────────────────────────

function heatColor(v: number): { bg: string; text: string } {
  if (v >= 80) return { bg: '#0b5e52', text: '#e2fff9' }
  if (v >= 65) return { bg: '#0d7a6a', text: '#e2fff9' }
  if (v >= 50) return { bg: '#0f9478', text: '#e2fff9' }
  if (v >= 38) return { bg: '#22c9a0', text: '#0d1f1a' }
  if (v >= 25) return { bg: '#6ee7cb', text: '#0d2d24' }
  return         { bg: '#b2f0e3', text: '#0d2d24' }
}

function CorrelacaoSetores({ matrixData, setores }: { matrixData: MatrixData; setores: Setores }) {
  const [selectedCell, setSelectedCell] = useState<CorrelacaoCell | null>(null)

  return (
    <section
      className="flex flex-col gap-5 rounded-xl p-5"
      style={{ background: 'rgb(var(--bh-surface))', border: '1px solid rgb(var(--bh-border))' }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: 'rgba(34,201,160,0.1)' }}
          >
            <LayoutGrid size={15} color="#22c9a0" />
          </div>
          <div>
            <h2 className="text-bh-text font-bold text-sm leading-tight">
              Correlação entre setores
            </h2>
            <p className="text-[11px] mt-0.5" style={{ color: 'rgb(var(--bh-muted))' }}>
              % de cupons com os dois grupos juntos · clique para ver os pares
            </p>
          </div>
        </div>
        <span
          className="text-[10px] font-bold px-2.5 py-1 rounded-lg flex-shrink-0 flex items-center gap-1.5"
          style={{ background: 'rgba(255,102,0,0.1)', color: '#ff6600', border: '1px solid rgba(255,102,0,0.2)' }}
        >
          <Target size={10} />
          {OPORT_FISCAL.size} oportunidades
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="border-collapse w-full" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ width: '22%' }} />
              {SETORES_MATRIX.map(s => (
                <th
                  key={s.abrev}
                  className="text-center text-[10px] font-bold uppercase tracking-widest pb-2"
                  style={{ color: 'rgb(var(--bh-muted))' }}
                >
                  {s.abrev}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrixData.map((row, ri) => (
              <tr key={ri}>
                <td className="pr-4 py-1">
                  <span className="text-[11px] font-semibold text-bh-text whitespace-nowrap">
                    {SETORES_MATRIX[ri].label}
                  </span>
                </td>
                {row.map((val, ci) => {
                  const key     = `${ri}-${ci}`
                  const isOport = OPORT_FISCAL.has(key)
                  if (val === null) {
                    return (
                      <td key={ci} className="p-1">
                        <div
                          className="w-full h-10 rounded-lg flex items-center justify-center"
                          style={{ background: 'rgb(var(--bh-surface2))' }}
                        >
                          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.1)' }}>—</span>
                        </div>
                      </td>
                    )
                  }
                  const { bg, text } = heatColor(val)
                  return (
                    <td key={ci} className="p-1">
                      <div
                        className="relative w-full h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150 hover:scale-105 hover:shadow-lg"
                        onClick={() => setSelectedCell({ ri, ci, val })}
                        style={{
                          background: bg,
                          border: isOport ? '2px solid #ff6600' : '2px solid transparent',
                        }}
                      >
                        <span className="text-[11px] font-bold tabular-nums" style={{ color: text }}>
                          {val}
                        </span>
                        {isOport && (
                          <span
                            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2"
                            style={{ background: '#ff6600', borderColor: 'rgb(var(--bh-bg))' }}
                          />
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

      <div
        className="flex items-center gap-6 pt-3 border-t flex-wrap"
        style={{ borderColor: 'rgb(var(--bh-border))' }}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {['#b2f0e3','#6ee7cb','#22c9a0','#0f9478','#0d7a6a','#0b5e52'].map(c => (
              <div key={c} className="w-4 h-2.5 rounded-sm" style={{ background: c }} />
            ))}
          </div>
          <span className="text-[10px]" style={{ color: 'rgb(var(--bh-subtle))' }}>
            Menor → Maior afinidade
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ background: '#ff6600', outline: '2px solid rgba(255,102,0,0.3)', outlineOffset: 1 }}
          />
          <span className="text-[10px]" style={{ color: 'rgb(var(--bh-subtle))' }}>
            Oportunidade fiscal
          </span>
        </div>
      </div>

      {selectedCell && (
        <CorrelacaoModal cell={selectedCell} setores={setores} onClose={() => setSelectedCell(null)} />
      )}
    </section>
  )
}

// ─── Top Oportunidades ────────────────────────────────────────────────────────

function TopOportunidades({ migracoes, setores }: { migracoes: Migracoes; setores: Setores }) {
  const [selectedCell, setSelectedCell] = useState<CorrelacaoCell | null>(null)

  function openModal(de: string, para: string, afinidade: number) {
    const ri = SETORES_MATRIX.findIndex(s => s.label === de)
    const ci = SETORES_MATRIX.findIndex(s => s.label === para)
    if (ri >= 0 && ci >= 0) setSelectedCell({ ri, ci, val: afinidade })
  }

  return (
    <section
      className="flex flex-col gap-4 rounded-xl p-5"
      style={{ background: 'rgb(var(--bh-surface))', border: '1px solid rgb(var(--bh-border))' }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: 'rgba(255,102,0,0.12)' }}
        >
          <Zap size={15} color="#ff6600" />
        </div>
        <div>
          <h2 className="text-bh-text font-bold text-sm leading-tight">Top oportunidades</h2>
          <p className="text-[11px] mt-0.5" style={{ color: 'rgb(var(--bh-muted))' }}>
            Migração fiscal × afinidade de cesta · clique para explorar
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {migracoes.map((m, i) => {
          const delta = m.de_desc - m.para_desc
          return (
            <div
              key={i}
              className="rounded-xl p-3 cursor-pointer transition-all duration-150 hover:scale-[1.01] hover:shadow-md"
              onClick={() => openModal(m.de, m.para, m.afinidade)}
              style={{
                background: 'rgb(var(--bh-surface2))',
                border: '1px solid rgb(var(--bh-border))',
              }}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0"
                  style={{ background: 'rgba(255,102,0,0.2)', color: '#ff6600' }}
                >
                  {i + 1}
                </span>
                <div className="flex items-center gap-1.5 flex-1 min-w-0 flex-wrap">
                  <span className="text-xs font-bold text-bh-text">{m.de}</span>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums"
                    style={{ background: 'rgba(239,159,39,0.18)', color: '#EF9F27' }}
                  >
                    {m.de_desc.toFixed(2)}%
                  </span>
                  <ArrowRight size={10} color="rgb(var(--bh-subtle))" className="flex-shrink-0" />
                  <span className="text-xs font-bold text-bh-text">{m.para}</span>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums"
                    style={{
                      background: m.para_desc === 0 ? 'rgba(156,163,175,0.1)' : 'rgba(34,201,160,0.12)',
                      color: m.para_desc === 0 ? '#9ca3af' : '#22c9a0',
                    }}
                  >
                    {m.para_desc.toFixed(2)}%
                  </span>
                </div>
                <span
                  className="flex-shrink-0 text-xs font-black tabular-nums px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(34,201,160,0.12)', color: '#22c9a0' }}
                >
                  -{delta.toFixed(0)}pp
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] flex-shrink-0" style={{ color: 'rgb(var(--bh-subtle))' }}>
                  afinidade
                </span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgb(var(--bh-surface))' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${m.afinidade}%`, background: 'linear-gradient(90deg, #22c9a0, #0f9478)' }}
                  />
                </div>
                <span className="text-[10px] font-bold tabular-nums flex-shrink-0" style={{ color: '#22c9a0' }}>
                  {m.afinidade}%
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {selectedCell && (
        <CorrelacaoModal cell={selectedCell} setores={setores} onClose={() => setSelectedCell(null)} />
      )}
    </section>
  )
}

// ─── Top Credenciados ─────────────────────────────────────────────────────────

function TopCredenciados({ credenciados }: { credenciados: CredenciadoPerf[] }) {
  const sorted    = useMemo(() => [...credenciados].sort((a, b) => b.margem - a.margem).slice(0, 5), [credenciados])
  const maxMargem = Math.max(...sorted.map(c => c.margem))

  return (
    <section
      className="flex flex-col gap-4 rounded-xl p-5"
      style={{ background: 'rgb(var(--bh-surface))', border: '1px solid rgb(var(--bh-border))' }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: 'rgba(34,201,160,0.1)' }}
        >
          <Award size={15} color="#22c9a0" />
        </div>
        <div>
          <h2 className="text-bh-text font-bold text-sm leading-tight">Top credenciados por margem</h2>
          <p className="text-[11px] mt-0.5" style={{ color: 'rgb(var(--bh-muted))' }}>
            5 melhores performers do período selecionado
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {['#', 'Credenciado', 'Localização', 'Venda', 'Margem', 'Margem %'].map(h => (
                <th
                  key={h}
                  className="text-left pb-2.5 pr-4 text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: 'rgb(var(--bh-subtle))', borderBottom: '1px solid rgb(var(--bh-border))' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((c, i) => (
              <tr
                key={c.nome}
                className="group transition-colors duration-100"
                style={{ borderBottom: '1px solid rgb(var(--bh-border))' }}
              >
                <td className="py-3 pr-4">
                  <span
                    className="w-6 h-6 rounded-full inline-flex items-center justify-center text-[10px] font-black"
                    style={{
                      background: i < 3 ? 'rgba(255,102,0,0.15)' : 'rgb(var(--bh-surface2))',
                      color: i < 3 ? '#ff6600' : 'rgb(var(--bh-muted))',
                    }}
                  >
                    {i + 1}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <p
                    className="text-xs font-semibold text-bh-text truncate"
                    style={{ maxWidth: 200 }}
                  >
                    {c.nome}
                  </p>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-1">
                    <MapPin size={10} color="rgb(var(--bh-subtle))" />
                    <span className="text-[11px]" style={{ color: 'rgb(var(--bh-muted))' }}>
                      {c.cidade}, {c.estado}
                    </span>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-xs tabular-nums font-medium" style={{ color: 'rgb(var(--bh-muted))' }}>
                    {fmtBRL(c.venda)}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2" style={{ minWidth: 120 }}>
                    <div
                      className="flex-1 h-1.5 rounded-full overflow-hidden"
                      style={{ background: 'rgb(var(--bh-surface2))' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${(c.margem / maxMargem) * 100}%`, background: 'linear-gradient(90deg, #22c9a0, #0f9478)' }}
                      />
                    </div>
                    <span className="text-xs font-bold tabular-nums flex-shrink-0" style={{ color: '#22c9a0' }}>
                      {fmtBRL(c.margem)}
                    </span>
                  </div>
                </td>
                <td className="py-3">
                  <span
                    className="text-[11px] font-bold px-2.5 py-0.5 rounded-full tabular-nums"
                    style={{ background: 'rgba(34,201,160,0.1)', color: '#22c9a0' }}
                  >
                    {c.margem_pct}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function InteligeniciaComercial() {
  const [mes, setMes]               = useState(MESES[0].value)
  const [loading, setLoading]       = useState(false)
  const [setores, setSetores]       = useState<Setores>(SETORES_BASE)
  const [matrixData, setMatrixData] = useState<MatrixData>(MATRIX_BASE)
  const [migracoes, setMigracoes]   = useState<Migracoes>(MIGRACOES_BASE)
  const [credenciados, setCredenciados] = useState<CredenciadoPerf[]>(CREDENCIADOS_PERF_BASE)

  const handleAtualizar = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      setSetores(generateSetores(mes))
      setMatrixData(generateMatrix(mes))
      setMigracoes(generateMigracoes(mes))
      setCredenciados(generateCredenciados(mes))
      setLoading(false)
    }, 700)
  }, [mes])

  return (
    <AppLayout title="" subtitle="" breadcrumb="">
      <TabNav />

      {/* Page header */}
      <div className="flex items-end justify-between gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <p
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: 'rgb(var(--bh-subtle))' }}
          >
            Análise Estratégica
          </p>
          <h1 className="text-bh-text text-xl font-bold">Inteligência Comercial</h1>
          <p className="text-[12px]" style={{ color: 'rgb(var(--bh-muted))' }}>
            Identifique oportunidades de margem e migração fiscal por setor e credenciado
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative flex items-center">
            <Calendar size={13} className="absolute left-3 pointer-events-none" style={{ color: 'rgb(var(--bh-subtle))' }} />
            <select
              value={mes}
              onChange={e => setMes(e.target.value)}
              className="appearance-none pl-8 pr-7 py-1.5 rounded-lg text-sm font-medium cursor-pointer focus:outline-none transition-colors"
              style={{
                background: 'rgb(var(--bh-surface))',
                border: '1px solid rgb(var(--bh-border))',
                color: 'rgb(var(--bh-text))',
              }}
            >
              {MESES.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <svg className="absolute right-2.5 pointer-events-none" width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="rgb(var(--bh-subtle))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <button
            onClick={handleAtualizar}
            disabled={loading}
            className="btn-primary flex items-center gap-2 px-4 py-1.5 text-sm disabled:opacity-60"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className={`flex flex-col gap-5 transition-all duration-300 ${
          loading ? 'opacity-40 blur-[1px] pointer-events-none' : 'opacity-100 blur-0'
        }`}
      >
        {/* KPI strip */}
        <KPIStrip setores={setores} />

        {/* Setores + Oportunidades */}
        <div className="flex gap-5 items-start">
          <div className="flex-[3] min-w-0">
            <QuemMaisVende setores={setores} />
          </div>
          <div className="flex-[2] min-w-0">
            <TopOportunidades migracoes={migracoes} setores={setores} />
          </div>
        </div>

        {/* Correlação (full width for heatmap readability) */}
        <CorrelacaoSetores matrixData={matrixData} setores={setores} />

        {/* Credenciados */}
        <TopCredenciados credenciados={credenciados} />
      </div>
    </AppLayout>
  )
}
