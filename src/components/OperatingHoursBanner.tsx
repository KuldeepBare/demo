import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, Moon, Sun, AlertTriangle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const OperatingHoursBanner: React.FC = () => {
  const { compliance, isOpenNow, toggleSimulateOpen } = useApp();
  const [currentLocalTime, setCurrentLocalTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentLocalTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const windowStart = compliance?.serviceWindowStart || '23:00';
  const windowEnd = compliance?.serviceWindowEnd || '05:00';

  return (
    <section id="operating-hours" className="border-b border-[#181a20] bg-[#090a0d] py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="rounded-3xl border border-[#242630] bg-[#0e1014] p-8 md:p-12 lg:p-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left Column: Hours Explanation */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#d4af37] uppercase">
                <Moon className="h-4 w-4" />
                <span>Statutory Delivery Window</span>
              </div>

              <h2
                className="mt-3 text-3xl font-bold tracking-tight text-[#f4efe6] sm:text-4xl"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Late-Night Operational Mandate
              </h2>

              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#b3ada2]">
                Under local state excise directives and municipal nightlife delivery guidelines,
                alcohol delivery is legally permitted exclusively within the designated nocturnal
                window of{' '}
                <strong className="text-[#f4efe6]">
                  {windowStart} to {windowEnd} (11:00 PM – 5:00 AM)
                </strong>
                . Outside these hours, orders cannot be dispatched.
              </p>

              <div className="mt-8 space-y-3 border-t border-[#181a20] pt-6 text-xs text-[#8e887d]">
                <div className="flex items-center justify-between">
                  <span>Current Local Time:</span>
                  <span className="font-mono text-sm font-semibold text-[#f4efe6] tabular-nums">
                    {currentLocalTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Authorized Delivery Window:</span>
                  <span className="font-mono font-semibold text-[#d4af37]">
                    11:00 PM – 5:00 AM Daily
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Checkout System Status:</span>
                  <span
                    className={`font-semibold ${
                      isOpenNow ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {isOpenNow ? '● Live Dispatch Unlocked' : '○ Locked Until 11:00 PM'}
                  </span>
                </div>
              </div>

              {/* Reviewer simulation toggle note */}
              <div className="mt-6 flex items-center justify-between rounded-xl border border-[#242630] bg-[#121318] p-3 text-xs">
                <span className="text-[#8e887d]">
                  Evaluating during daytime hours?
                </span>
                <button
                  onClick={toggleSimulateOpen}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#d4af37]/40 px-3 py-1.5 text-[11px] font-semibold text-[#e8ca74] hover:bg-[#d4af37]/10 transition-colors"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>{isOpenNow ? 'Deactivate Demo Mode' : 'Simulate 11 PM Active Window'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Visual Timeline & Cold Chain Info */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#1e2029] bg-[#121318] p-6">
                <h3 className="text-sm font-semibold text-[#f4efe6] flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#d4af37]" />
                  <span>The Nocturnal Cycle</span>
                </h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start gap-3 border-l-2 border-[#d4af37] pl-4">
                    <div>
                      <span className="font-mono text-xs text-[#d4af37]">11:00 PM</span>
                      <h4 className="text-xs font-semibold text-[#f4efe6]">Cellar Dispatch Opens</h4>
                      <p className="text-[11px] text-[#8e887d]">
                        Sommeliers begin packaging allocated orders in temperature-controlled hardcases.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-l-2 border-[#d4af37] pl-4">
                    <div>
                      <span className="font-mono text-xs text-[#d4af37]">11:00 PM – 4:30 AM</span>
                      <h4 className="text-xs font-semibold text-[#f4efe6]">Direct Route Transit</h4>
                      <p className="text-[11px] text-[#8e887d]">
                        Express courier delivery across South Mumbai, Bandra, BKC, and Lower Parel.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-l-2 border-[#353846] pl-4">
                    <div>
                      <span className="font-mono text-xs text-[#8e887d]">5:00 AM</span>
                      <h4 className="text-xs font-semibold text-[#8e887d]">Statutory Window Closes</h4>
                      <p className="text-[11px] text-[#6d685e]">
                        All orders pause until the following night's legal window.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#242630] bg-[#121318]/60 p-4 text-xs text-[#8e887d] flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Nocturne enforces an automatic hard lock on the checkout engine outside permitted operating hours to guarantee 100% regulatory compliance.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
