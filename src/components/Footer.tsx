import React from 'react';
import { ShieldCheck, Lock, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const Footer: React.FC = () => {
  const { compliance, setLegalModalType, setIsAdminOpen } = useApp();

  return (
    <footer className="border-t border-[#181a20] bg-[#050607] text-[#8e887d] py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 pb-12 border-b border-[#14151b]">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-4">
            <span
              className="font-serif text-lg tracking-[0.2em] text-[#f4efe6]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              NOCTURNE RESERVE
            </span>
            <p className="max-w-md text-xs leading-relaxed text-[#736e65]">
              Curated late-night cellar concierge providing temperature-controlled delivery of fine spirits and allocated vintages. Operating exclusively during authorized nocturnal delivery hours (11:00 PM – 5:00 AM) in licensed metropolitan corridors.
            </p>
            <div className="pt-2 text-[11px] text-[#55514a]">
              State Excise Facilitator License #{compliance?.licenseNumber || 'FL-III/2026/MUM-WZ-8849'}.
            </div>
          </div>

          {/* Legal & Compliance Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#d1cbbe]">
              Legal Governance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setLegalModalType('privacy')}
                  className="hover:text-[#f4efe6] transition-colors"
                >
                  Privacy Policy (DPDP Act)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLegalModalType('terms')}
                  className="hover:text-[#f4efe6] transition-colors"
                >
                  Terms of Service & Licensing
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLegalModalType('age-policy')}
                  className="hover:text-[#f4efe6] transition-colors"
                >
                  Age Restriction & ID Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLegalModalType('responsible')}
                  className="hover:text-[#f4efe6] transition-colors"
                >
                  Responsible Drinking Charter
                </button>
              </li>
            </ul>
          </div>

          {/* Operations & Dispatch */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#d1cbbe]">
              Nocturnal Concierge
            </h4>
            <ul className="space-y-2 text-xs text-[#736e65]">
              <li>Permitted Window: 11:00 PM – 5:00 AM</li>
              <li>Cellar Hubs: South Mumbai & Bandra</li>
              <li>Packaging: 14°C Isothermal Hardcase</li>
              <li>Mandatory Photo ID at Handover</li>
              <li className="pt-2">
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] hover:underline"
                >
                  <Lock className="h-3 w-3" />
                  <span>Operator Dispatch Console</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Statutory Disclaimers & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[11px] text-[#55514a]">
          <div>
            <p>
              STATUTORY WARNING: Consumption of alcohol is injurious to health. Be safe — do not drink and drive.
            </p>
            <p className="mt-1">
              Deliveries are only fulfilled to recipients who have reached the legal drinking age in their jurisdiction and present original government-issued photo ID upon arrival.
            </p>
          </div>

          <div className="text-right shrink-0">
            © {new Date().getFullYear()} Nocturne Reserve Ltd. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
