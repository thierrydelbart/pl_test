import { useState } from 'react'
import { useApi } from 'api'
import { useNavigate } from 'react-router-dom'
import { Customer, Invoice } from 'types'
import CustomerAutocomplete from '../CustomerAutocomplete'
import { Components } from 'api/gen/client'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const InvoiceCreate = () => {
  const api = useApi()
  const navigate = useNavigate()

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [deadline, setDeadline] = useState<Date | null>(new Date());

  const handleCreate = async () => {
    try {
      if (!customer) return;

      let invoice:Components.Schemas.InvoiceCreatePayload = { 
        customer_id: customer.id,
        deadline: deadline?.toISOString(),
        date: new Date().toISOString(),
      }; 

      console.log('Creating invoice...');
      api.postInvoices(null, { invoice: invoice }).then(({ data }) => {
        alert(`Invoice ${data.id} created successfully!`);
        console.log(data)
        navigate('/');
      });
    } catch (error) {
      console.error('Error creating data:', error);
    }
  };
  
  return (
    <div>
      <h1>New invoice</h1>
      <a className="button" href="/">Back</a>
      <div className="mb-3 mt-3">
        <div className="mb-3">
          <label className="form-label">Customer</label>
          <CustomerAutocomplete value={customer} onChange={setCustomer} />
        </div>
        <div className="mb-3">
          <label className="form-label">Due date</label>
          <br />
          <DatePicker selected={deadline} onChange={(date) => setDeadline(date)} />
        </div>
      </div>
      <button onClick={handleCreate}>Create</button>
    </div>
  )
}

export default InvoiceCreate
