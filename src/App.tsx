import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from "./components/Layout"
import Clients from './pages/clients/Clients'
import CreateClient from './pages/clients/CreateClient'
import EditClient from './pages/clients/EditClient'
import Operacoes from './pages/operations/Operations'
import CreateOperation from './pages/operations/CreateOperation'
import ChatWidget from './components/Chatbot/ChatWidget'
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
          <Route path="/operations" element={<Operacoes />} />
          <Route path="/operations/create" element={<CreateOperation />} />
          <Route path="/dashboard" />
          {/*  />
          <Route path="/parceiros" element={<Parceiros />} /> */}
        </Routes>
      </Layout>
      <ChatWidget />
    </Router>
  )
}

export default App