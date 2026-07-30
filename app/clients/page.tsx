/* eslint-disable react-hooks/purity */
'use client';

import { useMemo, useState } from 'react';
import { PlusCircle, Search, Trash2, PencilLine } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { createClient, deleteClient, updateClient, type Client } from '@/src/redux/slices/clientsSlice';

const clientSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  contactPerson: z.string().min(2, 'Contact person is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(5, 'Phone is required'),
  billingAddress: z.string().min(5, 'Billing address is required'),
  vatNumber: z.string().min(3, 'VAT number is required'),
  notes: z.string().min(1, 'Notes are required'),
});

type ClientFormValues = z.infer<typeof clientSchema>;

export default function ClientsPage() {
  const businesses = useAppSelector((state) => state.businesses.items);
  const activeBusinessId = useAppSelector((state) => state.businesses.activeBusinessId);
  const clients = useAppSelector((state) => state.clients.items);
  const dispatch = useAppDispatch();

  const [search, setSearch] = useState('');
  const [businessFilter, setBusinessFilter] = useState<string>('all');
  const [open, setOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      billingAddress: '',
      vatNumber: '',
      notes: '',
    },
  });

  const resetForm = () => {
    form.reset({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      billingAddress: '',
      vatNumber: '',
      notes: '',
    });
    setEditingClient(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    form.reset({
      companyName: client.companyName,
      contactPerson: client.contactPerson,
      email: client.email,
      phone: client.phone,
      billingAddress: client.billingAddress,
      vatNumber: client.vatNumber,
      notes: client.notes,
    });
    setOpen(true);
  };

  const handleSubmit = (values: ClientFormValues) => {
    const payload: Client = {
      id: editingClient?.id ?? `client-${Date.now()}`,
      businessId: editingClient?.businessId ?? activeBusinessId ?? businesses[0]?.id ?? 'business-1',
      ...values,
    };

    if (editingClient) {
      dispatch(updateClient(payload));
    } else {
      dispatch(createClient(payload));
    }

    setOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    dispatch(deleteClient(id));
  };

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesBusiness = businessFilter === 'all' || client.businessId === businessFilter;
      const query = search.toLowerCase();
      const matchesSearch =
        client.companyName.toLowerCase().includes(query) || client.contactPerson.toLowerCase().includes(query);
      return matchesBusiness && matchesSearch;
    });
  }, [businessFilter, clients, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Client Management</h2>
          <p className="mt-2 text-sm text-slate-400">Keep your client roster organized for each connected business.</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-900/70 p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by company or contact"
            className="pl-9"
          />
        </div>
        <Select value={businessFilter} onChange={(event) => setBusinessFilter(event.target.value)} className="md:max-w-56">
          <option value="all">All businesses</option>
          {businesses.map((business) => (
            <option key={business.id} value={business.id}>
              {business.companyName}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {filteredClients.map((client) => {
          const business = businesses.find((item) => item.id === client.businessId);
          return (
            <Card key={client.id} className="border border-white/10 bg-slate-900/80">
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-white">{client.companyName}</CardTitle>
                  <p className="text-sm text-slate-400">{client.contactPerson}</p>
                </div>
                <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-300">
                  {business?.companyName ?? 'Business'}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-400">
                <div className="grid gap-2">
                  <p>Email: {client.email}</p>
                  <p>Phone: {client.phone}</p>
                  <p>VAT: {client.vatNumber}</p>
                  <p>Address: {client.billingAddress}</p>
                  <p>Notes: {client.notes}</p>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button onClick={() => handleOpenEdit(client)} variant="secondary" className="gap-2">
                    <PencilLine className="h-4 w-4" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this client?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove {client.companyName} from the selected business context.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(client.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={(value) => {
        setOpen(value);
        if (!value) resetForm();
      }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingClient ? 'Edit Client' : 'Add Client'}</DialogTitle>
            <DialogDescription>Store the client details needed for future invoices and billing communication.</DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" {...form.register('companyName')} />
                {form.formState.errors.companyName ? <p className="text-sm text-rose-400">{form.formState.errors.companyName.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input id="contactPerson" {...form.register('contactPerson')} />
                {form.formState.errors.contactPerson ? <p className="text-sm text-rose-400">{form.formState.errors.contactPerson.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register('email')} />
                {form.formState.errors.email ? <p className="text-sm text-rose-400">{form.formState.errors.email.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...form.register('phone')} />
                {form.formState.errors.phone ? <p className="text-sm text-rose-400">{form.formState.errors.phone.message}</p> : null}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="billingAddress">Billing Address</Label>
                <Textarea id="billingAddress" {...form.register('billingAddress')} />
                {form.formState.errors.billingAddress ? <p className="text-sm text-rose-400">{form.formState.errors.billingAddress.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="vatNumber">VAT Number</Label>
                <Input id="vatNumber" {...form.register('vatNumber')} />
                {form.formState.errors.vatNumber ? <p className="text-sm text-rose-400">{form.formState.errors.vatNumber.message}</p> : null}
              </div>
              <div className="space-y-1">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" {...form.register('notes')} />
                {form.formState.errors.notes ? <p className="text-sm text-rose-400">{form.formState.errors.notes.message}</p> : null}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => { setOpen(false); resetForm(); }}>
                Cancel
              </Button>
              <Button type="submit">Save Client</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
