import React, { useEffect } from 'react';
import type { Project } from '../../types';
import { X, ArrowUpRight, Cpu, ShieldCheck } from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onConsultProject: (projectTitle: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onConsultProject
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#080A09]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0D100E] border border-[rgba(220,235,215,0.15)] shadow-2xl p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-lg bg-[#131713] text-[#9BA39A] hover:text-[#F5F7F2] border border-[rgba(220,235,215,0.1)] transition-colors"
          aria-label="Close project modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Metadata */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs text-[#C7FF45] font-semibold">
            {project.number}
          </span>
          <span className="font-mono text-xs text-[#9BA39A] bg-[#131713] px-2.5 py-0.5 rounded border border-[rgba(220,235,215,0.08)]">
            {project.category}
          </span>
          <span className="text-[#697168]">•</span>
          <span className="font-mono text-xs text-[#C7FF45]">
            {project.status}
          </span>
        </div>

        {/* Title */}
        <h2 id="project-modal-title" className="font-display text-2xl sm:text-4xl font-bold text-[#F5F7F2] mb-3">
          {project.title}
        </h2>
        <p className="font-sans text-sm sm:text-base text-[#9BA39A] mb-8 leading-relaxed">
          {project.fullOverview}
        </p>

        {/* Challenge vs Solution Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-5 rounded-xl bg-[#131713] border border-[rgba(220,235,215,0.08)]">
            <div className="flex items-center gap-2 font-mono text-xs text-red-400 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>THE CHALLENGE</span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#9BA39A] leading-relaxed">
              {project.challenge}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#131713] border border-[#C7FF45]/30">
            <div className="flex items-center gap-2 font-mono text-xs text-[#C7FF45] mb-2">
              <Cpu className="w-4 h-4" />
              <span>SOLUTION ENGINEERED</span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#F5F7F2] leading-relaxed">
              {project.solutionEngineered}
            </p>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="mb-8">
          <div className="font-mono text-xs text-[#F5F7F2] uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="text-[#C7FF45]">■</span>
            <span>Verified System Metrics</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.impactMetrics.map((metric, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#080A09] border border-[rgba(220,235,215,0.08)] font-mono text-xs text-[#C7FF45] flex items-center gap-2.5"
              >
                <span>›</span>
                <span className="text-[#F5F7F2]">{metric}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-8">
          <div className="font-mono text-xs text-[#F5F7F2] uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="text-[#C7FF45]">■</span>
            <span>Technology Stack</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-lg bg-[#131713] border border-[rgba(220,235,215,0.1)] text-[#9BA39A] font-mono text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-[rgba(220,235,215,0.1)] flex flex-wrap items-center justify-between gap-4">
          <div className="font-mono text-[11px] text-[#697168]">
            DEPLOYMENT: ARCHITECTURAL CASE STUDY
          </div>

          <button
            onClick={() => {
              onClose();
              onConsultProject(project.title);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#C7FF45] hover:bg-[#d5ff65] text-[#080A09] font-mono text-xs font-semibold tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(199,255,69,0.25)] transition-colors"
          >
            <span>Request Similar Architecture</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
