export interface StrategyModule {
  id: string;
  name: string;
  category: 'CONGRESSIONAL' | 'X_ACCOUNTS' | 'IPO_FILINGS' | 'AFTER_HOURS_PRICING';
  description: string;
  source: string;
  bitgetSkillContext: 'macro-analyst' | 'news-briefing' | 'sentiment-analyst' | 'market-intel' | 'technical-analysis';
  targets: string[]; // e.g. ["Nancy Pelosi", "Dan Crenshaw"] or ["@elonmusk", "@unusual_whales"]
  sampleTriggerEvent: {
    title: string;
    summary: string;
    ticker: string;
    confidence: number;
    sentiment: 'BULLISH' | 'BEARISH';
  };
  isActive: boolean;
}

export class StrategyModuleService {
  private static modules: StrategyModule[] = [
    {
      id: 'mod_congress',
      name: 'Congressional Trades',
      category: 'CONGRESSIONAL',
      description: 'Track STOCK Act disclosed trades and options purchases from key members of Congress outside market hours.',
      source: 'Capitol Trades & House Ethics Disclosures',
      bitgetSkillContext: 'market-intel',
      targets: ['Nancy Pelosi', 'Dan Crenshaw', 'Tommy Tuberville', 'Ro Khanna'],
      sampleTriggerEvent: {
        title: 'Sunday Disclosure: Rep. Pelosi Discloses $1.25M NVIDIA Call Options',
        summary: 'STOCK Act Periodic Transaction Report filed over the weekend shows aggressive long LEAPs purchase. US cash equities closed until Monday; rNVDA liquid on Bitget.',
        ticker: 'rNVDA',
        confidence: 92,
        sentiment: 'BULLISH',
      },
      isActive: true,
    },
    {
      id: 'mod_x_accounts',
      name: 'Specific X Accounts',
      category: 'X_ACCOUNTS',
      description: 'Follow high-impact X accounts for breaking weekend commentary and market-moving executive statements.',
      source: 'X / Twitter Real-Time Stream',
      bitgetSkillContext: 'sentiment-analyst',
      targets: ['@elonmusk', '@unusual_whales', '@tier10k', '@secgov'],
      sampleTriggerEvent: {
        title: 'Elon Musk Posts Weekend Progress on FSD Hardware 4 Deployment',
        summary: 'Sunday morning post confirms regulatory greenlight for driverless robotaxi testing in major international metro. Sentiment spiked +410%.',
        ticker: 'rTSLA',
        confidence: 86,
        sentiment: 'BULLISH',
      },
      isActive: true,
    },
    {
      id: 'mod_ipo_filings',
      name: 'New IPO Filings & S-1s',
      category: 'IPO_FILINGS',
      description: 'Watch for new SEC S-1 and 8-K filings in AI and tech sectors over weekends and overnight.',
      source: 'SEC EDGAR Real-Time Feed',
      bitgetSkillContext: 'news-briefing',
      targets: ['Tech / AI Compute Sector', 'Crypto Infrastructure'],
      sampleTriggerEvent: {
        title: 'Major Cloud Provider Files S-1 Highlighting 40% ASIC Procurement Growth',
        summary: 'Sunday SEC filing reveals accelerated custom silicon capex commitments with Tier-1 chipmakers.',
        ticker: 'rNVDA',
        confidence: 81,
        sentiment: 'BULLISH',
      },
      isActive: false,
    },
    {
      id: 'mod_after_hours_rtoken',
      name: 'After-Hours Information Pricing',
      category: 'AFTER_HOURS_PRICING',
      description: 'Exploit the 65.5h weekend and overnight gap when US cash stocks sleep but Bitget rTokens trade 24/7.',
      source: 'Bitget 24/7 rToken Orderbook & News Stream',
      bitgetSkillContext: 'technical-analysis',
      targets: ['rNVDA', 'rTSLA', 'rAAPL', 'rMSFT', 'rCOIN', 'rMSTR'],
      sampleTriggerEvent: {
        title: 'Sunday Bitcoin Run to $68.5k: MSTR Treasury NAV Repricing',
        summary: 'MicroStrategy Bitcoin holdings expand net asset value during Sunday rally; Bitget rMSTR trades ahead of Monday NASDAQ opening print.',
        ticker: 'rMSTR',
        confidence: 90,
        sentiment: 'BULLISH',
      },
      isActive: true,
    },
  ];

  static getModules(): StrategyModule[] {
    return [...this.modules];
  }

  static toggleModule(id: string): StrategyModule | null {
    const mod = this.modules.find(m => m.id === id);
    if (!mod) return null;
    mod.isActive = !mod.isActive;
    return mod;
  }

  static getActiveModules(): StrategyModule[] {
    return this.modules.filter(m => m.isActive);
  }
}
