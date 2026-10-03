'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Signal, Wifi, BatteryMedium, Send, Play, Pause, ChevronRight } from 'lucide-react';

export interface StrategyScenario {
  id: string;
  name: string;
  categoryTag: string;
  messages: {
    sender: 'AFTERBELL_AGENT' | 'USER';
    time: string;
    text: string;
    meta?: string;
  }[];
}

export const AUTOMATED_SCENARIOS: StrategyScenario[] = [
  {
    id: 'congressional',
    name: 'Congressional Trades',
    categoryTag: 'STOCK Act Tracker',
    messages: [
      {
        sender: 'USER',
        time: '18:14',
        text: 'Run Pelosi Watch on NVDA and TSLA.',
      },
      {
        sender: 'AFTERBELL_AGENT',
        time: '18:14',
        text: "Done. I'll monitor new STOCK Act disclosures and price momentum.",
        meta: 'Strategy live · NVDA + TSLA',
      },
      {
        sender: 'AFTERBELL_AGENT',
        time: '18:32',
        text: '🚨 Pelosi filed: 50x NVDA $120 Calls ($1.25M). rNVDA @ $128.45 now.\n\nLONG rNVDA $440 — Confidence 92%\n\nReply YES to execute.',
      },
      {
        sender: 'USER',
        time: '18:33',
        text: 'YES',
      },
      {
        sender: 'AFTERBELL_AGENT',
        time: '18:33',
        text: '✅ Filled: 3.42 rNVDA @ $128.45\nOrder ID: bg_paper_plsi_928f',
        meta: 'Bitget Paper · Isolated Account',
      },
    ],
  },
  {
    id: 'x_accounts',
    name: 'X Account Tracker',
    categoryTag: '@elonmusk Tracker',
    messages: [
      {
        sender: 'USER',
        time: '09:12',
        text: 'Watch @elonmusk and @unusual_whales for TSLA signals.',
      },
      {
        sender: 'AFTERBELL_AGENT',
        time: '09:12',
        text: "On it. Watching X feeds for market-moving commentary in real-time.",
        meta: 'Monitoring @elonmusk · @unusual_whales',
      },
      {
        sender: 'AFTERBELL_AGENT',
        time: '09:28',
        text: '🚨 @elonmusk: "FSD v13 permits granted for Shanghai fleet."\n\nrTSLA @ $242.80 ↑\nLONG $400 — Confidence 86%\n\nReply YES to execute.',
      },
      {
        sender: 'USER',
        time: '09:29',
        text: 'YES',
      },
      {
        sender: 'AFTERBELL_AGENT',
        time: '09:29',
        text: '✅ Filled: 1.65 rTSLA @ $242.80\nOrder ID: bg_paper_tsla_412e',
        meta: 'Bitget Paper · Isolated Account',
      },
    ],
  },
  {
    id: 'ipo_filings',
    name: 'IPO Filing Watch',
    categoryTag: 'SEC EDGAR S-1',
    messages: [
      {
        sender: 'USER',
        time: '14:05',
        text: 'Watch SEC S-1 filings for AI and cloud infrastructure.',
      },
      {
        sender: 'AFTERBELL_AGENT',
        time: '14:05',
        text: 'Active. Scanning EDGAR for new S-1 / 8-K filings now.',
        meta: 'Watching AI · Cloud · Silicon',
      },
      {
        sender: 'AFTERBELL_AGENT',
        time: '14:22',
        text: '🚨 S-1 amendment: $4.2B accelerator procurement with Tier-1 silicon partners.\n\nLONG rNVDA @ $128.45 ($450)\nConfidence 88%\n\nReply YES to execute.',
      },
      {
        sender: 'USER',
        time: '14:23',
        text: 'YES',
      },
      {
        sender: 'AFTERBELL_AGENT',
        time: '14:23',
        text: '✅ Filled: 3.50 rNVDA @ $128.45\nOrder ID: bg_paper_s1_78a1',
        meta: 'Bitget Paper · Isolated Account',
      },
    ],
  },
  {
    id: 'after_hours_rtoken',
    name: 'After-Hours rTokens',
    categoryTag: 'Weekend Temporal Gap',
    messages: [
      {
        sender: 'USER',
        time: '21:10',
        text: 'Monitor weekend rToken pricing for MSTR.',
      },
      {
        sender: 'AFTERBELL_AGENT',
        time: '21:10',
        text: 'Running. 24/7 rToken engine active for weekend gap.',
        meta: 'Tracking rMSTR · rNVDA · rTSLA',
      },
      {
        sender: 'AFTERBELL_AGENT',
        time: '21:40',
        text: '🚨 BTC +4.8% → MSTR beta implies +5.4% Monday reopen gap.\n\nLONG rMSTR @ $134.20 ($350)\nConfidence 91%\n\nReply YES to execute.',
      },
      {
        sender: 'USER',
        time: '21:41',
        text: 'YES',
      },
      {
        sender: 'AFTERBELL_AGENT',
        time: '21:41',
        text: '✅ Filled: 2.61 rMSTR @ $134.20\nOrder ID: bg_paper_mstr_891d',
        meta: 'Bitget Paper · Isolated Account',
      },
    ],
  },
];

