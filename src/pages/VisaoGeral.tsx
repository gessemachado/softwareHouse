import { Fragment, useState } from 'react'
import { Settings2 } from 'lucide-react'
import { AppLayout } from '../components/layout/AppLayout'
import { TabNav } from '../components/ui/TabNav'
import { DashboardHeader } from '../components/visao-geral/DashboardHeader'
import { SalesAnalysisSection } from '../components/visao-geral/SalesAnalysisSection'
import { CadastrosSection } from '../components/visao-geral/CadastrosSection'
import { MetricasSection } from '../components/visao-geral/MetricasSection'
import { IntermediacoesSection } from '../components/visao-geral/IntermediacoesSection'
import { DashboardConfigModal } from '../components/visao-geral/DashboardConfigModal'
import { DashboardFilterProvider } from '../contexts/DashboardFilterContext'
import { DashboardConfigProvider, useDashboardConfig, type SectionConfig } from '../contexts/DashboardConfigContext'

type RenderGroup = { group: string; ids: string[] }

function buildRenderGroups(sections: SectionConfig[]): RenderGroup[] {
  const visible = sections.filter(s => s.visible)
  const groups: RenderGroup[] = []
  for (const s of visible) {
    const last = groups[groups.length - 1]
    if (last && last.group === s.group) {
      last.ids.push(s.id)
    } else {
      groups.push({ group: s.group, ids: [s.id] })
    }
  }
  return groups
}

function DashboardContent() {
  const [showConfig, setShowConfig] = useState(false)
  const { sections } = useDashboardConfig()
  const renderGroups = buildRenderGroups(sections)

  return (
    <>
      <TabNav />
      <DashboardHeader />

      <div className="flex justify-end mb-4 -mt-1">
        <button
          onClick={() => setShowConfig(true)}
          className="flex items-center gap-2 rounded-lg border border-white/10 text-[#555] hover:text-orange-500 hover:border-orange-500/40 hover:bg-orange-500/5 px-3 py-1.5 text-xs font-semibold transition-colors"
        >
          <Settings2 size={13} />
          Configurar dashboard
        </button>
      </div>

      {renderGroups.map((rg) => (
        <Fragment key={`${rg.group}:${rg.ids.join(',')}`}>
          {rg.group === 'intermediacoes_group' && (
            <IntermediacoesSection visibleIds={rg.ids} />
          )}
          {rg.group === 'vendas' && (
            <SalesAnalysisSection />
          )}
          {rg.group === 'cadastros_group' && (
            <CadastrosSection visibleIds={rg.ids} />
          )}
          {rg.group === 'metricas_group' && (
            <MetricasSection visibleIds={rg.ids} />
          )}
        </Fragment>
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
