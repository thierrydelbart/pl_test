import { useState } from 'react'
import { useApi } from 'api'
import { Customer } from 'types'
import { Components } from 'api/gen/client'
import DatePicker from "react-datepicker";
import CustomerAutocomplete from '../../components/CustomerAutocomplete'

import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from 'react-router-dom';

interface InvoiceCreateProps {
  customer?: Customer | null,
  date?: Date | null,
  deadline?: Date | null,
}

const InvoiceCreate = () => {
  const api = useApi()
  const navigate = useNavigate();
  const [ formData, setFormData ] = useState<InvoiceCreateProps>({
    date: new Date(),
    deadline: new Date(),
  })

  const validateFormData = (data: InvoiceCreateProps) => {
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

  const handleCreate = async (event: React.SyntheticEvent<HTMLFormElement>) =>{
    event.preventDefault();

    if (!validateFormData(formData)) return;
   
    const customer_id = formData?.customer?.id;
    if (!customer_id) return;

    const invoiceCreatePayload: Components.Schemas.InvoiceCreatePayload = {
      customer_id: customer_id,
      date: formData.date?.toISOString(),
      deadline: formData.deadline?.toISOString(),
    };

    api.postInvoices(null, { invoice: invoiceCreatePayload }).then(({ data }) => {
      window.alert(`Invoice ${data.id} created successfully!`);
      navigate('/invoice/' + data.id)
    }).catch((error) => {
      window.alert("Error creating invoice\n" + error?.response?.data?.message)
    }) 
  };

  return (
    <div>
      <h1>New invoice</h1>
      <Link className="btn btn-outline-dark mb-3" to="/">Back</Link>
      <form onSubmit={handleCreate}>
        <div className="mb-3">
          <label className="form-label">First, select invoice customer</label>
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
                selected={formData?.date}
                onChange={(date) => setFormData({ ...formData, date: date})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Due date</label>
              <br />
              <DatePicker 
                selected={formData?.deadline}
                onChange={(date) => setFormData({ ...formData, deadline: date})}
              />
            </div>
          </div>
        )}
        <input type="submit" className="btn btn-outline-primary" value="Create" />
      </form>
    </div>
  )
}

export default InvoiceCreate
