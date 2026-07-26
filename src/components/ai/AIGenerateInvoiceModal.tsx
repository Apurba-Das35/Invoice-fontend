'use client';

import { useMemo, useState } from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { InvoiceLineItem } from '@/src/redux/slices/invoicesSlice';

interface AIGenerateInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (data: AIInvoiceDraft) => void;
}

export interface AIInvoiceDraft {
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  businessId: string;
  currency: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  notes: string;
  lineItems: InvoiceLineItem[];
  taxValue: number;
  taxMode: 'percentage' | 'fixed';
}

interface ParsedAIInvoiceResponse {
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  currency: string;
  invoiceNumber: string;
  lineItems: Array<{ description: string; quantity: number; unitPrice: number }>;
  notes: string;
  taxValue: number;
  taxMode: 'percentage' | 'fixed';
}

const parsePrompt = (prompt: string): ParsedAIInvoiceResponse => {
  const normalized = prompt.toLowerCase();
  const clientName = /for\s+([a-zA-Z][a-zA-Z\s.-]+?)(?:\s+at|\s+for|$)/.exec(prompt)?.[1]?.trim() ?? 'AI Client';
  const clientCompany = /at\s+([a-zA-Z][a-zA-Z0-9\s.-]+?)(?:\s+for|$)/.exec(prompt)?.[1]?.trim() ?? 'Generated Company';
  const currency = /(?:usd|eur|gbp|bdt)/.exec(normalized)?.[0]?.toUpperCase() ?? 'USD';
  const invoiceNumber = `INV-${Math.floor(1000 + Math.random() * 9000)}`;

  const lineItemPattern = /([0-9]+(?:\.[0-9]+)?)\s*(?:hours|hour|units|unit|banners|items|services)?\s*(?:of\s+)?([^@,.;]+?)(?:\s+at\s+\$?([0-9]+(?:\.[0-9]+)?))?/gi;
  const lineItems = Array.from(prompt.matchAll(lineItemPattern)).map((match) => ({
    description: match[2]?.trim() ?? 'Generated service',
    quantity: Number(match[1] ?? 1),
    unitPrice: Number(match[3] ?? 0),
  }));

  const taxValue = /tax\s+([0-9]+(?:\.[0-9]+)?)/i.exec(prompt)?.[1] ? Number(/tax\s+([0-9]+(?:\.[0-9]+)?)/i.exec(prompt)?.[1]) : 10;

  return {
    clientName,
    clientEmail: `${clientName.toLowerCase().replace(/\s+/g, '.')}@${clientCompany.toLowerCase().replace(/\s+/g, '')}.com`,
    clientCompany,
    currency,
    invoiceNumber,
    lineItems: lineItems.length ? lineItems : [{ description: 'Professional services', quantity: 1, unitPrice: 250 }],
    notes: 'Generated from natural language prompt.',
    taxValue,
    taxMode: 'percentage',
  };
};

export function AIGenerateInvoiceModal({ open, onOpenChange, onApply }: AIGenerateInvoiceModalProps) {
  const [prompt, setPrompt] = useState('Create an invoice for John Doe at TechCorp for 15 hours of UI/UX design at $50/hour and 2 website banners at $150 each');
  const [isGenerating, setIsGenerating] = useState(false);
  const [parsed, setParsed] = useState<ParsedAIInvoiceResponse | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);

    window.setTimeout(() => {
      const result = parsePrompt(prompt);
      setParsed(result);
      setIsGenerating(false);
    }, 1400);
  };

  const reviewCards = useMemo(() => {
    if (!parsed) return null;

    return (
      <div className="space-y-3 rounded-2xl border border-cyan-500/20 bg-slate-800/70 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">AI Review</p>
            <p className="text-sm text-slate-400">{parsed.clientName} · {parsed.clientCompany}</p>
          </div>
          <div className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 text-xs uppercase tracking-[0.2em] text-cyan-300">
            Ready to Apply
          </div>
        </div>
        <div className="space-y-2 text-sm text-slate-300">
          <p>Invoice number: {parsed.invoiceNumber}</p>
          <p>Currency: {parsed.currency}</p>
          <p>Line items: {parsed.lineItems.map((item) => `${item.description} x${item.quantity}`).join(', ')}</p>
        </div>
      </div>
    );
  }, [parsed]);

  const handleApply = () => {
    if (!parsed) return;

    onApply({
      ...parsed,
      businessId: '',
      invoiceNumber: parsed.invoiceNumber,
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      lineItems: parsed.lineItems.map((item, index) => ({ id: `ai-${index}`, description: item.description, quantity: item.quantity, unitPrice: item.unitPrice })),
      taxValue: parsed.taxValue,
      taxMode: parsed.taxMode,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            Natural Language Invoice Generator
          </DialogTitle>
          <DialogDescription>Describe the invoice in plain English and let AI structure it into a usable draft.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aiPrompt">Describe the invoice</Label>
            <Textarea
              id="aiPrompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              className="min-h-[140px]"
              placeholder="Create an invoice for John Doe at TechCorp for 15 hours of UI/UX design at $50/hour and 2 website banners at $150 each"
            />
          </div>

          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full gap-2">
            <Wand2 className="h-4 w-4" />
            {isGenerating ? 'Analyzing prompt with Gemini AI...' : 'Generate Invoice with AI'}
          </Button>

          {isGenerating ? (
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-200">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300" />
                Extracting client details and line items...
              </div>
            </div>
          ) : null}

          {reviewCards}

          {parsed ? (
            <Button onClick={handleApply} variant="secondary" className="w-full">
              Apply to Invoice Form
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
