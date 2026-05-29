import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'

const metrics = [
  {
    category: 'Lan√ßamentos/Freq.',
    icon: 'üY†',
    color: '#ff6600',
    value: '223',
    change: '+4.9%',
    changeVs: 'vs 212',
    positive: true,
  },
  {
    category: 'Tradu√ß√µes',
    icon: 'üY¢',
    color: '#20bf55',
    value: '106',
    change: '+1.9%',
    changeVs: 'vs 104',
    positive: true,
  },
  {
    category: 'Pedidos',
    icon: 'ü"µ',
    color: '#2499e4',
    value: '159',
    change: '+1.9%',
    changeVs: 'vs 156',
    positive: true,
  },
  {
    category: 'Intermedia√ß√µes/Freq.',
    icon: 'üY£',
    color: '#a855f7',
    value: '87',
    change: '+1.9%',
    changeVs: 'vs 85',
    positive: true,
  },
  {
    category: 'Desconto Aprovado',
    icon: 'üY†',
    color: '#ff6600',
    value: 'R$ -26,10',
    change: '-4.8%',
    changeVs: 'vs -25.00',
    positive: false,
    sub: true,
  },
  {
    category: 'Desconto em R$',
    icon: 'üY¢',
    color: '#20bf55',
    value: 'R$ 897,00',
    change: '+2.1%',
    changeVs: 'vs 879',
    positive: true,
    sub: true,
  },
  {
    category: 'Qtd de Intermedia√ß√µes',
    icon: 'ü"µ',
    color: '#2499e4',
    value: 'R$ 92,80',
    change: '+2.1%',
    changeVs: 'vs 90',
    positive: true,
    sub: true,
  },
]

export function MelhoresPeriodosSection() {
  return (
    <div className="rounded-lg border border-bh-border/50 bg-bh-bg p-6 mb-5">
      <div className="flex items-center gap-2 mb-5">
        <ChevronRight size={16} className="text-orange-500" />
        <h3 className="text-bh-text text-sm font-semibold">Melhores Per√≠odos - Vis√£o Geral</h3>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {metrics.slice(0, 4).map((m) => (
          <div key={m.category} className="space-y-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
              <span className="text-bh-muted text-xs">{m.category}</span>
            </div>
            <p className="text-bh-text text-xl font-semibold">{m.value}</p>
            <div className="flex items-center gap-1.5">
              <div className={`flex items-center gap-1 rounded px-1.5 py-0.5 ${m.positive ? 'bg-green-400/10' : 'bg-red-500/10'}`}>
                {m.positive
                  ? <TrendingUp size={10} className="text-green-400" />
                  : <TrendingDown size={10} className="text-red-400" />
                }
                <span className={`text-xs ${m.positive ? 'text-green-400' : 'text-red-400'}`}>{m.change}</span>
              </div>
              <span className="text-bh-subtle text-xs">{m.changeVs}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-bh-border/30">
        {metrics.slice(4).map((m) => (
          <div key={m.category} className="space-y-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
              <span className="text-bh-muted text-xs">{m.category}</span>
            </div>
            <p className="text-bh-text text-xl font-semibold">{m.value}</p>
            <div className="flex items-center gap-1.5">
              <div className={`flex items-center gap-1 rounded px-1.5 py-0.5 ${m.positive ? 'bg-green-400/10' : 'bg-red-500/10'}`}>
                {m.positive
                  ? <TrendingUp size={10} className="text-green-400" />
                  : <TrendingDown size={10} className="text-red-400" />
                }
                <span className={`text-xs ${m.positive ? 'text-green-400' : 'text-red-400'}`}>{m.change}</span>
              </div>
              <span className="text-bh-subtle text-xs">{m.changeVs}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
