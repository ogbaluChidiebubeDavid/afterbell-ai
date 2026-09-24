'use client';

import React from 'react';
import { Landmark, Twitter, FileText, Zap, Check } from 'lucide-react';
import { StrategyModule } from '@/services/strategy-modules';

interface StrategySelectorProps {
  modules: StrategyModule[];
  selectedModule: StrategyModule;
  onSelectModule: (mod: StrategyModule) => void;
  onToggleModule: (id: string) => void;
}

export const StrategySelector: React.FC<StrategySelectorProps> = ({
  modules,
  selectedModule,
  onSelectModule,
  onToggleModule,
}) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'CONGRESSIONAL':
        return <Landmark className="w-3.5 h-3.5" />;
      case 'X_ACCOUNTS':
        return <Twitter className="w-3.5 h-3.5" />;
      case 'IPO_FILINGS':
        return <FileText className="w-3.5 h-3.5" />;
      default:
        return <Zap className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#999] uppercase tracking-[0.12em] font-semibold text-[11px]">
          User-Configured Condition Modules
        </span>
        <span className="text-[#999] text-[11px]">
          Tap to preview & toggle
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {modules.map((mod) => {
          const isSelected = selectedModule.id === mod.id;
          return (
            <div
              key={mod.id}
              onClick={() => onSelectModule(mod)}
              className={`cursor-pointer rounded-2xl p-3 border transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#181818] border-[#eeeeeb] shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
                  : 'bg-[#141414] border-[#292929] hover:border-[#3b3b3b]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-[#eeeeeb] text-[#111]' : 'bg-[#222] text-[#999]'
                  }`}>
                    {getIcon(mod.category)}
                  </div>
                  <span className={`font-semibold text-xs ${isSelected ? 'text-[#eeeeeb]' : 'text-[#ccc]'}`}>
                    {mod.name}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleModule(mod.id);
                  }}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium transition-colors ${
                    mod.isActive
                      ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30'
                      : 'bg-[#2a2a2a] text-[#777]'
                  }`}
                >
                  {mod.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              <p className="text-[11px] text-[#888] line-clamp-2 mt-2 leading-relaxed">
                {mod.description}
              </p>

              <div className="flex items-center justify-between text-[10px] text-[#666] pt-2 mt-2 border-t border-[#222]">
                <span className="truncate max-w-[170px] font-mono">
                  {mod.targets.slice(0, 2).join(', ')}
                </span>
                <span className="text-[#999] font-mono">
                  Bitget {mod.bitgetSkillContext}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
