import { useState, useEffect } from 'react'
import { useParams } from 'react-router'

import { useApi } from 'api'
import { Customer, Invoice } from 'types'
import { useNavigate } from 'react-router-dom'
import UpdateInvoiceForm from './updateInvoiceForm'
import { Components } from 'api/gen/client'
import Drawer from '../../components/drawer'
import { Button, ButtonGroup, Card, Container, Nav, Navbar, Table } from 'react-bootstrap'
import AddProductForm from './addProductForm'

interface InvoiceUpdateProps {
  customer?: Customer | null,
  date?: Date | null,
  deadline?: Date | null,
  invoice_lines?: Components.Schemas.InvoiceLineUpdatePayload[],
}

const InvoiceShow = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate();

  const api = useApi()
  const [invoice, setInvoice] = useState<Invoice>()
  const [showUpdate, setShowUpdate] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [ formData, setFormData ] = useState<InvoiceUpdateProps>({
    customer: invoice?.customer || null,
    date: invoice?.date ? new Date(invoice.date) : new Date(),
    deadline: invoice?.deadline ? new Date(invoice.deadline) : new Date(),
    invoice_lines: invoice?.invoice_lines || [],
  })

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
    // console.log('Updating invoice...', invoiceUpdatePayload);
    api.putInvoice({ id: invoice_id }, { invoice: invoiceUpdatePayload }).then(({ data }) => {
      setInvoice(data)
      alert(`Invoice ${invoice?.id} saved successfully!`)
      setShowUpdate(false)
      setShowAddProduct(false)
    }).catch((error) => {
      window.alert("Error updating invoice\n" + error?.response?.data?.message)
    })
  }

  const handleRemoveProduct = async (event: React.MouseEvent<HTMLButtonElement>, line_id: number) => {
    event.preventDefault();

    const index = invoice?.invoice_lines?.findIndex((line) => line.id === line_id);

    console.log('Removing product...', index);
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
      
      { invoice && (
        <>
          <Navbar collapseOnSelect expand="md" className="bg-body-tertiary mb-3">
            <Container>
              <Navbar.Brand> Invoice {invoice?.id}</Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <Button className="m-1" variant="outline-secondary"  size="sm" onClick={() => navigate('/')}>Back</Button>
                </Nav>
                <Nav>
                  { !invoice?.finalized && (
                    <ButtonGroup className="m-1">
                      <Button variant="outline-primary" onClick={() => setShowUpdate(true)}>Edit</Button>
                      <Button variant="outline-primary" onClick={() => setShowAddProduct(true)}>Add product</Button>
                      <Button variant='outline-success' onClick={() => handleFinalize()}>Finalize</Button>
                    </ButtonGroup>
                  )}
                  <Button className="m-1" variant='outline-danger' onClick={() => handleDelete()}>Delete</Button>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          
          { invoice?.finalized && (
            <div className="alert alert-success mb-3" role="alert">
              This invoice is finalized
            </div>
          )}
          <div className="mb-3">
            <Card className="m-auto" style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>{invoice.customer?.first_name} {invoice.customer?.last_name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {invoice.customer?.address} {invoice.customer?.zip_code}<br />
                  {invoice.customer?.city} {invoice.customer?.country}
                </Card.Subtitle>
              </Card.Body>
            </Card>
            <div className="mb-3">
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  { invoice.invoice_lines?.map((line, index) => (
                    <tr key={ line.id }>
                      <td>{ line.label }</td>
                      <td>{ line.quantity }</td>
                      <td>{ line.price }</td>
                      <td><button className="btn btn-outline-danger" onClick={(e) => handleRemoveProduct(e, line.id)}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <hr />
            <div>
              <strong>Total:</strong> {invoice.total}<br />
              <strong>Finalized:</strong> {invoice.finalized ? 'Yes' : 'No'}<br />
              <strong>Paid:</strong> {invoice.paid ? 'Yes' : 'No'}<br />
              <strong>Date:</strong> {invoice.date}<br />
              <strong>Deadline:</strong> {invoice.deadline}<br />
            </div>
            <hr />
          </div>

          { !invoice?.finalized && (
            <>
              <Drawer title={`Update invoice ${invoice?.id}`} show={showUpdate} handleClose={() => setShowUpdate(false)}>
                <UpdateInvoiceForm invoice={ invoice } onSubmit={handleUpdate}/>
              </Drawer>

              <Drawer title={`Add a product`} show={showAddProduct} handleClose={() => setShowAddProduct(false)}>
                <AddProductForm invoice={ invoice } onSubmit={handleUpdate}/>
              </Drawer>
            </>
          )}

        </>
      )}
    </div>
  )
}

export default InvoiceShow
