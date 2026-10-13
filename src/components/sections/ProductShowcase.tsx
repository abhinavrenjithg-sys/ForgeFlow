import React, { useState } from 'react';
import { PRODUCTS } from '../../data/products';
import type { Product } from '../../types';
import {
  Play,
  Terminal,
  Cpu,
  Layers,
  RefreshCw,
  Maximize2,
  ChevronRight,
  Info
} from 'lucide-react';

interface ProductShowcaseProps {
  onOpenProductDetail: (product: Product) => void;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({ onOpenProductDetail }) => {
  const flagship = PRODUCTS[0]; // Glanzi Intelligence Studio

  // Interactive Prototype State
  const [activeTab, setActiveTab] = useState<'workspace' | 'pipeline' | 'telemetry'>('workspace');
  const [selectedPrompt, setSelectedPrompt] = useState<number>(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [tokenSpeed, setTokenSpeed] = useState('144 tok/s');

  const samplePrompts = [
    {
      label: 'Edge Anomaly Detection',
      prompt: 'Execute zero-copy tensor inference pipeline on 4k optical stream; isolate micro-defects exceeding 0.05mm threshold.',
      response: {
        status: 'SUCCESS',
        latency: '14.8 ms',
        confidence: '99.7%',
        tokens: 312,
        log: `[00:00.002] Initializing CUDA stream & pinned memory buffer...
[00:00.005] Loaded INT4 TensorRT engine: 'aether-vision-v4'
[00:00.009] Zero-copy DMA transfer completed. Shape: [1, 3, 2160, 3840]
[00:00.012] Speculative kernel execution converged in 3 iterations.
[00:00.014] Result: 0 anomalies detected in standard envelope. 1 localized edge burr at coords (1842, 920).
[00:00.015] Emitted structured JSON payload to local Redis buffer.`
      }
    },
    {
      label: 'Distributed Agent Consensus',
      prompt: 'Resolve split-brain deadlock between Worker-03 and Worker-07 using deterministic Raft commit logs.',
      response: {
        status: 'CONSENSUS_REACHED',
        latency: '18.2 ms',
        confidence: '100%',
        tokens: 428,
        log: `[00:00.001] Fetching Raft term metadata from Raft-Leader...
[00:00.004] Detected term mismatch: Worker-03 (Term 42) vs Worker-07 (Term 41).
[00:00.008] Step-down signaled to Worker-07; applied idempotent snapshot.
[00:00.014] State machine synchronized at log index 1,842,904.
[00:00.018] Zero dirty mutations recorded. Cluster returned to HEALTHY.`
      }
    },
    {
      label: 'Vector Embedding Reranking',
      prompt: 'Hybrid semantic search query across 12M code tokens with SIMD bitset filtering on repository scope: internal-core.',
      response: {
        status: 'INDEX_RETRIEVED',
        latency: '8.4 ms',
        confidence: '98.9%',
        tokens: 198,
        log: `[00:00.001] Ingested 512-dim dense vector embedding from client query.
[00:00.003] Evaluated HNSW graph layer with dynamic beam width = 64.
[00:00.006] Applied SIMD hardware bitmask filter for tenant: 'internal-core'.
[00:00.008] Top 5 relevant AST nodes ranked with Reciprocal Rank Fusion.
[00:00.008] Cache hit: 100% of candidate embeddings read from L3 cache.`
      }
    }
  ];

  const handleRunExecution = () => {
    setIsExecuting(true);
    setExecutionOutput(null);
    setTimeout(() => {
      setExecutionOutput(samplePrompts[selectedPrompt].response.log);
      setTokenSpeed(`${138 + Math.floor(Math.random() * 16)} tok/s`);
      setIsExecuting(false);
    }, 700);
  };

  return (
    <section id="products" className="relative py-28 bg-[#0D100E] border-t border-[rgba(220,235,215,0.08)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs text-[#C7FF45] tracking-widest uppercase font-semibold">
                // BUILT AT GLANZI
              </span>
              <div className="h-[1px] w-12 bg-[#C7FF45]/40" />
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#F5F7F2] tracking-tight">
              Not just ideas. Intelligent products.
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="font-mono text-xs text-[#9BA39A] bg-[#131713] px-3 py-1.5 rounded-lg border border-[rgba(220,235,215,0.1)]">
              FLAGSHIP SOFTWARE SHOWCASE
            </span>
            <span className="font-mono text-[11px] text-[#C7FF45] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C7FF45] animate-ping" />
              {flagship.statusLabel}
            </span>
          </div>
        </div>

        {/* Flagship Product Showcase Container */}
        <div className="rounded-2xl bg-[#080A09] border border-[rgba(220,235,215,0.15)] shadow-2xl overflow-hidden">
          {/* Product Header & Quick Metadata */}
          <div className="p-6 sm:p-8 bg-[#111612] border-b border-[rgba(220,235,215,0.1)] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F7F2]">
                  {flagship.name}
                </h3>
                <span className="font-mono text-[10px] text-[#080A09] bg-[#C7FF45] font-semibold px-2 py-0.5 rounded">
                  {flagship.status}
                </span>
              </div>
              <p className="font-sans text-sm sm:text-base text-[#9BA39A]">
                {flagship.tagline}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenProductDetail(flagship)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#131713] hover:bg-[#1A221A] text-[#F5F7F2] hover:text-[#C7FF45] border border-[rgba(220,235,215,0.15)] font-mono text-xs tracking-wider transition-colors"
              >
                <span>Product Specifications</span>
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C7FF45] hover:bg-[#d5ff66] text-[#080A09] font-mono text-xs font-semibold tracking-wider transition-colors shadow-[0_0_15px_rgba(199,255,69,0.25)]"
              >
                <span>Request Early Access</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Honest Prototype Notice Bar */}
          <div className="px-6 py-2.5 bg-[#0D100E] border-b border-[rgba(220,235,215,0.06)] flex items-center justify-between font-mono text-[11px] text-[#697168]">
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-[#C7FF45]" />
              <span className="text-[#9BA39A]">Honest Technology Notice:</span>
              <span className="hidden sm:inline">Conceptual application interface built to demonstrate internal engine architecture.</span>
            </div>
            <span className="text-[#C7FF45]">NO FABRICATED METRICS</span>
          </div>

          {/* Realistic Application UI Mockup */}
          <div className="p-4 sm:p-6 lg:p-8 bg-[#080A09]">
            {/* Mock Window Chrome */}
            <div className="rounded-xl bg-[#131713] border border-[rgba(220,235,215,0.12)] overflow-hidden shadow-2xl">
              {/* Window Titlebar */}
              <div className="px-4 py-3 bg-[#0D100E] border-b border-[rgba(220,235,215,0.08)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#323932]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#323932]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#323932]" />
                  </div>
                  <span className="font-mono text-xs text-[#9BA39A] pl-2 border-l border-[rgba(220,235,215,0.1)]">
                    glanzi-studio / neural-session-09
                  </span>
                </div>

                {/* Live Telemetry Tickers */}
                <div className="hidden sm:flex items-center gap-4 font-mono text-[11px] text-[#697168]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#9BA39A]">SPEED:</span>
                    <span className="text-[#C7FF45]">{tokenSpeed}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#9BA39A]">ENGINE:</span>
                    <span className="text-[#F5F7F2]">vLLM-Quant4</span>
                  </div>
                </div>
              </div>

              {/* Sub-header Tabs */}
              <div className="px-4 bg-[#111612] border-b border-[rgba(220,235,215,0.08)] flex items-center justify-between overflow-x-auto">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('workspace')}
                    className={`px-4 py-2.5 font-mono text-xs flex items-center gap-2 border-b-2 transition-colors ${
                      activeTab === 'workspace'
                        ? 'border-[#C7FF45] text-[#C7FF45] font-semibold'
                        : 'border-transparent text-[#9BA39A] hover:text-[#F5F7F2]'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Neural Workspace</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('pipeline')}
                    className={`px-4 py-2.5 font-mono text-xs flex items-center gap-2 border-b-2 transition-colors ${
                      activeTab === 'pipeline'
                        ? 'border-[#C7FF45] text-[#C7FF45] font-semibold'
                        : 'border-transparent text-[#9BA39A] hover:text-[#F5F7F2]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Inference Pipeline</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('telemetry')}
                    className={`px-4 py-2.5 font-mono text-xs flex items-center gap-2 border-b-2 transition-colors ${
                      activeTab === 'telemetry'
                        ? 'border-[#C7FF45] text-[#C7FF45] font-semibold'
                        : 'border-transparent text-[#9BA39A] hover:text-[#F5F7F2]'
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Hardware Telemetry</span>
                  </button>
                </div>

                <div className="hidden md:flex items-center gap-2 font-mono text-[10px] text-[#697168]">
                  <span>LATENCY: 14.8ms</span>
                  <span>•</span>
                  <span>VRAM: 4.2GB / 24GB</span>
                </div>
              </div>

              {/* Tab Content 1: Workspace & Interactive Synthesizer */}
              {activeTab === 'workspace' && (
                <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Prompt Selection */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="font-mono text-xs text-[#9BA39A] uppercase tracking-wider mb-2">
                        Select Benchmark Scenario
                      </div>
                      <div className="space-y-2">
                        {samplePrompts.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedPrompt(idx);
                              setExecutionOutput(null);
                            }}
                            className={`w-full text-left p-3 rounded-lg border font-mono text-xs transition-all ${
                              selectedPrompt === idx
                                ? 'bg-[#182018] border-[#C7FF45]/50 text-[#F5F7F2]'
                                : 'bg-[#0D100E] border-[rgba(220,235,215,0.06)] text-[#9BA39A] hover:text-[#F5F7F2]'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className={selectedPrompt === idx ? 'text-[#C7FF45]' : 'text-[#697168]'}>
                                0{idx + 1} //
                              </span>
                              <span className="text-[10px] text-[#697168]">
                                {item.response.latency}
                              </span>
                            </div>
                            <div className="font-semibold text-[#F5F7F2] mb-1">{item.label}</div>
                            <div className="text-[11px] text-[#697168] line-clamp-2 leading-relaxed">
                              {item.prompt}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleRunExecution}
                        disabled={isExecuting}
                        className="w-full py-3 rounded-lg bg-[#C7FF45] hover:bg-[#d3ff63] text-[#080A09] font-mono text-xs font-semibold tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(199,255,69,0.2)] transition-all duration-200"
                      >
                        {isExecuting ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>EXECUTING MODEL INFERENCE...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>RUN SYNTHESIS WORKFLOW</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Execution Terminal */}
                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div className="rounded-xl bg-[#080A09] border border-[rgba(220,235,215,0.1)] p-4 font-mono text-xs flex-1 flex flex-col justify-between min-h-[320px]">
                      <div>
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[rgba(220,235,215,0.06)] text-[#697168] text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="text-[#C7FF45]">$</span>
                            <span className="text-[#9BA39A]">glanzi-engine --eval-prompt</span>
                          </div>
                          <span>STREAM: TTY0</span>
                        </div>

                        <div className="p-3 rounded bg-[#0D100E] border border-[rgba(220,235,215,0.04)] text-[#F5F7F2] text-[11px] leading-relaxed mb-4">
                          <span className="text-[#C7FF45] mr-2">INPUT:</span>
                          {samplePrompts[selectedPrompt].prompt}
                        </div>

                        {/* Streamed Output or Prompt Ready state */}
                        {isExecuting ? (
                          <div className="space-y-2 text-[#9BA39A] text-[11px] animate-pulse">
                            <div>[i] Dispatching prompt to local quantized runtime...</div>
                            <div>[i] Evaluating speculative draft tokens (k=4)...</div>
                            <div className="text-[#C7FF45]">[i] Verifying token embeddings...</div>
                          </div>
                        ) : executionOutput ? (
                          <pre className="whitespace-pre-wrap text-[11px] text-[#9BA39A] font-mono leading-relaxed bg-[#0D100E]/70 p-3 rounded border border-[rgba(220,235,215,0.06)]">
                            {executionOutput}
                          </pre>
                        ) : (
                          <div className="text-center py-12 text-[#697168] space-y-2">
                            <Terminal className="w-6 h-6 mx-auto text-[#697168]" />
                            <div className="text-xs">Select a scenario and click "Run Synthesis Workflow"</div>
                            <div className="text-[10px] text-[#434b43]">Real-time execution simulation over INT4 tensor weights</div>
                          </div>
                        )}
                      </div>

                      {/* Execution Output Footer */}
                      <div className="mt-4 pt-3 border-t border-[rgba(220,235,215,0.06)] flex items-center justify-between text-[10px] text-[#697168]">
                        <span className="text-[#C7FF45]">STATUS: {samplePrompts[selectedPrompt].response.status}</span>
                        <span>LATENCY: {samplePrompts[selectedPrompt].response.latency}</span>
                        <span>TOKENS: {samplePrompts[selectedPrompt].response.tokens}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content 2: Pipeline Visualizer */}
              {activeTab === 'pipeline' && (
                <div className="p-6">
                  <div className="text-xs font-mono text-[#9BA39A] mb-4">
                    DIRECTED ACYCLIC GRAPH // ACTIVE INFERENCE ORCHESTRATION
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-[#0D100E] border border-[rgba(220,235,215,0.1)]">
                      <span className="font-mono text-[10px] text-[#C7FF45]">STAGE 01</span>
                      <div className="font-display text-sm font-semibold text-[#F5F7F2] mt-1">Tokenizer & Filter</div>
                      <div className="font-mono text-[11px] text-[#697168] mt-2">BPE Subword • 0.4ms</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#0D100E] border border-[#C7FF45]/30">
                      <span className="font-mono text-[10px] text-[#C7FF45]">STAGE 02</span>
                      <div className="font-display text-sm font-semibold text-[#F5F7F2] mt-1">Draft Prediction</div>
                      <div className="font-mono text-[11px] text-[#C7FF45] mt-2">INT4 Fast Core • 3.2ms</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#0D100E] border border-[rgba(220,235,215,0.1)]">
                      <span className="font-mono text-[10px] text-[#C7FF45]">STAGE 03</span>
                      <div className="font-display text-sm font-semibold text-[#F5F7F2] mt-1">Verification Pass</div>
                      <div className="font-mono text-[11px] text-[#697168] mt-2">Heavy Core • 10.1ms</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#0D100E] border border-[rgba(220,235,215,0.1)]">
                      <span className="font-mono text-[10px] text-[#C7FF45]">STAGE 04</span>
                      <div className="font-display text-sm font-semibold text-[#F5F7F2] mt-1">Schema Guardrail</div>
                      <div className="font-mono text-[11px] text-[#697168] mt-2">JSON Assert • 0.1ms</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-[#080A09] border border-[rgba(220,235,215,0.06)] font-mono text-xs text-[#9BA39A]">
                    <div className="text-[#C7FF45] mb-1">// Speculative Execution Guarantee</div>
                    Every token batch emitted by Glanzi Studio undergoes strict deterministic schema verification before handoff to client consumers.
                  </div>
                </div>
              )}

              {/* Tab Content 3: Telemetry */}
              {activeTab === 'telemetry' && (
                <div className="p-6">
                  <div className="text-xs font-mono text-[#9BA39A] mb-4">
                    HARDWARE ACCELERATION TELEMETRY // INT8 / FP8 RUNTIME
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {flagship.metrics.map((metric, i) => (
                      <div key={i} className="p-4 rounded-xl bg-[#0D100E] border border-[rgba(220,235,215,0.1)]">
                        <div className="font-mono text-[10px] text-[#697168] uppercase tracking-wider">{metric.label}</div>
                        <div className="font-display text-lg sm:text-xl font-bold text-[#C7FF45] mt-1">{metric.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Products Preview Row */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRODUCTS.slice(1).map((prod) => (
            <div
              key={prod.id}
              className="p-6 sm:p-7 rounded-2xl bg-[#080A09] border border-[rgba(220,235,215,0.1)] hover:border-[rgba(220,235,215,0.25)] transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] text-[#C7FF45] bg-[#131713] px-2.5 py-1 rounded border border-[rgba(199,255,69,0.2)]">
                    {prod.statusLabel}
                  </span>
                  <span className="font-mono text-xs text-[#697168]">{prod.category}</span>
                </div>
                <h4 className="font-display text-xl font-bold text-[#F5F7F2] mb-2">{prod.name}</h4>
                <p className="font-sans text-xs text-[#9BA39A] leading-relaxed mb-4">{prod.overview}</p>
              </div>

              <div className="pt-4 border-t border-[rgba(220,235,215,0.08)] flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#697168]">
                  {prod.techStack.slice(0, 3).join(' • ')}
                </div>
                <button
                  onClick={() => onOpenProductDetail(prod)}
                  className="font-mono text-xs text-[#C7FF45] hover:text-white flex items-center gap-1"
                >
                  <span>Specs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
