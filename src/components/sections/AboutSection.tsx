import React from 'react';
import { Terminal, Code, Cpu, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-28 bg-[#0D100E] border-t border-[rgba(220,235,215,0.08)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Label */}
        <div className="flex items-center gap-2 mb-6">
          <span className="font-mono text-xs text-[#C7FF45] tracking-widest uppercase font-semibold">
            // THE THINKING BEHIND THE BUILD
          </span>
          <div className="h-[1px] w-12 bg-[#C7FF45]/40" />
        </div>

        {/* Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Oversized Typography & Manifesto */}
          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-[#F5F7F2] leading-[1.12] mb-8">
              We believe the best technology makes difficult things{' '}
              <span className="text-[#C7FF45]">feel simple.</span>
            </h2>

            <div className="space-y-6 text-[#9BA39A] font-sans text-base sm:text-lg leading-relaxed">
              <p>
                GLANZI is an AI and software company focused on building intelligent applications, useful digital products, and thoughtfully engineered technology.
              </p>
              <p>
                We combine technical experimentation with practical product thinking to turn ideas into experiences people can actually use.
              </p>
            </div>

            {/* Subtle Engineering Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-10 mt-10 border-t border-[rgba(220,235,215,0.08)]">
              <div>
                <div className="font-mono text-2xl font-bold text-[#F5F7F2]">100%</div>
                <div className="font-mono text-[11px] text-[#697168] mt-1">TYPE-SAFE APIS</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-[#C7FF45]">Sub-20ms</div>
                <div className="font-mono text-[11px] text-[#697168] mt-1">INFERENCE BUDGET</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-[#F5F7F2]">Zero-Lock</div>
                <div className="font-mono text-[11px] text-[#697168] mt-1">MODULAR SCHEMAS</div>
              </div>
            </div>
          </div>

          {/* Right Column: Subtle Abstract Computational Geometry Graphic */}
          <div className="lg:col-span-5">
            <div className="p-8 rounded-2xl bg-[#131713] border border-[rgba(220,235,215,0.12)] shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[rgba(220,235,215,0.08)] font-mono text-[11px] text-[#697168]">
                <span>ARCHITECTURAL ETHOS</span>
                <span className="text-[#C7FF45]">GLANZI.MANIFESTO</span>
              </div>

              {/* Code snippet / Architectural Axioms */}
              <div className="space-y-4 font-mono text-xs">
                <div className="p-3.5 rounded-lg bg-[#080A09] border border-[rgba(220,235,215,0.06)] flex items-start gap-3">
                  <Terminal className="w-4 h-4 text-[#C7FF45] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#C7FF45]">fn</span> <span className="text-[#F5F7F2]">engineer_with_rigor</span>() -&gt; Result&lt;Reliability, Debt&gt;
                    <div className="text-[11px] text-[#697168] mt-1">// Reject hype; prioritize verified correctness.</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#080A09] border border-[rgba(220,235,215,0.06)] flex items-start gap-3">
                  <Code className="w-4 h-4 text-[#C7FF45] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#C7FF45]">const</span> <span className="text-[#F5F7F2]">HUMAN_ERGONOMICS</span> = <span className="text-[#C7FF45]">Priority::Supreme</span>;
                    <div className="text-[11px] text-[#697168] mt-1">// Tools must reduce cognitive load, not increase it.</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#080A09] border border-[rgba(220,235,215,0.06)] flex items-start gap-3">
                  <Cpu className="w-4 h-4 text-[#C7FF45] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#C7FF45]">pub struct</span> <span className="text-[#F5F7F2]">EvolutionarySystem</span>;
                    <div className="text-[11px] text-[#697168] mt-1">// Built with clear interfaces that adapt cleanly.</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[rgba(220,235,215,0.08)] flex items-center justify-between font-mono text-[10px] text-[#697168]">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#C7FF45]" />
                  <span>HONEST TECHNICAL CREDIBILITY</span>
                </span>
                <span>NO FABRICATED TESTIMONIALS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
