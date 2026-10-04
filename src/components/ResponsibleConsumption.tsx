import React from 'react';
import { ShieldAlert, HeartHandshake, Scale, AlertOctagon } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const ResponsibleConsumption: React.FC = () => {
  const { compliance, setLegalModalType } = useApp();

  return (
    <section id="legal-compliance" className="border-b border-[#181a20] bg-[#090a0d] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold tracking-widest text-[#d4af37] uppercase">
            Civic Responsibility & Statutory Adherence
          </span>
          <h2
            className="mt-2 text-3xl font-bold tracking-tight text-[#f4efe6] sm:text-4xl"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            The Responsible Consumption Charter
          </h2>
          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#8e887d]">
            Nocturne operates on the principle of moderation, civil refinement, and strict adherence to Indian alcohol excise regulations. We do not promote binge consumption or unlawful indulgence.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#1e2029] bg-[#0c0d10] p-6">
            <Scale className="h-6 w-6 text-[#d4af37]" />
            <h3 className="mt-4 text-sm font-semibold text-[#f4efe6]">
              Statutory Age Enforcement ({compliance?.minLegalAge || 21}+)
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8e887d]">
              Zero tolerance for underage procurement. Every consignment requires physical inspection of government photo ID by the delivery agent at the doorstep.
            </p>
          </div>

          <div className="rounded-2xl border border-[#1e2029] bg-[#0c0d10] p-6">
            <AlertOctagon className="h-6 w-6 text-[#d4af37]" />
            <h3 className="mt-4 text-sm font-semibold text-[#f4efe6]">
              Rationed Transaction Limits
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8e887d]">
              Strict maximum of {compliance?.maxBottlesPerOrder || 3} bottles per customer per nocturnal delivery cycle to curtail excessive or secondary redistribution.
            </p>
          </div>

          <div className="rounded-2xl border border-[#1e2029] bg-[#0c0d10] p-6">
            <ShieldAlert className="h-6 w-6 text-[#d4af37]" />
            <h3 className="mt-4 text-sm font-semibold text-[#f4efe6]">
              Intoxication Refusal Mandate
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8e887d]">
              Couriers are legally empowered and mandated to refuse handover if the recipient exhibits visible intoxication, disorderly conduct, or proxy recipient indicators.
            </p>
          </div>

          <div className="rounded-2xl border border-[#1e2029] bg-[#0c0d10] p-6">
            <HeartHandshake className="h-6 w-6 text-[#d4af37]" />
            <h3 className="mt-4 text-sm font-semibold text-[#f4efe6]">
              Data Minimization (DPDP Act)
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8e887d]">
              In strict accordance with the Digital Personal Data Protection Act, Nocturne collects only minimal order data and never stores raw Aadhaar or biometrics.
            </p>
          </div>
        </div>

        {/* Statutory Warning Box */}
        <div className="mt-10 rounded-2xl border border-[#d4af37]/30 bg-[#121318] p-6 text-center">
          <div className="font-serif text-xs sm:text-sm font-semibold tracking-wider text-[#d4af37] uppercase">
            Statutory Warning / Govt. Health Advisory
          </div>
          <p className="mt-2 text-xs sm:text-sm text-[#f4efe6] font-medium">
            Alcohol consumption is injurious to health. Be safe — do not drink and drive. Not for sale to persons under {compliance?.minLegalAge || 21} years of age.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
            <button
              onClick={() => setLegalModalType('responsible')}
              className="text-[#d4af37] hover:underline"
            >
              Read Full Responsible Drinking Policy →
            </button>
            <button
              onClick={() => setLegalModalType('age-policy')}
              className="text-[#d4af37] hover:underline"
            >
              Age Restriction & Excise Policy →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
