import { useApi } from 'api'
import { Invoice, Customer, Product } from 'types'
import { useEffect, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomerAutocomplete from '../CustomerAutocomplete'
import ProductAutocomplete from '../ProductAutocomplete'

const InvoicesList = (): React.ReactElement => {
  const api = useApi()
  const navigate = useNavigate()

  const [invoicesList, setInvoicesList] = useState<Invoice[]>([])
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [product, setProduct] = useState<Product | null>(null)

  const fetchInvoices = useCallback(async () => {
    const { data } = await api.getInvoices()
    setInvoicesList(data.invoices)
  }, [api])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  function handleRowClick(id: number): void {
    navigate(`/invoice/${id}`)
  }

  return (
    <div>
      <h1>Invoices</h1>
      <div className="mb-3 mt-5">
        <CustomerAutocomplete value={customer} onChange={setCustomer} />
      </div>
      <div className="mb-5">
        <ProductAutocomplete value={product} onChange={setProduct} />
      </div>
      <a className="btn btn-outline-dark mb-3" href="/invoices/new">New invoice</a>
      <table className="table table-bordered table-striped table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Finalized</th>
            <th>Paid</th>
            <th>Date</th>
            <th>Deadline</th>
          </tr>
        </thead>
        <tbody>
          {invoicesList.map((invoice) => (
            <tr key={invoice.id} onClick={() => handleRowClick(invoice.id)} style={{ cursor: 'pointer' }}>
              <td>{invoice.id}</td>
              <td>
                {invoice.customer?.first_name} {invoice.customer?.last_name}
              </td>
              <td>{invoice.total}</td>
              <td>{invoice.finalized ? 'Yes' : 'No'}</td>
              <td>{invoice.paid ? 'Yes' : 'No'}</td>
              <td>{invoice.date}</td>
              <td>{invoice.deadline}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default InvoicesList
