import React, { useState, useEffect, useCallback } from 'react';
import { Search, ArrowRight, Terminal, Layers, Cpu, Mail, Globe, Code2 } from 'lucide-react';
import { useToast } from '../ui/useToast';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectAction
}) => {
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const actions = [
    { id: 'home', label: 'Go to Hero / Home', category: 'Navigation', icon: Globe },
    { id: 'solutions', label: 'Explore Engineering Capabilities', category: 'Navigation', icon: Cpu },
    { id: 'products', label: 'Inspect Glanzi Intelligence Studio', category: 'Products', icon: Terminal },
    { id: 'work', label: 'Review Selected Work & Case Studies', category: 'Work', icon: Layers },
    { id: 'approach', label: 'Our Approach & Process', category: 'Process', icon: Code2 },
    { id: 'about', label: 'About Glanzi & Ethos', category: 'About', icon: Terminal },
    { id: 'contact', label: 'Start a Project / Send Brief', category: 'Action', icon: Mail },
    { id: 'copy-email', label: 'Copy Direct Contact Email (contact@glanzi.ai)', category: 'Utility', icon: Mail },
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  const executeCommand = useCallback((id: string) => {
    onClose();
    if (id === 'copy-email') {
      navigator.clipboard.writeText('contact@glanzi.ai');
      showToast('Copied contact@glanzi.ai to clipboard', 'success');
      return;
    }
    onSelectAction(id);
  }, [onClose, onSelectAction, showToast]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onSelectAction('open-palette');
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          executeCommand(filtered[selectedIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose, onSelectAction, executeCommand]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-[#080A09]/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl rounded-2xl bg-[#0D100E] border border-[rgba(220,235,215,0.18)] shadow-2xl overflow-hidden font-mono"
        role="dialog"
        aria-modal="true"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[rgba(220,235,215,0.1)] gap-3 bg-[#131713]">
          <Search className="w-4 h-4 text-[#C7FF45] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or jump to section..."
            className="w-full bg-transparent text-sm text-[#F5F7F2] placeholder-[#697168] focus:outline-none"
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-[#182018] border border-[rgba(220,235,215,0.12)] text-[#697168]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={item.id}
                  onClick={() => executeCommand(item.id)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                    isSelected
                      ? 'bg-[#182018] text-[#C7FF45] border border-[rgba(199,255,69,0.3)]'
                      : 'text-[#9BA39A] hover:bg-[#131713] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#C7FF45]' : 'text-[#697168]'}`} />
                    <span className={isSelected ? 'text-[#F5F7F2] font-semibold' : ''}>
                      {item.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#697168] bg-[#0D100E] px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    {isSelected && <ArrowRight className="w-3.5 h-3.5 text-[#C7FF45]" />}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-[#697168]">
              No commands found for "{query}".
            </div>
          )}
        </div>

        {/* Footer Shortcut Legend */}
        <div className="px-4 py-2 bg-[#080A09] border-t border-[rgba(220,235,215,0.06)] flex items-center justify-between text-[10px] text-[#697168]">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Dismiss</span>
          </div>
          <span className="text-[#C7FF45]">GLANZI COMMAND CORE</span>
        </div>
      </div>
    </div>
  );
};
