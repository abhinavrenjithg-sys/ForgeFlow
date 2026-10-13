import React, { useState } from 'react';
import { SOLUTIONS } from '../../data/solutions';
import type { Solution } from '../../types';
import { Brain, Code2, Cpu, BarChart3, ArrowUpRight, Check, ChevronRight } from 'lucide-react';

interface SolutionsSectionProps {
  onSelectSolution?: (solution: Solution) => void;
  onConsultSolution?: (solutionId: string) => void;
}

export const SolutionsSection: React.FC<SolutionsSectionProps> = ({
  onSelectSolution,
  onConsultSolution
}) => {
  const [activeSolutionId, setActiveSolutionId] = useState<string>('ai-ml');

  const getIcon = (id: string) => {
    switch (id) {
      case 'ai-ml':
        return Brain;
      case 'software-engineering':
        return Code2;
      case 'intelligent-automation':
        return Cpu;
      case 'decision-intelligence':
        return BarChart3;
      default:
        return Brain;
    }
  };

  const handleCardClick = (solution: Solution) => {
    setActiveSolutionId(solution.id);
    if (onSelectSolution) {
      onSelectSolution(solution);
    }
  };

  return (
    <section id="solutions" className="relative py-28 bg-[#080A09] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs text-[#C7FF45] tracking-widest uppercase font-semibold">
                // WHAT WE BUILD
              </span>
              <div className="h-[1px] w-12 bg-[#C7FF45]/40" />
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#F5F7F2] tracking-tight max-w-xl">
              Technology designed to move ideas forward.
            </h2>
          </div>
          <p className="font-sans text-sm sm:text-base text-[#9BA39A] max-w-md">
            Four specialized engineering disciplines delivering enterprise resilience, computational speed, and intuitive digital product architecture.
          </p>
        </div>

        {/* Asymmetric Bento Capabilities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {SOLUTIONS.map((sol, index) => {
            const Icon = getIcon(sol.id);
            const isWide = index === 0 || index === 3; // Asymmetric bento: 7 cols & 5 cols
            const isSelected = activeSolutionId === sol.id;

            return (
              <div
                key={sol.id}
                onClick={() => handleCardClick(sol)}
                className={`${
                  isWide ? 'lg:col-span-7' : 'lg:col-span-5'
                } group relative p-7 sm:p-9 rounded-2xl bg-[#0D100E] border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[rgba(199,255,69,0.35)] shadow-[0_0_30px_rgba(199,255,69,0.08)] bg-[#111612]'
                    : 'border-[rgba(220,235,215,0.1)] hover:border-[rgba(220,235,215,0.25)] hover:bg-[#101410]'
                }`}
              >
                {/* Top Row: Index, Icon, Metric */}
                <div>
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[#C7FF45] font-semibold tracking-wider">
                        {sol.number}
                      </span>
                      <div className="p-2.5 rounded-xl bg-[#131713] border border-[rgba(220,235,215,0.1)] text-[#C7FF45] group-hover:scale-105 transition-transform duration-200">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <span className="font-mono text-[11px] text-[#9BA39A] bg-[#131713] px-3 py-1 rounded-full border border-[rgba(220,235,215,0.08)]">
                      {sol.metrics}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="font-display text-2xl font-bold text-[#F5F7F2] mb-2 group-hover:text-white transition-colors">
                    {sol.title}
                  </h3>
                  <div className="font-mono text-xs text-[#C7FF45] mb-4">
                    {sol.tagline}
                  </div>
                  <p className="font-sans text-sm text-[#9BA39A] leading-relaxed mb-6">
                    {sol.description}
                  </p>

                  {/* Capabilities List */}
                  <div className="space-y-2 mb-8">
                    {sol.capabilities.slice(0, 3).map((cap, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-[#F5F7F2]/90 font-mono">
                        <Check className="w-3.5 h-3.5 text-[#C7FF45] shrink-0" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Tech Stack & Action Footer */}
                <div className="pt-6 border-t border-[rgba(220,235,215,0.08)] flex flex-wrap items-center justify-between gap-4">
                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {sol.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#131713] text-[#9BA39A] border border-[rgba(220,235,215,0.06)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Link */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onConsultSolution) {
                        onConsultSolution(sol.id);
                      } else {
                        const contactEl = document.querySelector('#contact');
                        contactEl?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-[#C7FF45] hover:text-white transition-colors group/btn"
                  >
                    <span>Request Spec</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Capability Assurance Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-[#0D100E] border border-[rgba(220,235,215,0.1)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3 text-[#9BA39A]">
            <span className="w-2 h-2 rounded-full bg-[#C7FF45]" />
            <span>Need a custom architecture or hybrid deployment?</span>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-[#C7FF45] hover:underline font-semibold"
          >
            <span>Consult our engineering architects</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
