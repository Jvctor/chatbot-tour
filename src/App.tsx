import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from "./components/Layout"
import Clients from './pages/clients/Clients'
import CreateClient from './pages/clients/CreateClient'
import EditClient from './pages/clients/EditClient'
import Operacoes from './pages/operations/Operations'
// import Dashboard from "./pages/Dashboard"
// import Operacoes from "./pages/Operacoes"
// import Parceiros from "./pages/Parceiros"

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/clients" replace />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/create" element={<CreateClient />} />
          <Route path="/clients/edit/:id" element={<EditClient />} />
          <Route path="/operacoes" element={<Operacoes />} />
          {/* <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/parceiros" element={<Parceiros />} /> */}
        </Routes>
      </Layout>
    </Router>
  )
}

export default App