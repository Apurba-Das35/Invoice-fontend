'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Copy, Eye, PencilLine, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InvoiceFilterBar } from '@/src/components/invoices/InvoiceFilterBar';
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { deleteInvoice, duplicateInvoice, type InvoiceStatus } from '@/src/redux/slices/invoicesSlice';

const statusStyles: Record<InvoiceStatus, string> = {
  Draft: 'border border-slate-600/50 bg-slate-700/60 text-slate-200',
  Sent: 'border border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  Paid: 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  Overdue: 'border border-amber-500/30 bg-amber-500/10 text-amber-300',
  Cancelled: 'border border-rose-500/30 bg-rose-500/10 text-rose-300',
};

export default function InvoicesPage() {
  const dispatch = useAppDispatch();
  const businesses = useAppSelector((state) => state.businesses.items);
  const clients = useAppSelector((state) => state.clients.items);
  const invoices = useAppSelector((state) => state.invoices.items);
  const activeBusinessId = useAppSelector((state) => state.businesses.activeBusinessId);
  const filters = useAppSelector((state) => state.settings.invoiceFilters);

  const visibleInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesBusiness = filters.businessId === 'all' ? true : invoice.businessId === filters.businessId;
      const matchesStatus = filters.status === 'All' ? true : invoice.status === filters.status;
      const matchesQuery = [invoice.invoiceNumber, businesses.find((business) => business.id === invoice.businessId)?.companyName ?? '', clients.find((client) => client.id === invoice.clientId)?.companyName ?? '']
        .join(' ')
        .toLowerCase()
        .includes(filters.query.toLowerCase());
      const issueDate = new Date(invoice.issueDate);
      const dueDate = new Date(invoice.dueDate);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;
      const matchesDate = (!startDate || issueDate >= startDate || dueDate >= startDate) && (!endDate || issueDate <= endDate || dueDate <= endDate);

      return matchesBusiness && matchesStatus && matchesQuery && matchesDate;
    });
  }, [businesses, clients, filters, invoices]);

  const formatCurrency = (value: number, currency: string) => {
    const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£' };
    return `${symbols[currency] ?? '$'}${value.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Invoice Management</h2>
          <p className="mt-2 text-sm text-slate-400">Track every invoice, monitor payment progress, and keep billing operations moving.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/invoices/new">
            <PlusCircle className="h-4 w-4" />
            Create Invoice
          </Link>
        </Button>
      </div>

      <InvoiceFilterBar />

      <Card className="border border-white/10 bg-slate-900/80">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-lg text-white">Invoice Overview</CardTitle>
            <p className="mt-1 text-sm text-slate-400">A complete table view of current invoices for the active business.</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Grand Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleInvoices.map((invoice) => {
                  const business = businesses.find((item) => item.id === invoice.businessId);
                  const client = clients.find((item) => item.id === invoice.clientId);

                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium text-white">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{business?.companyName ?? 'Unassigned'}</TableCell>
                      <TableCell>{client?.companyName ?? 'Unassigned'}</TableCell>
                      <TableCell>{invoice.issueDate}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>{formatCurrency(invoice.grandTotal, invoice.currency)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[invoice.status]}`}>
                          {invoice.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="secondary" className="h-9 px-3">
                            <Link href={`/invoices/${invoice.id}/preview`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </Link>
                          </Button>
                          <Button asChild variant="secondary" className="h-9 px-3">
                            <Link href={`/invoices/new?id=${invoice.id}`}>
                              <PencilLine className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </Button>
                          <Button onClick={() => dispatch(duplicateInvoice(invoice.id))} variant="secondary" className="h-9 px-3">
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </Button>
                          <Button onClick={() => dispatch(deleteInvoice(invoice.id))} variant="outline" className="h-9 px-3">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
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
