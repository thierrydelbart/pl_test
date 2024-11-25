import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import InvoicesList from './pages/InvoicesList'
import InvoiceShow from './pages/InvoiceShow'
import InvoiceCreate from './pages/InvoiceCreate'

function App() {
  return (
    <div className="px-5">
      <Router basename="pl_test">
        <Routes>
          <Route path="/invoices/new" Component={InvoiceCreate} />
          <Route path="/invoice/:id" Component={InvoiceShow} />
          <Route path="/" Component={InvoicesList} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
