import React, { useState, useRef, useEffect } from 'react';
import { Send, Smartphone, ShieldCheck, Check, Sparkles, AlertCircle } from 'lucide-react';
import { IMessageChatEntry } from '@/services/photon-client';

interface IMessageSimulatorProps {
  chatHistory: IMessageChatEntry[];
  onSendMessage: (text: string) => Promise<void>;
  isSending: boolean;
}

export const IMessageSimulator: React.FC<IMessageSimulatorProps> = ({
  chatHistory,
  onSendMessage,
  isSending,
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
    <div className="glass-panel rounded-2xl border border-slate-800 flex flex-col h-[580px] overflow-hidden shadow-2xl relative">
      
      {/* iOS Status & Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-cyan-500/20">
            AB
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-white">Afterbell Agent</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-1 rounded border border-cyan-500/20">
                Photon iMessage
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Bitget Agentic Account • Fund Isolated
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">iMessage Relay</span>
        </div>
      </div>

      {/* Message Chat Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/70 text-xs">
        {chatHistory.map((msg) => {
          const isAgent = msg.sender === 'AFTERBELL_AGENT';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 whitespace-pre-wrap leading-relaxed shadow-sm font-sans ${
                  isAgent
                    ? 'bg-slate-800/90 text-slate-100 rounded-tl-sm border border-slate-700/60'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-tr-sm shadow-blue-500/10'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-slate-500 mt-1 px-1 font-mono">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Pills */}
      <div className="px-3 py-1.5 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] overflow-x-auto scrollbar-none">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mr-1">Quick:</span>
        <button
          onClick={() => handleQuickAction('YES')}
          disabled={isSending}
          className="px-2.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold transition-all disabled:opacity-50"
        >
          Reply "YES" (Approve)
        </button>
        <button
          onClick={() => handleQuickAction('NO')}
          disabled={isSending}
          className="px-2.5 py-1 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold transition-all disabled:opacity-50"
        >
          Reply "NO" (Decline)
        </button>
        <button
          onClick={() => handleQuickAction('STATUS')}
          disabled={isSending}
          className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono transition-all disabled:opacity-50"
        >
          STATUS
        </button>
      </div>

      {/* Input Field */}
      <form onSubmit={handleSend} className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="iMessage (e.g. YES to execute, NO to cancel)..."
          className="flex-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-full px-4 py-2 focus:outline-none focus:border-cyan-500 transition-colors"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="w-8 h-8 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition-all disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5 fill-current" />
        </button>
      </form>

    </div>
  );
};
