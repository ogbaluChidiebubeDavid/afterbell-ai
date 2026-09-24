import type { Metadata } from 'next';
import './globals.css';
import { DisclaimerBanner } from '@/components/disclaimer-banner';

export const metadata: Metadata = {
  title: 'Afterbell AI — Agentic Trading Assistant for Bitget Hackathon S2',
  description: 'Event-driven AI trading assistant watching after-hours information pricing on Bitget rTokens (tokenized US stocks) via Photon iMessage.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        <DisclaimerBanner />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
