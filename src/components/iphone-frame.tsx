'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Signal, Wifi, BatteryMedium, Send, Check, Play, Pause, ChevronRight } from 'lucide-react';

export interface StrategyScenario {
  id: string;
  name: string;
  categoryTag: string;
  messages: {
    sender: 'AFTERBELL_AGENT' | 'USER';
    time: string;
    text: string;
  }[];
}

const AUTOMATED_SCENARIOS: StrategyScenario[] = [
  {
    id: 'congressional',
    name: 'Congressional Trades',
    categoryTag: 'STOCK Act Tracker',
    messages: [
      {
        sender: 'AFTERBELL_AGENT',
        time: '18:14',
        text: '🔔 Afterbell: Congressional Watch active for Nancy Pelosi, Dan Crenshaw, Tommy Tuberville.',
      },
      {
        sender: 'AFTERBELL_AGENT',
        time: '18:32',
        text: `🚨 MATCH DETECTED [Rep. Nancy Pelosi Disclosure]
Periodic Transaction Report filed over the weekend:
Purchased 50x NVDA $120 Call Options (exp 2027), valued $1.25M.

US Equities Closed: ~42 hours until Monday 9:30 AM open.
Bitget rToken (rNVDA) liquid now @ $128.45.

Decision: LONG rNVDA @ $128.45 ($440 USDT)
Confidence: 92% | DryRun: PASSED

Reply "YES" to execute paper order, or "NO" to cancel.`,
      },
      {
        sender: 'USER',
        time: '18:33',
        text: 'YES',
      },
      {
        sender: 'AFTERBELL_AGENT',
        time: '18:33',
        text: `✅ ORDER FILLED [Bitget Agent Hub Paper Trading]
Bought 3.42 rNVDA @ $128.45 USDT ($439.30)
Order ID: bg_paper_plsi_928f
Account: Bitget Agentic (Isolated)`,
      },
    ],
  },
  {
    id: 'x_accounts',
    name: 'Specific X Accounts',
    categoryTag: '@elonmusk Tracker',
    messages: [
      {
        sender: 'AFTERBELL_AGENT',
        time: '09:12',
        text: '🔔 Afterbell: Real-time X watch active for @elonmusk, @unusual_whales, @tier10k.',
      },
      {
        sender: 'AFTERBELL_AGENT',
        time: '09:28',
        text: `🚨 MATCH DETECTED [@elonmusk Tweet]
"FSD v13 full driverless road testing permits officially granted for Shanghai Free Trade Zone fleet starting next month."

Sunday night news gap: NASDAQ closed until Monday 9:30 AM EST.
Bitget rToken (rTSLA) trading @ $242.80 with rising buy volume.

Decision: LONG rTSLA @ $242.80 ($400 USDT)
Confidence: 86% | DryRun: PASSED

Reply "YES" to execute paper order, or "NO" to cancel.`,
      },
      {
        sender: 'USER',
        time: '09:29',
        text: 'YES',
      },
      {
        sender: 'AFTERBELL_AGENT',
        time: '09:29',
        text: `✅ ORDER FILLED [Bitget Agent Hub Paper Trading]
Bought 1.65 rTSLA @ $242.80 USDT ($400.62)
Order ID: bg_paper_tsla_412e
Account: Bitget Agentic (Isolated)`,
      },
    ],
  },
  {
    id: 'ipo_filings',
    name: 'New IPO Filings',
    categoryTag: 'SEC EDGAR S-1',
    messages: [
      {
        sender: 'AFTERBELL_AGENT',
        time: '14:05',
        text: '🔔 Afterbell: SEC EDGAR feed active for AI compute & cloud infrastructure filings.',
      },
      {
        sender: 'AFTERBELL_AGENT',
        time: '14:22',
        text: `🚨 MATCH DETECTED [Weekend S-1 Filing]
Major hyperscaler S-1 amendment details $4.2B multi-year custom accelerator procurement commitments with Tier-1 silicon partners.

US regular equities locked. Bitget 24/7 rTokens liquid.

Decision: LONG rNVDA @ $128.45 ($450 USDT)
Confidence: 88% | DryRun: PASSED

Reply "YES" to execute paper order, or "NO" to cancel.`,
      },
      {
        sender: 'USER',
        time: '14:23',
        text: 'YES',
      },
      {
        sender: 'AFTERBELL_AGENT',
        time: '14:23',
        text: `✅ ORDER FILLED [Bitget Agent Hub Paper Trading]
Bought 3.50 rNVDA @ $128.45 USDT ($449.57)
Order ID: bg_paper_s1_78a1
Account: Bitget Agentic (Isolated)`,
      },
    ],
  },
  {
    id: 'after_hours_rtoken',
    name: 'After-Hours rTokens',
    categoryTag: 'Weekend Temporal Gap',
    messages: [
      {
        sender: 'AFTERBELL_AGENT',
        time: '21:10',
        text: '🔔 Afterbell: 24/7 rToken after-hours pricing engine active across weekend gap.',
      },
      {
        sender: 'AFTERBELL_AGENT',
        time: '21:40',
        text: `🚨 SUNDAY MOMENTUM DETECTED [BTC Crosses $68.5k]
Bitcoin surged +4.8% on weekend spot ETF inflows. Historical beta of MicroStrategy (MSTR) implies +5.4% opening gap on Monday.

NASDAQ equity closed until Monday 9:30 AM.
Bitget rMSTR trading 24/7 @ $134.20.

Decision: LONG rMSTR @ $134.20 ($350 USDT)
Confidence: 91% | DryRun: PASSED

Reply "YES" to execute paper order, or "NO" to cancel.`,
      },
      {
        sender: 'USER',
        time: '21:41',
        text: 'YES',
      },
      {
        sender: 'AFTERBELL_AGENT',
        time: '21:41',
        text: `✅ ORDER FILLED [Bitget Agent Hub Paper Trading]
Bought 2.61 rMSTR @ $134.20 USDT ($350.26)
Order ID: bg_paper_mstr_891d
Account: Bitget Agentic (Isolated)`,
      },
    ],
  },
];

