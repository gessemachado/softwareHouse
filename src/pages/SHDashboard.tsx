'use client'
import { useState, useEffect, type ReactElement } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Settings2, Eye, Download } from 'lucide-react'
import { AppLayout } from '../components/layout/AppLayout'
import { TabNav } from '../components/ui/TabNav'
import { CardsGrid } from '../components/visao-geral/CardsGrid'
import { SalesAnalysisSection } from '../components/visao-geral/SalesAnalysisSection'
import { CadastrosSection } from '../components/visao-geral/CadastrosSection'
import { MetricasSection } from '../components/visao-geral/MetricasSection'
import { DashboardConfigModal } from '../components/visao-geral/DashboardConfigModal'
import { DashboardHeader } from '../components/visao-geral/DashboardHeader'
import { DashboardFilterProvider } from '../contexts/DashboardFilterContext'
import { DashboardConfigProvider, useDashboardConfig } from '../contexts/DashboardConfigContext'
import { getSoftwareHouseById } from '../services/supabase/softwareHouseService'
import type { SoftwareHouse } from '../types/sh.types'

const SECTION_MAP: Record<string, ReactElement> = {
  cards:     <CardsGrid />,
  vendas:    <SalesAnalysisSection />,
  cadastros: <CadastrosSection />,
  metricas:  <MetricasSection />,
}

function SHDashboardContent({ sh }: { sh: SoftwareHouse }) {
  const navigate = useNavigate()
  const [showConfig, setShowConfig] = useState(false)
  const { sections } = useDashboardConfig()

  return (
    <>
      <TabNav />

      {/* Header SH */}
      <div className="rounded-lg border border-bh-primary/20 bg-bh-bg/80 p-4 sm:p-6 mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/software-house')}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-[#555] hover:text-white hover:border-white/20 transition-colors shrink-0"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(255,102,0,0.2) 0%, rgba(255,102,0,0.1) 100%)' }}>
              <Eye size={20} className="text-bh-primary" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold leading-tight">{sh.nome_fantasia}</h1>
              <p className="text-[#999] text-sm mt-0.5">
                {sh.estado}, {sh.municipio} · CNPJ {sh.cnpj}
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-bh-primary hover:bg-bh-primary-hover text-white px-5 py-3 rounded-lg text-sm font-medium transition-colors">
            <Download size={14} />
            Exportar
          </button>
        </div>
      </div>

      {/* Período (mesmos filtros do visão geral) */}
      <DashboardHeader />

      {/* Config button */}
      <div className="flex justify-end mb-4 -mt-1">
        <button
          onClick={() => setShowConfig(true)}
          className="flex items-center gap-2 rounded-lg border border-white/10 text-[#555] hover:text-bh-primary hover:border-bh-primary/40 hover:bg-bh-primary/5 px-3 py-1.5 text-xs font-semibold transition-colors"
        >
          <Settings2 size={13} />
          Configurar dashboard
        </button>
      </div>

      {/* Seções */}
      {sections
        .filter(s => s.visible)
        .map(s => (
          <div key={s.id}>{SECTION_MAP[s.id]}</div>
        ))}

      {showConfig && <DashboardConfigModal onClose={() => setShowConfig(false)} />}
    </>
  )
}

export function SHDashboard() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [sh, setSH] = useState<SoftwareHouse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { navigate('/software-house'); return }
    getSoftwareHouseById(id)
      .then(setSH)
      .catch(() => navigate('/software-house'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading) {
    return (
      <AppLayout title="">
        <div className="flex items-center justify-center h-64 text-[#555] text-sm">
          Carregando...
        </div>
      </AppLayout>
    )
  }

  if (!sh) return null

  return (
    <DashboardFilterProvider>
      <DashboardConfigProvider>
        <AppLayout title="">
          <SHDashboardContent sh={sh} />
        </AppLayout>
      </DashboardConfigProvider>
    </DashboardFilterProvider>
  )
}
