import React, { useState } from 'react';
import { PROJECTS } from '../../data/projects';
import type { Project } from '../../types';
import { ArrowUpRight, Cpu, Layers, ShieldCheck } from 'lucide-react';

interface FeaturedWorkProps {
  onOpenProjectDetail: (project: Project) => void;
}

export const FeaturedWork: React.FC<FeaturedWorkProps> = ({ onOpenProjectDetail }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'AI Systems', 'Infrastructure', 'Decision Engines', 'Web Platforms'];

  const filteredProjects = selectedCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === selectedCategory);

  const heroProject = filteredProjects[0] || PROJECTS[0];
  const supportingProjects = filteredProjects.slice(1);

  return (
    <section id="work" className="relative py-28 bg-[#080A09] border-t border-[rgba(220,235,215,0.08)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs text-[#C7FF45] tracking-widest uppercase font-semibold">
                // SELECTED WORK
              </span>
              <div className="h-[1px] w-12 bg-[#C7FF45]/40" />
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#F5F7F2] tracking-tight">
              Complex problems. Thoughtful solutions.
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#C7FF45] text-[#080A09] font-semibold shadow-[0_0_12px_rgba(199,255,69,0.25)]'
                    : 'bg-[#131713] text-[#9BA39A] hover:text-[#F5F7F2] border border-[rgba(220,235,215,0.1)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Primary Project (Large Asymmetric Composition) */}
        {heroProject && (
          <div
            onClick={() => onOpenProjectDetail(heroProject)}
            className="group relative rounded-2xl bg-[#0D100E] border border-[rgba(220,235,215,0.12)] hover:border-[rgba(199,255,69,0.4)] transition-all duration-300 p-7 sm:p-10 mb-8 cursor-pointer shadow-2xl overflow-hidden"
          >
            {/* Subtle corner badge */}
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#131713] border-b border-l border-[rgba(220,235,215,0.1)] font-mono text-[10px] text-[#C7FF45]">
              FLAGSHIP CASE STUDY // {heroProject.status}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-[#C7FF45] font-semibold">{heroProject.number}</span>
                  <span className="font-mono text-xs text-[#9BA39A] bg-[#131713] px-2.5 py-0.5 rounded border border-[rgba(220,235,215,0.08)]">
                    {heroProject.category}
                  </span>
                </div>

                <h3 className="font-display text-3xl sm:text-4xl font-bold text-[#F5F7F2] group-hover:text-white transition-colors">
                  {heroProject.title}
                </h3>

                <p className="font-sans text-sm sm:text-base text-[#9BA39A] leading-relaxed">
                  {heroProject.shortDescription}
                </p>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {heroProject.impactMetrics.slice(0, 2).map((m, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-mono text-[#F5F7F2]">
                      <span className="text-[#C7FF45]">■</span>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Pills & Action Link */}
                <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(220,235,215,0.08)]">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {heroProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#131713] text-[#9BA39A] border border-[rgba(220,235,215,0.08)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#C7FF45] group-hover:text-white font-medium">
                    <span>Inspect System Architecture</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </div>

              {/* Graphical Technical Schematic Preview */}
              <div className="lg:col-span-5">
                <div className="rounded-xl bg-[#080A09] border border-[rgba(220,235,215,0.1)] p-5 relative overflow-hidden group-hover:border-[rgba(199,255,69,0.3)] transition-colors">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(220,235,215,0.08)] font-mono text-[10px] text-[#697168]">
                    <span>SYSTEM TOPOLOGY</span>
                    <span className="text-[#C7FF45]">ONLINE</span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 rounded-lg bg-[#0D100E] border border-[rgba(220,235,215,0.08)] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#F5F7F2]">
                        <Cpu className="w-4 h-4 text-[#C7FF45]" />
                        <span>Input Edge Stream</span>
                      </div>
                      <span className="text-[10px] text-[#697168]">120 FPS DMA</span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#111612] border border-[#C7FF45]/30 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#C7FF45]">
                        <Layers className="w-4 h-4" />
                        <span>Quantized INT8 TensorRT</span>
                      </div>
                      <span className="text-[10px] text-[#C7FF45]">3.4ms Ingest</span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#0D100E] border border-[rgba(220,235,215,0.08)] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#F5F7F2]">
                        <ShieldCheck className="w-4 h-4 text-[#C7FF45]" />
                        <span>Encrypted Zero-Copy Ring</span>
                      </div>
                      <span className="text-[10px] text-[#697168]">0B Offsite</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Supporting Projects (Asymmetric Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {supportingProjects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => onOpenProjectDetail(proj)}
              className="group rounded-2xl bg-[#0D100E] border border-[rgba(220,235,215,0.1)] hover:border-[rgba(199,255,69,0.35)] transition-all duration-300 p-6 flex flex-col justify-between cursor-pointer hover:bg-[#101410]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-[#C7FF45] font-semibold">{proj.number}</span>
                  <span className="font-mono text-[10px] text-[#9BA39A] bg-[#131713] px-2 py-0.5 rounded border border-[rgba(220,235,215,0.08)]">
                    {proj.category}
                  </span>
                </div>

                <h4 className="font-display text-xl font-bold text-[#F5F7F2] group-hover:text-white transition-colors mb-2">
                  {proj.title}
                </h4>

                <p className="font-sans text-xs text-[#9BA39A] leading-relaxed mb-6">
                  {proj.shortDescription}
                </p>
              </div>

              <div>
                <div className="pt-4 border-t border-[rgba(220,235,215,0.08)] flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#697168]">
                    {proj.techStack.slice(0, 3).join(' • ')}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#C7FF45] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
