import { useState, useEffect } from 'react'
import { useParams } from 'react-router'

import { useApi } from 'api'
import { Invoice } from 'types'
import { useNavigate } from 'react-router-dom'
import UpdateInvoiceForm from './updateInvoiceForm'
import { Components } from 'api/gen/client'
import { Button, Card, Container, ListGroup, Nav, Navbar, Table } from 'react-bootstrap'
import AddProductForm from './addProductForm'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import Drawer from 'app/components/drawer'

const InvoiceShow = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate();

  const api = useApi()
  const [invoice, setInvoice] = useState<Invoice>()
  const [showUpdate, setShowUpdate] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);

  useEffect(() => {
    api.getInvoice(id).then(({ data }) => {
      setInvoice(data)
    })
  }, [api, id])

  const handleDelete = async () => {
    invoice &&
    window.confirm('Are you sure you want to delete this invoice?') &&
    api.deleteInvoice({ id: invoice.id }).then(() => {
      navigate('/')
    }).catch((error) => {
      window.alert("Error deleting invoice\n" + error.response.data.message)
    })
  }

  const handleUpdate = async (invoice_id: number, invoiceUpdatePayload: Components.Schemas.InvoiceUpdatePayload) => {
    // console.log('Updating invoice...', invoiceUpdatePayload);
    api.putInvoice({ id: invoice_id }, { invoice: invoiceUpdatePayload }).then(({ data }) => {
      setInvoice(data)
      setShowUpdate(false)
      setShowAddProduct(false)
    }).catch((error) => {
      window.alert("Error updating invoice\n" + error?.response?.data?.message)
    })
  }

  const handleRemoveProduct = async (event: React.MouseEvent<HTMLAnchorElement>, line_id: number) => {
    event.preventDefault();

    invoice &&
    handleUpdate(invoice?.id, { invoice_lines_attributes: [ { id: line_id, _destroy: true } ] });
  }

  const handleFinalize = async () => {
    invoice &&
    window.confirm('Are you sure you want to finalize this invoice? This action cannot be undone') &&
    handleUpdate(invoice.id, { finalized: true })
  }

  const togglePaid = async () => {
    invoice &&
    handleUpdate(invoice.id, { paid: !invoice.paid })
  }

  const toMoney = (amount: number | string | null  ) => {
    const value = (typeof amount === 'string') ? parseInt(amount) : amount
    if (value === null || value === undefined) return "N/A"
    else return value.toLocaleString("en-US", {style:"currency", currency:"USD"})
  }

  const subtotal = invoice?.total && invoice?.tax ? parseInt(invoice.total) - parseInt(invoice.tax) : null

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
                    <>
                      <Button className="m-1" variant='outline-success' onClick={() => handleFinalize()}>Finalize</Button>
                      <Button className="m-1" variant='outline-danger' onClick={() => handleDelete()}>Delete</Button>
                    </>
                  )}
                  { invoice?.finalized && (
                    <Button className="m-1" variant='outline-primary' onClick={() => togglePaid()}>
                      {invoice.paid ? 'Unset' : 'Set'} paid
                    </Button>
                  )}
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
            { invoice?.paid && (
              <img src="/pl_test/paid.png" alt="Invoice paid" style={{ position: 'absolute', zIndex: 1 }} />
            )}
            <Card className="mb-3" style={{ width: '20rem', float: 'right' }}>
              <Card.Body>
                <Card.Title>{invoice.customer?.first_name} {invoice.customer?.last_name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {invoice.customer?.address} {invoice.customer?.zip_code}<br />
                  {invoice.customer?.city} {invoice.customer?.country}
                </Card.Subtitle>
              </Card.Body>
              <ListGroup variant="flush">
                  <ListGroup.Item><strong>Invoice Date:</strong> {invoice.date}</ListGroup.Item>
                  <ListGroup.Item><strong>Due Date:</strong> {invoice.deadline}</ListGroup.Item>
                </ListGroup>
              { !invoice?.finalized && (
                <Card.Footer>
                  <Button variant="outline-primary" onClick={() => setShowUpdate(true)}>Edit</Button>
                </Card.Footer>
              )}
            </Card>
            <div className="mb-3">
              <Table striped bordered>
                <thead>
                  <tr>
                    <th></th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>VTA</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  { invoice.invoice_lines?.map((line, index) => (
                    <tr key={ line.id }>
                      <td>
                        { !invoice?.finalized && (
                          <Link className="link-danger" onClick={(e) => handleRemoveProduct(e, line.id)} to={''}>
                            <FontAwesomeIcon icon="trash" />
                          </Link>
                        )}
                      </td>
                      <td>{ line.label }</td>
                      <td>{ line.quantity }</td>
                      <td>{ toMoney(parseInt(line.price) - parseInt(line.tax)) }</td>
                      <td>{ line.vat_rate + "%" }</td>
                      <td>{ toMoney(parseInt(line.price) * line.quantity) }</td>
                    </tr>
                  ))}
                  { !invoice?.finalized && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center" }}>
                        <Button className="m-auto" variant="outline-primary" onClick={() => setShowAddProduct(true)}>Add product</Button>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={4}></td>
                    <td><strong>Subtotal:</strong></td>
                    <td>{ toMoney(subtotal) }</td>
                  </tr>
                  <tr>
                    <td colSpan={4}></td>
                    <td><strong>Tax:</strong></td>
                    <td>{ toMoney(invoice?.tax) }</td>
                  </tr>
                  <tr>
                    <td colSpan={4}></td>
                    <td><strong>Total:</strong></td>
                    <td>{ toMoney(invoice?.total) }</td>
                  </tr>
                </tbody>
              </Table>
            </div>
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
