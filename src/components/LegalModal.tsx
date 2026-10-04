import React from 'react';
import { X, ShieldCheck, Scale, AlertOctagon, HeartHandshake } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const LegalModal: React.FC = () => {
  const { legalModalType, setLegalModalType, compliance } = useApp();

  if (!legalModalType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        className="relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#242630] bg-[#0c0d10] p-6 sm:p-10 shadow-2xl text-[#f4efe6]"
      >
        <button
          onClick={() => setLegalModalType(null)}
          aria-label="Close legal modal"
          className="absolute top-5 right-5 rounded-lg p-2 text-[#8e887d] hover:bg-[#181a20] hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* --- PRIVACY POLICY (DPDP ACT) --- */}
        {legalModalType === 'privacy' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-semibold tracking-widest text-[#d4af37] uppercase">
                  Data Protection & Privacy
                </span>
                <h2 id="legal-modal-title" className="text-2xl font-bold tracking-tight text-[#f4efe6]">
                  Privacy Policy & Data Minimization Charter
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-[#b3ada2]">
              <p>
                Nocturne Reserve (&ldquo;Service&rdquo;) is committed to the highest standards of user privacy, strictly aligned with India’s Digital Personal Data Protection (DPDP) Act, the Information Technology Act, and applicable State Excise regulatory rules.
              </p>

              <h4 className="text-sm font-semibold text-[#f4efe6] pt-2">
                1. Principle of Strict Data Minimization
              </h4>
              <p>
                We collect only the bare minimum personal data strictly necessary to fulfill an age-restricted nocturnal dispatch: your delivery address, name, and contact telephone number for courier synchronization.
              </p>

              <h4 className="text-sm font-semibold text-[#f4efe6] pt-2">
                2. Prohibition on Raw Identity & Aadhaar Storage
              </h4>
              <p className="border-l-2 border-[#d4af37] pl-3 text-[#d1cbbe]">
                In accordance with Unique Identification Authority of India (UIDAI) circulars and statutory privacy mandates, Nocturne strictly DOES NOT collect, record, copy, or store raw 12-digit Aadhaar numbers, scanned government identity cards, biometric data, or identity documents in our database.
              </p>
              <p>
                Age verification is achieved via authorized third-party cryptographic tokenization (e.g. DigiLocker API / IDCentral / Offline QR XML assertion). We store exclusively an ephemeral zero-knowledge age verification token certifying that the recipient is 21+ years of age.
              </p>

              <h4 className="text-sm font-semibold text-[#f4efe6] pt-2">
                3. Physical Handover Protocol
              </h4>
              <p>
                The courier will visually inspect an original government photo ID at the delivery doorstep. No image, photocopy, or scan of your card is taken or retained by the courier.
              </p>

              <h4 className="text-sm font-semibold text-[#f4efe6] pt-2">
                4. Data Retention & Deletion
              </h4>
              <p>
                Delivery fulfillment records are retained only for the legally mandated excise audit period and are thereafter permanently purged from production databases. You may request data erasure at privacy@nocturnereserve.in.
              </p>
            </div>
          </div>
        )}

        {/* --- TERMS OF SERVICE --- */}
        {legalModalType === 'terms' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
                <Scale className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-semibold tracking-widest text-[#d4af37] uppercase">
                  Contractual Terms
                </span>
                <h2 id="legal-modal-title" className="text-2xl font-bold tracking-tight text-[#f4efe6]">
                  Terms of Service & Licensing Terms
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-[#b3ada2]">
              <p>
                These Terms of Service govern the facilitation of alcoholic beverage deliveries through Nocturne Reserve acting as a certified technological facilitator for licensed retail partner cellars under License #{compliance?.licenseNumber || 'FL-III/2026/MUM'}.
              </p>

              <h4 className="text-sm font-semibold text-[#f4efe6] pt-2">
                1. Statutory Service Window
              </h4>
              <p>
                Delivery dispatches are permitted solely between {compliance?.serviceWindowStart || '23:00'} and {compliance?.serviceWindowEnd || '05:00'} (11:00 PM – 5:00 AM) in designated authorized municipal corridors. Orders cannot be fulfilled during declared statutory Dry Days or outside these hours.
              </p>

              <h4 className="text-sm font-semibold text-[#f4efe6] pt-2">
                2. Doorstep Verification Mandate
              </h4>
              <p>
                The buyer warrants that the recipient is of legal purchasing age (21+ or 25+ where applicable). Handover will only occur to the individual whose physical government photo ID matches the order reservation. Failure to produce valid original ID results in immediate order return without refund.
              </p>

              <h4 className="text-sm font-semibold text-[#f4efe6] pt-2">
                3. Purchase Rations & Anti-Hoarding
              </h4>
              <p>
                Orders are capped at a maximum of {compliance?.maxBottlesPerOrder || 3} bottles per individual patron per 24-hour cycle. Commercial resale, redistribution, or consumption in unlicensed public areas is strictly prohibited.
              </p>
            </div>
          </div>
        )}

        {/* --- AGE RESTRICTION POLICY --- */}
        {legalModalType === 'age-policy' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
                <AlertOctagon className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-semibold tracking-widest text-[#d4af37] uppercase">
                  Youth Protection
                </span>
                <h2 id="legal-modal-title" className="text-2xl font-bold tracking-tight text-[#f4efe6]">
                  Age-Restriction & Underage Prevention Policy
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-[#b3ada2]">
              <p>
                Nocturne Reserve maintains a strict zero-tolerance policy regarding underage alcohol purchase or possession.
              </p>

              <h4 className="text-sm font-semibold text-[#f4efe6] pt-2">
                Legal Thresholds by Jurisdiction:
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Maharashtra: 21 years for wine and beer; 25 years for spirits.</li>
                <li>Goa, Karnataka, Delhi, and other territories: As governed by local State Excise acts.</li>
              </ul>

              <h4 className="text-sm font-semibold text-[#f4efe6] pt-2">
                Dual Verification Gate:
              </h4>
              <p>
                1. Digital Zero-Knowledge Proof: Date of birth validated via authorized digital verification before catalog access.
              </p>
              <p>
                2. Physical In-Person Inspection: Original photo ID examined at doorstep handover. Couriers do not leave packages unattended, at front doors, or with proxies.
              </p>
            </div>
          </div>
        )}

        {/* --- RESPONSIBLE CONSUMPTION CHARTER --- */}
        {legalModalType === 'responsible' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-semibold tracking-widest text-[#d4af37] uppercase">
                  Civil Society & Health
                </span>
                <h2 id="legal-modal-title" className="text-2xl font-bold tracking-tight text-[#f4efe6]">
                  Responsible Consumption Charter
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-[#b3ada2]">
              <p>
                Spirits and fine wines are culinary creations meant to be savored in moderation. Nocturne Reserve actively discourages excessive intake, rapid intoxication, and irresponsible nocturnal behavior.
              </p>

              <h4 className="text-sm font-semibold text-[#f4efe6] pt-2">
                Refusal to Intoxicated Patrons
              </h4>
              <p>
                Our delivery personnel are trained in responsible service standards and have statutory authorization to withhold delivery if the recipient demonstrates signs of intoxication or aggressive behavior.
              </p>

              <h4 className="text-sm font-semibold text-[#f4efe6] pt-2">
                Support & Counseling Resources
              </h4>
              <div className="rounded-lg border border-[#242630] bg-[#121318] p-4 text-xs space-y-2">
                <p className="font-semibold text-[#f4efe6]">National Helpline & Support Lines:</p>
                <p>• National Toll-Free Drug & Alcohol De-addiction Helpline: 1800-11-0031</p>
                <p>• Alcoholics Anonymous India: +91 90227 71011</p>
                <p>• Never drink and drive: Always arrange a designated driver or rideshare service.</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 border-t border-[#181a20] pt-4 text-right">
          <button
            onClick={() => setLegalModalType(null)}
            className="rounded-lg bg-[#181a20] px-5 py-2 text-xs font-semibold text-[#d4af37] hover:bg-[#242630]"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
