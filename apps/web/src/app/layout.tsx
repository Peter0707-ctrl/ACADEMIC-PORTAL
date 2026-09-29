import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Universal Education Management Platform | Academic Digital OS',
  description: 'Multi-tenant, country-agnostic education management platform for primary schools, secondary schools, colleges, and universities.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-slate antialiased">
        {children}
      </body>
    </html>
  );
}
