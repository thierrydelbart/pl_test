import { useState } from 'react'
import { useApi } from 'api'
import { Customer, Invoice } from 'types'
import CustomerAutocomplete from '../CustomerAutocomplete'
import { Components } from 'api/gen/client'

const InvoiceCreate = () => {
  const api = useApi()

  const [customer, setCustomer] = useState<Customer | null>(null)

  const handleCreate = async () => {
    console.log('Creating invoice...');
    try {
      if (!customer) return;

      let invoice:Components.Schemas.InvoiceCreatePayload = {customer_id: customer.id}; 
      api.postInvoices(null, { invoice: invoice }).then(({ data }) => {
        alert('Data created successfully!');
        console.log(data)
      });
      console.log('Invoice creation started!');
    } catch (error) {
      console.error('Error creating data:', error);
    }
  };
  
  return (
    <div>
      <h1>New invoice</h1>
      <a className="button" href="/">Back</a>
      <CustomerAutocomplete value={customer} onChange={setCustomer} />
      <br />
      <button onClick={handleCreate}>Create</button>
    </div>
  )
}

export default InvoiceCreate
