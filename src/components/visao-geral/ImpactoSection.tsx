import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip
} from 'recharts'

const margemData = [
  { name: 'Período anterior', value: 6800000, fill: '#ff6600' },
  { name: 'Atual', value: 7100000, fill: '#4ade80' },
]

const debitoData = [
  { name: 'Período anterior', value: 22400000, fill: '#ff6600' },
  { name: 'Atual', value: 20300000, fill: '#4ade80' },
]

function formatMil(v: number) {
  return `R$${Math.round(v / 1000000 * 10) / 10}M`
}

function ComparisonChart({
  title, badge, badgePositive, data, format
}: {
  title: string
  badge: string
  badgePositive: boolean
  data: typeof margemData
  format: (v: number) => string
}) {
  return (
    <div className="rounded-lg border border-[rgba(41,41,41,0.5)] bg-[#0d0d0d]/80 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white text-lg font-bold">{title}</h3>
        <div className={`flex items-center gap-1.5 rounded px-3 py-1 text-xs ${badgePositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
          <span className="font-semibold">{badge}</span>
          <span className="text-[#999]">vs período anterior</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 20, right: 10, bottom: 10, left: 50 }} barSize={80}>
          <XAxis
            dataKey="name"
            tick={{ fill: '#999', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={format}
            tick={{ fill: '#999', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(v) => [format(Number(v)), '']}
            contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, color: '#fff' }}
            labelStyle={{ color: '#999' }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} label={{ position: 'top', formatter: (v: unknown) => format(Number(v)), fill: '#fff', fontWeight: 'bold', fontSize: 12 }}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ImpactoSection() {
  return (
    <div className="grid grid-cols-2 gap-5 mb-5">
      <ComparisonChart
        title="Impacto na Margem Líquida"
        badge="+4.4%"
        badgePositive={true}
        data={margemData}
        format={formatMil}
      />
      <ComparisonChart
        title="Impacto no Débito"
        badge="-9.4%"
        badgePositive={false}
        data={debitoData}
        format={formatMil}
      />
    </div>
  )
}
