import { TrendingDown, TrendingUp } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const operacaoData = [
  { name: 'Aproveitado', value: 62.4, fill: '#ff6600' },
  { name: 'Não Aproveitado', value: 37.6, fill: '#01baef' },
]

export function IntermediacoesSection() {
  return (
    <div className="grid grid-cols-2 gap-5 mb-5">
      {/* Intermediações */}
      <div className="rounded-xl border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/80 overflow-hidden">
        {/* Header */}
        <div className="border-b border-[#292929] px-6 py-5"
          style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 10h16M6 5l-4 5 4 5M14 5l4 5-4 5" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold">Intermediações</h3>
              <p className="text-[#999] text-xs">Operações de intermediação</p>
            </div>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-4 p-5">
          {/* Qtd de Intermediações */}
          <div className="rounded-xl border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M2 10h16M6 5l-4 5 4 5M14 5l4 5-4 5" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-[#999] text-xs">Qtd de Intermediações</span>
            </div>
            <p className="text-white text-2xl font-light mb-3">4</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-red-500/10 rounded px-2 py-1">
                <TrendingDown size={12} className="text-red-400" />
                <span className="text-red-400 text-sm">-20.0%</span>
              </div>
              <span className="text-[#666] text-xs">vs 5 Ant.</span>
            </div>
          </div>

          {/* Total de Intermediações */}
          <div className="rounded-xl border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M2 10h16M6 5l-4 5 4 5M14 5l4 5-4 5" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-[#999] text-xs">Total de Intermediações</span>
            </div>
            <p className="text-white text-2xl font-light mb-3">R$ 6.9k</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-red-500/10 rounded px-2 py-1">
                <TrendingDown size={12} className="text-red-400" />
                <span className="text-red-400 text-sm">-20.0%</span>
              </div>
              <span className="text-[#666] text-xs">vs R$ 8.6k Ant.</span>
            </div>
          </div>

          {/* Desconto Usado */}
          <div className="rounded-xl border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <span className="text-red-400 text-sm font-bold">%</span>
              </div>
              <span className="text-[#999] text-xs">Desconto Usado</span>
            </div>
            <p className="text-white text-2xl font-light mb-3">R$ 5.4k</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-red-500/10 rounded px-2 py-1">
                <TrendingDown size={12} className="text-red-400" />
                <span className="text-red-400 text-sm">-1.8%</span>
              </div>
              <span className="text-[#666] text-xs">vs R$ 5.5k Ant.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Operação */}
      <div className="rounded-xl border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/80 overflow-hidden">
        {/* Header */}
        <div className="border-b border-[#292929] px-6 py-5"
          style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <span className="text-orange-500 text-base font-bold">%</span>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold">Operação</h3>
              <p className="text-[#999] text-xs">Acompanhamento da operação | Pedido / Intermediação</p>
            </div>
          </div>
        </div>

        <div className="p-5 flex gap-4">
          {/* Donut */}
          <div className="relative w-52 h-52 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={operacaoData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {operacaoData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <div className="text-center">
                <p className="text-[#999] text-xs">Aproveitado</p>
                <p className="text-orange-500 text-2xl font-bold">62.4%</p>
              </div>
              <div className="text-center">
                <p className="text-[#999] text-xs">Não Aproveitado</p>
                <p className="text-cyan-400 text-base font-bold">37.6%</p>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex-1 flex flex-col gap-3">
            {/* PEDIDO */}
            <div className="rounded-lg border border-[#1a1a1a] bg-[#0d0d0d]/50 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
                <span className="text-[#999] text-[9px] font-semibold tracking-widest uppercase">PEDIDO | 138</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white text-xs font-bold">R$ 2.541,00</span>
                <div className="flex items-center gap-1 bg-green-400/10 rounded px-1.5 py-0.5">
                  <TrendingUp size={10} className="text-green-400" />
                  <span className="text-green-400 text-xs">+7.5%</span>
                </div>
                <span className="text-white text-xs">vs R$2.200,00 Ant.</span>
              </div>
            </div>

            {/* INTERMEDIAÇÃO */}
            <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-orange-500 text-[9px] font-semibold tracking-widest uppercase">INTERMEDIAÇÃO | 100</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white text-xs font-bold">R$ 2.541,00</span>
                <div className="flex items-center gap-1 bg-green-400/10 rounded px-1.5 py-0.5">
                  <TrendingUp size={10} className="text-green-400" />
                  <span className="text-green-400 text-xs">+7.5%</span>
                </div>
                <span className="text-white text-xs">vs R$2.200,00 Ant.</span>
              </div>
              <p className="text-[#999] text-[8px]">62.4% do total</p>
            </div>

            {/* NÃO APROVEITADO */}
            <div className="rounded-lg border border-[#1a1a1a] bg-[#0d0d0d]/50 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#2a2a2a]" />
                <span className="text-[#999] text-[9px] font-semibold tracking-widest uppercase">NÃO APROVEITADO | 38</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white text-xs font-bold">R$ 2.541,00</span>
                <div className="flex items-center gap-1 bg-green-400/10 rounded px-1.5 py-0.5">
                  <TrendingUp size={10} className="text-green-400" />
                  <span className="text-green-400 text-xs">+7.5%</span>
                </div>
                <span className="text-white text-xs">vs R$2.200,00 Ant.</span>
              </div>
              <p className="text-[#999] text-[8px] mb-2">37.8% restante</p>
              <div className="space-y-1">
                {['Mesma Tributação', 'Somente um item', 'Clientes não aceitam'].map((reason) => (
                  <div key={reason} className="flex items-center justify-between">
                    <span className="text-[#999] text-[9px]">{reason}</span>
                    <div className="flex items-center gap-1 bg-green-400/10 rounded px-1.5 py-0.5">
                      <TrendingUp size={8} className="text-green-400" />
                      <span className="text-green-400 text-[9px]">+7.5%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
