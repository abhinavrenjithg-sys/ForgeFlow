import React, { useState } from 'react';
import { ToastProvider } from './components/ui/Toast';
import { useToast } from './components/ui/useToast';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { BrandIntro } from './components/sections/BrandIntro';
import { SolutionsSection } from './components/sections/SolutionsSection';
import { ProductShowcase } from './components/sections/ProductShowcase';
import { FeaturedWork } from './components/sections/FeaturedWork';
import { HowWeWork } from './components/sections/HowWeWork';
import { WhyGlanzi } from './components/sections/WhyGlanzi';
import { AboutSection } from './components/sections/AboutSection';
import { ContactSection } from './components/sections/ContactSection';
import { ProductDetailModal } from './components/modals/ProductDetailModal';
import { ProjectDetailModal } from './components/modals/ProjectDetailModal';
import { CommandPalette } from './components/modals/CommandPalette';
import type { Product, Project, Solution } from './types';

const GlanziAppContent: React.FC = () => {
  const { showToast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const handleCommandAction = (actionId: string) => {
    if (actionId === 'open-palette') {
      setCommandPaletteOpen(true);
      return;
    }
    const element = document.getElementById(actionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleConsultFromProduct = (productName: string) => {
    const contactEl = document.getElementById('contact');
    contactEl?.scrollIntoView({ behavior: 'smooth' });
    showToast(`Inquiry configured for product: ${productName}`, 'info');
  };

  const handleConsultFromProject = (projectTitle: string) => {
    const contactEl = document.getElementById('contact');
    contactEl?.scrollIntoView({ behavior: 'smooth' });
    showToast(`Inquiry configured for architecture: ${projectTitle}`, 'info');
  };

  const handleSelectSolution = (solution: Solution) => {
    showToast(`Focused capability: ${solution.title}`, 'info');
  };

  const handleConsultSolution = (solutionId: string) => {
    const contactEl = document.getElementById('contact');
    contactEl?.scrollIntoView({ behavior: 'smooth' });
    showToast(`Inquiry initiated for ${solutionId.toUpperCase()} capability`, 'info');
  };

  return (
    <div className="min-h-screen bg-[#080A09] text-[#F5F7F2] flex flex-col selection:bg-[#C7FF45] selection:text-[#080A09]">
      {/* Sticky Navigation */}
      <Navbar
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenContact={() => {
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col">
        {/* 05. Hero Section */}
        <Hero
          onExploreWork={() => {
            document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onContactClick={() => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 06. Brand Introduction / Mission */}
        <BrandIntro />

        {/* 07. Solutions / Capabilities */}
        <SolutionsSection
          onSelectSolution={handleSelectSolution}
          onConsultSolution={handleConsultSolution}
        />

        {/* 08. Products Showcase */}
        <ProductShowcase
          onOpenProductDetail={(prod) => setSelectedProduct(prod)}
        />

        {/* 10. Selected Work */}
        <FeaturedWork
          onOpenProjectDetail={(proj) => setSelectedProject(proj)}
        />

        {/* 11. How We Work / Process */}
        <HowWeWork />

        {/* 12. Why Glanzi / Principles */}
        <WhyGlanzi />

        {/* 13. About Glanzi / Thinking Behind the Build */}
        <AboutSection />

        {/* 14. Contact Form & Brief Submission */}
        <ContactSection />
      </main>

      {/* 15. Footer */}
      <Footer />

      {/* Reusable Modals */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onInitiateInquiry={handleConsultFromProduct}
      />

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onConsultProject={handleConsultFromProject}
      />

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectAction={handleCommandAction}
      />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <GlanziAppContent />
    </ToastProvider>
  );
}
