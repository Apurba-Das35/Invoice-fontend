import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { InvoiceStatus } from './invoicesSlice';

export interface InvoiceFilterState {
  query: string;
  status: 'All' | InvoiceStatus;
  businessId: string;
  startDate: string;
  endDate: string;
}

export interface SettingsState {
  invoicePrefix: string;
  defaultCurrency: string;
  defaultPaymentMethodId: string;
  invoiceFilters: InvoiceFilterState;
}

const initialState: SettingsState = {
  invoicePrefix: 'INV',
  defaultCurrency: 'USD',
  defaultPaymentMethodId: 'payment-1',
  invoiceFilters: {
    query: '',
    status: 'All',
    businessId: 'all',
    startDate: '',
    endDate: '',
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setInvoicePrefix: (state, action: PayloadAction<string>) => {
      state.invoicePrefix = action.payload;
    },
    setDefaultCurrency: (state, action: PayloadAction<string>) => {
      state.defaultCurrency = action.payload;
    },
    setDefaultPaymentMethodId: (state, action: PayloadAction<string>) => {
      state.defaultPaymentMethodId = action.payload;
    },
    setInvoiceFilters: (state, action: PayloadAction<InvoiceFilterState>) => {
      state.invoiceFilters = action.payload;
    },
  },
});

export const { setInvoicePrefix, setDefaultCurrency, setDefaultPaymentMethodId, setInvoiceFilters } = settingsSlice.actions;
export default settingsSlice.reducer;
