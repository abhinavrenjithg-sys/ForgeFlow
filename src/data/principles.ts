import type { Principle } from '../types';

export const PRINCIPLES: Principle[] = [
  {
    title: 'ENGINEERED WITH PURPOSE',
    headline: 'Every technical decision solves a real problem.',
    description: 'We reject complexity for the sake of novelty. Every library, model parameter, and architectural pattern must directly advance system reliability, speed, or utility.',
    technicalImplication: 'Lean dependencies, measurable performance benchmarks, and zero superficial abstraction layers.'
  },
  {
    title: 'DESIGNED AROUND PEOPLE',
    headline: 'Technology should be understandable, usable, and accessible.',
    description: 'The most capable AI model is ineffective if operators cannot trust or comprehend its decisions. We prioritize clarity, predictable mental models, and intuitive ergonomics.',
    technicalImplication: 'Semantic typography, keyboard accessibility, clear error states, and transparent system reasoning.'
  },
  {
    title: 'BUILT TO EVOLVE',
    headline: 'Architecture and implementation should support future improvements.',
    description: 'We engineer modular, loosely coupled components with strict interface contracts so systems adapt smoothly as AI models and business requirements advance.',
    technicalImplication: 'Clean API boundaries, type safety, comprehensive test coverage, and portable cloud infrastructure.'
  },
  {
    title: 'FOCUSED ON REAL OUTCOMES',
    headline: 'Measure success through useful functionality and meaningful results.',
    description: 'We evaluate our work not by artificial vanity metrics or marketing buzz, but by tangible throughput gains, reduced human fatigue, and verified uptime.',
    technicalImplication: 'Continuous telemetry, SLA accountability, auditable logs, and pragmatic production delivery.'
  }
];
