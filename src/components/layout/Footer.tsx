import React from 'react';
import { GlanziLogo } from '../ui/GlanziLogo';
import { ArrowUp, Terminal } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#050706] border-t border-[rgba(220,235,215,0.1)] pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-[rgba(220,235,215,0.08)]">
          {/* Brand Info (Cols 1-5) */}
          <div className="lg:col-span-5 space-y-4">
            <GlanziLogo size="md" />

            <p className="font-sans text-xs sm:text-sm text-[#9BA39A] max-w-sm leading-relaxed">
              GLANZI transforms ambitious ideas into intelligent digital products through rigorous software engineering, AI innovation, and thoughtful design.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-[#0D100E] border border-[rgba(220,235,215,0.1)] text-[#9BA39A] hover:text-[#C7FF45] hover:border-[rgba(199,255,69,0.3)] transition-colors"
                aria-label="GLANZI GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-[#0D100E] border border-[rgba(220,235,215,0.1)] text-[#9BA39A] hover:text-[#C7FF45] hover:border-[rgba(199,255,69,0.3)] transition-colors"
                aria-label="GLANZI LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.59 1.59 0 1 0 0-3.18 1.59 1.59 0 0 0 0 3.18m1.4 9.74v-8.37H5.06v8.37h2.8z" />
                </svg>
              </a>
              <div className="px-3 py-1.5 rounded-lg bg-[#0D100E] border border-[rgba(220,235,215,0.1)] flex items-center gap-2 font-mono text-[10px] text-[#697168]">
                <Terminal className="w-3 h-3 text-[#C7FF45]" />
                <span>BUILD 2026.04-PROD</span>
              </div>
            </div>
          </div>

          {/* Navigation (Cols 6-7) */}
          <div className="lg:col-span-2 space-y-3 font-mono text-xs">
            <div className="text-[11px] text-[#F5F7F2] font-semibold uppercase tracking-wider mb-4">
              Navigation
            </div>
            <ul className="space-y-2 text-[#9BA39A]">
              <li><a href="#home" className="hover:text-[#C7FF45] transition-colors">Home</a></li>
              <li><a href="#mission" className="hover:text-[#C7FF45] transition-colors">Mission</a></li>
              <li><a href="#solutions" className="hover:text-[#C7FF45] transition-colors">Capabilities</a></li>
              <li><a href="#products" className="hover:text-[#C7FF45] transition-colors">Products</a></li>
              <li><a href="#work" className="hover:text-[#C7FF45] transition-colors">Selected Work</a></li>
              <li><a href="#approach" className="hover:text-[#C7FF45] transition-colors">Approach</a></li>
            </ul>
          </div>

          {/* Capabilities (Cols 8-10) */}
          <div className="lg:col-span-3 space-y-3 font-mono text-xs">
            <div className="text-[11px] text-[#F5F7F2] font-semibold uppercase tracking-wider mb-4">
              Capabilities
            </div>
            <ul className="space-y-2 text-[#9BA39A]">
              <li><a href="#solutions" className="hover:text-[#C7FF45] transition-colors">AI & Machine Learning</a></li>
              <li><a href="#solutions" className="hover:text-[#C7FF45] transition-colors">Software & Product Engineering</a></li>
              <li><a href="#solutions" className="hover:text-[#C7FF45] transition-colors">Intelligent Automation</a></li>
              <li><a href="#solutions" className="hover:text-[#C7FF45] transition-colors">Data & Decision Intelligence</a></li>
              <li><a href="#solutions" className="hover:text-[#C7FF45] transition-colors">Distributed Cloud Architectures</a></li>
            </ul>
          </div>

          {/* Systems & Contact (Cols 11-12) */}
          <div className="lg:col-span-2 space-y-3 font-mono text-xs">
            <div className="text-[11px] text-[#F5F7F2] font-semibold uppercase tracking-wider mb-4">
              Contact
            </div>
            <div className="text-[#9BA39A] leading-relaxed">
              <a href="mailto:contact@glanzi.ai" className="hover:text-[#C7FF45] transition-colors block">
                contact@glanzi.ai
              </a>
              <div className="text-[10px] text-[#697168] mt-2">
                Response SLA: 24-48 hrs
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 text-[11px] text-[#C7FF45] hover:text-white transition-colors"
              >
                <span>Back to top</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Metadata & Status Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#697168]">
          <div>
            © {CURRENT_YEAR} GLANZI. Intelligence, engineered. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C7FF45] animate-pulse" />
              <span className="text-[#9BA39A]">ALL SYSTEMS OPERATIONAL</span>
            </div>
            <span>•</span>
            <span>PRIVACY & SECURITY FIRST</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
