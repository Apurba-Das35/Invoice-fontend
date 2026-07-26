'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowRight, CircleDollarSign, HandCoins, ReceiptText, TimerReset, PlusCircle, Building2, Users2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/src/redux/hooks';
import type { InvoiceStatus } from '@/src/redux/slices/invoicesSlice';

const statusStyles: Record<InvoiceStatus, string> = {
  Draft: 'border border-slate-600/50 bg-slate-700/60 text-slate-200',
  Sent: 'border border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  Paid: 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  Overdue: 'border border-amber-500/30 bg-amber-500/10 text-amber-300',
  Cancelled: 'border border-rose-500/30 bg-rose-500/10 text-rose-300',
};

export default function HomePage() {
  const businesses = useAppSelector((state) => state.businesses.items);
  const clients = useAppSelector((state) => state.clients.items);
  const invoices = useAppSelector((state) => state.invoices.items);
  const settings = useAppSelector((state) => state.settings);
  const activeBusinessId = useAppSelector((state) => state.businesses.activeBusinessId);

  const activeBusiness = businesses.find((business) => business.id === activeBusinessId) ?? businesses[0];
  const filteredInvoices = useMemo(
    () => invoices.filter((invoice) => invoice.businessId === activeBusinessId),
    [activeBusinessId, invoices],
  );

  const paidInvoices = filteredInvoices.filter((invoice) => invoice.status === 'Paid');
  const outstandingInvoices = filteredInvoices.filter((invoice) => invoice.status === 'Sent' || invoice.status === 'Draft');
  const overdueInvoices = filteredInvoices.filter((invoice) => invoice.status === 'Overdue');

  const totalRevenue = paidInvoices.reduce((sum, invoice) => sum + invoice.grandTotal, 0);
  const paidAmount = paidInvoices.reduce((sum, invoice) => sum + invoice.grandTotal, 0);
  const outstandingAmount = outstandingInvoices.reduce((sum, invoice) => sum + invoice.grandTotal, 0);
  const overdueAmount = overdueInvoices.reduce((sum, invoice) => sum + invoice.grandTotal, 0);

  const currency = activeBusiness?.defaultCurrency ?? settings.defaultCurrency;
  const currencySymbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Operations snapshot</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Welcome back to {activeBusiness?.companyName}</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Monitor revenue health, track outstanding work, and keep your client billing cycle moving from one workspace.
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
            {filteredInvoices.length} invoices in current business context
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Button asChild className="gap-2">
          <Link href="/invoices">
            <PlusCircle className="h-4 w-4" />
            Create New Invoice
          </Link>
        </Button>
        <Button asChild variant="secondary" className="gap-2">
          <Link href="/businesses">
            <Building2 className="h-4 w-4" />
            Add Business
          </Link>
        </Button>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/clients">
            <Users2 className="h-4 w-4" />
            Add Client
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
        <Card className="border border-emerald-500/20 bg-slate-900/80">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-slate-300">Total Revenue</CardTitle>
              <CircleDollarSign className="h-4 w-4 text-emerald-300" />
            </div>
          </CardHeader>
          <CardContent className={undefined}>
            <p className="text-2xl font-semibold text-white">{currencySymbol}{totalRevenue.toFixed(2)}</p>
            <p className="mt-2 text-sm text-slate-400">From paid invoices</p>
          </CardContent>
        </Card>

        <Card className="border border-cyan-500/20 bg-slate-900/80">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-slate-300">Paid Invoices</CardTitle>
              <HandCoins className="h-4 w-4 text-cyan-300" />
            </div>
          </CardHeader>
          <CardContent className={undefined}>
            <p className="text-2xl font-semibold text-white">{paidInvoices.length}</p>
            <p className="mt-2 text-sm text-slate-400">{currencySymbol}{paidAmount.toFixed(2)} collected</p>
          </CardContent>
        </Card>

        <Card className="border border-amber-500/20 bg-slate-900/80">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-slate-300">Outstanding Amount</CardTitle>
              <ReceiptText className="h-4 w-4 text-amber-300" />
            </div>
          </CardHeader>
          <CardContent className={undefined}>
            <p className="text-2xl font-semibold text-white">{currencySymbol}{outstandingAmount.toFixed(2)}</p>
            <p className="mt-2 text-sm text-slate-400">Sent / draft invoices pending</p>
          </CardContent>
        </Card>

        <Card className="border border-rose-500/20 bg-slate-900/80">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-slate-300">Overdue Invoices</CardTitle>
              <TimerReset className="h-4 w-4 text-rose-300" />
            </div>
          </CardHeader>
          <CardContent className={undefined}>
            <p className="text-2xl font-semibold text-white">{overdueInvoices.length}</p>
            <p className="mt-2 text-sm text-slate-400">{currencySymbol}{overdueAmount.toFixed(2)} overdue</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-white/10 bg-slate-900/80">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-lg text-white">Recent invoices</CardTitle>
            <p className="mt-1 text-sm text-slate-400">Latest billing activity for {activeBusiness?.companyName}</p>
          </div>
          <Button asChild variant="secondary" className="gap-2">
            <Link href="/invoices">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className={undefined}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.slice(0, 6).map((invoice) => {
                  const client = clients.find((item) => item.id === invoice.clientId);
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium text-white">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{client?.companyName ?? 'Unassigned'}</TableCell>
                      <TableCell>{invoice.issueDate}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>{currencySymbol}{invoice.grandTotal.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[invoice.status]}`}>
                          {invoice.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
