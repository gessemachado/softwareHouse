import { ChevronDown } from 'lucide-react'

const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '00:00', '03:00', '06:00']

// Mock heatmap data (7 days x 11 hours)
const heatmapData = days.map(() =>
  hours.map(() => Math.floor(Math.random() * 100))
)

function getIntensityColor(value: number): string {
  if (value === 0) return 'rgba(255,102,0,0.05)'
  if (value < 20) return 'rgba(255,102,0,0.15)'
  if (value < 40) return 'rgba(255,102,0,0.3)'
  if (value < 60) return 'rgba(255,102,0,0.5)'
  if (value < 80) return 'rgba(255,102,0,0.7)'
  return 'rgba(255,102,0,0.9)'
}

export function HeatmapSection() {
  return (
    <div className="rounded-lg border border-bh-border/50 bg-bh-bg p-6 mb-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-bh-text text-base font-semibold">Mapa de Calor - Cadastrados por Dia e Hora</h3>
        <button className="flex items-center gap-2 border border-bh-border/50 bg-bh-surface2 text-bh-text px-3 py-1.5 rounded text-xs">
          Máximo <ChevronDown size={12} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left text-bh-muted pb-2 pr-3 font-normal w-10" />
              {hours.map((h, i) => (
                <th key={i} className="text-center text-bh-muted pb-2 font-normal min-w-[56px]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day, di) => (
              <tr key={day}>
                <td className="text-bh-muted pr-3 py-1 font-medium">{day}</td>
                {hours.map((_, hi) => {
                  const val = heatmapData[di][hi]
                  return (
                    <td key={hi} className="py-1 px-1">
                      <div
                        className="w-full h-9 rounded flex items-center justify-center text-bh-text text-xs font-semibold"
                        style={{ backgroundColor: getIntensityColor(val) }}
                        title={`${val} cadastros`}
                      >
                        {val > 0 ? val : ''}
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
      <div className="flex items-center justify-end gap-3 mt-4">
        <span className="text-bh-muted text-xs">Menos cadastros</span>
        <div className="flex gap-1">
          {[0.05, 0.2, 0.4, 0.6, 0.8].map((op, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded"
              style={{ backgroundColor: `rgba(255,102,0,${op})` }}
            />
          ))}
        </div>
        <span className="text-bh-muted text-xs">Mais cadastros</span>
      </div>
    </div>
  )
}
