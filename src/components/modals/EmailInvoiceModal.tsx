'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Client } from '@/src/redux/slices/clientsSlice';
import type { Invoice } from '@/src/redux/slices/invoicesSlice';

interface EmailInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice;
  client: Client;
  mode?: 'send' | 'resend';
}

export function EmailInvoiceModal({ open, onOpenChange, invoice, client, mode = 'send' }: EmailInvoiceModalProps) {
  const [recipientEmail, setRecipientEmail] = useState(client.email);
  const [subject, setSubject] = useState(`${invoice.invoiceNumber} — Invoice from ${invoice.invoiceNumber}`);
  const [message, setMessage] = useState(`Hello ${client.contactPerson},\n\nPlease find your invoice attached for review. Thank you for your business.`);
  const [includePdf, setIncludePdf] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const title = mode === 'resend' ? 'Resend Invoice Email' : 'Send Invoice Email';
  const helperText = mode === 'resend' ? 'Send another copy of the invoice with the latest PDF attached.' : 'Send a polished invoice email with the PDF attachment included.';

  const handleSend = () => {
    setIsSending(true);
    window.setTimeout(() => {
      setIsSending(false);
      setSent(true);
      window.setTimeout(() => {
        setSent(false);
        onOpenChange(false);
      }, 1400);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-cyan-300" />
            {title}
          </DialogTitle>
          <DialogDescription>{helperText}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipientEmail">Recipient Email</Label>
            <Input id="recipientEmail" value={recipientEmail} onChange={(event) => setRecipientEmail(event.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailSubject">Email Subject</Label>
            <Input id="emailSubject" value={subject} onChange={(event) => setSubject(event.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Custom Message</Label>
            <Textarea id="message" value={message} onChange={(event) => setMessage(event.target.value)} />
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-800/70 px-3 py-3 text-sm text-slate-300">
            <input type="checkbox" checked={includePdf} onChange={(event) => setIncludePdf(event.target.checked)} className="h-4 w-4 rounded border-white/20 bg-slate-950" />
            Attach PDF invoice copy to this email
          </label>

          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-sm text-cyan-200">
            Preview notice: the invoice PDF will be attached and delivered through a simulated Gmail SMTP dispatch.
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <div className="text-sm text-slate-400">
            {sent ? <span className="flex items-center gap-2 text-emerald-300"><CheckCircle2 className="h-4 w-4" /> Email sent successfully</span> : null}
          </div>
          <Button onClick={handleSend} disabled={isSending} className="gap-2">
            <Send className="h-4 w-4" />
            {isSending ? 'Sending...' : mode === 'resend' ? 'Resend Email' : 'Send Email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
