import { useState, useEffect } from 'react'
import { useParams } from 'react-router'

import { useApi } from 'api'
import { Invoice } from 'types'
import { Link, useNavigate } from 'react-router-dom'
import UpdateInvoiceForm from './updateInvoiceForm'
import { Components } from 'api/gen/client'

const InvoiceShow = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate();

  const api = useApi()
  const [invoice, setInvoice] = useState<Invoice>()

  useEffect(() => {
    api.getInvoice(id).then(({ data }) => {
      setInvoice(data)
    })
  }, [api, id])

  const handleDelete = async () => {
    invoice &&
    window.confirm('Are you sure you want to delete this invoice?') &&
    api.deleteInvoice({ id: invoice.id }).then(() => {
      alert(`Invoice ${invoice?.id} deleted successfully!`)
      navigate('/')
    }).catch((error) => {
      window.alert("Error deleting invoice\n" + error.response.data.message)
    })
  }

  const handleUpdate = async (invoice_id: number, invoiceUpdatePayload: Components.Schemas.InvoiceUpdatePayload) => {
    //    console.log('Updating invoice...', invoiceUpdatePayload);
    api.putInvoice({ id: invoice_id }, { invoice: invoiceUpdatePayload }).then(({ data }) => {
      setInvoice(data)
      alert(`Invoice ${invoice?.id} saved successfully!`)
    }).catch((error) => {
      window.alert("Error updating invoice\n" + error?.response?.data?.message)
    })
  }

  const handleFinalize = async () => {
    invoice &&
    window.confirm('Are you sure you want to finalize this invoice? This action cannot be undone') &&
    api.putInvoice({ id: invoice.id }, { invoice: { finalized: true } }).then(({ data }) => {
      setInvoice(data)
      alert(`Invoice ${invoice?.id} finalized successfully!`)
    }).catch((error) => {
      window.alert("Error finalizing invoice\n" + error?.response?.data?.message)
    })
  }

  return (
    <div>
      <h1>Invoice {invoice?.id} </h1>
      <Link className="btn btn-outline-dark mb-3" to="/">Back</Link>
      { invoice && (
        <>
          <UpdateInvoiceForm invoice={ invoice } onUpdate={handleUpdate}/>
          <hr/>
          <h2><small>Advanced actions</small></h2>
          <button className='btn btn-outline-success' onClick={() => handleFinalize()}>Finalize</button>
          &nbsp;&nbsp;&nbsp;
          <button className='btn btn-outline-danger' onClick={() => handleDelete()}>Delete</button>
          <hr/>
          <h2><small>More</small></h2>
          <pre>{JSON.stringify(invoice ?? '', null, 2)}</pre>

        </>
      )}
    </div>
  )
}

export default InvoiceShow
