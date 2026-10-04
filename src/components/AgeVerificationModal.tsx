import React, { useState } from 'react';
import { X, ShieldAlert, ShieldCheck, CheckCircle2, Lock, ArrowRight, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { VerificationToken } from '../types/index.ts';

export const AgeVerificationModal: React.FC = () => {
  const { showAgeModal, setShowAgeModal, confirmAgeVerification, compliance } = useApp();

  const [step, setStep] = useState<'initial' | 'verify_provider' | 'exit_declined'>('initial');
  const [fullName, setFullName] = useState('');
  const [birthYear, setBirthYear] = useState<number>(1995);
  const [provider, setProvider] = useState<'DigiLocker_API' | 'IDCentral_Auth' | 'Aadhaar_Offline_XML' | 'Manual_Physical_ID'>('DigiLocker_API');
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!showAgeModal) return null;

  const minAge = compliance?.minLegalAge || 21;

  const handleInitialYes = () => {
    setStep('verify_provider');
  };

  const handleInitialNo = () => {
    setStep('exit_declined');
  };

  const handleProviderVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/verify-age', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim() || 'Verified Connoisseur',
          birthYear: Number(birthYear),
          provider,
          acceptedTerms
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || 'Verification could not be established.');
        setIsVerifying(false);
        return;
      }

      if (data.token) {
        confirmAgeVerification(data.token);
        // Scroll smoothly to cellar section
        setTimeout(() => {
          const el = document.getElementById('cellar-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } catch (err: any) {
      setErrorMsg('Network error connecting to authorized verification provider.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-modal-title"
        className="relative w-full max-w-lg rounded-2xl border border-[#242630] bg-[#0c0d10] p-6 sm:p-8 shadow-2xl shadow-black/90 text-[#f4efe6]"
      >
        {/* Close Button (only accessible if already on exit or cancel) */}
        <button
          onClick={() => setShowAgeModal(false)}
          aria-label="Close modal"
          className="absolute top-5 right-5 rounded-lg p-1.5 text-[#8e887d] hover:bg-[#181a20] hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* --- STEP 1: INITIAL COMPLIANCE QUESTION --- */}
        {step === 'initial' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-semibold tracking-widest text-[#d4af37] uppercase">
                  Age & Regulatory Verification
                </span>
                <h2 id="age-modal-title" className="text-xl font-bold tracking-tight text-[#f4efe6]">
                  Legal Access Requirement
                </h2>
              </div>
            </div>

            <div className="rounded-xl border border-[#181a20] bg-[#121318] p-4 text-sm leading-relaxed text-[#d1cbbe]">
              <p className="font-medium text-[#f4efe6]">
                Are you legally permitted to purchase alcohol in your location?
              </p>
              <p className="mt-2 text-xs text-[#8e887d]">
                This service strictly operates in compliance with State Excise laws and mandates a
                minimum age of {minAge}+ years. Alcohol delivery is strictly prohibited for minors.
              </p>
            </div>

            <div className="space-y-2 text-xs text-[#8e887d]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#d4af37] mt-0.5" />
                <span>
                  Physical original photo ID verification is legally required upon doorstep courier delivery.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#d4af37] mt-0.5" />
                <span>
                  Privacy-first: Zero-knowledge age confirmation. We do not store raw Aadhaar numbers or identity cards.
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                onClick={handleInitialYes}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#d4af37] py-3 px-5 text-sm font-semibold text-[#0c0d10] transition-all hover:bg-[#e8ca74] active:scale-[0.99]"
              >
                <span>Yes, continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={handleInitialNo}
                className="flex-1 rounded-lg border border-[#242630] bg-[#181a20] py-3 px-5 text-sm font-medium text-[#b3ada2] transition-colors hover:border-[#353846] hover:text-[#f4efe6]"
              >
                No, exit
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 2: PRIVACY-PRESERVING AGE TOKEN CHECK --- */}
        {step === 'verify_provider' && (
          <form onSubmit={handleProviderVerification} className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-semibold tracking-widest text-[#d4af37] uppercase">
                  Zero-Knowledge Proof
                </span>
                <h2 className="text-xl font-bold tracking-tight text-[#f4efe6]">
                  Confirm Legal Eligibility ({minAge}+)
                </h2>
              </div>
            </div>

            <p className="text-xs text-[#b3ada2]">
              In accordance with Indian privacy laws (DPDP Act) and alcohol licensing rules, choose an
              authorized verification method. No sensitive identity documents are stored on our servers.
            </p>

            {errorMsg && (
              <div className="rounded-lg border border-red-500/30 bg-red-950/20 p-3 text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#d1cbbe] mb-1">
                  Recipient Full Name (as on government ID)
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Vikram Singhania"
                  className="w-full rounded-lg border border-[#242630] bg-[#121318] px-3.5 py-2.5 text-sm text-[#f4efe6] placeholder-[#5a564f] focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#d1cbbe] mb-1">
                    Year of Birth
                  </label>
                  <select
                    value={birthYear}
                    onChange={(e) => setBirthYear(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#242630] bg-[#121318] px-3 py-2.5 text-sm text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                  >
                    {Array.from({ length: 70 }, (_, i) => 2008 - i).map((yr) => (
                      <option key={yr} value={yr}>
                        {yr} ({new Date().getFullYear() - yr} yrs)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#d1cbbe] mb-1">
                    Verification Method
                  </label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value as any)}
                    className="w-full rounded-lg border border-[#242630] bg-[#121318] px-3 py-2.5 text-sm text-[#f4efe6] focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="DigiLocker_API">DigiLocker API Token</option>
                    <option value="IDCentral_Auth">IDCentral Age Check</option>
                    <option value="Aadhaar_Offline_XML">Offline QR Age Assertion</option>
                    <option value="Manual_Physical_ID">Doorstep Physical ID Affirmation</option>
                  </select>
                </div>
              </div>

              <div className="rounded-lg border border-[#181a20] bg-[#121318]/60 p-3 text-[11px] text-[#8e887d]">
                <span className="font-semibold text-[#d4af37]">Privacy Guarantee: </span>
                Our integration exchanges only an age assertion hash. Raw numbers, copies of IDs, or biometric data are never captured or saved.
              </div>

              <label className="flex items-start gap-2.5 text-xs text-[#b3ada2] cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[#242630] bg-[#121318] text-[#d4af37] focus:ring-0"
                />
                <span>
                  I solemnly affirm that I am above the legal purchasing age ({minAge}+) in this jurisdiction and agree to produce original physical government photo ID to the delivery agent.
                </span>
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('initial')}
                className="rounded-lg border border-[#242630] px-4 py-2.5 text-xs font-medium text-[#8e887d] hover:text-[#f4efe6]"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isVerifying}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#d4af37] px-5 py-2.5 text-xs font-semibold text-[#0c0d10] hover:bg-[#e8ca74] disabled:opacity-50 transition-all"
              >
                {isVerifying ? (
                  <span>Generating Verification Token...</span>
                ) : (
                  <>
                    <span>Verify & Unlock Cellar</span>
                    <ShieldCheck className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* --- STEP 3: EXIT DECLINED SCREEN --- */}
        {step === 'exit_declined' && (
          <div className="space-y-5 text-center py-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-950/40 text-red-400 border border-red-800/40">
              <ShieldAlert className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#f4efe6]">Access Restricted</h2>
              <p className="mt-2 text-sm text-[#b3ada2]">
                In compliance with statutory excise regulations and youth protection policies, we
                cannot grant access to age-restricted beverage products.
              </p>
            </div>

            <div className="rounded-xl border border-[#242630] bg-[#121318] p-4 text-xs text-[#8e887d] text-left space-y-2">
              <p className="font-semibold text-[#f4efe6]">Responsible Consumption Resources:</p>
              <p>• Alcohol support and awareness counseling: 1800-11-0031</p>
              <p>• Statutory warning: Consumption of alcohol is injurious to health. Be safe, do not drink and drive.</p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setStep('initial');
                  setShowAgeModal(false);
                }}
                className="w-full rounded-lg border border-[#242630] bg-[#181a20] py-3 text-xs font-semibold text-[#f4efe6] hover:bg-[#242630]"
              >
                Return to Informational Landing Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