interface IPhoneFrameProps {
  onSendMessage: (text: string) => Promise<void>;
  isSending: boolean;
}

export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({
  onSendMessage,
  isSending,
}) => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [inputText, setInputText] = useState('');
  const [customMessages, setCustomMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-cycle through scenarios every 6.5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setScenarioIndex((prev) => (prev + 1) % AUTOMATED_SCENARIOS.length);
      setCustomMessages([]); // reset custom overrides on automated switch
    }, 6500);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [scenarioIndex, customMessages]);

  const currentScenario = AUTOMATED_SCENARIOS[scenarioIndex];

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSending) return;
    const text = inputText.trim();
    setInputText('');
    setIsAutoPlaying(false); // Pause auto-play so user can converse

    setCustomMessages((prev) => [
      ...prev,
      { sender: 'USER', time: 'Just now', text },
    ]);

    await onSendMessage(text);

    // Simulated instant reply in demo if custom
    setTimeout(() => {
      if (text.toUpperCase() === 'YES') {
        setCustomMessages((prev) => [
          ...prev,
          {
            sender: 'AFTERBELL_AGENT',
            time: 'Just now',
            text: `✅ ORDER FILLED [Bitget Agent Hub Paper Trading]\nExecuted paper fill on Bitget UTA\nAccount: Bitget Agentic Isolated`,
          },
        ]);
      } else if (text.toUpperCase() === 'NO') {
        setCustomMessages((prev) => [
          ...prev,
          {
            sender: 'AFTERBELL_AGENT',
            time: 'Just now',
            text: `❌ Proposal cancelled. No order was dispatched.`,
          },
        ]);
      }
    }, 600);
  };

  const handleQuickAction = async (cmd: string) => {
    setInputText(cmd);
    setIsAutoPlaying(false);
    await onSendMessage(cmd);
  };

  const handleNextScenario = () => {
    setScenarioIndex((prev) => (prev + 1) % AUTOMATED_SCENARIOS.length);
    setCustomMessages([]);
  };

  const activeMessages = customMessages.length > 0
    ? [...currentScenario.messages, ...customMessages]
    : currentScenario.messages;

  return (
    <div 
      className="mx-auto h-[440px] sm:h-[490px] lg:h-[520px] xl:h-[550px] w-[300px] sm:w-[340px] overflow-hidden" 
      style={{ 
        maskImage: 'linear-gradient(to bottom, black 0%, black 78%, transparent 100%)', 
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 78%, transparent 100%)' 
      }}
    >
      <div className="relative mx-auto w-[300px] sm:w-[340px] rounded-[52px] bg-gradient-to-b from-[#dedee2] via-[#8e8e93] to-[#444448] p-[9px] shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
        
        {/* Inner Screen Chassis */}
        <div className="relative h-[650px] overflow-hidden rounded-[43px] bg-[#1c1c1e] ring-1 ring-black/80 flex flex-col">
        
        {/* Dynamic Island */}
        <div className="absolute top-0 left-1/2 z-30 h-[34px] w-[132px] -translate-x-1/2 rounded-b-[20px] bg-black" aria-hidden="true">
          <span className="absolute top-[12px] left-[43px] h-[7px] w-[47px] rounded-full bg-[#242426]"></span>
          <span className="absolute top-[11px] right-[19px] size-[9px] rounded-full bg-[#101012] ring-1 ring-[#35353a]"></span>
        </div>

        {/* Status Bar */}
        <div className="flex h-[49px] items-center justify-between px-6 pt-1 text-white z-20 shrink-0">
          <span className="text-[12px] font-semibold tracking-[-0.02em]">18:35</span>
          <span className="flex items-center gap-1.5" aria-hidden="true">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-4 h-4" />
          </span>
        </div>

        {/* Strategy Condition Auto-Ticker Ribbon */}
        <div className="px-4 py-1.5 bg-[#252528] border-b border-white/5 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-ping shrink-0" />
            <span className="text-[10px] font-semibold text-[#eeeeeb] truncate tracking-tight">
              Watching: <span className="text-white underline decoration-white/30">{currentScenario.name}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Dots indicator */}
            <div className="flex items-center gap-1">
              {AUTOMATED_SCENARIOS.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setScenarioIndex(idx);
                    setCustomMessages([]);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === scenarioIndex ? 'bg-white w-3' : 'bg-white/30'
                  }`}
                  aria-label={`Jump to ${s.name}`}
                />
              ))}
            </div>

            <button
              onClick={() => setIsAutoPlaying((prev) => !prev)}
              className="text-white/60 hover:text-white p-1"
              title={isAutoPlaying ? 'Pause rotation' : 'Resume auto-rotation'}
            >
              {isAutoPlaying ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
            </button>
          </div>
        </div>

        {/* iMessage Contact Header */}
        <div className="px-4 py-2 bg-[#202022]/90 border-b border-white/5 flex items-center justify-between shrink-0 z-10 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#0a84ff] to-[#30d158] flex items-center justify-center text-slate-950 font-bold text-[11px] shadow-sm">
              AB
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-semibold text-white tracking-tight">Afterbell</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]"></span>
              </div>
              <p className="text-[10px] text-white/50 leading-none">
                Bitget Agent Hub • Paper Mode
              </p>
            </div>
          </div>
          <span className="text-[10px] text-white/60 bg-white/5 px-2 py-0.5 rounded-full font-mono">
            iMessage
          </span>
        </div>

        {/* Chat Messages Feed with Smooth Opacity Transition */}
        <div 
          key={currentScenario.id + customMessages.length}
          className="flex-1 overflow-y-auto px-3.5 pt-3 pb-2 space-y-3 no-scrollbar text-xs transition-opacity duration-500 ease-in-out"
        >
          {activeMessages.map((msg, index) => {
            const isAgent = msg.sender === 'AFTERBELL_AGENT';
            return (
              <div
                key={index}
                className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'} chat-message-enter`}
              >
                <div
                  className={`max-w-[88%] rounded-[18px] px-3.5 py-2.5 whitespace-pre-wrap leading-[1.35] text-[13px] font-sans ${
                    isAgent
                      ? 'bg-[#3a3a3c] text-white rounded-bl-[5px] shadow-sm'
                      : 'bg-[#0a84ff] text-white rounded-br-[5px]'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-white/40 mt-1 px-1 font-mono">
                  {msg.time}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-3 py-1.5 bg-[#18181a] border-t border-white/5 flex items-center gap-1.5 text-[11px] overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => handleQuickAction('YES')}
            disabled={isSending}
            className="px-2.5 py-1 rounded-full bg-[#30d158]/20 hover:bg-[#30d158]/30 text-[#30d158] font-semibold transition-all disabled:opacity-50 text-[11px]"
          >
            Reply "YES"
          </button>
          <button
            onClick={() => handleQuickAction('NO')}
            disabled={isSending}
            className="px-2.5 py-1 rounded-full bg-[#ff453a]/20 hover:bg-[#ff453a]/30 text-[#ff453a] font-semibold transition-all disabled:opacity-50 text-[11px]"
          >
            Reply "NO"
          </button>
          <button
            onClick={handleNextScenario}
            className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-white/80 font-mono transition-all text-[11px] flex items-center gap-1"
          >
            <span>Next Scenario</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* iMessage Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-[#18181a] border-t border-white/5 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="iMessage..."
            className="flex-1 bg-[#2c2c2e] border border-white/10 text-white placeholder-white/40 text-[13px] rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#0a84ff] transition-all"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="w-8 h-8 rounded-full bg-[#0a84ff] hover:bg-[#0071e3] text-white flex items-center justify-center transition-all disabled:opacity-40 shrink-0"
          >
            <Send className="w-3.5 h-3.5 fill-current" />
          </button>
        </form>

      </div>
    </div>
  </div>
  );
};
