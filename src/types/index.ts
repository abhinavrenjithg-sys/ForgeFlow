export interface Solution {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  capabilities: string[];
  techStack: string[];
  metrics: string;
  architectureDiagramType: 'neural' | 'distributed' | 'pipeline' | 'analytics';
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  status: 'PROTOTYPE' | 'ACTIVE_BETA' | 'IN_RESEARCH' | 'INTERNAL_TOOL';
  statusLabel: string;
  category: string;
  overview: string;
  problemSolved: string;
  keyFeatures: string[];
  techStack: string[];
  liveDemoAvailable: boolean;
  repoOrDocLink?: string;
  metrics: { label: string; value: string }[];
}

export interface Project {
  id: string;
  number: string;
  title: string;
  category: 'AI Systems' | 'Infrastructure' | 'Web Platforms' | 'Decision Engines';
  shortDescription: string;
  fullOverview: string;
  challenge: string;
  solutionEngineered: string;
  impactMetrics: string[];
  techStack: string[];
  status: 'CONCEPT SYSTEM' | 'RESEARCH PROTOTYPE' | 'PILOT DEPLOYED';
  accentColor?: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  shortDescription: string;
  deliverables: string[];
  timelinePhase: string;
}

export interface Principle {
  title: string;
  headline: string;
  description: string;
  technicalImplication: string;
}

export interface ContactFormData {
  fullName: string;
  workEmail: string;
  companyName: string;
  projectType: string;
  timelineBudget: string;
  projectDescription: string;
}
