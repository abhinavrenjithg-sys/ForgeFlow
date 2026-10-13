import React from 'react';
import { ComputationalHeroVisual } from './ComputationalHeroVisual';
import { ArrowDownRight, Terminal, Sparkles, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onExploreWork?: () => void;
  onContactClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreWork, onContactClick }) => {
  const scrollToWork = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onExploreWork) {
      onExploreWork();
    } else {
      document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onContactClick) {
      onContactClick();
    } else {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen pt-28 pb-20 flex flex-col justify-center overflow-hidden bg-grid-tech"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-radial-gradient pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial & Brand Core */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131713] border border-[rgba(220,235,215,0.14)] mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#C7FF45] animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#C7FF45] font-semibold">
                INDEPENDENT AI & SOFTWARE COMPANY
              </span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F5F7F2] leading-[1.08] mb-6">
              Intelligence,{' '}
              <span className="text-[#C7FF45] glow-text-lime relative inline-block">
                engineered
              </span>{' '}
              for what comes next.
            </h1>

            {/* Supporting Copy */}
            <p className="font-sans text-base sm:text-lg lg:text-xl text-[#9BA39A] leading-relaxed max-w-2xl mb-10">
              GLANZI builds intelligent software, AI-powered products, and digital experiences that turn ambitious ideas into useful technology.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <a
                href="#work"
                onClick={scrollToWork}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C7FF45] hover:bg-[#d4ff68] text-[#080A09] font-mono text-sm font-semibold tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(199,255,69,0.25)] hover:shadow-[0_0_30px_rgba(199,255,69,0.45)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore Our Work</span>
                <ArrowDownRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                onClick={scrollToContact}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#131713] hover:bg-[#1A201A] text-[#F5F7F2] hover:text-[#C7FF45] border border-[rgba(220,235,215,0.15)] hover:border-[rgba(199,255,69,0.3)] font-mono text-sm font-medium tracking-wider transition-all duration-200"
              >
                <span>Let's Talk</span>
                <Terminal className="w-4 h-4 text-[#9BA39A]" />
              </a>
            </div>

            {/* Technical Sub-spec Annotations */}
            <div className="w-full pt-8 border-t border-[rgba(220,235,215,0.1)] flex flex-wrap items-center justify-between gap-y-3 font-mono text-[11px] text-[#697168]">
              <div className="flex items-center gap-2">
                <span className="text-[#C7FF45]">■</span>
                <span className="text-[#9BA39A] tracking-wider">AI SYSTEMS</span>
              </div>
              <div className="hidden xs:inline text-[#2A332A]">/</div>
              <div className="flex items-center gap-2">
                <span className="text-[#C7FF45]">■</span>
                <span className="text-[#9BA39A] tracking-wider">SOFTWARE ENGINEERING</span>
              </div>
              <div className="hidden xs:inline text-[#2A332A]">/</div>
              <div className="flex items-center gap-2">
                <span className="text-[#C7FF45]">■</span>
                <span className="text-[#9BA39A] tracking-wider">DIGITAL PRODUCTS</span>
              </div>
            </div>
          </div>

          {/* Right Column: Custom Computational Visual */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <ComputationalHeroVisual />

            {/* Technical Metric Badges under the Canvas */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-[#0D100E] border border-[rgba(220,235,215,0.08)] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#131713] border border-[rgba(220,235,215,0.1)] text-[#C7FF45]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-mono text-[10px] text-[#697168] uppercase tracking-wider">Inference Speed</div>
                  <div className="font-mono text-xs font-semibold text-[#F5F7F2]">Sub-20ms Engine</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0D100E] border border-[rgba(220,235,215,0.08)] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#131713] border border-[rgba(220,235,215,0.1)] text-[#C7FF45]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-mono text-[10px] text-[#697168] uppercase tracking-wider">Architecture</div>
                  <div className="font-mono text-xs font-semibold text-[#F5F7F2]">Deterministic Logic</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
