import { useApi } from 'api'
import { Invoice } from 'types'
import { useEffect, useCallback, useState } from 'react'
import { Components } from 'api/gen/client'
import { Link } from 'react-router-dom'

const InvoicesList = (): React.ReactElement => {
  const api = useApi()

  const [invoicesList, setInvoicesList] = useState<Invoice[]>([])

  const fetchInvoices = useCallback(async () => {
    const { data } = await api.getInvoices()
    setInvoicesList(data.invoices)
  }, [api])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const handleUpdate = async (invoice_id: number, invoiceUpdatePayload: Components.Schemas.InvoiceUpdatePayload) => {
//    console.log('Updating invoice...', invoiceUpdatePayload);
    api.putInvoice({ id: invoice_id }, { invoice: invoiceUpdatePayload }).then(({ data }) => {
      fetchInvoices()
    }).catch((error) => {
      window.alert("Error updating invoice\n" + error?.response?.data?.message)
    })
  };
  
  function finalize(invoice_id: number): void {
    handleUpdate(invoice_id, { finalized: true })
  }

  function setPaid(invoice_id: number, value: boolean): void {
    handleUpdate(invoice_id, { paid: value })
  }
  return (
    <div>
      <h1>Invoices</h1>
      <Link className="btn btn-outline-dark mb-3" to="/invoices/new">New invoice</Link>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoicesList.map((invoice: Invoice) => (
            <tr key={invoice.id}>
              <td>
                <Link to={`/invoice/${invoice.id}`}>{invoice.id}</Link>
              </td>
              <td>
                {invoice.customer?.first_name} {invoice.customer?.last_name}
              </td>
              <td>{invoice.total}</td>
              <td>{invoice.finalized ? 'Yes' : 'No'}</td>
              <td>{invoice.paid ? 'Yes' : 'No'}</td>
              <td>{invoice.date}</td>
              <td>{invoice.deadline}</td>
              <td>
                { !invoice.finalized  && (
                    <button className="btn btn-outline-primary mx-2" onClick={() => finalize(invoice.id)}>
                      Finalize
                    </button>
                )}
                <button className="btn btn-outline-primary mx-2" onClick={() => setPaid(invoice.id,!invoice.paid)}>
                  {invoice.paid ? 'Unset' : 'Set'} paid
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default InvoicesList
