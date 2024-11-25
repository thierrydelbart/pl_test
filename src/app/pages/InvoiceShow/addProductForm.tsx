import { useState } from "react";
import { Components } from 'api/gen/client'
import { Invoice, Product } from 'types'
import ProductAutocomplete from '../../components/ProductAutocomplete'
import { Button, Form } from "react-bootstrap";

interface Props {
  invoice: Invoice,
  onSubmit: (invoice_id: number, invoiceUpdatePayload: Components.Schemas.InvoiceUpdatePayload) => void
}

interface AddProductProps {
  product?: Product | null,
  quantity?: number | null,
}

const AddProductForm = ({ invoice, onSubmit }: Props) => {
  const [ formData, setFormData ] = useState<AddProductProps>({
    product: null,
    quantity: 1,
  })

  const validateFormData = (data: AddProductProps) => {
    if (!data.product) {
      window.alert('Please select a product');
      return;
    }
    if (!data.quantity) {
      window.alert('Please select a quantity');
      return false;
    }
    return true
  }
  
  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) =>{
    event.preventDefault();

    if (!validateFormData(formData)) return;

    const product_id = formData?.product?.id;
    if (!product_id) return;

    const index = invoice.invoice_lines?.findIndex((line) => line.product_id === product_id);

    let invoiceLineUpdatePayload;
    if (index !== -1) { // product already in invoice
      const line = invoice.invoice_lines[index];
      invoiceLineUpdatePayload = {
        id: line.id,
        quantity: line.quantity + (formData?.quantity || 1),
      };
    } else { // new product
      invoiceLineUpdatePayload = {
        product_id: product_id,
        quantity: formData?.quantity || 1,
        label: formData?.product?.label || '',
        unit: formData?.product?.unit || undefined,
        vat_rate: formData?.product?.vat_rate || undefined,
        price: formData?.product?.unit_price || 0,
        tax: formData?.product?.unit_tax || 0,
      };
    }
    const invoiceUpdatePayload: Components.Schemas.InvoiceUpdatePayload = {
      invoice_lines_attributes: [invoiceLineUpdatePayload],
    };

    await onSubmit(invoice.id, invoiceUpdatePayload);
  };


  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="inputCustomer">Customer</Form.Label>
          <ProductAutocomplete
            value={formData?.product || null} 
            onChange={(product) => setFormData({ ...formData, product: product})} 
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="inputQuantity">Quantity</Form.Label>
          <br />
          <Form.Control 
            type="number"
            id="inputQuantity"
            value={formData?.quantity || 1}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value)})}
          />
        </Form.Group>
        <Button type="submit">Add</Button>
      </Form>
    </div>
  );
}

export default AddProductForm;
