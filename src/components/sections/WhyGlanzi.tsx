import React from 'react';
import { PRINCIPLES } from '../../data/principles';
import { Target, Users, RefreshCw, BarChart2 } from 'lucide-react';

export const WhyGlanzi: React.FC = () => {
  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return Target;
      case 1:
        return Users;
      case 2:
        return RefreshCw;
      case 3:
        return BarChart2;
      default:
        return Target;
    }
  };

  return (
    <section className="relative py-28 bg-[#080A09] border-t border-[rgba(220,235,215,0.08)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs text-[#C7FF45] tracking-widest uppercase font-semibold">
              // WHY GLANZI
            </span>
            <div className="h-[1px] w-12 bg-[#C7FF45]/40" />
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#F5F7F2] tracking-tight mb-4">
            Thoughtful by design. Technical by nature.
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#9BA39A]">
            We operate by four non-negotiable engineering principles that safeguard our clients from architectural debt and superficial hype.
          </p>
        </div>

        {/* Four Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {PRINCIPLES.map((p, index) => {
            const Icon = getIcon(index);
            return (
              <div
                key={p.title}
                className="group p-8 rounded-2xl bg-[#0D100E] border border-[rgba(220,235,215,0.1)] hover:border-[rgba(199,255,69,0.35)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-xl bg-[#131713] border border-[rgba(220,235,215,0.1)] text-[#C7FF45] group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs text-[#697168] group-hover:text-[#C7FF45] transition-colors">
                      0{index + 1}
                    </span>
                  </div>

                  <span className="font-mono text-[11px] text-[#C7FF45] uppercase tracking-wider block mb-2 font-semibold">
                    {p.title}
                  </span>

                  <h3 className="font-display text-xl font-bold text-[#F5F7F2] mb-3 group-hover:text-white transition-colors">
                    {p.headline}
                  </h3>

                  <p className="font-sans text-sm text-[#9BA39A] leading-relaxed mb-6">
                    {p.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[rgba(220,235,215,0.08)]">
                  <div className="font-mono text-[11px] text-[#697168]">
                    <span className="text-[#9BA39A] font-semibold mr-1">Engineering Commitment:</span>
                    {p.technicalImplication}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
