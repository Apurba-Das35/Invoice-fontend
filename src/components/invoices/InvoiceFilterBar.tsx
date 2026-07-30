'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { setInvoiceFilters, type InvoiceFilterState } from '@/src/redux/slices/settingsSlice';
import type { InvoiceStatus } from '@/src/redux/slices/invoicesSlice';

const statusOptions: Array<'All' | InvoiceStatus> = ['All', 'Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'];

export function InvoiceFilterBar() {
  const dispatch = useAppDispatch();
  const businesses = useAppSelector((state) => state.businesses.items);
  const activeBusinessId = useAppSelector((state) => state.businesses.activeBusinessId);
  const filters = useAppSelector((state) => state.settings.invoiceFilters);

  const [query, setQuery] = useState(filters.query);
  const [status, setStatus] = useState<InvoiceFilterState['status']>(filters.status);
  const [businessId, setBusinessId] = useState(filters.businessId);
  const [startDate, setStartDate] = useState(filters.startDate);
  const [endDate, setEndDate] = useState(filters.endDate);

  useEffect(() => {
    setQuery(filters.query);
    setStatus(filters.status);
    setBusinessId(filters.businessId);
    setStartDate(filters.startDate);
    setEndDate(filters.endDate);
  }, [filters]);

  const applyFilters = (next: Partial<InvoiceFilterState>) => {
    dispatch(setInvoiceFilters({ ...filters, ...next }));
  };

  const businessOptions = useMemo(() => {
    return businesses.filter((business) => business.id === activeBusinessId || !activeBusinessId || business.id === filters.businessId);
  }, [activeBusinessId, businesses, filters.businessId]);

  return (
    <div className="grid gap-3 rounded-3xl border border-white/10 bg-slate-900/70 p-4 md:grid-cols-2 xl:grid-cols-5">
      <div className="relative top-6 md:col-span-2 xl:col-span-2">
        <Search className="pointer-events-none absolute left-3 top-5 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <Input
          value={query}
          onChange={(event) => {
            const value = event.target.value;
            setQuery(value);
            applyFilters({ query: value });
          }}
          placeholder="Search invoice, client, or business"
          className="pl-9"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Status</label>
        <Select value={status} onChange={(event) => {
          const value = event.target.value as InvoiceFilterState['status'];
          setStatus(value);
          applyFilters({ status: value });
        }}>
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Business</label>
        <Select value={businessId} onChange={(event) => {
          const value = event.target.value;
          setBusinessId(value);
          applyFilters({ businessId: value });
        }}>
          <option value="all">All businesses</option>
          {businesses.map((business) => (
            <option key={business.id} value={business.id}>
              {business.companyName}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Date Range</label>
        <div className="grid grid-cols-2 gap-2">
          <Input type="date" value={startDate} onChange={(event) => {
            const value = event.target.value;
            setStartDate(value);
            applyFilters({ startDate: value });
          }} />
          <Input type="date" value={endDate} onChange={(event) => {
            const value = event.target.value;
            setEndDate(value);
            applyFilters({ endDate: value });
          }} />
        </div>
      </div>
    </div>
  );
}
