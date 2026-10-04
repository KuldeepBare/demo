import React from 'react';
import { ShoppingBag, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export const MobileBottomBar: React.FC = () => {
  const { cartTotalCount, cartSubtotal, setIsCartOpen, isAgeVerified, setShowAgeModal } = useApp();

  const handleCellarScroll = () => {
    if (!isAgeVerified) {
      setShowAgeModal(true);
      return;
    }
    const el = document.getElementById('cellar-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <aside
      aria-label="Mobile order actions"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#1e2029] bg-[#0c0d10]/95 px-4 py-2.5 backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        {cartTotalCount > 0 ? (
          <>
            <div>
              <span className="text-[10px] text-[#8e887d] uppercase tracking-wider block">Reserve Total</span>
              <span className="font-mono text-sm font-bold text-[#d4af37] tabular-nums">
                ₹{cartSubtotal.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#d4af37] px-5 py-2.5 text-xs font-semibold text-[#0c0d10] active:scale-95 transition-all shadow-md shadow-[#d4af37]/20"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Review Bag ({cartTotalCount})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-xs text-[#b3ada2]">
              {isAgeVerified ? (
                <>
                  <ShieldCheck className="h-4 w-4 text-[#d4af37]" />
                  <span className="font-medium text-[#f4efe6]">Age Verified (21+)</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 text-[#8e887d]" />
                  <span>11 PM – 5 AM Window</span>
                </>
              )}
            </div>

            <button
              onClick={handleCellarScroll}
              className="flex items-center gap-1.5 rounded-lg bg-[#181a20] border border-[#242630] px-4 py-2 text-xs font-semibold text-[#e8ca74] active:scale-95 transition-all"
            >
              <span>{isAgeVerified ? 'Curated Cellar' : 'Verify Age'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>
    </aside>
  );
};
