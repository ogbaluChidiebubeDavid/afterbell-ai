import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Exbit AI — Run trading agents from Messenger',
  description: 'Deploy your own after-hours trading agent for Bitget tokenized US stocks (rToken) with a couple of clicks.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#101010] text-[#eeeeeb] min-h-screen font-sans selection:bg-[#eeeeeb] selection:text-[#111]">
        {children}
      </body>
    </html>
  );
}
