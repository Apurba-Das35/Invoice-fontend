import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Client {
  id: string;
  businessId: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  billingAddress: string;
  vatNumber: string;
  notes: string;
}

interface ClientsState {
  items: Client[];
}

const initialState: ClientsState = {
  items: [
    {
      id: 'client-1',
      businessId: 'biz-1',
      companyName: 'Brightlane Media',
      contactPerson: 'Jordan Lee',
      email: 'jordan@brightlane.co',
      phone: '+1 415 555 0174',
      billingAddress: '100 First Ave, New York, NY',
      vatNumber: 'US-445566778',
      notes: 'Prefers quarterly billing',
    },
    {
      id: 'client-2',
      businessId: 'biz-2',
      companyName: 'Harbor & Co',
      contactPerson: 'Nadia Noor',
      email: 'nadia@harborco.uk',
      phone: '+44 20 7946 0110',
      billingAddress: '55 Baker Street, London',
      vatNumber: 'GB-998877665',
      notes: 'Needs PDF invoices',
    },
  ],
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    createClient: (state, action: PayloadAction<Client>) => {
      state.items.push(action.payload);
    },
    updateClient: (state, action: PayloadAction<Client>) => {
      const index = state.items.findIndex((client) => client.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteClient: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((client) => client.id !== action.payload);
    },
  },
});

export const { createClient, updateClient, deleteClient } = clientsSlice.actions;
export default clientsSlice.reducer;
