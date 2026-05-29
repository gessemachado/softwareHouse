import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { LojaGrupoProvider } from './contexts/LojaGrupoContext'
import { SoftwareHouseList } from './pages/SoftwareHouseList'
import { SoftwareHouseWizard } from './pages/SoftwareHouseWizard'
import { RelatorioFinanceiro } from './pages/RelatorioFinanceiro'
import { VisaoGeral } from './pages/VisaoGeral'
import { SHDashboard } from './pages/SHDashboard'
import { Dashboard } from './pages/Dashboard'

function App() {
  return (
    <ThemeProvider>
    <LojaGrupoProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/visao-geral" replace />} />
        <Route path="/visao-geral" element={<VisaoGeral />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/software-house" element={<SoftwareHouseList />} />
        <Route path="/software-house/nova" element={<SoftwareHouseWizard mode="create" />} />
        <Route path="/software-house/:id/editar" element={<SoftwareHouseWizard mode="edit" />} />
        <Route path="/software-house/:id/dashboard" element={<SHDashboard />} />
        <Route path="/software-house/relatorio" element={<RelatorioFinanceiro />} />
        <Route path="*" element={<Navigate to="/visao-geral" replace />} />
      </Routes>
    </BrowserRouter>
    </LojaGrupoProvider>
    </ThemeProvider>
  )
}

export default App
