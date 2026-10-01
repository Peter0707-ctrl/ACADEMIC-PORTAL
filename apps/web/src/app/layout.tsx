import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UniversalEd Primary — Primary & Nursery School Portal',
  description: 'Dedicated cloud platform for primary, nursery, and kindergarten schools.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F3FAF5] text-slate-800 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
