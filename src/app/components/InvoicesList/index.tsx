import { useApi } from 'api'
import { Invoice, Customer, Product } from 'types'
import { useEffect, useCallback, useState } from 'react'
import CustomerAutocomplete from '../CustomerAutocomplete'
import ProductAutocomplete from '../ProductAutocomplete'

const InvoicesList = (): React.ReactElement => {
  const api = useApi()

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

  return (
    <div>
      <h1>Invoices</h1>
      <nav>
        <ul>
          <li>
            <a href="/">All</a>
          </li>
          <li>
            <a href="/?paid=true">Paid</a>
          </li>
          <li>
            <a href="/?paid=false">Unpaid</a>
          </li>
          <li>
            <a href="/?finalized=true">Finalized</a>
          </li>
          <li>
            <a href="/?finalized=false">Unfinalized</a>
          </li>
          <li>
            <a className="button" href="/invoices/new">New invoice</a>
          </li>
        </ul>
      </nav>
      <div className="mb-3">
        <CustomerAutocomplete value={customer} onChange={setCustomer} />
      </div>
      <div className="mb-5">
        <ProductAutocomplete value={product} onChange={setProduct} />
      </div>
      <br />
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Id</th>
            <th>Customer</th>
            <th>Address</th>
            <th>Total</th>
            <th>Tax</th>
            <th>Finalized</th>
            <th>Paid</th>
            <th>Date</th>
            <th>Deadline</th>
          </tr>
        </thead>
        <tbody>
          {invoicesList.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>
                {invoice.customer?.first_name} {invoice.customer?.last_name}
              </td>
              <td>
                {invoice.customer?.address}, {invoice.customer?.zip_code}{' '}
                {invoice.customer?.city}
              </td>
              <td>{invoice.total}</td>
              <td>{invoice.tax}</td>
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
