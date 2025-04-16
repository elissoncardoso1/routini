import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Calendar } from './components/Calendar'
import { Dashboard } from './components/Dashboard'
import { Cadastro } from './pages/Cadastro'

export function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Calendar />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cadastro" element={<Cadastro />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App;
