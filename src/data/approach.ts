import type { ProcessStep } from '../types';

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Discover',
    timelinePhase: 'Foundation & Inquiry',
    shortDescription: 'We interrogate the root assumptions, technical constraints, user workflows, and core operational bottlenecks before proposing any software architecture.',
    deliverables: [
      'Technical constraint & latency feasibility matrix',
      'Data asset & pipeline audit',
      'User journey mapping & friction point analysis',
      'System dependency & security boundary assessment'
    ]
  },
  {
    step: '02',
    title: 'Define',
    timelinePhase: 'Architecture & Scope',
    shortDescription: 'We synthesize findings into a clear, unambiguous architectural blueprint, establishing concrete service boundaries, model specifications, and benchmark metrics.',
    deliverables: [
      'End-to-end system architecture specifications',
      'API interface contracts & data schemas',
      'Model selection & training/inference budget',
      'Measurable KPI and performance SLA definition'
    ]
  },
  {
    step: '03',
    title: 'Design & Engineer',
    timelinePhase: 'Iterative Implementation',
    shortDescription: 'We build through rigorous engineering cycles: pairing modern UI craft with robust backends, continuous integration, type-safety, and real-world testing.',
    deliverables: [
      'Production-grade application codebase in TypeScript/Rust/Python',
      'High-fidelity interactive UI with responsive precision',
      'Automated integration test suites & CI/CD pipeline',
      'Zero-trust deployment staging environment'
    ]
  },
  {
    step: '04',
    title: 'Test & Evolve',
    timelinePhase: 'Validation & Scaling',
    shortDescription: 'We validate performance under realistic workloads, conduct security profiling, optimize memory and latency, and establish observability for long-term health.',
    deliverables: [
      'Stress testing, load simulation & latency profiling',
      'Security audit & automated vulnerability scanning',
      'Telemetry dashboards & alerting monitors',
      'Structured technical documentation & knowledge handover'
    ]
  }
];
