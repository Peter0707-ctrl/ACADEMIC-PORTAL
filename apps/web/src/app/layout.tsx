import type { Metadata } from 'next';
import { Ubuntu } from 'next/font/google';
import './globals.css';

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-ubuntu',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'UniversalEd Primary — Primary & Nursery School Management Portal',
  description: 'Dedicated cloud management platform designed specifically for primary, nursery, and kindergarten schools.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={ubuntu.variable}>
      <body className={`min-h-screen bg-background text-slate antialiased font-sans ${ubuntu.className}`}>
        {children}
      </body>
    </html>
  );
}
