import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SoftwareHouseList } from './pages/SoftwareHouseList'
import { SoftwareHouseWizard } from './pages/SoftwareHouseWizard'
import { RelatorioFinanceiro } from './pages/RelatorioFinanceiro'
import { VisaoGeral } from './pages/VisaoGeral'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/visao-geral" replace />} />
        <Route path="/visao-geral" element={<VisaoGeral />} />
        <Route path="/software-house" element={<SoftwareHouseList />} />
        <Route path="/software-house/nova" element={<SoftwareHouseWizard mode="create" />} />
        <Route path="/software-house/:id/editar" element={<SoftwareHouseWizard mode="edit" />} />
        <Route path="/software-house/relatorio" element={<RelatorioFinanceiro />} />
        <Route path="*" element={<Navigate to="/visao-geral" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
