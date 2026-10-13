import type { Project } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'aether-lens',
    number: '01',
    title: 'AetherLens',
    category: 'AI Systems',
    shortDescription: 'High-speed multimodal edge perception system designed for spatial telemetry, automated object classification, and micro-anomaly detection.',
    fullOverview: 'AetherLens combines quantized vision-language models with low-power edge compute accelerators to process 120 FPS high-definition optical streams in real time without transmitting sensitive raw footage off-device.',
    challenge: 'Edge hardware constraints usually force an aggressive compromise between spatial resolution and classification latency. High-accuracy models routinely exceed the thermal limits of compact industrial microcomputers.',
    solutionEngineered: 'Engineered a dual-pipeline architecture: a lightweight sub-millisecond motion and candidate detector wakes an INT8-quantized vision transformer only when anomaly thresholds are breached. Zero raw video frames leave local memory.',
    impactMetrics: [
      '120 FPS processing throughput on 15W edge silicon',
      '99.4% precision on multi-class defect classification',
      '0 bytes of unencrypted raw video transmitted offsite',
      '<12 ms end-to-end detection and alert latency'
    ],
    techStack: ['PyTorch', 'TensorRT', 'C++', 'WebRTC', 'CUDA', 'Rust'],
    status: 'RESEARCH PROTOTYPE',
    accentColor: '#C7FF45'
  },
  {
    id: 'chronos-orchestrator',
    number: '02',
    title: 'Chronos Orchestrator',
    category: 'Infrastructure',
    shortDescription: 'Autonomous distributed task execution engine coordinating multi-agent software pipelines with deterministic rollback guarantees.',
    fullOverview: 'An event-driven orchestration backbone that coordinates autonomous AI agent workflows across disparate microservices, databases, and third-party APIs while maintaining a cryptographically auditable log of every decision step.',
    challenge: 'Autonomous agents frequently fail non-deterministically mid-execution, causing dirty state mutations across downstream databases with no reliable rollback or debugging trace.',
    solutionEngineered: 'Built a durable execution engine around event-sourcing and saga patterns. Each agent tool call generates an immutable transaction receipt; if downstream validation fails, compensating transactions are dispatched automatically.',
    impactMetrics: [
      '10,000+ concurrent workflow events with sub-5ms dispatch',
      'Deterministic rollback across multi-system state mutations',
      '100% replayability of failed agent reasoning trees',
      'Zero manual database reconciliation incidents'
    ],
    techStack: ['Go', 'Kafka', 'Temporal', 'PostgreSQL', 'OpenTelemetry', 'Docker'],
    status: 'CONCEPT SYSTEM',
    accentColor: '#8BF074'
  },
  {
    id: 'vektor-nexus',
    number: '03',
    title: 'Vektor Nexus',
    category: 'Decision Engines',
    shortDescription: 'Sub-millisecond hybrid vector retrieval and semantic indexing engine engineered for billion-scale enterprise knowledge repositories.',
    fullOverview: 'A high-throughput search engine combining dense semantic vector embeddings with sparse BM25 token indices and exact graph filtering for mission-critical legal, financial, and code intelligence workloads.',
    challenge: 'Pure vector similarity search struggles with exact keyword constraints, product SKU IDs, and boolean tenant filters, while traditional lexical search lacks semantic comprehension.',
    solutionEngineered: 'Created a unified HNSW graph index integrated with SIMD-accelerated bitset filtering and learned reciprocal rank fusion (RRF), yielding instant cross-modal search over 50M+ document fragments.',
    impactMetrics: [
      'Sub-8ms P99 query latency across 50M vectors',
      '42% recall improvement over naive vector indexing',
      '60% memory footprint compression via scalar quantization',
      'Multi-tenant hardware isolation at zero extra overhead'
    ],
    techStack: ['Rust', 'Apache Arrow', 'SIMD', 'gRPC', 'RocksDB', 'Python'],
    status: 'RESEARCH PROTOTYPE',
    accentColor: '#D4FF70'
  },
  {
    id: 'symphony-ui',
    number: '04',
    title: 'Symphony Design Platform',
    category: 'Web Platforms',
    shortDescription: 'High-density design engineering platform and UI system built for mission-critical technical software and real-time operations dashboards.',
    fullOverview: 'A comprehensive frontend engineering architecture designed specifically for data-dense AI interfaces, featuring virtualized tabular viewports, canvas-driven graphs, and strict keyboard-first accessibility.',
    challenge: 'Modern component libraries prioritize consumer marketing simplicity, rapidly degrading when asked to render 100k data points or complex multi-pane engineering dashboards.',
    solutionEngineered: 'Engineered a zero-runtime CSS token architecture paired with WebGL canvas fallbacks for ultra-dense data grids, achieving 60 FPS scrolling regardless of table dataset size.',
    impactMetrics: [
      '60 FPS guaranteed viewport rendering with 100k+ rows',
      'WCAG AAA compliance across high-contrast dark themes',
      'Zero layout shift across dynamic layout pane resizing',
      '40% faster developer prototyping cycle time'
    ],
    techStack: ['TypeScript', 'React 19', 'Tailwind CSS', 'WebGL', 'Zustand'],
    status: 'PILOT DEPLOYED',
    accentColor: '#C7FF45'
  }
];
