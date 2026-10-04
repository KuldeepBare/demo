import React from 'react';
import { ShieldCheck, Wine, Box, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="border-b border-[#181a20] bg-[#070809] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold tracking-widest text-[#d4af37] uppercase">
            Protocol & Operations
          </span>
          <h2
            className="mt-2 text-3xl font-bold tracking-tight text-[#f4efe6] sm:text-4xl"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            How Nocturne Operates
          </h2>
          <p className="mt-3 text-sm text-[#8e887d]">
            A civilized, compliant nocturnal delivery protocol engineered for connoisseurs requiring discretion, cold-chain preservation, and strict excise compliance.
          </p>
        </div>

        {/* 3-Column Editorial Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Step 1 */}
          <div className="relative rounded-2xl border border-[#1e2029] bg-[#0c0d10] p-8 transition-all hover:border-[#d4af37]/30">
            <span className="font-mono text-2xl font-bold text-[#d4af37] tabular-nums">01.</span>
            <h3 className="mt-4 text-lg font-semibold text-[#f4efe6]">
              Zero-Knowledge Age Verification
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-[#b3ada2]">
              In full compliance with the Digital Personal Data Protection (DPDP) Act, you confirm your legal purchasing age (21+) via an authorized verification provider. We strictly do not store raw Aadhaar numbers, biometric data, or identity scans.
            </p>
            <div className="mt-6 border-t border-[#181a20] pt-4 text-[11px] text-[#8e887d]">
              Statutory verification token issued for the nocturnal session.
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-2xl border border-[#1e2029] bg-[#0c0d10] p-8 transition-all hover:border-[#d4af37]/30">
            <span className="font-mono text-2xl font-bold text-[#d4af37] tabular-nums">02.</span>
            <h3 className="mt-4 text-lg font-semibold text-[#f4efe6]">
              Curated Reserve Selection
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-[#b3ada2]">
              Access rare single malts, botanical craft gins, and prestige champagnes cellared in climate-regulated environments. Every allocation bears valid excise holograms and origin certificates.
            </p>
            <div className="mt-6 border-t border-[#181a20] pt-4 text-[11px] text-[#8e887d]">
              Strict maximum order limit enforced per excise guidelines.
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-2xl border border-[#1e2029] bg-[#0c0d10] p-8 transition-all hover:border-[#d4af37]/30">
            <span className="font-mono text-2xl font-bold text-[#d4af37] tabular-nums">03.</span>
            <h3 className="mt-4 text-lg font-semibold text-[#f4efe6]">
              Discreet Cold-Chain Courier
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-[#b3ada2]">
              Packaged in unmarked, 14°C–16°C thermal hardcases. Dispatched exclusively during the legal 11:00 PM – 5:00 AM window. Certified couriers visually inspect recipient physical photo ID at handover.
            </p>
            <div className="mt-6 border-t border-[#181a20] pt-4 text-[11px] text-[#8e887d]">
              Unbroken cold chain with silent, discreet handover.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
