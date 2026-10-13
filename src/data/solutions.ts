import type { Solution } from '../types';

export const SOLUTIONS: Solution[] = [
  {
    id: 'ai-ml',
    number: '01',
    title: 'AI & Machine Learning',
    tagline: 'Predictive intelligence and adaptive neural systems',
    description: 'We architect and train custom machine learning workflows, fine-tuned multimodal models, computer vision systems, and low-latency natural language pipelines tailored to domain-specific workloads.',
    capabilities: [
      'Custom LLM Fine-Tuning & Quantization',
      'High-Throughput Computer Vision & Object Tracking',
      'Retrieval-Augmented Generation (RAG) Architecture',
      'Autonomous Agent Swarms & Reasoning Chains',
      'Edge Model Optimization & TensorRT Acceleration'
    ],
    techStack: ['PyTorch', 'vLLM', 'Triton', 'TensorRT', 'HuggingFace', 'ONNX'],
    metrics: '<18ms inference latency on quantized edge models',
    architectureDiagramType: 'neural'
  },
  {
    id: 'software-engineering',
    number: '02',
    title: 'Software & Product Engineering',
    tagline: 'Fault-tolerant distributed applications and modern software suites',
    description: 'We construct high-reliability digital applications, robust APIs, event-driven architectures, and developer platforms engineered for scale, auditability, and zero-downtime evolution.',
    capabilities: [
      'Microservice & Event-Driven Distributed Backends',
      'Ultra-Responsive Web Applications & Design Systems',
      'Type-Safe GraphQL & High-Performance gRPC APIs',
      'Zero-Trust Auth & Hardened Infrastructure Security',
      'Cloud-Native Kubernetes CI/CD Deployment Pipelines'
    ],
    techStack: ['TypeScript', 'Go', 'Rust', 'React / Next.js', 'PostgreSQL', 'Docker / K8s'],
    metrics: '99.99% availability with automated canary rollouts',
    architectureDiagramType: 'distributed'
  },
  {
    id: 'intelligent-automation',
    number: '03',
    title: 'Intelligent Automation',
    tagline: 'Self-orchestrating business logic and cognitive agent pipelines',
    description: 'We build autonomous workflows that bridge disparate software ecosystems, eliminate human-in-the-loop bottlenecks, and execute structured decision loops with strict audit logs.',
    capabilities: [
      'Multi-Agent System Orchestration & Tool Calling',
      'Complex Document Processing & Semantic Ingestion',
      'Deterministic Fallbacks & Human-on-the-Loop Safeguards',
      'Real-Time ETL & Streaming Event Bus Triggers',
      'Audited Compliance & Enterprise Process Telemetry'
    ],
    techStack: ['Temporal', 'Kafka', 'Python', 'LangGraph', 'Redis Streams', 'ClickHouse'],
    metrics: '70%+ operational latency reduction across data pipelines',
    architectureDiagramType: 'pipeline'
  },
  {
    id: 'decision-intelligence',
    number: '04',
    title: 'Data & Decision Intelligence',
    tagline: 'Actionable real-time analytics and predictive decision frameworks',
    description: 'We transform massive unstructured data streams into clear, actionable intelligence engines with interactive low-latency dashboards, predictive modeling, and executive decision-support systems.',
    capabilities: [
      'Real-Time Analytical Dashboards & Visualizations',
      'Columnar Big-Data Ingestion & OLAP Queries',
      'Probabilistic Forecasting & Monte Carlo Simulation',
      'Anomaly Detection & Early-Warning Trigger Engines',
      'Interactive Geospatial & Metric Surface Mapping'
    ],
    techStack: ['ClickHouse', 'DuckDB', 'Apache Arrow', 'WebGL / D3', 'TimescaleDB', 'FastAPI'],
    metrics: 'Sub-50ms query responses over 100M+ event records',
    architectureDiagramType: 'analytics'
  }
];
