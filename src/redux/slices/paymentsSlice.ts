import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type PaymentProvider = 'Bank' | 'Wise' | 'PayPal' | 'Payoneer';

export interface PaymentMethod {
  id: string;
  businessId: string;
  providerName: PaymentProvider;
  accountHolder: string;
  accountNumber: string;
  swiftIban: string;
  isDefault: boolean;
}

interface PaymentsState {
  items: PaymentMethod[];
}

const initialState: PaymentsState = {
  items: [
    {
      id: 'payment-1',
      businessId: 'biz-1',
      providerName: 'Bank',
      accountHolder: 'Northstar Studio LLC',
      accountNumber: '1234567890',
      swiftIban: 'USAB445566',
      isDefault: true,
    },
    {
      id: 'payment-2',
      businessId: 'biz-2',
      providerName: 'Wise',
      accountHolder: 'Lumen Labs Ltd',
      accountNumber: 'GB12-4567-8901',
      swiftIban: 'TRWIGB2L',
      isDefault: true,
    },
  ],
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    createPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.items.push(action.payload);
    },
    updatePaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      const index = state.items.findIndex((payment) => payment.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deletePaymentMethod: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((payment) => payment.id !== action.payload);
    },
    setDefaultPaymentMethod: (state, action: PayloadAction<string>) => {
      state.items = state.items.map((payment) => ({
        ...payment,
        isDefault: payment.id === action.payload,
      }));
    },
  },
});

export const { createPaymentMethod, updatePaymentMethod, deletePaymentMethod, setDefaultPaymentMethod } = paymentsSlice.actions;
export default paymentsSlice.reducer;
