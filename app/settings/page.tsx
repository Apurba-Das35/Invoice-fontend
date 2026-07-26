'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { setDefaultCurrency, setDefaultPaymentMethodId, setInvoicePrefix } from '@/src/redux/slices/settingsSlice';

const currencyOptions = ['USD', 'EUR', 'BDT', 'GBP'];

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);
  const payments = useAppSelector((state) => state.payments.items);

  const [invoicePrefix, setInvoicePrefixValue] = useState(settings.invoicePrefix);
  const [defaultCurrency, setDefaultCurrencyValue] = useState(settings.defaultCurrency);
  const [defaultPaymentMethodId, setDefaultPaymentMethodValue] = useState(settings.defaultPaymentMethodId);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    dispatch(setInvoicePrefix(invoicePrefix));
    dispatch(setDefaultCurrency(defaultCurrency));
    dispatch(setDefaultPaymentMethodId(defaultPaymentMethodId));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
        <h2 className="text-xl font-semibold text-white">Settings</h2>
        <p className="mt-2 text-sm text-slate-400">Configure global invoice defaults and payment preferences.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border border-white/10 bg-slate-900/80">
          <CardHeader>
            <CardTitle className="text-lg text-white">Global Defaults</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
              <Input id="invoicePrefix" value={invoicePrefix} onChange={(event) => setInvoicePrefixValue(event.target.value)} placeholder="INV" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select id="currency" value={defaultCurrency} onChange={(event) => setDefaultCurrencyValue(event.target.value)}>
                {currencyOptions.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Default Payment Method</Label>
              <Select id="paymentMethod" value={defaultPaymentMethodId} onChange={(event) => setDefaultPaymentMethodValue(event.target.value)}>
                {payments.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.providerName} · {method.accountHolder}
                  </option>
                ))}
              </Select>
            </div>
            <Button onClick={handleSave} className="w-full">
              Save Changes
            </Button>
            {saved ? (
              <div className="flex items-center gap-2 text-sm text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                Settings saved successfully.
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-slate-900/80">
          <CardHeader>
            <CardTitle className="text-lg text-white">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {payments.map((method) => (
                <div key={method.id} className="rounded-2xl border border-white/10 bg-slate-800/70 p-3 text-sm text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="text-white">{method.providerName}</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-cyan-300">{method.isDefault ? 'Default' : 'Secondary'}</span>
                  </div>
                  <p className="mt-1">{method.accountHolder}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
