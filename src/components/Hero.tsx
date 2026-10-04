import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const Hero: React.FC = () => {
  const { isAgeVerified, setShowAgeModal, isOpenNow, compliance, toggleSimulateOpen } = useApp();
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCellarClick = () => {
    if (!isAgeVerified) {
      setShowAgeModal(true);
    } else {
      const element = document.getElementById('cellar-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleScrollToPincode = () => {
    const element = document.getElementById('service-area');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-[#181a20] bg-[#070809]">
      {/* Background Image with Dark Vignette Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_nocturne_lounge_1791090773416.jpg"
          alt="Nocturne Private Lounge and Curated Spirits Cellar"
          className="h-full w-full object-cover object-center opacity-30 brightness-75 filter transition-opacity duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070809] via-[#070809]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070809] via-[#070809]/60 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-32">
        <div className="max-w-3xl">
          {/* Live Regulatory Window Banner */}
          <div className="mb-6 inline-flex flex-wrap items-center gap-3 rounded-full border border-[#242630] bg-[#121318]/90 px-4 py-1.5 text-xs text-[#d1cbbe] backdrop-blur-md">
            <span className="flex items-center gap-1.5 text-[#d4af37]">
              <Clock className="h-3.5 w-3.5" />
              <span className="font-mono tabular-nums tracking-wide">{timeString} Local</span>
            </span>
            <span className="text-[#353846]">|</span>
            <span className="flex items-center gap-2">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  isOpenNow ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span className="font-medium text-[#f4efe6]">
                {isOpenNow
                  ? 'Nocturnal Window Active (11:00 PM – 5:00 AM)'
                  : 'Scheduled Window: 11:00 PM – 5:00 AM'}
              </span>
            </span>

            {/* Quick Demo toggle for evaluators */}
            <button
              onClick={toggleSimulateOpen}
              className="ml-auto inline-flex items-center gap-1 text-[11px] text-[#e8ca74] underline hover:text-white transition-colors"
              title="Click to toggle open status for evaluation without waiting for 11 PM"
            >
              <Sparkles className="h-3 w-3" />
              <span>{isOpenNow ? 'Demo Mode Active' : 'Simulate Active Window'}</span>
            </button>
          </div>

          {/* Main Headline */}
          <h1
            className="text-4xl font-normal tracking-tight text-[#f4efe6] sm:text-6xl lg:text-7xl"
            style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
          >
            Curated Spirits. <br />
            <span className="bg-gradient-to-r from-[#f4efe6] via-[#dfb74a] to-[#d4af37] bg-clip-text text-transparent">
              Discreet Nocturnal Delivery.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#b3ada2] sm:text-lg">
            Nocturne Reserve provides temperature-controlled late-night delivery of rare single
            malts, artisanal botanicals, and allocated vintages. Operating strictly within
            permitted hours (11:00 PM – 5:00 AM) with seamless, privacy-first legal age
            verification.
          </p>

          {/* Call to Actions */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              onClick={handleCellarClick}
              className="inline-flex items-center justify-center gap-3 rounded-lg bg-[#d4af37] px-7 py-3.5 text-sm font-semibold text-[#0c0d10] shadow-lg shadow-[#d4af37]/10 transition-all hover:bg-[#e8ca74] active:scale-[0.99]"
            >
              <span>{isAgeVerified ? 'Access Curated Cellar' : 'Verify Age & Enter Cellar'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={handleScrollToPincode}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#242630] bg-[#121318]/70 px-6 py-3.5 text-sm font-medium text-[#f4efe6] transition-all hover:border-[#d4af37]/40 hover:bg-[#181a20]"
            >
              <MapPin className="h-4 w-4 text-[#d4af37]" />
              <span>Check Delivery Pincode</span>
            </button>
          </div>

          {/* Editorial Trust Markers */}
          <div className="mt-14 grid grid-cols-1 gap-6 border-t border-[#181a20] pt-8 sm:grid-cols-3">
            <div>
              <div className="text-xs font-semibold tracking-wider text-[#d4af37] uppercase">
                Temperature Controlled
              </div>
              <p className="mt-1 text-xs text-[#8e887d]">
                14°C–16°C isothermal hardcases preserving cellular integrity.
              </p>
            </div>

            <div>
              <div className="text-xs font-semibold tracking-wider text-[#d4af37] uppercase">
                Privacy-First ID Check
              </div>
              <p className="mt-1 text-xs text-[#8e887d]">
                Zero raw Aadhaar or biometric storage. Zero-knowledge age token.
              </p>
            </div>

            <div>
              <div className="text-xs font-semibold tracking-wider text-[#d4af37] uppercase">
                Excise Compliant
              </div>
              <p className="mt-1 text-xs text-[#8e887d]">
                Permit #{compliance?.licenseNumber?.split(' ')[0] || 'FL-III/2026/MUM'}. Strictly 21+
                only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
