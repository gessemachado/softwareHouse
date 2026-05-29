import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import type { HistoricoMes } from '../../types/buyhelp-index.types'

interface Props {
  historico: HistoricoMes[]
}

function formatMes(mes: string) {
  const [ano, m] = mes.split('-')
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  return `${meses[parseInt(m) - 1]}/${ano.slice(2)}`
}

const CustomDot = (props: any) => {
  const { cx, cy } = props
  return (
    <circle
      cx={cx} cy={cy} r={5}
      fill="#0F6E56"
      stroke="rgb(var(--bh-surface))"
      strokeWidth={2}
    />
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgb(var(--bh-surface))', border: '1px solid #222', borderRadius: 8,
      padding: '8px 12px', fontSize: 12, color: 'rgb(var(--bh-border))',
    }}>
      <p style={{ color: '#9ca3af', marginBottom: 2 }}>{label}</p>
      <p style={{ color: '#0F6E56', fontWeight: 700, fontSize: 16 }}>
        {payload[0].value} <span style={{ fontSize: 11, fontWeight: 400, color: '#9ca3af' }}>pts</span>
      </p>
    </div>
  )
}

export function EvolutionChart({ historico }: Props) {
  const data = historico.map(h => ({
    mes: formatMes(h.mes),
    score: h.score,
  }))

  return (
    <div className="card-bh p-6 flex flex-col h-full">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#9ca3af' }}>
          Evolução Mensal
        </p>
        <p className="text-bh-text text-sm font-medium">Score ao longo do tempo</p>
      </div>

      <div className="flex-1" style={{ minHeight: 200, height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F6E56" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#0F6E56" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--bh-surface2))" />
            <XAxis
              dataKey="mes"
              tick={{ fill: 'rgb(var(--bh-subtle))', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: 'rgb(var(--bh-subtle))', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Linhas de referência das faixas */}
            <ReferenceLine y={80} stroke="#639922" strokeDasharray="4 4" strokeOpacity={0.4} />
            <ReferenceLine y={60} stroke="#0F6E56" strokeDasharray="4 4" strokeOpacity={0.4} />
            <ReferenceLine y={40} stroke="#EF9F27" strokeDasharray="4 4" strokeOpacity={0.4} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#0F6E56"
              strokeWidth={2.5}
              dot={<CustomDot />}
              activeDot={{ r: 7, fill: '#0F6E56', stroke: 'rgb(var(--bh-surface))', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
