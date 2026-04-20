# User Manual (Role-Based)

This is a quick guide for using the Bureaucracy Automation Portal.

## Portal Access

1. Open the frontend URL in your browser (for local setup, usually `http://localhost:5173`).
2. Log in with your credentials.
3. Select your role on the login screen (as applicable).

> Important: The backend API server must be running for login and dashboard actions to work.

---

## Roles and Features

## 1) Admin

### Access
- Login as role: `admin`
- Lands on: Admin Dashboard

### Available Features
- View all queries in the admin queue.
- Open a query and view details:
  - query text
  - company
  - department
  - status
  - company response (for resolved/rejected cases)
- Update query department.
- Open **User Management** from navbar and create users:
  - customer
  - company
  - operator
  - admin

---

## 2) Operator

### Access
- Login as role: `operator`
- Lands on: Admin Dashboard (operator-scoped view)

### Available Features
- View only operator-allowed queries.
- Open a query and review details.
- Forward query to company with:
  - company name
  - forwarding message

---

## 3) Company

### Access
- Login as role: `company`
- Lands on: Company Dashboard

### Available Features
- View queries assigned to the company.
- Respond to each query from the dashboard:
  - `resolve` with company response
  - `reject` with company response
- Track status updates in the list.

---

## 4) Customer

### Access
- Login as role: `customer`
- Lands on: Customer Dashboard

### Available Features
- View your raised queries.
- Use chatbot flow to raise a query:
  - click **Raise a Query** (when allowed)
  - select state
  - select company
  - submit query text
- Raise Query availability rule:
  - allowed if no query exists, or no query is in `PENDING`
  - blocked if an active `PENDING` query exists

---

## Common Feature (All Roles)

- **Logout** button is available in the navbar for all dashboards.

---

## Test Credentials (Highlighted)

> **Use these credentials for role-wise testing in the portal.**

## Admin

- **Email:** `consumer_admin@gmail.com`  
- **Password:** `harsh1234`

## Companies

> **All company passwords:** `company123`

- `navient.ops@gmail.com` (Navient Solutions, Inc.)
- `wellsfargo.ops@gmail.com` (Wells Fargo & Company)
- `capitalone.ops@gmail.com` (Capital One)
- `jpmorgan.ops@gmail.com` (JPMorgan Chase & Co.)
- `amex.ops@gmail.com` (Amex)

## Operators

> **All operator passwords:** `operator123`

- `operator.loans@gmail.com` (Loans)
- `operator.cards@gmail.com` (Credit Card)
- `operator.payments@gmail.com` (Payments)

## Customers

> **All customer passwords:** `pass1234`

- `aarav.sharma01@gmail.com`
- `isha.verma02@gmail.com`
- `rohan.mehta03@gmail.com`
- `neha.singh04@gmail.com`

