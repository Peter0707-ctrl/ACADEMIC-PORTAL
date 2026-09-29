import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Universal Ed Tanzania | Mfumo wa Kidijitali wa Taasisi za Elimu',
  description: 'Mfumo rasmi wa kidijitali wa kusimamia shule za msingi, sekondari, vyuo vya ufundi (NACTVET/VETA) na vyuo vikuu (TCU) nchini Tanzania.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sw" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
