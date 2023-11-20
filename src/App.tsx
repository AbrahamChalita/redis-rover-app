import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { InitialConnectionPage, Dashboard} from './pages'

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<InitialConnectionPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
