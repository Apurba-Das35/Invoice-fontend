import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
export type TaxMode = 'percentage' | 'fixed';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  businessId: string;
  clientId: string;
  currency: string;
  lineItems: InvoiceLineItem[];
  paymentMethodId: string;
  notes: string;
  taxMode: TaxMode;
  taxValue: number;
  status: InvoiceStatus;
  subtotal: number;
  tax: number;
  grandTotal: number;
}

interface InvoicesState {
  items: Invoice[];
}

const initialState: InvoicesState = {
  items: [
    {
      id: 'invoice-1',
      invoiceNumber: 'INV-1001',
      issueDate: '2026-07-01',
      dueDate: '2026-07-15',
      businessId: 'biz-1',
      clientId: 'client-1',
      currency: 'USD',
      lineItems: [
        { id: 'line-1', description: 'Brand Strategy Workshop', quantity: 1, unitPrice: 2400 },
        { id: 'line-2', description: 'Design Systems Audit', quantity: 1, unitPrice: 1800 },
      ],
      paymentMethodId: 'payment-1',
      notes: 'Priority client',
      taxMode: 'percentage',
      taxValue: 10,
      status: 'Sent',
      subtotal: 4200,
      tax: 420,
      grandTotal: 4620,
    },
    {
      id: 'invoice-2',
      invoiceNumber: 'INV-1002',
      issueDate: '2026-07-10',
      dueDate: '2026-07-25',
      businessId: 'biz-2',
      clientId: 'client-2',
      currency: 'EUR',
      lineItems: [
        { id: 'line-3', description: 'Product Launch Assets', quantity: 3, unitPrice: 650 },
      ],
      paymentMethodId: 'payment-2',
      notes: 'Due on receipt',
      taxMode: 'percentage',
      taxValue: 10,
      status: 'Paid',
      subtotal: 1950,
      tax: 195,
      grandTotal: 2145,
    },
  ],
};

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    createInvoice: (state, action: PayloadAction<Invoice>) => {
      state.items.push(action.payload);
    },
    updateInvoice: (state, action: PayloadAction<Invoice>) => {
      const index = state.items.findIndex((invoice) => invoice.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteInvoice: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((invoice) => invoice.id !== action.payload);
    },
    updateInvoiceStatus: (state, action: PayloadAction<{ id: string; status: InvoiceStatus }>) => {
      const invoice = state.items.find((item) => item.id === action.payload.id);
      if (invoice) {
        invoice.status = action.payload.status;
      }
    },
    duplicateInvoice: (state, action: PayloadAction<string>) => {
      const invoice = state.items.find((item) => item.id === action.payload);
      if (!invoice) {
        return;
      }

      const duplicatedInvoice: Invoice = {
        ...invoice,
        id: `${invoice.id}-copy-${Date.now()}`,
        invoiceNumber: `${invoice.invoiceNumber}-COPY`,
        status: 'Draft',
      };

      state.items.push(duplicatedInvoice);
    },
  },
});

export const { createInvoice, updateInvoice, deleteInvoice, updateInvoiceStatus, duplicateInvoice } = invoicesSlice.actions;
export default invoicesSlice.reducer;
