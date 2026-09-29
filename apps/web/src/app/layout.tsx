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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
