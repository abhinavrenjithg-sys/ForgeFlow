import React, { useEffect } from 'react';
import type { Product } from '../../types';
import { X, Check, ArrowUpRight } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onInitiateInquiry: (productName: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onInitiateInquiry
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#080A09]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0D100E] border border-[rgba(220,235,215,0.15)] shadow-2xl p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-lg bg-[#131713] text-[#9BA39A] hover:text-[#F5F7F2] border border-[rgba(220,235,215,0.1)] transition-colors"
          aria-label="Close product modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="font-mono text-[10px] text-[#080A09] bg-[#C7FF45] font-semibold px-2.5 py-0.5 rounded">
            {product.status}
          </span>
          <span className="font-mono text-xs text-[#9BA39A]">
            {product.category}
          </span>
          <span className="text-[#697168]">•</span>
          <span className="font-mono text-xs text-[#C7FF45]">
            {product.statusLabel}
          </span>
        </div>

        {/* Product Title & Tagline */}
        <h2 id="product-modal-title" className="font-display text-2xl sm:text-4xl font-bold text-[#F5F7F2] mb-3">
          {product.name}
        </h2>
        <p className="font-sans text-sm sm:text-base text-[#C7FF45] mb-6">
          {product.tagline}
        </p>

        {/* Overview */}
        <div className="space-y-6 text-[#9BA39A] font-sans text-sm leading-relaxed mb-8">
          <div>
            <h3 className="font-mono text-xs text-[#F5F7F2] uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="text-[#C7FF45]">■</span>
              <span>Architecture Overview</span>
            </h3>
            <p>{product.overview}</p>
          </div>

          <div>
            <h3 className="font-mono text-xs text-[#F5F7F2] uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="text-[#C7FF45]">■</span>
              <span>Problem Being Solved</span>
            </h3>
            <p className="p-3.5 rounded-xl bg-[#131713] border border-[rgba(220,235,215,0.08)] text-[#F5F7F2]">
              {product.problemSolved}
            </p>
          </div>

          {/* Key Capabilities */}
          <div>
            <h3 className="font-mono text-xs text-[#F5F7F2] uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="text-[#C7FF45]">■</span>
              <span>Key Capabilities & Features</span>
            </h3>
            <div className="space-y-2.5">
              {product.keyFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#F5F7F2] font-mono">
                  <Check className="w-4 h-4 text-[#C7FF45] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics / Verified Specifications */}
          <div>
            <h3 className="font-mono text-xs text-[#F5F7F2] uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="text-[#C7FF45]">■</span>
              <span>Verified Specifications</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {product.metrics.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#131713] border border-[rgba(220,235,215,0.08)]">
                  <div className="font-mono text-[10px] text-[#697168]">{m.label}</div>
                  <div className="font-mono text-sm font-bold text-[#C7FF45] mt-1">{m.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Stack */}
          <div>
            <h3 className="font-mono text-xs text-[#F5F7F2] uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="text-[#C7FF45]">■</span>
              <span>Technology Stack</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-lg bg-[#131713] border border-[rgba(220,235,215,0.1)] text-[#9BA39A] font-mono text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-6 border-t border-[rgba(220,235,215,0.1)] flex flex-wrap items-center justify-between gap-4">
          <div className="font-mono text-[11px] text-[#697168]">
            HONEST STATUS: {product.statusLabel}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onInitiateInquiry(product.name);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#C7FF45] hover:bg-[#d5ff65] text-[#080A09] font-mono text-xs font-semibold tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(199,255,69,0.25)] transition-colors"
            >
              <span>Consult on Integration</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
