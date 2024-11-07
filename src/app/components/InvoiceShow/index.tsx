import { useState, useEffect } from 'react'
import { useParams } from 'react-router'

import { useApi } from 'api'
import { Invoice } from 'types'

const InvoiceShow = () => {
  const { id } = useParams<{ id: string }>()
  const api = useApi()
  const [invoice, setInvoice] = useState<Invoice>()

  useEffect(() => {
    api.getInvoice(id).then(({ data }) => {
      setInvoice(data)
    })
  }, [api, id])

  function handleDelete(): void {
    invoice &&
    window.confirm('Are you sure you want to delete this invoice?') &&
    api.deleteInvoice({ id: invoice.id }).then(() => {
      alert(`Invoice ${invoice?.id} deleted successfully!`)
      window.location.href = '/'
    }).catch((error) => {
      window.alert("Error deleting invoice\n" + error.response.data.message)
    })
  }

  return (
    <div>
      <h1>Invoice {invoice?.id} </h1>
      <a className="btn btn-outline-dark mb-3" href="/">Back</a>
      <pre>{JSON.stringify(invoice ?? '', null, 2)}</pre>
      { invoice && (
        <a className='btn btn-outline-danger' onClick={() => handleDelete()}>Delete</a>
      )}
    </div>
  )
}

export default InvoiceShow
