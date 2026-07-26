/* eslint-disable react-hooks/purity */
'use client';

import { useMemo, useState } from 'react';
import { Building2, Globe2, Mail, PencilLine, Phone, PlusCircle, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { createBusiness, deleteBusiness, updateBusiness, type Business } from '@/src/redux/slices/businessesSlice';

const businessSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  logo: z.string().url('Enter a valid URL').or(z.string().min(1, 'Logo is required')),
  contactPerson: z.string().min(2, 'Contact person is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(5, 'Phone is required'),
  website: z.string().min(2, 'Website is required'),
  address: z.string().min(5, 'Address is required'),
  vat: z.string().min(3, 'VAT / Tax ID is required'),
  defaultCurrency: z.string().min(1, 'Currency is required'),
});

type BusinessFormValues = z.infer<typeof businessSchema>;

const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];

export default function BusinessesPage() {
  const businesses = useAppSelector((state) => state.businesses.items);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      companyName: '',
      logo: '',
      contactPerson: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      vat: '',
      defaultCurrency: 'USD',
    },
  });

  const resetForm = () => {
    form.reset({
      companyName: '',
      logo: '',
      contactPerson: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      vat: '',
      defaultCurrency: 'USD',
    });
    setEditingBusiness(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpen(true);
  };

  const handleOpenEdit = (business: Business) => {
    setEditingBusiness(business);
    form.reset({
      companyName: business.companyName,
      logo: business.logo,
      contactPerson: business.contactPerson,
      email: business.email,
      phone: business.phone,
      website: business.website,
      address: business.address,
      vat: business.vat,
      defaultCurrency: business.defaultCurrency,
    });
    setOpen(true);
  };

  const handleSubmit = (values: BusinessFormValues) => {
    const payload: Business = {
      id: editingBusiness?.id ?? `biz-${Date.now()}`,
      ...values,
    };

    if (editingBusiness) {
      dispatch(updateBusiness(payload));
    } else {
      dispatch(createBusiness(payload));
    }

    setOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    dispatch(deleteBusiness(id));
  };

  const businessCountLabel = useMemo(() => `${businesses.length} configured business${businesses.length === 1 ? '' : 'es'}`, [businesses.length]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Business Management</h2>
          <p className="mt-2 text-sm text-slate-400">Manage your organization profiles, contacts, and billing defaults.</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Business
        </Button>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-400">
        {businessCountLabel}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {businesses.map((business) => (
          <Card key={business.id} className="border border-white/10 bg-slate-900/80">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/15 text-sm font-semibold text-cyan-300">
                  {business.logo?.slice(0, 2).toUpperCase() || 'BS'}
                </div>
                <div>
                  <CardTitle className="text-white">{business.companyName}</CardTitle>
                  <p className="text-sm text-slate-400">{business.email}</p>
                </div>
              </div>
              <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">
                {business.defaultCurrency}
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-400">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-500" />{business.phone}</div>
                <div className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-slate-500" />{business.website}</div>
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-500" />{business.contactPerson}</div>
                <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-slate-500" />{business.vat}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Address</p>
                <p className="mt-1 text-slate-300">{business.address}</p>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button onClick={() => handleOpenEdit(business)} variant="secondary" className="gap-2">
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
                      <AlertDialogTitle>Delete this business?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will remove {business.companyName} from your workspace and cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(business.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={(value) => {
        setOpen(value);
        if (!value) resetForm();
      }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBusiness ? 'Edit Business' : 'Add Business'}</DialogTitle>
            <DialogDescription>Capture the core business profile needed for invoices and billing workflows.</DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" {...form.register('companyName')} />
                {form.formState.errors.companyName ? <p className="text-sm text-rose-400">{form.formState.errors.companyName.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input id="logo" placeholder="https://example.com/logo.png" {...form.register('logo')} />
                {form.formState.errors.logo ? <p className="text-sm text-rose-400">{form.formState.errors.logo.message}</p> : null}
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
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" {...form.register('website')} />
                {form.formState.errors.website ? <p className="text-sm text-rose-400">{form.formState.errors.website.message}</p> : null}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" {...form.register('address')} />
                {form.formState.errors.address ? <p className="text-sm text-rose-400">{form.formState.errors.address.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="vat">VAT / Tax ID</Label>
                <Input id="vat" {...form.register('vat')} />
                {form.formState.errors.vat ? <p className="text-sm text-rose-400">{form.formState.errors.vat.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultCurrency">Default Currency</Label>
                <select id="defaultCurrency" className="flex h-10 w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white" {...form.register('defaultCurrency')}>
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
                {form.formState.errors.defaultCurrency ? <p className="text-sm text-rose-400">{form.formState.errors.defaultCurrency.message}</p> : null}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => { setOpen(false); resetForm(); }}>
                Cancel
              </Button>
              <Button type="submit">Save Business</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
