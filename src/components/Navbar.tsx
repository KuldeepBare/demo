import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, Menu, X, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const Navbar: React.FC = () => {
  const {
    isAgeVerified,
    setShowAgeModal,
    cartTotalCount,
    setIsCartOpen,
    setIsAdminOpen,
    isOpenNow
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#242630] bg-[#0c0d10]/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="font-serif text-xl tracking-[0.25em] text-[#f4efe6] transition-colors hover:text-[#d4af37]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          NOCTURNE RESERVE
        </a>

        {/* Zone 2: 4-5 clean text nav links */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-[#b3ada2] lg:flex">
          <button
            onClick={() => scrollToSection('cellar-section')}
            className="transition-colors hover:text-[#f4efe6]"
          >
            Curated Cellar
          </button>
          <button
            onClick={() => scrollToSection('operating-hours')}
            className="transition-colors hover:text-[#f4efe6]"
          >
            Nocturnal Window
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="transition-colors hover:text-[#f4efe6]"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('service-area')}
            className="transition-colors hover:text-[#f4efe6]"
          >
            Service Area
          </button>
          <button
            onClick={() => scrollToSection('legal-compliance')}
            className="transition-colors hover:text-[#f4efe6]"
          >
            Compliance & FAQ
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Verification indicator / action */}
          {isAgeVerified ? (
            <div className="hidden items-center gap-1.5 text-xs text-[#d4af37] sm:flex">
              <ShieldCheck className="h-4 w-4" />
              <span className="font-medium tracking-wide">Age Verified (21+)</span>
            </div>
          ) : (
            <button
              onClick={() => setShowAgeModal(true)}
              className="hidden items-center gap-1.5 rounded-lg border border-[#d4af37]/40 px-3 py-1.5 text-xs font-medium text-[#e8ca74] transition-all hover:bg-[#d4af37]/10 sm:flex"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Verify Legal Age</span>
            </button>
          )}

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="View Order Reserve"
            className="relative flex items-center gap-2 rounded-lg bg-[#181a20] px-4 py-2 text-xs font-semibold text-[#f4efe6] transition-all hover:bg-[#242630] hover:text-[#d4af37]"
          >
            <ShoppingBag className="h-4 w-4 text-[#d4af37]" />
            <span className="hidden sm:inline">Reserve Bag</span>
            <span className="font-mono text-xs font-bold text-[#d4af37] tabular-nums">
              ({cartTotalCount})
            </span>
            {cartTotalCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#d4af37] text-[10px] font-bold text-[#0c0d10]">
                {cartTotalCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-[#b3ada2] hover:text-white lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-[#242630] bg-[#0c0d10] px-6 py-6 lg:hidden">
          <div className="flex flex-col gap-4 text-sm font-medium text-[#b3ada2]">
            <div className="flex items-center justify-between border-b border-[#181a20] pb-3 text-xs">
              <span className="text-[#8e887d]">Current Status</span>
              <span className={`font-mono ${isOpenNow ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isOpenNow ? '● 11 PM–5 AM ACTIVE' : '○ WINDOW CLOSED (11 PM–5 AM)'}
              </span>
            </div>

            <button
              onClick={() => scrollToSection('cellar-section')}
              className="text-left py-2 hover:text-[#d4af37]"
            >
              Curated Cellar
            </button>
            <button
              onClick={() => scrollToSection('operating-hours')}
              className="text-left py-2 hover:text-[#d4af37]"
            >
              Nocturnal Window
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-left py-2 hover:text-[#d4af37]"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('service-area')}
              className="text-left py-2 hover:text-[#d4af37]"
            >
              Service Area & Pincodes
            </button>
            <button
              onClick={() => scrollToSection('legal-compliance')}
              className="text-left py-2 hover:text-[#d4af37]"
            >
              Legal Compliance & Disclaimers
            </button>

            <div className="mt-2 pt-4 border-t border-[#181a20] flex items-center justify-between">
              {!isAgeVerified ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowAgeModal(true);
                  }}
                  className="w-full text-center py-2.5 rounded-lg border border-[#d4af37]/60 text-xs font-semibold text-[#e8ca74] bg-[#d4af37]/10"
                >
                  Verify Legal Age (21+)
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs text-[#d4af37]">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Age Verified Patron</span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAdminOpen(true);
              }}
              className="text-left text-xs text-[#736e65] hover:text-[#b3ada2] pt-2"
            >
              Operator Dispatch Portal →
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
