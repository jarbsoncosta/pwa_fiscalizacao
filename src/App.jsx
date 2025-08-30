import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import TeamPage from './pages/Team/TeamId'
import MinhasFiscalizacoesPage from './pages/MinhasFiscalizacoes/MinhasFiscalizacoes'
import MapaPage from './pages/Mapa/Mapa'
import DefaultLayout from './components/DefaultLayout/DefaultLayout'
import TargetsPage from './pages/Fiscalizacoes/Fiscalizacoes'
import TargetDetailPage from './pages/TargetDetailPage/TargetDetailPage'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<DefaultLayout />}>
        <Route path="/view/dashboard" element={<Dashboard />} />
        <Route path="/view/equipe/:id" element={<TeamPage />} />
        <Route path="/view/meus_alvos" element={<MinhasFiscalizacoesPage />} />
        <Route path="/view/meus_alvos/mapa" element={<MapaPage />} />
        <Route path="/view/alvos" element={<TargetsPage />} />
        <Route path="/view/target/:id" element={<TargetDetailPage />} />
      </Route>
      {/* <Route path="/registros" element={<RegistrosLocais />} /> */}
    </Routes>
  )
}

export default App
