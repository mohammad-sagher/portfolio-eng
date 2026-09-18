import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope, Amiri, IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';

/* Typography (§6): display serif + geometric sans, each with a true Arabic pairing (Amiri / IBM Plex Sans Arabic). */
const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-display-latin', display: 'swap' });
const sans = Manrope({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-sans-latin', display: 'swap' });
const displayAr = Amiri({ subsets: ['arabic'], weight: ['400', '700'], variable: '--font-display-ar', display: 'swap' });
const sansAr = IBM_Plex_Sans_Arabic({ subsets: ['arabic'], weight: ['400', '500', '600'], variable: '--font-sans-ar', display: 'swap' });

export const metadata: Metadata = {
  title: 'Basma Sagher — Software Engineer',
  description: 'Software Engineer & Informatics Engineering professional. Full-stack development, software testing and QA.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${display.variable} ${sans.variable} ${displayAr.variable} ${sansAr.variable}`}>{children}</body>
    </html>
  );
}
