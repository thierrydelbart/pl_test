import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InvoicesList from './index';
import * as api from 'api';
import { invoice_1, invoice_2, invoice_3 } from 'api/fixtures';
import { MemoryRouter } from 'react-router-dom'


const mockUseApi = jest.spyOn(api, 'useApi');

const subject = () => render( <MemoryRouter><InvoicesList/></MemoryRouter> );
describe('InvoicesList', () => {


  it('Should display a list of invoices', async () => {
    const mockPromise = Promise.resolve({ data: { invoices: [ invoice_1, invoice_2, invoice_3 ] }})
    // @ts-ignore:next-line
    mockUseApi.mockImplementation(() => ({ getInvoices: () => mockPromise })); 

    const { getByText } = subject();

    await waitFor(() => {
      expect(getByText('John Doe')).toBeInTheDocument();
      expect(getByText('Jane Doe')).toBeInTheDocument();
      expect(getByText('Alice Smith')).toBeInTheDocument();
    });
  });

  it('Should display buttons for unfinalized / unpaid invoice', async () => {
    const mockPromise = Promise.resolve({ data: { invoices: [ invoice_1 ] }})
    // @ts-ignore:next-line
    mockUseApi.mockImplementation(() => ({ getInvoices: () => mockPromise })); 

    const { getByText } = subject();

    await waitFor(() => {
      expect(getByText('Finalize')).toBeInTheDocument();
    });
  });

  it('Should display buttons for finalized / paid invoice', async () => {
    const mockPromise = Promise.resolve({ data: { invoices: [ invoice_2 ] }})
    // @ts-ignore:next-line
    mockUseApi.mockImplementation(() => ({ getInvoices: () => mockPromise })); 

    const { queryByText, getByText } = subject();

    await waitFor(() => {
      expect(queryByText('Finalize')).not.toBeInTheDocument();
      expect(getByText('Unset paid')).toBeInTheDocument();
    });
  });

  it('Should request invoice update on finalize', async () => {
    const mockGetInvoices = jest.fn().mockImplementation(() => Promise.resolve({ data: { invoices: [ invoice_1 ] }}))
    const mockPutInvoice = jest.fn().mockImplementation(() => Promise.resolve({ data: invoice_2 }))
    // @ts-ignore:next-line
    mockUseApi.mockImplementation(() => ({ getInvoices:  mockGetInvoices, putInvoice: mockPutInvoice })); 

    const { getByText } = subject();

    await waitFor(() => {
      expect(getByText('Finalize')).toBeInTheDocument();
    });

    await getByText('Finalize').click();

    await waitFor(() => {
      expect(mockPutInvoice).toHaveBeenCalledWith({ id: 1 }, { invoice: { finalized: true } });
    });
  });

  it('Should request invoice update on set paid', async () => {
    const mockGetInvoices = jest.fn().mockImplementation(() => Promise.resolve({ data: { invoices: [ invoice_3 ] }}))
    const mockPutInvoice = jest.fn().mockImplementation(() => Promise.resolve({ data: { ...invoice_3 } }))
    // @ts-ignore:next-line
    mockUseApi.mockImplementation(() => ({ getInvoices:  mockGetInvoices, putInvoice: mockPutInvoice })); 

    const { getByText } = subject();

    await waitFor(() => {
      expect(getByText('Set paid')).toBeInTheDocument();
    });
    
    await getByText('Set paid').click();
    
    await waitFor(() => {
      expect(mockPutInvoice).toHaveBeenCalledWith({ id: 3 }, { invoice: { paid: true } });
    });
  });
});