'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Signal, Wifi, BatteryMedium, Send, Check, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { IMessageChatEntry } from '@/services/photon-client';
import { StrategyModule } from '@/services/strategy-modules';

interface IPhoneFrameProps {
  chatHistory: IMessageChatEntry[];
  onSendMessage: (text: string) => Promise<void>;
  isSending: boolean;
  selectedStrategy: StrategyModule;
  onSelectStrategy: (mod: StrategyModule) => void;
}

export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({
  chatHistory,
  onSendMessage,
  isSending,
  selectedStrategy,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSending) return;
    const msg = inputText.trim();
    setInputText('');
    await onSendMessage(msg);
  };

  const handleQuickAction = async (cmd: string) => {
    if (isSending) return;
    await onSendMessage(cmd);
  };

  return (
    <div className="relative mx-auto w-[310px] sm:w-[350px] lg:w-[360px] rounded-[52px] bg-gradient-to-b from-[#dedee2] via-[#8e8e93] to-[#444448] p-[9px] shadow-[0_32px_80px_rgba(0,0,0,0.45)]">
      
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

        {/* iMessage Contact Header */}
        <div className="px-4 py-2 bg-[#202022]/90 border-b border-white/5 flex items-center justify-between shrink-0 z-10 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-slate-950 font-bold text-[11px] shadow-sm">
              AB
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-semibold text-white tracking-tight">Afterbell</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
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

        {/* Chat Messages Feed */}
        <div className="flex-1 overflow-y-auto px-3.5 pt-3 pb-2 space-y-3 no-scrollbar text-xs">
          {chatHistory.map((msg) => {
            const isAgent = msg.sender === 'AFTERBELL_AGENT';
            return (
              <div
                key={msg.id}
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
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
            onClick={() => handleQuickAction('STATUS')}
            disabled={isSending}
            className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-white/80 font-mono transition-all disabled:opacity-50 text-[11px]"
          >
            STATUS
          </button>
          <button
            onClick={() => handleQuickAction('MENU')}
            disabled={isSending}
            className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-white/80 font-mono transition-all disabled:opacity-50 text-[11px]"
          >
            MENU
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
  );
};
