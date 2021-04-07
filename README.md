# jean_test_front

This repository contains the guidelines for the frontend interview question, as well as a repository skeleton with which to start.

## Problem statement

> ***Implement an invoice editor with React***


## Objectives

The goal is to use the provided API to build the prototype of an invoice editor.
This prototype will contain pages to list, create, edit, delete and finalize invoices.

We will pay attention to code quality and user experiance. We will NOT pay attention to UI.
We expect you to identify two advanced features which could be useful for an invoice editor. For each feature, we ask for:
- an explanation of when this feature could be useful
- a prototype implementation (feel free to work around API limitations)
- your thoughts for a better / more robust implementation

## Deliverable

- source code on a private GitHub repository (please invite @quentindemetz and @tdeo) or in a zip file
- the application hosted on a personal server or on Heroku.

You MUST use:
- bootstrap as UI library
- [react-bootstrap](https://react-bootstrap.github.io/) for bootstrap's javascript components to avoid using jquery

You must NOT use:
- a state management library (e.g. Redux)

## Data model

The prototype will interact with 4 entities:
- `customers`: the list of customers,
- `products`: the list of available products,
- `invoices`: the list of existing invoices,
  - point of attention, once the `finalized` field is set to `true`, no field may be modified except for `paid`.
- `invoice_lines`: the lines of an invoice.


## API

The API is available at this URL: https://jean-test-api.herokuapp.com/. To use it, you must send the authorization token in the `X-SESSION` header (contact thierry@pennylane.tech if needed).

Point of attention :
- invoice lines are accessed via their invoice. To update them, use the relevant invoice API methods, as described in the Invoice API documentation (e.g. https://jean-test-api.herokuapp.com/apipie/1.0/invoices/update.html)

The API codebase is available [here](https://github.com/pennylane-hq/jean_test_api) if you want to have a look.

## Repository contents

This repository has been initialized with [create-react-app](https://github.com/facebook/create-react-app). It is to be used as a starting point for developing the prototype.

A set of packages has been included in [package.json](./package.json), please feel free to use them. Their usage is optional; you are not expected to learn any new libraries for this test.

As much as possible, please avoid introducing new dependencies - if you find this necessary, please explain why.
