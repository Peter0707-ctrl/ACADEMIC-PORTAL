import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Universal Ed | Mfumo wa Usimamizi wa Shule na Vyuo',
  description: 'Programu ya kisasa ya kidijitali kwa usimamizi wa shule, kadi za ripoti, ada na mawasiliano ya wazazi.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sw">
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
