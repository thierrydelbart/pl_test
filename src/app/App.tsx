import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import InvoicesList from './components/InvoicesList'
import InvoiceShow from './components/InvoiceShow'
import InvoiceCreate from './components/InvoiceCreate'

function App() {
  console.log(process.env.BASENAME)
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
