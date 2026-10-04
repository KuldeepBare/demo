import React, { useState } from 'react';
import { MapPin, CheckCircle2, XCircle, Search, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const ServiceAreaSection: React.FC = () => {
  const { compliance } = useApp();
  const [testPincode, setTestPincode] = useState('');
  const [checkResult, setCheckResult] = useState<{ checked: boolean; serviceable: boolean; pincode: string } | null>(null);

  const permitted = compliance?.permittedPincodes || [
    '400001', '400005', '400020', '400021', '400026', '400050', '400051', '400052', '400054', '400056', '400069'
  ];

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = testPincode.trim();
    if (!clean) return;
    const isServiceable = permitted.includes(clean);
    setCheckResult({
      checked: true,
      serviceable: isServiceable,
      pincode: clean
    });
  };

  return (
    <section id="service-area" className="border-b border-[#181a20] bg-[#070809] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Column: Context */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#d4af37] uppercase">
              <MapPin className="h-4 w-4" />
              <span>Licensed Delivery Zones</span>
            </div>

            <h2
              className="mt-3 text-3xl font-bold tracking-tight text-[#f4efe6] sm:text-4xl"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Authorised Service Corridor
            </h2>

            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#b3ada2]">
              In accordance with state excise retail facilitation rules, Nocturne operates through licensed partner cellars serving pre-approved metropolitan postal codes in Mumbai. We do not dispatch outside licensed municipal borders.
            </p>

            {/* Interactive Pincode Checker Form */}
            <form onSubmit={handleCheck} className="mt-8">
              <label className="block text-xs font-medium text-[#d1cbbe] mb-2">
                Check Your Delivery Pincode Eligibility
              </label>
              <div className="flex gap-2 max-w-md">
                <input
                  type="text"
                  maxLength={6}
                  value={testPincode}
                  onChange={(e) => {
                    setTestPincode(e.target.value);
                    setCheckResult(null);
                  }}
                  placeholder="e.g. 400050 or 400001"
                  className="flex-1 rounded-lg border border-[#242630] bg-[#121318] px-4 py-2.5 text-xs text-[#f4efe6] placeholder-[#5a564f] focus:border-[#d4af37] focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-[#d4af37] px-5 py-2.5 text-xs font-semibold text-[#0c0d10] hover:bg-[#e8ca74] transition-all"
                >
                  Verify
                </button>
              </div>

              {/* Pincode Result Feedback */}
              {checkResult && (
                <div
                  className={`mt-4 rounded-xl border p-4 text-xs max-w-md flex items-start gap-3 ${
                    checkResult.serviceable
                      ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                      : 'border-red-500/30 bg-red-950/20 text-red-300'
                  }`}
                >
                  {checkResult.serviceable ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                      <div>
                        <span className="font-semibold">Eligible for Nocturnal Dispatch!</span>
                        <p className="mt-0.5 text-[11px] text-emerald-400/80">
                          Pincode {checkResult.pincode} is situated within our temperature-controlled nocturnal delivery perimeter.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                      <div>
                        <span className="font-semibold">Outside Current Licensed Jurisdiction</span>
                        <p className="mt-0.5 text-[11px] text-red-400/80">
                          Pincode {checkResult.pincode} is not currently covered under our excise delivery facilitator permit.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Authorized Neighborhoods List */}
          <div className="rounded-2xl border border-[#1e2029] bg-[#0c0d10] p-8">
            <h3 className="text-sm font-semibold text-[#f4efe6] flex items-center justify-between">
              <span>Active Facilitator Hubs</span>
              <span className="text-[11px] font-mono text-[#d4af37]">FL-III Partner Certified</span>
            </h3>

            <div className="mt-6 space-y-4">
              {compliance?.permittedNeighborhoods?.map((area, idx) => (
                <div
                  key={area}
                  className="flex items-center justify-between border-b border-[#181a20] pb-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[#d4af37] tabular-nums">0{idx + 1}.</span>
                    <span className="font-medium text-[#f4efe6]">{area}</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400">Active (11PM–5AM)</span>
                </div>
              )) || (
                <p className="text-xs text-[#8e887d]">Loading authorized delivery hubs...</p>
              )}
            </div>

            <div className="mt-6 rounded-lg border border-[#242630] bg-[#121318] p-3 text-[11px] text-[#8e887d] flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#d4af37] shrink-0" />
              <span>
                All deliveries are executed by certified, background-verified couriers equipped with digital ID readers.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
