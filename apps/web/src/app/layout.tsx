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
  title: 'UniversalEd — Education Management Platform',
  description:
    'A secure, multi-tenant cloud platform for managing students, examinations, report cards, fees, and parent communication across schools, colleges, and universities.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={ubuntu.variable}>
      <body className={`min-h-screen bg-background text-slate antialiased ${ubuntu.className}`}>
        {children}
      </body>
    </html>
  );
}
