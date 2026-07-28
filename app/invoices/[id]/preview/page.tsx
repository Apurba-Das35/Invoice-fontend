'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BellRing, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppSelector } from '@/src/redux/hooks';
import { EmailInvoiceModal } from '@/src/components/modals/EmailInvoiceModal';
import type { InvoiceStatus } from '@/src/redux/slices/invoicesSlice';

const statusStyles: Record<InvoiceStatus, string> = {
  Draft: 'border border-slate-600/50 bg-slate-700/60 text-slate-200',
  Sent: 'border border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  Paid: 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  Overdue: 'border border-amber-500/30 bg-amber-500/10 text-amber-300',
  Cancelled: 'border border-rose-500/30 bg-rose-500/10 text-rose-300',
};

export default function InvoicePreviewPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const invoiceId = params?.id;

  const invoices = useAppSelector((state) => state.invoices.items);
  const businesses = useAppSelector((state) => state.businesses.items);
  const clients = useAppSelector((state) => state.clients.items);
  const payments = useAppSelector((state) => state.payments.items);
  const reminderSettings = useAppSelector((state) => state.settings);

  const [emailOpen, setEmailOpen] = useState(false);
  const [emailMode, setEmailMode] = useState<'send' | 'resend'>('send');

  const invoice = useMemo(() => invoices.find((item) => item.id === invoiceId), [invoiceId, invoices]);
  const business = useMemo(() => businesses.find((item) => item.id === invoice?.businessId), [businesses, invoice?.businessId]);
  const client = useMemo(() => clients.find((item) => item.id === invoice?.clientId), [clients, invoice?.clientId]);
  const payment = useMemo(() => payments.find((item) => item.id === invoice?.paymentMethodId), [invoice?.paymentMethodId, payments]);

  if (!invoice || !business || !client) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-400">Invoice not found.</p>
        <Button variant="secondary" onClick={() => router.push('/invoices')}>
          Back to invoices
        </Button>
      </div>
    );
  }

  const currencySymbol = invoice.currency === 'EUR' ? '€' : invoice.currency === 'GBP' ? ' £ ' : '$';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-900/70 p-4 print:hidden md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Invoice Preview</h2>
          <p className="text-sm text-slate-400">Print-ready invoice layout for sharing or downloading as a PDF.</p>
        </div>
        <div className="flex flex-wrap gap-2">

          <Button
            onClick={() => {
              setEmailMode('send');
              setEmailOpen(true);
            }}
            className="gap-2"
          >
            <Printer className="h-4 w-4" />
            Send Email
          </Button>
          <Button onClick={() => window.print()} variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <EmailInvoiceModal open={emailOpen} onOpenChange={setEmailOpen} invoice={invoice} client={client} mode={emailMode} />

      {/* <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 print:hidden">
        <div className="flex flex-col gap-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-cyan-200">Automatic reminders</p>
            <p className="text-sm text-cyan-100/80">{reminderSettings.invoicePrefix} reminder policy is currently {invoice.status === 'Overdue' ? 'active' : 'available'} for overdue invoices.</p>
          </div>
          <div className="rounded-full border border-cyan-400/30 bg-slate-950/40 px-3 py-1 text-sm text-cyan-200">
            3 days / 7 days follow-up
          </div>
        </div>
      </div> */}

      <Card className="overflow-hidden border border-white/10 bg-white text-slate-900 shadow-2xl">
        <div className='flex justify-between'>

          {/* invoices From */}
          <div className=" px-8 py-8  print:bg-white print:text-slate-900">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">FROM:</p>
                </div>

                {/* <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-sm font-semibold text-cyan-300">
                {business.logo}
              </div> */}

                <h3 className="text-2xl font-semibold">{business.companyName}</h3>
                <p className="mt-2 max-w-md text-sm ">{business.address}</p>
                <p className="text-sm ">{business.email}</p>
                <p className="text-sm ">{business.phone}</p>
                <p className="mt-2 text-sm">VAT: {business.vat}</p>
              </div>

              {/* <div className="text-left md:text-right">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Invoice</p>
              <h2 className="mt-2 text-3xl font-semibold">{invoice.invoiceNumber}</h2>
              <div className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusStyles[invoice.status]}`}>
                {invoice.status}
              </div>
            </div> */}

            </div>
          </div>

          {/* invoice Billed to  */}
          <div className="grid gap-8  border-slate-200 bg-white p-8 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">BillED TO:</p>
              <h4 className="mt-2 text-lg font-semibold text-slate-900">{client.companyName}</h4>
              <p className="mt-2 text-sm text-slate-600">{client.billingAddress}</p>
              <p className="text-sm text-slate-600">{client.email}</p>
              <p className="text-sm text-slate-600">{client.phone}</p>
              <p className="mt-2 text-sm text-slate-500">VAT Number: {client.vatNumber}</p>
            </div>


          </div>
        </div>

        {/* invoice date area */}
        <div className=" flex gap-8  border-slate-200 bg-white p-8 md:justify-between">
          <div className=" gap-3">
            <p className="font-medium text-slate-500">INVOICE DATE</p>
            <p className="font-semibold text-slate-900">{invoice.issueDate}</p>
          </div>

          <div className="pr-75 gap-3">
            <p className="font-medium text-slate-500">DUE DATE</p>
            <span className="font-semibold text-slate-900">{invoice.dueDate}</span>
          </div>

          {/* <div className="flex justify-between gap-3">
              <span className="font-medium text-slate-500">Currency</span>
              <span className="font-semibold text-slate-900">{invoice.currency}</span>
            </div> */}
        </div>


        {/* invoice description */}
        <div className="p-8">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
                <th className="px-3 py-3 font-semibold">TITLE / DESCRIPTION</th>
                <th className="px-3 py-3 font-semibold">QTY</th>
                <th className="px-3 py-3 font-semibold">RATE</th>
                <th className="px-3 py-3 font-semibold">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-3 py-3 text-slate-900">{item.description}</td>
                  <td className="px-3 py-3 text-slate-700">{item.quantity}</td>
                  <td className="px-3 py-3 text-slate-700">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                  <td className="px-3 py-3 font-semibold text-slate-900">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Subtotal,Tax,Grand Total */}
        <div className="grid grid-col-2 mx-7 pr-45  border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-sm text-slate-600 ">
            <span>Subtotal</span>
            <span>{currencySymbol}{invoice.subtotal.toFixed(2)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
            <span>Tax</span>
            <span>{currencySymbol}{invoice.tax.toFixed(2)}</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3   text-base font-semibold text-slate-900">
            <span>Grand Total</span>
            <span>{currencySymbol}{invoice.grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid gap-8 border-t border-slate-200 bg-slate-50 p-8 md:grid-cols-[1.     2fr_0.8fr]">
          <div className="space-y-3">

            {/* <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Payment Instructions</h4>
              {payment ? (
                <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">{payment.providerName}</p>
                  <p>Account Holder: {payment.accountHolder}</p>
                  <p>Account Number: {payment.accountNumber}</p>
                  {payment.swiftIban ? <p>SWIFT / IBAN: {payment.swiftIban}</p> : null}
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-500">No payment method selected.</p>
              )}
            </div> */}

            {invoice.notes ? (
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Notes</h4>
                <p className="mt-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">{invoice.notes}</p>
              </div>
            ) : null}
          </div>



        </div>
      </Card>
    </div>
  );
}
