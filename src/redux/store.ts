import { configureStore } from '@reduxjs/toolkit';
import businessesReducer from './slices/businessesSlice';
import clientsReducer from './slices/clientsSlice';
import paymentsReducer from './slices/paymentsSlice';
import invoicesReducer from './slices/invoicesSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    businesses: businessesReducer,
    clients: clientsReducer,
    payments: paymentsReducer,
    invoices: invoicesReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
