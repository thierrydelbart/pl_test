import { Customer, Invoice } from "types";

export const customer_1: Customer = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  address: '123 Main St',
  city: 'Springfield',
  country: 'USA',
  country_code: 'US',
  zip_code: '12345'
}

export const customer_2: Customer = {
  id: 2,
  first_name: 'Jane',
  last_name: 'Doe',
  address: '123 Main St',
  city: 'Springfield',
  country: 'USA',
  country_code: 'US',
  zip_code: '12345'
}

export const customer_3: Customer = {
  id: 3,
  first_name: 'Alice',
  last_name: 'Smith',
  address: '123 Main St',
  city: 'Springfield',
  country: 'USA',
  country_code: 'US',
  zip_code: '12345'
}

export const invoice_1: Invoice = {
  id: 1,
  customer: customer_1,
  customer_id: customer_1.id,
  total: '100',
  finalized: false,
  paid: false,
  date: '2021-01-01',
  deadline: '2021-01-31',
  tax: '10',
  invoice_lines: []
}

export const invoice_2: Invoice = {
  id: 2,
  customer: customer_2,
  customer_id: customer_2.id,
  total: '200',
  finalized: true,
  paid: true,
  date: '2021-02-01',
  deadline: '2021-02-28',
  tax: '20',
  invoice_lines: []
}

export const invoice_3: Invoice = {
  id: 3,
  customer: customer_3,
  customer_id: customer_3.id,
  total: '300',
  finalized: false,
  paid: true,
  date: '2021-03-01',
  deadline: '2021-03-31',
  tax: '30',
  invoice_lines: []
}