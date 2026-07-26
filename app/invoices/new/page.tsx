'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PlusCircle, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { createInvoice, updateInvoice, updateInvoiceStatus, type Invoice, type InvoiceLineItem, type InvoiceStatus, type TaxMode } from '@/src/redux/slices/invoicesSlice';
import { AIGenerateInvoiceModal, type AIInvoiceDraft } from '@/src/components/ai/AIGenerateInvoiceModal';

const defaultLineItem = (): InvoiceLineItem => ({
  id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  description: '',
  quantity: 1,
  unitPrice: 0,
});

const currencyOptions = ['USD', 'EUR', 'GBP'];
const taxModes: TaxMode[] = ['percentage', 'fixed'];
const statusOptions: InvoiceStatus[] = ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'];

function InvoiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const businesses = useAppSelector((state) => state.businesses.items);
  const activeBusinessId = useAppSelector((state) => state.businesses.activeBusinessId);
  const clients = useAppSelector((state) => state.clients.items);
  const payments = useAppSelector((state) => state.payments.items);
  const settings = useAppSelector((state) => state.settings);
  const invoices = useAppSelector((state) => state.invoices.items);

  const editingId = searchParams.get('id');
  const editingInvoice = invoices.find((invoice) => invoice.id === editingId) ?? null;

  const [businessId, setBusinessId] = useState(editingInvoice?.businessId ?? activeBusinessId ?? businesses[0]?.id ?? '');
  const [clientId, setClientId] = useState(editingInvoice?.clientId ?? '');
  const [invoiceNumber, setInvoiceNumber] = useState(editingInvoice?.invoiceNumber ?? `${settings.invoicePrefix}-1001`);
  const [issueDate, setIssueDate] = useState(editingInvoice?.issueDate ?? new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState(editingInvoice?.dueDate ?? new Date().toISOString().slice(0, 10));
  const [currency, setCurrency] = useState(editingInvoice?.currency ?? settings.defaultCurrency);
  const [paymentMethodId, setPaymentMethodId] = useState(editingInvoice?.paymentMethodId ?? payments.find((payment) => payment.businessId === businessId && payment.isDefault)?.id ?? '');
  const [notes, setNotes] = useState(editingInvoice?.notes ?? '');
  const [taxMode, setTaxMode] = useState<TaxMode>(editingInvoice?.taxMode ?? 'percentage');
  const [taxValue, setTaxValue] = useState(editingInvoice?.taxValue ?? 10);
  const [status, setStatus] = useState<InvoiceStatus>(editingInvoice?.status ?? 'Draft');
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>(editingInvoice?.lineItems?.length ? editingInvoice.lineItems : [defaultLineItem()]);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  useEffect(() => {
    if (editingInvoice) {
      setBusinessId(editingInvoice.businessId);
      setClientId(editingInvoice.clientId);
      setInvoiceNumber(editingInvoice.invoiceNumber);
      setIssueDate(editingInvoice.issueDate);
      setDueDate(editingInvoice.dueDate);
      setCurrency(editingInvoice.currency);
      setPaymentMethodId(editingInvoice.paymentMethodId);
      setNotes(editingInvoice.notes);
      setTaxMode(editingInvoice.taxMode);
      setTaxValue(editingInvoice.taxValue);
      setStatus(editingInvoice.status);
      setLineItems(editingInvoice.lineItems);
    }
  }, [editingInvoice]);

  useEffect(() => {
    setPaymentMethodId((current) => current || payments.find((payment) => payment.businessId === businessId && payment.isDefault)?.id || '');
  }, [businessId, payments]);

  const filteredClients = useMemo(() => clients.filter((client) => client.businessId === businessId), [businessId, clients]);
  const businessPayments = useMemo(() => payments.filter((payment) => payment.businessId === businessId), [businessId, payments]);

  const subtotal = useMemo(
    () => lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [lineItems],
  );

  const tax = useMemo(() => {
    if (taxMode === 'fixed') {
      return taxValue;
    }
    return subtotal * (taxValue / 100);
  }, [subtotal, taxMode, taxValue]);

  const grandTotal = subtotal + tax;

  const handleLineItemChange = (id: string, field: keyof InvoiceLineItem, value: string | number) => {
    setLineItems((current) => current.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const addLineItem = () => {
    setLineItems((current) => [...current, defaultLineItem()]);
  };

  const removeLineItem = (id: string) => {
    setLineItems((current) => current.filter((item) => item.id !== id));
  };

  const handleSave = (nextStatus: InvoiceStatus) => {
    const normalizedLineItems = lineItems.map((item) => ({
      ...item,
      quantity: Number(item.quantity) || 0,
      unitPrice: Number(item.unitPrice) || 0,
    }));

    const payload: Invoice = {
      id: editingInvoice?.id ?? `invoice-${Date.now()}`,
      invoiceNumber,
      issueDate,
      dueDate,
      businessId,
      clientId,
      currency,
      lineItems: normalizedLineItems,
      paymentMethodId,
      notes,
      taxMode,
      taxValue,
      status: nextStatus,
      subtotal,
      tax,
      grandTotal,
    };

    if (editingInvoice) {
      dispatch(updateInvoice(payload));
    } else {
      dispatch(createInvoice(payload));
    }

    if (nextStatus === 'Paid') {
      dispatch(updateInvoiceStatus({ id: payload.id, status: 'Paid' }));
    }

    router.push('/invoices');
  };

  const handleApplyAI = (draft: AIInvoiceDraft) => {
    const nextClient = clients.find((client) => client.companyName.toLowerCase() === draft.clientCompany.toLowerCase());
    if (nextClient) {
      setClientId(nextClient.id);
    }

    setInvoiceNumber(draft.invoiceNumber);
    setCurrency(draft.currency);
    setNotes(draft.notes);
    setTaxMode(draft.taxMode);
    setTaxValue(draft.taxValue);
    setLineItems(draft.lineItems.map((item, index) => ({ ...item, id: `ai-${index}` })));
    setBusinessId(draft.businessId || businessId);
  };

  const currencySymbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

  return (
    <>
      <AIGenerateInvoiceModal open={aiModalOpen} onOpenChange={setAiModalOpen} onApply={handleApplyAI} />
      <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">{editingInvoice ? 'Edit Invoice' : 'Create Invoice'}</h2>
          <p className="mt-2 text-sm text-slate-400">Build a polished invoice with line items, payment details, and real-time totals.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={() => setAiModalOpen(true)} className="gap-2">
            <Sparkles className="h-4 w-4" />
            AI Generate
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/invoices')}>
            Cancel
          </Button>
          <Button type="button" onClick={() => handleSave('Draft')} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Save Draft
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <Card className="border border-white/10 bg-slate-900/80">
          <CardHeader>
            <CardTitle className="text-lg text-white">Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input id="invoiceNumber" value={invoiceNumber} onChange={(event) => setInvoiceNumber(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select id="currency" value={currency} onChange={(event) => setCurrency(event.target.value)}>
                  {currencyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="business">Business</Label>
                <Select id="business" value={businessId} onChange={(event) => setBusinessId(event.target.value)}>
                  {businesses.map((business) => (
                    <option key={business.id} value={business.id}>
                      {business.companyName}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Select id="client" value={clientId} onChange={(event) => setClientId(event.target.value)}>
                  <option value="">Select a client</option>
                  {filteredClients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.companyName}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input id="issueDate" type="date" value={issueDate} onChange={(event) => setIssueDate(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select id="paymentMethod" value={paymentMethodId} onChange={(event) => setPaymentMethodId(event.target.value)}>
                <option value="">Select a payment method</option>
                {businessPayments.map((payment) => (
                  <option key={payment.id} value={payment.id}>
                    {payment.providerName} · {payment.accountHolder}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Optional notes for the client" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">Line Items</h3>
                <Button type="button" variant="secondary" onClick={addLineItem}>
                  Add Item
                </Button>
              </div>

              <div className="space-y-3">
                {lineItems.map((item) => (
                  <div key={item.id} className="grid gap-3 rounded-2xl border border-white/10 bg-slate-800/70 p-3 md:grid-cols-[2fr_0.7fr_0.8fr_auto]">
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input value={item.description} onChange={(event) => handleLineItemChange(item.id, 'description', event.target.value)} placeholder="Service or product" />
                    </div>
                    <div className="space-y-2">
                      <Label>Quantity / Hours</Label>
                      <Input type="number" min="0" value={item.quantity} onChange={(event) => handleLineItemChange(item.id, 'quantity', Number(event.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit Rate</Label>
                      <Input type="number" min="0" value={item.unitPrice} onChange={(event) => handleLineItemChange(item.id, 'unitPrice', Number(event.target.value))} />
                    </div>
                    <div className="flex items-end">
                      <Button type="button" variant="outline" onClick={() => removeLineItem(item.id)} className="h-10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-slate-900/80">
          <CardHeader>
            <CardTitle className="text-lg text-white">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-4">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Subtotal</span>
                <span className="text-white">{currencySymbol}{subtotal.toFixed(2)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                <span>Tax</span>
                <span className="text-white">{currencySymbol}{tax.toFixed(2)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-base font-semibold text-white">
                <span>Grand Total</span>
                <span>{currencySymbol}{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxMode">Tax Type</Label>
              <Select id="taxMode" value={taxMode} onChange={(event) => setTaxMode(event.target.value as TaxMode)}>
                {taxModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxValue">Tax Value</Label>
              <Input id="taxValue" type="number" min="0" value={taxValue} onChange={(event) => setTaxValue(Number(event.target.value))} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" value={status} onChange={(event) => setStatus(event.target.value as InvoiceStatus)}>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Button type="button" onClick={() => handleSave(status)} className="w-full">
                Save Invoice
              </Button>
              <Button type="button" variant="secondary" onClick={() => handleSave('Sent')} className="w-full">
                Mark as Sent
              </Button>
              <Button type="button" variant="secondary" onClick={() => handleSave('Paid')} className="w-full">
                Mark as Paid
              </Button>
              <Button type="button" variant="outline" onClick={() => handleSave('Cancelled')} className="w-full">
                Cancel Invoice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}

export default function NewInvoicePage() {
  return (
    <Suspense fallback={<div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 text-sm text-slate-400">Loading invoice form…</div>}>
      <InvoiceForm />
    </Suspense>
  );
}
