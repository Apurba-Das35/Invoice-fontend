/* eslint-disable react-hooks/purity */
'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, CreditCard, PlusCircle, Star, Trash2, PencilLine } from 'lucide-react';
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
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { createPaymentMethod, deletePaymentMethod, setDefaultPaymentMethod, updatePaymentMethod, type PaymentMethod, type PaymentProvider } from '@/src/redux/slices/paymentsSlice';

const paymentSchema = z.object({
  providerName: z.enum(['Bank', 'Wise', 'PayPal', 'Payoneer']),
  accountHolder: z.string().min(2, 'Account holder is required'),
  accountNumber: z.string().min(3, 'Account number is required'),
  swiftIban: z.string().optional(),
  isDefault: z.boolean(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

const providerOptions: PaymentProvider[] = ['Bank', 'Wise', 'PayPal', 'Payoneer'];

export default function PaymentsPage() {
  const businesses = useAppSelector((state) => state.businesses.items);
  const activeBusinessId = useAppSelector((state) => state.businesses.activeBusinessId);
  const payments = useAppSelector((state) => state.payments.items);
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      providerName: 'Bank',
      accountHolder: '',
      accountNumber: '',
      swiftIban: '',
      isDefault: false,
    },
  });

  const resetForm = () => {
    form.reset({
      providerName: 'Bank',
      accountHolder: '',
      accountNumber: '',
      swiftIban: '',
      isDefault: false,
    });
    setEditingPayment(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpen(true);
  };

  const handleOpenEdit = (payment: PaymentMethod) => {
    setEditingPayment(payment);
    form.reset({
      providerName: payment.providerName,
      accountHolder: payment.accountHolder,
      accountNumber: payment.accountNumber,
      swiftIban: payment.swiftIban,
      isDefault: payment.isDefault,
    });
    setOpen(true);
  };

  const handleSubmit = (values: PaymentFormValues) => {
    const payload: PaymentMethod = {
      id: editingPayment?.id ?? `payment-${Date.now()}`,
      businessId: editingPayment?.businessId ?? activeBusinessId ?? businesses[0]?.id ?? 'biz-1',
      ...values,
      swiftIban: values.swiftIban ?? '',
    };

    if (editingPayment) {
      dispatch(updatePaymentMethod(payload));
    } else {
      dispatch(createPaymentMethod(payload));
    }

    setOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    dispatch(deletePaymentMethod(id));
  };

  const handleSetDefault = (id: string) => {
    dispatch(setDefaultPaymentMethod(id));
  };

  const businessPayments = useMemo(() => {
    return payments.filter((payment) => payment.businessId === (activeBusinessId ?? businesses[0]?.id));
  }, [activeBusinessId, businesses, payments]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Payment Methods</h2>
          <p className="mt-2 text-sm text-slate-400">Manage payout destinations for the active business context.</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Payment Method
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {businessPayments.map((payment) => (
          <Card key={payment.id} className="border border-white/10 bg-slate-900/80">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="text-white">{payment.providerName}</CardTitle>
                <p className="text-sm text-slate-400">{payment.accountHolder}</p>
              </div>
              {payment.isDefault ? (
                <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-300">
                  Default
                </div>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-400">
              <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Account</p>
                <p className="mt-1 text-slate-200">{payment.accountNumber}</p>
                {payment.swiftIban ? <p className="mt-1">SWIFT / IBAN: {payment.swiftIban}</p> : null}
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {!payment.isDefault ? (
                  <Button onClick={() => handleSetDefault(payment.id)} variant="secondary" className="gap-2">
                    <Star className="h-4 w-4" />
                    Set Default
                  </Button>
                ) : null}
                <Button onClick={() => handleOpenEdit(payment)} variant="secondary" className="gap-2">
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
                      <AlertDialogTitle>Delete this payment method?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove the provider credential from the current business profile.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(payment.id)}>Delete</AlertDialogAction>
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
            <DialogTitle>{editingPayment ? 'Edit Payment Method' : 'Add Payment Method'}</DialogTitle>
            <DialogDescription>Configure payout destinations for invoices created under the active business.</DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="providerName">Provider</Label>
              <Select id="providerName" {...form.register('providerName')}>
                {providerOptions.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountHolder">Account Holder</Label>
              <Input id="accountHolder" {...form.register('accountHolder')} />
              {form.formState.errors.accountHolder ? <p className="text-sm text-rose-400">{form.formState.errors.accountHolder.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number / Identifier</Label>
              <Input id="accountNumber" {...form.register('accountNumber')} />
              {form.formState.errors.accountNumber ? <p className="text-sm text-rose-400">{form.formState.errors.accountNumber.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="swiftIban">SWIFT / IBAN (Optional)</Label>
              <Input id="swiftIban" {...form.register('swiftIban')} />
            </div>
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-800/70 px-3 py-3 text-sm text-slate-300">
              <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-slate-950" {...form.register('isDefault')} />
              Set as default payment method
            </label>

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => { setOpen(false); resetForm(); }}>
                Cancel
              </Button>
              <Button type="submit">Save Payment Method</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
