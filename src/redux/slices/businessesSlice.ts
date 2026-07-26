import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Business {
  id: string;
  companyName: string;
  logo: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  vat: string;
  defaultCurrency: string;
}

interface BusinessesState {
  items: Business[];
  activeBusinessId: string | null;
}

const initialState: BusinessesState = {
  items: [
    {
      id: 'biz-1',
      companyName: 'Northstar Studio',
      logo: 'NS',
      contactPerson: 'Adele Brooks',
      email: 'adele@northstarstudio.com',
      phone: '+1 415 555 0147',
      website: 'northstarstudio.com',
      address: '240 Market Street, San Francisco, CA',
      vat: 'US-987654321',
      defaultCurrency: 'USD',
    },
    {
      id: 'biz-2',
      companyName: 'Lumen Labs',
      logo: 'LL',
      contactPerson: 'Mina Patel',
      email: 'mina@lumenlabs.io',
      phone: '+44 20 7946 0958',
      website: 'lumenlabs.io',
      address: '12 Clerkenwell Road, London',
      vat: 'GB-123456789',
      defaultCurrency: 'EUR',
    },
  ],
  activeBusinessId: 'biz-1',
};

const businessesSlice = createSlice({
  name: 'businesses',
  initialState,
  reducers: {
    setActiveBusiness: (state, action: PayloadAction<string>) => {
      state.activeBusinessId = action.payload;
    },
    createBusiness: (state, action: PayloadAction<Business>) => {
      state.items.push(action.payload);
      state.activeBusinessId = action.payload.id;
    },
    updateBusiness: (state, action: PayloadAction<Business>) => {
      const index = state.items.findIndex((business) => business.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteBusiness: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((business) => business.id !== action.payload);
      if (state.activeBusinessId === action.payload) {
        state.activeBusinessId = state.items[0]?.id ?? null;
      }
    },
  },
});

export const { setActiveBusiness, createBusiness, updateBusiness, deleteBusiness } = businessesSlice.actions;
export default businessesSlice.reducer;
