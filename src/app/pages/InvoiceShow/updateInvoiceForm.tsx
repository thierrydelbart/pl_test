import { useState } from "react";
import { Components } from 'api/gen/client'
import DatePicker from "react-datepicker";
import CustomerAutocomplete from '../../components/CustomerAutocomplete'

import { Customer, Invoice } from "types";
import { Table } from "react-bootstrap";

interface Props {
  invoice: Invoice | null,
  onUpdate: (invoice_id: number, invoiceUpdatePayload: Components.Schemas.InvoiceUpdatePayload) => void
}

interface InvoiceUpdateProps {
  customer?: Customer | null,
  date?: Date | null,
  deadline?: Date | null,
  invoice_lines?: Components.Schemas.InvoiceLineUpdatePayload[],
}

const UpdateInvoiceForm = ({ invoice, onUpdate }: Props) => {
  const [ formData, setFormData ] = useState<InvoiceUpdateProps>({
    customer: invoice?.customer || null,
    date: invoice?.date ? new Date(invoice.date) : new Date(),
    deadline: invoice?.deadline ? new Date(invoice.deadline) : new Date(),
    invoice_lines: invoice?.invoice_lines || [],
  })

  const validateFormData = (data: InvoiceUpdateProps) => {
    if (!data.customer) {
      window.alert('Please select a customer');
      return;
    }
    if (!data.date) {
      window.alert('Please select an invoicing date');
      return false;
    }
    if (!data.deadline) {
      window.alert('Please select a due date');
      return false;
    }
    if (data.deadline < data.date) {
      window.alert('Due date should be after invoicing date');
      return false;
    }
    return true
  }
  
  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) =>{
    event.preventDefault();

    if (!invoice) return;

    if (!validateFormData(formData)) return;

    const customer_id = formData?.customer?.id;
    if (!customer_id) return;

    const invoiceCreatePayload: Components.Schemas.InvoiceUpdatePayload = {
      customer_id: customer_id,
      date: formData.date?.toISOString(),
      deadline: formData.deadline?.toISOString(),
    };

    await onUpdate(invoice.id, invoiceCreatePayload);
  };

  const handleAddProduct = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log('Adding product...');
    formData.invoice_lines?.push({
      product_id: formData.invoice_lines.length + 1,
      quantity: 1,
      label: 'Product 123',
      unit: "piece",
      price: 15.50,
    });
    console.log(formData.invoice_lines);
  }

  const handleRemoveProduct = async (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
    event.preventDefault();
    console.log('Removing product...');
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Customer</label>
          <CustomerAutocomplete 
            value={formData?.customer || null} 
            onChange={(customer) => setFormData({ ...formData, customer: customer})} 
          />
        </div>
        { formData?.customer && (
          <div>
            <div className="mb-3">
              <label className="form-label">Invoice date</label>
              <br />
              <DatePicker 
                dateFormat="dd/MM/yyyy"
                selected={formData?.date}
                onChange={(date) => setFormData({ ...formData, date: date})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Due date</label>
              <br />
              <DatePicker 
                dateFormat="dd/MM/yyyy"
                selected={formData?.deadline}
                onChange={(date) => setFormData({ ...formData, deadline: date})}
              />
            </div>
            <div className="mb-3">
              <h2><small>Products</small></h2>
              <div className="mb-3">
                <button className="btn btn-outline-primary" onClick={handleAddProduct}>Add product</button>
                <br/><br/>
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
                    { formData.invoice_lines?.map((line, index) => (
                      <tr key={ line.product_id }>
                        <td>{ line.label }</td>
                        <td>{ line.quantity }</td>
                        <td>{ line.price }</td>
                        <td><button className="btn btn-outline-danger" onClick={(e) => handleRemoveProduct(e, index)}>Remove</button></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        )}
        <input type="submit" className="btn btn-outline-primary" value="Save" />
      </form>
    </div>
  );
}

export default UpdateInvoiceForm;
