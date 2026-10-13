import React, { useState, useEffect } from 'react';
import { GlanziLogo } from '../ui/GlanziLogo';
import { Menu, X, ArrowUpRight, Search } from 'lucide-react';

interface NavbarProps {
  onOpenCommandPalette?: () => void;
  onOpenContact?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCommandPalette,
  onOpenContact
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Simple active section detection
      const sections = ['home', 'mission', 'solutions', 'products', 'work', 'approach', 'about', 'contact'];
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'Solutions', href: '#solutions', id: 'solutions' },
    { label: 'Products', href: '#products', id: 'products' },
    { label: 'Work', href: '#work', id: 'work' },
    { label: 'Approach', href: '#approach', id: 'approach' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#080A09]/90 backdrop-blur-md border-b border-[rgba(220,235,215,0.1)] py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Wordmark */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#C7FF45] rounded-lg p-1"
            aria-label="GLANZI Home"
          >
            <GlanziLogo size="sm" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full bg-[#131713]/60 border border-[rgba(220,235,215,0.08)] backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-3 py-1 text-xs font-mono tracking-wider transition-colors duration-200 rounded-full ${
                    isActive
                      ? 'text-[#C7FF45] bg-[#1D241D] font-medium'
                      : 'text-[#9BA39A] hover:text-[#F5F7F2] hover:bg-[#181D18]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Command Palette Button */}
            {onOpenCommandPalette && (
              <button
                onClick={onOpenCommandPalette}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#131713] border border-[rgba(220,235,215,0.12)] text-[#9BA39A] hover:text-[#F5F7F2] hover:border-[rgba(199,255,69,0.3)] transition-all text-xs font-mono"
                aria-label="Open command palette"
                title="Search / Command Palette (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-[#C7FF45]" />
                <span className="hidden lg:inline text-[11px]">Command</span>
                <kbd className="hidden lg:inline text-[9px] px-1 py-0.5 rounded bg-[#1C221C] border border-[rgba(220,235,215,0.15)] text-[#697168]">
                  ⌘K
                </kbd>
              </button>
            )}

            {/* Primary Action Button */}
            <a
              href="#contact"
              onClick={(e) => {
                if (onOpenContact) {
                  e.preventDefault();
                  onOpenContact();
                } else {
                  handleNavClick(e, '#contact');
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C7FF45] hover:bg-[#d4ff68] text-[#080A09] font-mono text-xs font-semibold tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(199,255,69,0.25)] hover:shadow-[0_0_25px_rgba(199,255,69,0.4)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            {onOpenCommandPalette && (
              <button
                onClick={onOpenCommandPalette}
                className="p-2 rounded-lg bg-[#131713] border border-[rgba(220,235,215,0.12)] text-[#C7FF45]"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#131713] border border-[rgba(220,235,215,0.12)] text-[#F5F7F2] hover:text-[#C7FF45] focus:outline-none focus:ring-2 focus:ring-[#C7FF45]"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-[#080A09]/95 backdrop-blur-xl flex flex-col justify-between p-6 animate-in fade-in duration-200">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[rgba(220,235,215,0.12)]">
              <GlanziLogo size="sm" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-[#131713] text-[#9BA39A] hover:text-[#F5F7F2]"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="mt-8 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="flex items-center justify-between py-3 text-lg font-display font-medium text-[#F5F7F2] hover:text-[#C7FF45] border-b border-[rgba(220,235,215,0.06)]"
                >
                  <span>{link.label}</span>
                  <span className="font-mono text-xs text-[#697168]">{link.id.toUpperCase()}</span>
                </a>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-[rgba(220,235,215,0.12)] flex flex-col gap-3">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="w-full py-3.5 rounded-lg bg-[#C7FF45] text-[#080A09] font-mono text-sm font-semibold tracking-wider text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(199,255,69,0.3)]"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <div className="flex items-center justify-center gap-2 font-mono text-[11px] text-[#697168] mt-2">
              <span className="w-2 h-2 rounded-full bg-[#C7FF45]" />
              <span>SYSTEMS OPERATIONAL • GLANZI.AI</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
