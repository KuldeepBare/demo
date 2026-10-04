import React, { useState } from 'react';
import { X, ShieldCheck, Thermometer, Utensils, Award, Plus, Minus, Check } from 'lucide-react';
import { Product } from '../types/index.ts';
import { useApp } from '../context/AppContext.tsx';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, cart, setIsCartOpen } = useApp();
  const [selectedQty, setSelectedQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return null;

  const cartItem = cart.find((item) => item.product.id === product.id);
  const existingQty = cartItem ? cartItem.quantity : 0;
  const maxLimit = product.maxPerOrder || 3;
  const remainingAllowed = Math.max(0, maxLimit - existingQty);

  const handleAdd = () => {
    if (remainingAllowed <= 0) return;
    addToCart(product, selectedQty);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
      setIsCartOpen(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-detail-title"
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#242630] bg-[#0c0d10] p-6 sm:p-8 shadow-2xl text-[#f4efe6]"
      >
        <button
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-5 right-5 rounded-lg p-2 text-[#8e887d] hover:bg-[#181a20] hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Product Image */}
          <div className="overflow-hidden rounded-xl bg-[#14151b] border border-[#1e2029]">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Details & Specs */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#d4af37] font-medium">
                <span>{product.subCategory}</span>
                <span aria-hidden="true">·</span>
                <span>{product.origin}</span>
              </div>

              <h2
                id="product-detail-title"
                className="mt-2 text-2xl font-bold tracking-tight text-[#f4efe6] leading-tight"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {product.name}
              </h2>

              <div className="mt-3 flex items-center gap-4 text-xs text-[#8e887d] font-mono tabular-nums">
                <span>Volume: {product.volume}</span>
                <span>Strength: {product.abv}% ABV</span>
                <span>Batch: {product.exciseCode}</span>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-[#b3ada2]">
                {product.description}
              </p>

              {/* Tasting Notes */}
              <div className="mt-4 border-t border-[#181a20] pt-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#d4af37] block mb-1.5">
                  Tasting Profile
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.tastingNotes.map((note) => (
                    <span
                      key={note}
                      className="rounded border border-[#242630] bg-[#121318] px-2.5 py-1 text-xs text-[#d1cbbe]"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sommelier Serving Specs */}
              <div className="mt-4 space-y-2 text-xs text-[#8e887d]">
                <div className="flex items-start gap-2">
                  <Thermometer className="h-4 w-4 shrink-0 text-[#d4af37] mt-0.5" />
                  <span>
                    <strong className="text-[#d1cbbe]">Cellar Temperature:</strong>{' '}
                    {product.servingTemp}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Utensils className="h-4 w-4 shrink-0 text-[#d4af37] mt-0.5" />
                  <span>
                    <strong className="text-[#d1cbbe]">Pairing:</strong> {product.pairing}
                  </span>
                </div>
              </div>
            </div>

            {/* Price, Quantity & Add to Cart */}
            <div className="mt-6 border-t border-[#181a20] pt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[11px] text-[#8e887d] block uppercase tracking-wider">
                    Excise Retail Price
                  </span>
                  <span className="font-mono text-xl font-bold text-[#f4efe6] tabular-nums">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                </div>

                {remainingAllowed > 0 && (
                  <div className="flex items-center rounded-lg border border-[#242630] bg-[#121318]">
                    <button
                      onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                      aria-label="Decrease quantity"
                      className="p-2 text-[#8e887d] hover:text-white"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-3 font-mono text-sm font-semibold text-[#f4efe6] tabular-nums">
                      {selectedQty}
                    </span>
                    <button
                      onClick={() => setSelectedQty(Math.min(remainingAllowed, selectedQty + 1))}
                      aria-label="Increase quantity"
                      className="p-2 text-[#8e887d] hover:text-white"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-[#8e887d] mb-3">
                {remainingAllowed > 0 ? (
                  <span>Excise purchase allowance: up to {remainingAllowed} bottle(s)</span>
                ) : (
                  <span className="text-amber-400">Order limit reached for this bottle ({maxLimit} max)</span>
                )}
              </div>

              <button
                onClick={handleAdd}
                disabled={remainingAllowed <= 0}
                className={`w-full flex items-center justify-center gap-2 rounded-lg py-3 text-xs font-semibold transition-all ${
                  remainingAllowed <= 0
                    ? 'border border-[#242630] bg-[#14151b] text-[#5a564f] cursor-not-allowed'
                    : justAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#d4af37] text-[#0c0d10] hover:bg-[#e8ca74] active:scale-98'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Added to Reserve Bag</span>
                  </>
                ) : remainingAllowed <= 0 ? (
                  <span>Maximum Order Limit Reached</span>
                ) : (
                  <>
                    <span>Add {selectedQty} Bottle(s) to Reserve</span>
                    <span className="font-mono tabular-nums">
                      (₹{(product.price * selectedQty).toLocaleString('en-IN')})
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
