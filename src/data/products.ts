import type { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'glanzi-intelligence',
    name: 'Glanzi Intelligence Studio',
    tagline: 'Autonomous AI workspace for multi-modal analysis, neural synthesis, and cognitive orchestration.',
    status: 'PROTOTYPE',
    statusLabel: 'Interactive Prototype • In Active Engineering',
    category: 'Cognitive Computing & Workspace',
    overview: 'Glanzi Intelligence Studio is our flagship internal software environment designed to bridge natural language reasoning with real-time computational graphs, code synthesis, and structured data streaming.',
    problemSolved: 'Modern engineering teams juggle isolated AI tools, disconnected context windows, and non-deterministic scripts. Glanzi Intelligence unifies multi-model inference, stateful memory, and deterministic tool execution in a single observable canvas.',
    keyFeatures: [
      'Multi-engine neural inference with automatic model fallback and latency routing',
      'Dynamic computational canvas with real-time token telemetry and GPU memory tracking',
      'Contextual knowledge ingestion supporting raw PDFs, codebases, and vector embeddings',
      'Deterministic code execution sandbox with structured JSON output enforcement',
      'Integrated audit trails logging prompt lineage, temperature drifts, and inference cost'
    ],
    techStack: ['React 19', 'TypeScript', 'WebAssembly', 'vLLM', 'Rust Core', 'Tailwind CSS', 'WebGL'],
    liveDemoAvailable: true,
    repoOrDocLink: '#product-showcase',
    metrics: [
      { label: 'Token Speed', value: '142 tok/sec' },
      { label: 'Latency to First Token', value: '18 ms' },
      { label: 'Context Window Support', value: '128k Tokens' },
      { label: 'Deterministic Guardrails', value: '100% Schema Validated' }
    ]
  },
  {
    id: 'glanzi-mesh',
    name: 'Glanzi Inference Mesh',
    tagline: 'Distributed low-latency model routing and speculative decoding proxy for edge deployments.',
    status: 'IN_RESEARCH',
    statusLabel: 'Research Concept • Architecture Validation',
    category: 'AI Infrastructure',
    overview: 'A decentralized model gateway that dynamically splits prompt evaluation across speculative draft models and heavyweight foundational models to achieve sub-20ms roundtrips.',
    problemSolved: 'Reduces operational GPU costs and tail latency spikes when serving multiple concurrent high-throughput consumer requests.',
    keyFeatures: [
      'Speculative execution pipeline combining small draft models with large verifiers',
      'Dynamic batching and memory-aware GPU queue distribution',
      'Continuous KV-cache reuse across multi-turn conversational agents',
      'Comprehensive Prometheus metrics exporter for cluster observability'
    ],
    techStack: ['Rust', 'gRPC', 'Triton Inference Server', 'eBPF', 'Tokio'],
    liveDemoAvailable: false,
    repoOrDocLink: '#contact',
    metrics: [
      { label: 'P99 Latency Reduction', value: '41%' },
      { label: 'KV-Cache Hit Ratio', value: '88.4%' },
      { label: 'Throughput Multiplier', value: '2.8x' },
      { label: 'Memory Footprint', value: '<24 MB idle' }
    ]
  },
  {
    id: 'glanzi-flow',
    name: 'Glanzi Flow Engine',
    tagline: 'Type-safe stateful agent workflow orchestrator with deterministic rollback semantics.',
    status: 'INTERNAL_TOOL',
    statusLabel: 'Internal Alpha Tooling',
    category: 'Workflow Automation',
    overview: 'A lightweight resilient orchestration runtime that executes complex long-running AI task graphs with automatic checkpointing and human-in-the-loop intervention hooks.',
    problemSolved: 'Prevents non-deterministic AI agents from hallucinating catastrophic side-effects by wrapping external API calls in transactional boundaries.',
    keyFeatures: [
      'Declarative directed acyclic graph (DAG) definition with strict type boundaries',
      'Automatic state persistence with point-in-time rewind and retry capabilities',
      'Real-time WebSocket event emission for live interface telemetry',
      'Fine-grained permission gating on external tool executions'
    ],
    techStack: ['TypeScript', 'Node.js', 'Redis Streams', 'PostgreSQL', 'Temporal SDK'],
    liveDemoAvailable: false,
    repoOrDocLink: '#contact',
    metrics: [
      { label: 'Workflow Recovery Time', value: '<50 ms' },
      { label: 'Fault Tolerance', value: 'Zero Data Loss' },
      { label: 'Tool Permission Checks', value: 'Sub-millisecond' },
      { label: 'Audit Trail Retention', value: 'Immutable' }
    ]
  }
];
