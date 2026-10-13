import React, { useState } from 'react';
import { HelpCircle, GitFork, Cpu, CheckCircle } from 'lucide-react';

export const BrandIntro: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const inquirySteps = [
    {
      icon: HelpCircle,
      tag: '01 / INQUIRY',
      title: 'Question the root problem',
      desc: 'Instead of applying AI blindly, we ask: what is the fundamental bottleneck? Does this require a deep neural network, or deterministic distributed logic?'
    },
    {
      icon: GitFork,
      tag: '02 / ARCHITECTURE',
      title: 'Formulate minimal architecture',
      desc: 'We map out data boundaries, latency budgets, and security vectors before writing line one. Simplicity is prioritized over trendy complexity.'
    },
    {
      icon: Cpu,
      tag: '03 / SYNTHESIS',
      title: 'Engineer with strict discipline',
      desc: 'Type-safe systems, hardened containerized runtimes, and observable event streams that survive hostile production environments.'
    },
    {
      icon: CheckCircle,
      tag: '04 / UTILITY',
      title: 'Deliver dependable outcome',
      desc: 'Software that functions reliably day after day, producing clear business leverage and measurable technical value.'
    }
  ];

  return (
    <section id="mission" className="relative py-28 bg-[#0D100E] border-y border-[rgba(220,235,215,0.08)] overflow-hidden">
      {/* Background Subtle Tech Lines */}
      <div className="absolute inset-0 bg-grid-fine opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-6">
          <span className="font-mono text-xs text-[#C7FF45] tracking-widest uppercase font-semibold">
            // OUR MISSION
          </span>
          <div className="h-[1px] w-12 bg-[#C7FF45]/40" />
        </div>

        {/* Split Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Oversized Statement */}
          <div className="lg:col-span-6">
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-[#F5F7F2] leading-[1.12] mb-8">
              Great technology starts with{' '}
              <span className="text-[#C7FF45] underline decoration-[rgba(199,255,69,0.3)] decoration-wavy underline-offset-8">
                better questions.
              </span>
            </h2>

            <div className="space-y-6 text-[#9BA39A] font-sans text-base sm:text-lg leading-relaxed">
              <p>
                We bring together software engineering, intelligent systems, and thoughtful product design to create technology that solves meaningful problems.
              </p>
              <p className="border-l-2 border-[#C7FF45]/50 pl-4 text-[#F5F7F2] font-medium text-base">
                From an early idea to a production-ready application, we focus on making complex technology useful, intuitive, and dependable.
              </p>
            </div>
          </div>

          {/* Right: Interactive Inquiry-to-System Pipeline */}
          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#131713] border border-[rgba(220,235,215,0.12)] shadow-2xl relative">
              <div className="flex items-center justify-between pb-5 mb-6 border-b border-[rgba(220,235,215,0.08)]">
                <span className="font-mono text-xs text-[#697168] uppercase tracking-wider">
                  The Inquiry Pipeline
                </span>
                <span className="font-mono text-[11px] text-[#C7FF45] bg-[#182018] px-2.5 py-1 rounded-full border border-[rgba(199,255,69,0.2)]">
                  ACTIVE FRAMEWORK
                </span>
              </div>

              <div className="space-y-4">
                {inquirySteps.map((step, idx) => {
                  const Icon = step.icon;
                  const isCurrent = activeStep === idx;
                  return (
                    <div
                      key={step.tag}
                      onClick={() => setActiveStep(idx)}
                      className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                        isCurrent
                          ? 'bg-[#181E18] border-[rgba(199,255,69,0.4)] shadow-[0_0_15px_rgba(199,255,69,0.1)]'
                          : 'bg-[#0D100E]/70 border-[rgba(220,235,215,0.06)] hover:border-[rgba(220,235,215,0.2)]'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-2.5 rounded-lg border transition-colors ${
                            isCurrent
                              ? 'bg-[#131713] border-[#C7FF45] text-[#C7FF45]'
                              : 'bg-[#131713] border-[rgba(220,235,215,0.1)] text-[#9BA39A]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-[10px] text-[#C7FF45] tracking-wider">
                              {step.tag}
                            </span>
                            {isCurrent && (
                              <span className="font-mono text-[9px] text-[#C7FF45] bg-[#C7FF45]/10 px-1.5 py-0.5 rounded">
                                SELECTED
                              </span>
                            )}
                          </div>
                          <h3 className="font-display text-sm font-semibold text-[#F5F7F2] mb-1">
                            {step.title}
                          </h3>
                          <p className="font-sans text-xs text-[#9BA39A] leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-[rgba(220,235,215,0.08)] flex items-center justify-between font-mono text-[11px] text-[#697168]">
                <span>METHODOLOGY // EMPIRICAL</span>
                <span className="text-[#C7FF45]">0% HYPE • 100% SPEC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
