import { X } from 'lucide-react'

// ì?ì?ì? Tipos ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?

interface RowData {
  label: string
  pctAntes: string
  pctDepois: string
  valAntes: string
  valDepois: string
  reducaoPct: string | null   // negativo = redu√ß√£o, positivo = aumento
  reducaoVal: string | null
  tipo: 'normal' | 'margem' | 'ganho'
}

interface PeriodData {
  ano: string
  baseAntes: string
  baseDepois: string
  ganho: string | null
  rows: RowData[]
}

// ì?ì?ì? KPI ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?

interface KpiCardProps {
  ano: string
  baseAntes: string
  baseDepois: string
  ganho: string | null
}

function KpiCard({ ano, baseAntes, baseDepois, ganho }: KpiCardProps) {
  const temGanho = ganho !== null && ganho !== 'R$ 0,00'
  return (
    <div className="relative rounded-xl border border-bh-border/40 p-6 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-500/40 group">
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: 'linear-gradient(180deg, rgba(245,158,11,0.04) 0%, transparent 100%)' }} />
      <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: 'linear-gradient(90deg, #ff6600, transparent)' }} />

      {/* Ano fantasma no fundo */}
      <span className="absolute right-3 bottom-[-6px] font-black text-[64px] leading-none select-none pointer-events-none"
        style={{ color: 'rgba(255,255,255,0.04)', fontVariantNumeric: 'tabular-nums' }}>
        {ano.slice(-2)}
      </span>

      <div className="relative z-10">
        <p className="text-orange-500 text-[10px] font-bold tracking-[0.16em] uppercase mb-2">Base {ano}</p>
        <p className="text-bh-text text-xl font-bold leading-tight">{baseAntes}</p>
        <p className="text-bh-subtle text-xs mt-0.5">Ap√≥s: {baseDepois}</p>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-bh-subtle text-[10px] tracking-wide">Ganho Cliente</span>
          {temGanho ? (
            <span className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold font-mono px-2.5 py-0.5 rounded-full">
              {ganho}
            </span>
          ) : (
            <span className="bg-white/5 text-bh-subtle text-xs font-mono px-2.5 py-0.5 rounded-full">
              R$ 0,00
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ì?ì?ì? Linha da tabela ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?

function TableRow({ row }: { row: RowData }) {
  const isNegPct = row.reducaoPct?.startsWith('-')
  const isPosPct = row.reducaoPct?.startsWith('+')

  if (row.tipo === 'ganho') {
    return (
      <tr className="border-t border-white/[0.06]">
        <td className="px-5 py-3 text-bh-text font-bold text-xs tracking-wide">Ganho Cliente</td>
        <td colSpan={4} />
        <td className="px-4 py-3 text-right">
          {row.reducaoPct && (
            <span className="inline-block bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-xs font-bold px-2 py-0.5 rounded">
              {row.reducaoPct}
            </span>
          )}
        </td>
        <td className="px-5 py-3 text-right">
          {row.reducaoVal && (
            <span className="text-emerald-400 font-mono font-bold text-sm">{row.reducaoVal}</span>
          )}
        </td>
      </tr>
    )
  }

  const isMargem = row.tipo === 'margem'

  return (
    <tr
      className="border-t border-white/[0.04] transition-colors hover:bg-white/[0.02]"
      style={isMargem ? { background: 'rgba(255,102,0,0.04)' } : {}}
    >
      <td className={`px-5 py-3 text-sm font-semibold ${isMargem ? 'text-orange-400' : 'text-[#aaa]'}`}>
        {row.label}
      </td>
      <td className="px-4 py-3 text-right font-mono text-xs text-blue-400">{row.pctAntes}</td>
      <td className="px-4 py-3 text-right font-mono text-xs text-emerald-400">{row.pctDepois}</td>
      <td className="px-4 py-3 text-right font-mono text-xs text-bh-text/70">{row.valAntes}</td>
      <td className="px-4 py-3 text-right font-mono text-xs text-bh-text">{row.valDepois}</td>
      <td className="px-4 py-3 text-right font-mono text-xs font-semibold">
        <span className={
          isPosPct ? 'text-emerald-400' :
          isNegPct ? 'text-red-400' :
          'text-bh-subtle'
        }>
          {row.reducaoPct ?? 'á"'}
        </span>
      </td>
      <td className="px-5 py-3 text-right font-mono text-xs">
        <span className={
          row.reducaoVal?.startsWith('-') ? 'text-red-400' :
          row.reducaoVal?.startsWith('R$') ? 'text-emerald-400' :
          'text-bh-subtle'
        }>
          {row.reducaoVal ?? 'á"'}
        </span>
      </td>
    </tr>
  )
}

// ì?ì?ì? Se√ß√£o de per√≠odo ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?

function PeriodSection({ period }: { period: PeriodData }) {
  return (
    <div>
      {/* Header do per√≠odo */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-orange-400 font-black text-3xl tracking-widest">{period.ano}</span>
        <div className="flex gap-5 text-xs text-bh-subtle">
          <span>Antes: <strong className="font-mono text-bh-text/70">{period.baseAntes}</strong></span>
          <span>Depois: <strong className="font-mono text-bh-text">{period.baseDepois}</strong></span>
        </div>
        <div className="flex-1 h-px" style={{ background: 'rgb(var(--bh-border) / 0.25)' }} />
      </div>

      {/* Tabela */}
      <div className="rounded-xl border border-white/[0.07] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              {/* Linha de grupos */}
              <tr style={{ background: 'rgba(255,255,255,0.015)' }}>
                <th className="px-5 py-2 text-left" />
                <th colSpan={2} className="px-4 py-2 text-center text-[9px] font-bold tracking-[0.16em] uppercase text-blue-400">
                  % Al√≠quota
                </th>
                <th colSpan={2} className="px-4 py-2 text-center text-[9px] font-bold tracking-[0.16em] uppercase text-emerald-400">
                  Valor R$
                </th>
                <th colSpan={2} className="px-5 py-2 text-center text-[9px] font-bold tracking-[0.16em] uppercase text-orange-500">
                  Redu√ß√£o
                </th>
              </tr>
              {/* Linha de colunas */}
              <tr style={{ background: 'rgba(255,255,255,0.025)' }}>
                <th className="px-5 py-2.5 text-left text-bh-subtle text-[9px] font-bold tracking-widest uppercase border-t border-bh-border/30">
                  Rubrica
                </th>
                <th className="px-4 py-2.5 text-right text-bh-subtle text-[9px] font-bold tracking-widest uppercase border-t border-bh-border/30">
                  Antes
                </th>
                <th className="px-4 py-2.5 text-right text-bh-subtle text-[9px] font-bold tracking-widest uppercase border-t border-bh-border/30">
                  Depois
                </th>
                <th className="px-4 py-2.5 text-right text-bh-subtle text-[9px] font-bold tracking-widest uppercase border-t border-bh-border/30">
                  Antes
                </th>
                <th className="px-4 py-2.5 text-right text-bh-subtle text-[9px] font-bold tracking-widest uppercase border-t border-bh-border/30">
                  Depois
                </th>
                <th className="px-4 py-2.5 text-right text-bh-subtle text-[9px] font-bold tracking-widest uppercase border-t border-bh-border/30">
                  % Red.
                </th>
                <th className="px-5 py-2.5 text-right text-bh-subtle text-[9px] font-bold tracking-widest uppercase border-t border-bh-border/30">
                  Valor Red.
                </th>
              </tr>
            </thead>
            <tbody>
              {period.rows.map((row, i) => (
                <TableRow key={i} row={row} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ì?ì?ì? Dados ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?

const PERIODS: PeriodData[] = [
  {
    ano: '2024',
    baseAntes: 'R$ 2.513.388,64',
    baseDepois: 'R$ 2.483.562,35',
    ganho: null,
    rows: [
      { label: 'ICMS',        pctAntes: '21,56%', pctDepois: '17,55%', valAntes: 'R$ 541.985,53', valDepois: 'R$ 435.798,00', reducaoPct: '-18,63%', reducaoVal: 'á"',              tipo: 'normal' },
      { label: 'PIS/COFINS',  pctAntes: '35,53%', pctDepois: '28,23%', valAntes: 'R$ 893.085,83', valDepois: 'R$ 701.102,61', reducaoPct: '-20,55%', reducaoVal: '-1,40%',         tipo: 'normal' },
      { label: 'D√©bitos',     pctAntes: '6,87%',  pctDepois: '5,54%',  valAntes: 'R$ 172.643,68', valDepois: 'R$ 137.554,10', reducaoPct: '-19,37%', reducaoVal: '-R$ 35.089,58', tipo: 'normal' },
      { label: 'Margem Bruta',pctAntes: '22,41%', pctDepois: '22,89%', valAntes: 'R$ 563.229,84', valDepois: 'R$ 568.493,13', reducaoPct: '+2,15%',  reducaoVal: 'R$ 5.263,29',   tipo: 'margem' },
      { label: 'Ganho Cliente',pctAntes: '',      pctDepois: '',        valAntes: '',               valDepois: 'R$ 0,00',       reducaoPct: null,      reducaoVal: null,             tipo: 'ganho'  },
    ],
  },
  {
    ano: '2025',
    baseAntes: 'R$ 7.467.863,63',
    baseDepois: 'R$ 7.387.956,24',
    ganho: 'R$ 9.637,85',
    rows: [
      { label: 'ICMS',        pctAntes: '21,23%', pctDepois: '17,02%', valAntes: 'R$ 1.585.756,92', valDepois: 'R$ 1.257.234,15', reducaoPct: '-19,86%', reducaoVal: 'á"',               tipo: 'normal' },
      { label: 'PIS/COFINS',  pctAntes: '33,22%', pctDepois: '26,09%', valAntes: 'R$ 2.480.897,52', valDepois: 'R$ 1.927.669,63', reducaoPct: '-21,46%', reducaoVal: '-1,41%',          tipo: 'normal' },
      { label: 'D√©bitos',     pctAntes: '6,61%',  pctDepois: '5,26%',  valAntes: 'R$ 493.724,32',   valDepois: 'R$ 388.725,32',   reducaoPct: '-20,42%', reducaoVal: '-R$ 104.999,00',  tipo: 'normal' },
      { label: 'Margem Bruta',pctAntes: '22,64%', pctDepois: '23,22%', valAntes: 'R$ 1.690.646,42', valDepois: 'R$ 1.715.738,03', reducaoPct: '+2,58%',  reducaoVal: 'R$ 25.091,61',    tipo: 'margem' },
      { label: 'Ganho Cliente',pctAntes: '',      pctDepois: '',        valAntes: '',                 valDepois: '',               reducaoPct: '-9,18%',  reducaoVal: 'R$ 9.637,85',     tipo: 'ganho'  },
    ],
  },
  {
    ano: '2026',
    baseAntes: 'R$ 2.192.644,65',
    baseDepois: 'R$ 2.161.947,89',
    ganho: 'R$ 4.094,14',
    rows: [
      { label: 'ICMS',        pctAntes: '25,69%', pctDepois: '19,65%', valAntes: 'R$ 563.192,46', valDepois: 'R$ 424.780,71', reducaoPct: '-23,51%', reducaoVal: 'á"',              tipo: 'normal' },
      { label: 'PIS/COFINS',  pctAntes: '36,70%', pctDepois: '27,95%', valAntes: 'R$ 804.671,42', valDepois: 'R$ 604.220,95', reducaoPct: '-23,84%', reducaoVal: '-1,87%',         tipo: 'normal' },
      { label: 'D√©bitos',     pctAntes: '7,64%',  pctDepois: '5,86%',  valAntes: 'R$ 167.575,23', valDepois: 'R$ 126.643,11', reducaoPct: '-23,35%', reducaoVal: '-R$ 40.932,12', tipo: 'normal' },
      { label: 'Margem Bruta',pctAntes: '21,95%', pctDepois: '22,73%', valAntes: 'R$ 481.248,81', valDepois: 'R$ 491.484,17', reducaoPct: '+3,58%',  reducaoVal: 'R$ 10.235,36',   tipo: 'margem' },
      { label: 'Ganho Cliente',pctAntes: '',      pctDepois: '',        valAntes: '',               valDepois: '',              reducaoPct: '-10,00%', reducaoVal: 'R$ 4.094,14',    tipo: 'ganho'  },
    ],
  },
]

// ì?ì?ì? Modal principal ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?ì?

interface Props { onClose: () => void }

export function DREHistoricoModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.92)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl rounded-2xl border border-bh-border/40 shadow-2xl flex flex-col"
        style={{ background: 'rgb(var(--bh-surface))', maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-bh-border/30 shrink-0">
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#ff6600' }}>An√°lise de Resultados Fiscais</h2>
            <p className="text-bh-subtle text-xs mt-0.5">
              Comparativo de al√≠quotas, d√©bitos e margem bruta á" Exerc√≠cios 2024, 2025 e 2026
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bh-surface2 text-bh-subtle hover:text-bh-text transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-auto flex-1 px-8 py-6 space-y-8">

          {/* KPI Strip */}
          <div className="grid grid-cols-3 gap-4">
            {PERIODS.map(p => (
              <KpiCard
                key={p.ano}
                ano={p.ano}
                baseAntes={p.baseAntes}
                baseDepois={p.baseDepois}
                ganho={p.ganho}
              />
            ))}
          </div>

          {/* Legenda de cores */}
          <div className="flex items-center gap-6 px-1">
            <span className="flex items-center gap-1.5 text-[9px] font-bold text-bh-subtle tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-400" /> Al√≠quota antes
            </span>
            <span className="flex items-center gap-1.5 text-[9px] font-bold text-bh-subtle tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Al√≠quota depois / melhora
            </span>
            <span className="flex items-center gap-1.5 text-[9px] font-bold text-bh-subtle tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-red-400" /> Piora
            </span>
            <span className="flex items-center gap-1.5 text-[9px] font-bold text-bh-subtle tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-orange-400" /> Margem bruta
            </span>
          </div>

          {/* Per√≠odos */}
          {PERIODS.map(p => (
            <PeriodSection key={p.ano} period={p} />
          ))}

          {/* Rodap√© */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
            <span className="text-[#333] text-[10px] font-mono tracking-widest uppercase">
              Supermercado Maciel á" An√°lise Tribut√°ria
            </span>
            <span className="text-[#333] text-[10px] font-mono tracking-widest">
              Exerc√≠cios 2024 ¬∑ 2025 ¬∑ 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
