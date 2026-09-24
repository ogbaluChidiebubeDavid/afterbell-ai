export interface RTokenConfig {
  symbol: string;             // e.g. "rNVDA"
  bitgetPair: string;         // e.g. "rNVDAUSDT"
  name: string;               // e.g. "NVIDIA Corp (Tokenized)"
  underlyingTicker: string;   // e.g. "NVDA"
  underlyingExchange: string; // e.g. "NASDAQ"
  basePrice: number;          // reference price
  tickSize: number;
  lotSize: number;
  tradingHours: string;       // "24/7 Extended (Reality Protocol)"
  description: string;
  category: 'AI_CHIPS' | 'EV_TECH' | 'BIG_TECH' | 'CRYPTO_EQUITY';
  volatilityRating: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const WATCHLIST_RTOKENS: RTokenConfig[] = [
  {
    symbol: "rNVDA",
    bitgetPair: "rNVDAUSDT",
    name: "NVIDIA Corp (Tokenized)",
    underlyingTicker: "NVDA",
    underlyingExchange: "NASDAQ",
    basePrice: 128.45,
    tickSize: 0.01,
    lotSize: 0.01,
    tradingHours: "24/7 Extended",
    description: "Semiconductor & AI data center giant. Highly sensitive to weekend tech supply-chain, hyperscaler capex, and export policy news.",
    category: "AI_CHIPS",
    volatilityRating: "HIGH",
  },
  {
    symbol: "rTSLA",
    bitgetPair: "rTSLAUSDT",
    name: "Tesla Inc (Tokenized)",
    underlyingTicker: "TSLA",
    underlyingExchange: "NASDAQ",
    basePrice: 242.80,
    tickSize: 0.01,
    lotSize: 0.01,
    tradingHours: "24/7 Extended",
    description: "Autonomous driving, robotics & EV pioneer. Often reacts violently to Elon Musk weekend posts, FSD updates, or regulatory deliveries.",
    category: "EV_TECH",
    volatilityRating: "HIGH",
  },
  {
    symbol: "rAAPL",
    bitgetPair: "rAAPLUSDT",
    name: "Apple Inc (Tokenized)",
    underlyingTicker: "AAPL",
    underlyingExchange: "NASDAQ",
    basePrice: 226.50,
    tickSize: 0.01,
    lotSize: 0.01,
    tradingHours: "24/7 Extended",
    description: "Consumer tech bellwether. Responsive to weekend Apple Intelligence deployment announcements, supply chain supplier audits, and China sales trends.",
    category: "BIG_TECH",
    volatilityRating: "MEDIUM",
  },
  {
    symbol: "rMSFT",
    bitgetPair: "rMSFTUSDT",
    name: "Microsoft Corp (Tokenized)",
    underlyingTicker: "MSFT",
    underlyingExchange: "NASDAQ",
    basePrice: 435.10,
    tickSize: 0.01,
    lotSize: 0.01,
    tradingHours: "24/7 Extended",
    description: "Enterprise software & Azure cloud leader. Moves on weekend OpenAI governance news, cloud enterprise demand signals, and cybersecurity headlines.",
    category: "BIG_TECH",
    volatilityRating: "MEDIUM",
  },
  {
    symbol: "rCOIN",
    bitgetPair: "rCOINUSDT",
    name: "Coinbase Global (Tokenized)",
    underlyingTicker: "COIN",
    underlyingExchange: "NASDAQ",
    basePrice: 218.60,
    tickSize: 0.01,
    lotSize: 0.01,
    tradingHours: "24/7 Extended",
    description: "Premier US crypto exchange equity. High correlation with weekend BTC/ETH weekend volatility and SEC crypto regulatory rulings.",
    category: "CRYPTO_EQUITY",
    volatilityRating: "HIGH",
  },
  {
    symbol: "rMSTR",
    bitgetPair: "rMSTRUSDT",
    name: "MicroStrategy (Tokenized)",
    underlyingTicker: "MSTR",
    underlyingExchange: "NASDAQ",
    basePrice: 134.20,
    tickSize: 0.01,
    lotSize: 0.01,
    tradingHours: "24/7 Extended",
    description: "Bitcoin treasury proxy. Direct weekend Bitcoin price beta amplifier with 24/7 rToken liquidity ahead of Monday equity open.",
    category: "CRYPTO_EQUITY",
    volatilityRating: "HIGH",
  },
];
