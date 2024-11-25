import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import InvoicesList from './pages/InvoicesList'
import InvoiceShow from './pages/InvoiceShow'
import InvoiceCreate from './pages/InvoiceCreate'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas)

function App() {
  return (
    <div className="px-5" style={{ minWidth: 600 }}>
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
