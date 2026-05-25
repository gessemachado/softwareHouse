import { RefreshCw, Store, Calendar } from 'lucide-react'
import { AppLayout } from '../components/layout/AppLayout'
import { TabNav } from '../components/ui/TabNav'
import { ScoreGauge } from '../components/buyhelp-index/ScoreGauge'
import { EvolutionChart } from '../components/buyhelp-index/EvolutionChart'
import { PilarCard } from '../components/buyhelp-index/PilarCard'
import { InsightsPanel } from '../components/buyhelp-index/InsightsPanel'
import { RecomendacoesPanel } from '../components/buyhelp-index/RecomendacoesPanel'
import { useBuyHelpIndex } from '../hooks/useBuyHelpIndex'
import { CREDENCIADOS_MOCK, PILARES_DEF } from '../mocks/buyhelp-index.mock'

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded animate-pulse ${className}`}
      style={{ background: '#1a1a1a' }}
    />
  )
}

function SkeletonLayout() {
  return (
    <>
      {/* Score + Evolução */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Skeleton className="h-56" />
        <div className="col-span-2"><Skeleton className="h-56" /></div>
      </div>
      {/* Pilares */}
      <div className="grid grid-cols-5 gap-4 mb-4">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-44" />)}
      </div>
      {/* Insights + Recomendações */}
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function Dashboard() {
  const {
    data, loading, insights, recomendacoes,
    credenciadoUuid, setCredenciadoUuid,
    dataInicio, setDataInicio,
    dataFim, setDataFim,
    refetch,
  } = useBuyHelpIndex()

  return (
    <AppLayout title="" subtitle="" breadcrumb="">
      <TabNav />

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        {/* Título */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#9ca3af' }}>
            Saúde Comercial
          </p>
          <h1 className="text-bh-text text-xl font-bold">BuyHelp Index</h1>
        </div>

        {/* Controles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Seletor de loja */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-bh-border bg-bh-surface text-sm">
            <Store size={14} className="text-bh-muted flex-shrink-0" />
            <select
              id="select-credenciado"
              value={credenciadoUuid}
              onChange={e => setCredenciadoUuid(e.target.value)}
              className="bg-transparent text-bh-text text-sm outline-none cursor-pointer"
            >
              {CREDENCIADOS_MOCK.map(c => (
                <option key={c.uuid} value={c.uuid} style={{ background: '#0d0d0d' }}>
                  {c.nome} · {c.cnpj}
                </option>
              ))}
            </select>
          </div>

          {/* Data início */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-bh-border bg-bh-surface">
            <Calendar size={14} className="text-bh-muted flex-shrink-0" />
            <input
              type="date"
              value={dataInicio}
              onChange={e => setDataInicio(e.target.value)}
              className="bg-transparent text-bh-text text-sm outline-none cursor-pointer"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          {/* Data fim */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-bh-border bg-bh-surface">
            <Calendar size={14} className="text-bh-muted flex-shrink-0" />
            <input
              type="date"
              value={dataFim}
              onChange={e => setDataFim(e.target.value)}
              className="bg-transparent text-bh-text text-sm outline-none cursor-pointer"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          {/* Atualizar */}
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: '#f97316',
              color: '#fff',
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Atualizar
          </button>
        </div>
      </div>

      {/* ── Conteúdo ─────────────────────────────────────────────────────────── */}
      {loading || !data ? (
        <SkeletonLoader />
      ) : (
        <>
          {/* Bloco superior: Score + Evolução */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <ScoreGauge
              score={data.index.score}
              classificacao={data.index.classificacao}
              delta={data.index.delta_periodo_anterior}
            />
            <div className="col-span-2">
              <EvolutionChart historico={data.historico_mensal} />
            </div>
          </div>

          {/* Pilares */}
          <div className="grid grid-cols-5 gap-4 mb-4">
            {PILARES_DEF.map(pilar => (
              <PilarCard
                key={pilar.key}
                pilar={pilar}
                dados={data.pilares[pilar.key]}
              />
            ))}
          </div>

          {/* Bloco inferior: Insights + Recomendações */}
          <div className="grid grid-cols-2 gap-4">
            <InsightsPanel insights={insights} />
            <RecomendacoesPanel recomendacoes={recomendacoes} />
          </div>
        </>
      )}
    </AppLayout>
  )
}

// Alias para evitar erro de referência antes da definição
function SkeletonLoader() {
  return <SkeletonLayout />
}
