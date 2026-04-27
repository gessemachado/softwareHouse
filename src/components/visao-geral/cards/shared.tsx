import { TrendingDown, TrendingUp } from 'lucide-react'

export function fmtK(v: number) { return `R$ ${Math.round(v / 1000)}k` }
export function fmtM(v: number) {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(2)}M`
  return `R$ ${Math.round(v / 1000)}k`
}
export function pctStr(cur: number, prev: number) {
  if (prev === 0) return '+0.0%'
  const p = ((cur - prev) / prev) * 100
  return `${p >= 0 ? '+' : ''}${p.toFixed(1)}%`
}

export function TrendBadge({ cur, prev }: { cur: number; prev: number }) {
  const up = cur >= prev
  return (
    <div className={`flex items-center gap-1 rounded px-1.5 py-0.5 ${up ? 'bg-green-400/10' : 'bg-red-400/10'}`}>
      {up
        ? <TrendingUp size={10} className="text-green-400" />
        : <TrendingDown size={10} className="text-red-400" />}
      <span className={`text-xs ${up ? 'text-green-400' : 'text-red-400'}`}>{pctStr(cur, prev)}</span>
    </div>
  )
}
