import { useState, type ReactElement } from 'react'
import { Settings2 } from 'lucide-react'
import { AppLayout } from '../components/layout/AppLayout'
import { TabNav } from '../components/ui/TabNav'
import { DashboardHeader } from '../components/visao-geral/DashboardHeader'
import { CardsCarousel } from '../components/visao-geral/CardsCarousel'
import { CardsGrid } from '../components/visao-geral/CardsGrid'
import { SalesAnalysisSection } from '../components/visao-geral/SalesAnalysisSection'
import { CadastrosSection } from '../components/visao-geral/CadastrosSection'
import { MetricasSection } from '../components/visao-geral/MetricasSection'
import { DashboardConfigModal } from '../components/visao-geral/DashboardConfigModal'
import { DashboardFilterProvider } from '../contexts/DashboardFilterContext'
import { DashboardConfigProvider, useDashboardConfig } from '../contexts/DashboardConfigContext'

const SECTION_MAP: Record<string, ReactElement> = {
  carousel:  <CardsCarousel />,
  cards:     <CardsGrid />,
  vendas:    <SalesAnalysisSection />,
  cadastros: <CadastrosSection />,
  metricas:  <MetricasSection />,
}

function DashboardContent() {
  const [showConfig, setShowConfig] = useState(false)
  const { sections } = useDashboardConfig()

  return (
    <>
      <TabNav />
      <DashboardHeader />

      {/* Config button */}
      <div className="flex justify-end mb-4 -mt-1">
        <button
          onClick={() => setShowConfig(true)}
          className="flex items-center gap-2 rounded-lg border border-bh-border/40 text-bh-subtle hover:text-bh-primary hover:border-bh-primary/40 hover:bg-bh-primary/5 px-3 py-1.5 text-xs font-semibold transition-colors"
        >
          <Settings2 size={13} />
          Configurar dashboard
        </button>
      </div>

      {/* Sections in configured order */}
      {sections
        .filter(s => s.visible)
        .map(s => (
          <div key={s.id}>{SECTION_MAP[s.id]}</div>
        ))}

      {showConfig && <DashboardConfigModal onClose={() => setShowConfig(false)} />}
    </>
  )
}

export function VisaoGeral() {
  return (
    <DashboardFilterProvider>
      <DashboardConfigProvider>
        <AppLayout title="" subtitle="" breadcrumb="">
          <DashboardContent />
        </AppLayout>
      </DashboardConfigProvider>
    </DashboardFilterProvider>
  )
}