interface IPhoneFrameProps {
  onSendMessage: (text: string) => Promise<void>;
  isSending: boolean;
  selectedScenarioIndex?: number;
  onSelectScenario?: (index: number) => void;
}

export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({
  onSendMessage,
  isSending,
  selectedScenarioIndex,
  onSelectScenario,
}) => {
  const [internalScenarioIndex, setInternalScenarioIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [inputText, setInputText] = useState('');
  const [customMessages, setCustomMessages] = useState<any[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scenarioIndex =
    selectedScenarioIndex !== undefined ? selectedScenarioIndex : internalScenarioIndex;

  const setScenarioIndex = (idx: number) => {
    setInternalScenarioIndex(idx);
    if (onSelectScenario) {
      onSelectScenario(idx);
    }
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setScenarioIndex((scenarioIndex + 1) % AUTOMATED_SCENARIOS.length);
      setCustomMessages([]);
    }, 6500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, scenarioIndex]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [scenarioIndex, customMessages]);

  const currentScenario = AUTOMATED_SCENARIOS[scenarioIndex] || AUTOMATED_SCENARIOS[0];

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSending) return;
    const text = inputText.trim();
    setInputText('');
    setIsAutoPlaying(false);

    setCustomMessages((prev) => [...prev, { sender: 'USER', time: 'now', text }]);
    await onSendMessage(text);

    setTimeout(() => {
      if (text.toUpperCase() === 'YES') {
        setCustomMessages((prev) => [
          ...prev,
          {
            sender: 'AFTERBELL_AGENT',
            time: 'now',
            text: '✅ Order executed on Bitget paper account.\nPosition open.',
            meta: 'Bitget Paper · Isolated Account',
          },
        ]);
      } else if (text.toUpperCase() === 'NO') {
        setCustomMessages((prev) => [
          ...prev,
          {
            sender: 'AFTERBELL_AGENT',
            time: 'now',
            text: '❌ Proposal cancelled. No order placed.',
          },
        ]);
      }
    }, 600);
  };

  const handleQuickAction = async (cmd: string) => {
    setIsAutoPlaying(false);
    await onSendMessage(cmd);
  };

  const handleNextScenario = () => {
    setScenarioIndex((scenarioIndex + 1) % AUTOMATED_SCENARIOS.length);
    setCustomMessages([]);
  };

  const activeMessages =
    customMessages.length > 0
      ? [...currentScenario.messages, ...customMessages]
      : currentScenario.messages;

  return (
    <div className="relative mx-auto" style={{ width: 'min(300px, 88vw)' }}>

      {/* iPhone 16 Pro outer shell */}
      <div
        className="relative w-full rounded-[52px] shadow-[0_32px_80px_rgba(0,0,0,0.75),0_0_0_1px_rgba(255,255,255,0.07)]"
        style={{
          background: 'linear-gradient(160deg, #e8e8ec 0%, #9d9da2 40%, #505055 100%)',
          padding: '8px',
        }}
      >
        {/* Side buttons - left */}
        <div className="absolute left-[-3px] top-[108px] w-[3px] h-[34px] rounded-l-full bg-[#9d9da2]" aria-hidden="true" />
        <div className="absolute left-[-3px] top-[154px] w-[3px] h-[62px] rounded-l-full bg-[#9d9da2]" aria-hidden="true" />
        <div className="absolute left-[-3px] top-[228px] w-[3px] h-[62px] rounded-l-full bg-[#9d9da2]" aria-hidden="true" />
        {/* Side buttons - right */}
        <div className="absolute right-[-3px] top-[154px] w-[3px] h-[92px] rounded-r-full bg-[#9d9da2]" aria-hidden="true" />

        {/* Inner screen */}
        <div
          className="relative w-full rounded-[44px] overflow-hidden bg-[#131315] flex flex-col"
          style={{ height: 'min(620px, calc(100svh - 160px))' }}
        >
          {/* Dynamic Island */}
          <div
            className="absolute top-0 left-1/2 z-40 -translate-x-1/2 bg-black"
            style={{ width: '120px', height: '34px', borderRadius: '0 0 20px 20px' }}
            aria-hidden="true"
          >
            <span className="absolute top-[12px] left-[28px] h-[8px] w-[48px] rounded-full bg-[#1a1a1c]" />
            <span className="absolute top-[11px] right-[14px] h-[10px] w-[10px] rounded-full bg-[#0d0d10] ring-1 ring-[#2c2c2e]" />
          </div>

          {/* Status bar */}
          <div className="flex h-[50px] items-end justify-between px-6 pb-2 text-white z-30 shrink-0">
            <span className="text-[13px] font-semibold tracking-[-0.02em]">18:35</span>
            <span className="flex items-center gap-1.5" aria-hidden="true">
              <Signal className="w-[14px] h-[14px]" />
              <Wifi className="w-[14px] h-[14px]" />
              <BatteryMedium className="w-[18px] h-[18px]" />
            </span>
          </div>

          {/* Contact header - centered avatar + name, Messenger thread top */}
          <div className="px-4 pb-3 flex flex-col items-center shrink-0 z-20">
            <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-tr from-[#0a84ff] to-[#00c6ff] flex items-center justify-center text-white font-bold text-[14px] shadow-lg shadow-blue-500/20 mb-1.5">
              AB
            </div>
            <span className="text-[13px] font-semibold text-white tracking-tight">Afterbell</span>
            <span className="text-[11px] text-[#0084ff] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0084ff] animate-pulse"></span>
              Messenger • Active Now
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.06] mx-4 shrink-0" />

          {/* Chat feed */}
          <div className="relative flex-1 min-h-0 overflow-hidden">
            <div
              key={currentScenario.id + customMessages.length}
              ref={chatContainerRef}
              className="h-full overflow-y-auto px-4 pt-3 pb-4 space-y-3 no-scrollbar"
            >
              {activeMessages.map((msg, index) => {
                const isAgent = msg.sender === 'AFTERBELL_AGENT';
                return (
                  <div
                    key={index}
                    className={`flex gap-2 ${isAgent ? 'items-end justify-start' : 'items-end justify-end'}`}
                  >
                    {isAgent && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0a84ff] to-[#00c6ff] flex items-center justify-center text-white font-bold text-[8px] shrink-0 mb-0.5">
                        AB
                      </div>
                    )}

                    <div className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'} max-w-[82%]`}>
                      {isAgent && (
                        <span className="text-[10px] text-[#8e8e93] mb-1 ml-0.5 font-medium">
                          Afterbell
                        </span>
                      )}

                      <div
                        className={`rounded-[18px] px-3.5 py-2.5 whitespace-pre-wrap leading-[1.4] text-[13px] font-sans ${
                          isAgent
                            ? 'bg-[#2c2c2e] text-white rounded-bl-[4px]'
                            : 'bg-[#0a84ff] text-white rounded-br-[4px]'
                        }`}
                      >
                        {msg.text}
                      </div>

                      {isAgent && msg.meta && (
                        <span className="text-[9px] text-[#636366] mt-1 ml-0.5 font-mono">
                          {msg.meta}
                        </span>
                      )}

                      <span className="text-[9px] text-[#636366] mt-0.5 px-0.5">
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scenario strip */}
          <div className="px-4 py-2 bg-[#1c1c1e] border-t border-white/[0.06] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-pulse shrink-0" />
              <span className="text-[9px] font-medium text-[#8e8e93] truncate">
                {currentScenario.name}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1">
                {AUTOMATED_SCENARIOS.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setScenarioIndex(idx);
                      setCustomMessages([]);
                      setIsAutoPlaying(false);
                    }}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === scenarioIndex ? 'bg-white w-3' : 'bg-white/25 w-1.5'
                    }`}
                    aria-label={`Jump to ${s.name}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setIsAutoPlaying((p) => !p)}
                className="text-white/40 hover:text-white transition-colors p-0.5"
                title={isAutoPlaying ? 'Pause' : 'Resume'}
              >
                {isAutoPlaying ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
              </button>
            </div>
          </div>

          {/* Quick action pills */}
          <div className="px-3 py-2 bg-[#1c1c1e] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <button
              onClick={() => handleQuickAction('YES')}
              disabled={isSending}
              className="px-3 py-1 rounded-full bg-[#30d158]/15 hover:bg-[#30d158]/25 text-[#30d158] font-semibold text-[10px] transition-all disabled:opacity-50 shrink-0"
            >
              Reply "YES"
            </button>
            <button
              onClick={() => handleQuickAction('NO')}
              disabled={isSending}
              className="px-3 py-1 rounded-full bg-[#ff453a]/15 hover:bg-[#ff453a]/25 text-[#ff453a] font-semibold text-[10px] transition-all disabled:opacity-50 shrink-0"
            >
              Reply "NO"
            </button>
            <button
              onClick={handleNextScenario}
              className="px-3 py-1 rounded-full bg-white/8 hover:bg-white/15 text-white/60 font-mono text-[10px] transition-all flex items-center gap-1 shrink-0"
            >
              Next <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Messenger input bar */}
          <form
            onSubmit={handleSend}
            className="px-3 pb-5 pt-2 bg-[#1c1c1e] border-t border-white/[0.06] flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Message..."
              className="flex-1 bg-[#2c2c2e] border border-white/8 text-white placeholder-[#636366] text-[13px] rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#0a84ff]/60 transition-all"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="w-8 h-8 rounded-full bg-[#0a84ff] hover:bg-[#0071e3] text-white flex items-center justify-center transition-all disabled:opacity-30 shrink-0"
            >
              <Send className="w-3.5 h-3.5 fill-current" />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom fade - blends phone into page background */}
      <div
        className="absolute inset-x-[-24px] bottom-0 h-52 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to top, #101010 0%, #101010 15%, rgba(16,16,16,0.6) 55%, transparent 100%)',
        }}
        aria-hidden="true"
      />
    </div>
  );
};
