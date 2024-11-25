import { useState } from "react";
import { Components } from 'api/gen/client'
import DatePicker from "react-datepicker";
import CustomerAutocomplete from '../../components/CustomerAutocomplete'

import { Customer, Invoice } from "types";
interface Props {
  invoice: Invoice,
  onSubmit: (invoice_id: number, invoiceUpdatePayload: Components.Schemas.InvoiceUpdatePayload) => void
}

interface InvoiceUpdateProps {
  customer?: Customer | null,
  date?: Date | null,
  deadline?: Date | null,
}

const UpdateInvoiceForm = ({ invoice, onSubmit }: Props) => {
  const [ formData, setFormData ] = useState<InvoiceUpdateProps>({
    customer: invoice?.customer || null,
    date: invoice?.date ? new Date(invoice.date) : new Date(),
    deadline: invoice?.deadline ? new Date(invoice.deadline) : new Date(),
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

    if (!validateFormData(formData)) return;

    const customer_id = formData?.customer?.id;
    if (!customer_id) return;

    const invoiceUpdatePayload: Components.Schemas.InvoiceUpdatePayload = {
      customer_id: customer_id,
      date: formData.date?.toISOString(),
      deadline: formData.deadline?.toISOString(),
    };

    await onSubmit(invoice.id, invoiceUpdatePayload);
  };

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
          </div>
        )}
        <input type="submit" className="btn btn-outline-primary" value="Save" />
      </form>
    </div>
  );
}

export default UpdateInvoiceForm;
