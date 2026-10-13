import React, { useState } from 'react';
import { PROCESS_STEPS } from '../../data/approach';
import { Check, ChevronRight } from 'lucide-react';

export const HowWeWork: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section id="approach" className="relative py-28 bg-[#0D100E] border-t border-[rgba(220,235,215,0.08)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs text-[#C7FF45] tracking-widest uppercase font-semibold">
                // OUR APPROACH
              </span>
              <div className="h-[1px] w-12 bg-[#C7FF45]/40" />
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#F5F7F2] tracking-tight">
              From the first question to the final build.
            </h2>
          </div>
          <p className="font-sans text-sm sm:text-base text-[#9BA39A] max-w-md">
            A methodical, milestone-driven engineering cycle designed to de-risk complex architectures before full-scale deployment.
          </p>
        </div>

        {/* Timeline Interaction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Vertical Step Selector */}
          <div className="lg:col-span-5 space-y-3">
            {PROCESS_STEPS.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={step.step}
                  onClick={() => setActiveStep(idx)}
                  className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-[#131713] border-[#C7FF45]/50 shadow-[0_0_20px_rgba(199,255,69,0.1)]'
                      : 'bg-[#080A09]/60 border-[rgba(220,235,215,0.08)] hover:border-[rgba(220,235,215,0.2)]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-mono text-sm font-semibold ${
                        isActive ? 'text-[#C7FF45]' : 'text-[#697168]'
                      }`}
                    >
                      {step.step}
                    </span>
                    <div>
                      <div className="font-display text-base font-bold text-[#F5F7F2]">
                        {step.title}
                      </div>
                      <div className="font-mono text-[11px] text-[#697168]">
                        {step.timelinePhase}
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isActive ? 'text-[#C7FF45] translate-x-1' : 'text-[#697168]'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Phase Deliverables & Scope */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-2xl bg-[#131713] border border-[rgba(220,235,215,0.12)] shadow-2xl relative">
              {/* Active Step Header */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-[rgba(220,235,215,0.08)]">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-2xl font-bold text-[#C7FF45]">
                    {PROCESS_STEPS[activeStep].step}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-[#F5F7F2]">
                      {PROCESS_STEPS[activeStep].title}
                    </h3>
                    <span className="font-mono text-xs text-[#9BA39A]">
                      {PROCESS_STEPS[activeStep].timelinePhase}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-[#C7FF45] bg-[#1A221A] px-3 py-1 rounded-full border border-[rgba(199,255,69,0.2)]">
                  ACTIVE PHASE
                </span>
              </div>

              {/* Description */}
              <p className="font-sans text-sm sm:text-base text-[#9BA39A] leading-relaxed mb-8">
                {PROCESS_STEPS[activeStep].shortDescription}
              </p>

              {/* Concrete Technical Deliverables */}
              <div>
                <div className="font-mono text-xs text-[#F5F7F2] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="text-[#C7FF45]">■</span>
                  <span>Concrete Phase Deliverables</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PROCESS_STEPS[activeStep].deliverables.map((item, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-[#0D100E] border border-[rgba(220,235,215,0.08)] flex items-start gap-2.5"
                    >
                      <Check className="w-4 h-4 text-[#C7FF45] shrink-0 mt-0.5" />
                      <span className="font-mono text-xs text-[#F5F7F2]/90 leading-snug">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Assurance */}
              <div className="mt-8 pt-6 border-t border-[rgba(220,235,215,0.08)] flex items-center justify-between font-mono text-[11px] text-[#697168]">
                <span>ITERATION CADENCE // WEEKLY CANARY</span>
                <span className="text-[#C7FF45]">100% VISIBILITY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
