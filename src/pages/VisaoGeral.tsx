import { AppLayout } from '../components/layout/AppLayout'
import { TabNav } from '../components/ui/TabNav'
import { DashboardHeader } from '../components/visao-geral/DashboardHeader'
import { SalesAnalysisSection } from '../components/visao-geral/SalesAnalysisSection'
import { CadastrosSection } from '../components/visao-geral/CadastrosSection'
import { MetricasSection } from '../components/visao-geral/MetricasSection'
import { IntermediacoesSection } from '../components/visao-geral/IntermediacoesSection'
import { DashboardFilterProvider } from '../contexts/DashboardFilterContext'

export function VisaoGeral() {
  return (
    <DashboardFilterProvider>
      <AppLayout title="" subtitle="" breadcrumb="">
        <TabNav />
        <DashboardHeader />
        <SalesAnalysisSection />
        <CadastrosSection />
        <MetricasSection />
        <IntermediacoesSection />
      </AppLayout>
    </DashboardFilterProvider>
  )
}
