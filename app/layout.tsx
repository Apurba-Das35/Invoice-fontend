import type { Metadata } from 'next';
import './globals.css';
import { ReduxProvider } from '@/src/redux/provider';
import { DashboardLayout } from '@/src/components/layout/dashboard-layout';

export const metadata: Metadata = {
  title: 'InvoiceFlow',
  description: 'Invoice management SaaS frontend',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full font-sans">
        <ReduxProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
