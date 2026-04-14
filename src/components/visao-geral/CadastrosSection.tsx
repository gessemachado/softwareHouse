import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'

const composicaoData = [
  { label: 'Ativos', value: 120, pct: 42, color: '#20bf55' },
  { label: 'Novos', value: 10, pct: 3.5, color: '#66cdf6' },
  { label: 'Recuperados', value: 30, pct: 10.5, color: '#2499e4' },
  { label: 'A ser perdidos', value: 50, pct: 17.5, color: '#f1d954' },
  { label: 'Perdidos', value: 80, pct: 28, color: '#ff5353' },
]

export function CadastrosSection() {
  return (
    <div className="grid grid-cols-2 gap-5 mb-5">
      {/* Cadastros Ativos */}
      <div className="rounded-xl border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/80 p-5">
        <p className="text-white text-base mb-4">Cadastros Ativos</p>
        <div className="flex gap-6">
          {/* Total */}
          <div className="min-w-[100px]">
            <p className="text-white text-2xl font-semibold">5235</p>
            <p className="text-[#999] text-[10px] mt-1">Total de clientes cadastros</p>
            <p className="text-[#999] text-[10px]">em 21/03/2025</p>
          </div>

          {/* Divider */}
          <div className="w-px bg-[rgba(142,142,147,0.3)] self-stretch" />

          {/* Right side */}
          <div className="flex-1">
            <p className="text-orange-500 text-base font-semibold">+20 clientes</p>
            <p className="text-[#999] text-[10px] mb-4">Saldo no dia</p>

            <div className="flex gap-5">
              {/* Cadastrados */}
              <div className="flex items-start gap-2">
                <div className="w-9 h-9 rounded-lg bg-orange-500/20 flex items-center justify-center mt-0.5">
                  <TrendingUp size={16} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-[#999] text-[8px]">Cadastrados</p>
                  <p className="text-orange-500 text-[10px] font-medium">20 clientes</p>
                </div>
              </div>

              {/* Perdidos */}
              <div className="flex items-start gap-2">
                <div className="w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center mt-0.5">
                  <TrendingDown size={16} className="text-red-500" />
                </div>
                <div>
                  <p className="text-[#999] text-[8px]">Perdidos</p>
                  <p className="text-[#ff2e00] text-[10px] font-medium">5 clientes</p>
                </div>
              </div>

              {/* Recuperados */}
              <div className="flex items-start gap-2">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center mt-0.5">
                  <RefreshCw size={16} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-[#999] text-[8px]">Clientes recuperados</p>
                  <p className="text-cyan-400 text-[10px] font-medium">5 clientes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Composição dos Clientes */}
      <div className="rounded-xl border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/80 p-5">
        <p className="text-white text-sm font-semibold mb-0.5">Composição dos clientes</p>
        <p className="text-[#666] text-xs mb-5">Total: 5235 clientes Ativos</p>

        {/* Bar */}
        <div className="h-9 flex rounded-lg overflow-hidden border border-white/10 mb-4">
          {composicaoData.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-center"
              style={{ width: `${item.pct}%`, backgroundColor: item.color }}
            >
              <span className="text-white text-sm font-bold">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          {composicaoData.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[#999] text-[10px]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
