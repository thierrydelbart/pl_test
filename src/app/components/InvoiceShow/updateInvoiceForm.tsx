import { Invoice } from "types";

interface Props {
  invoice: Invoice | null
}

const UpdateInvoiceForm = ({ invoice }: Props) => {
  return (
    <div>
      <pre>{JSON.stringify(invoice ?? '', null, 2)}</pre>
    </div>
  );
}

export default UpdateInvoiceForm;
