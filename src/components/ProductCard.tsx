import React, { useState } from 'react';
import { Plus, Check, Info } from 'lucide-react';
import { Product } from '../types/index.ts';
import { useApp } from '../context/AppContext.tsx';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { addToCart, cart, setIsCartOpen } = useApp();
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const cartItem = cart.find((item) => item.product.id === product.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;
  const maxLimit = product.maxPerOrder || 3;
  const isMaxReached = currentQuantity >= maxLimit;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMaxReached) return;
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#1e2029] bg-[#0f1014] transition-all duration-300 hover:border-[#d4af37]/40 hover:shadow-xl hover:shadow-black/60 cursor-pointer"
    >
      {/* Product Image Container (65% height, neutral solid tone) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#14151b]">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#181920] to-[#0f1014] p-6 text-center">
            <div>
              <span className="font-serif text-sm tracking-widest text-[#d4af37]">NOCTURNE CELLAR</span>
              <p className="mt-2 text-xs font-semibold text-[#f4efe6]">{product.name}</p>
            </div>
          </div>
        )}

        {/* Subtle Scrim for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-transparent to-transparent opacity-80" />

        {/* Quick Details Affordance on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(product);
          }}
          aria-label="View tasting profile"
          className="absolute top-3 right-3 rounded-full bg-[#0c0d10]/80 p-2 text-[#b3ada2] backdrop-blur-sm transition-colors hover:text-white hover:bg-[#d4af37]/20"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>

      {/* Card Content & Metadata */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {/* Clean Unboxed Metadata: Category · Origin · Size · ABV */}
          <div className="flex items-center gap-1.5 text-xs text-[#8e887d]">
            <span className="font-medium text-[#d4af37]">{product.subCategory}</span>
            <span aria-hidden="true">·</span>
            <span>{product.origin}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{product.volume}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{product.abv}% ABV</span>
          </div>

          {/* Product Name */}
          <h3
            className="mt-2 text-base font-semibold text-[#f4efe6] group-hover:text-[#e8ca74] transition-colors leading-snug"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {product.name}
          </h3>

          {/* Tasting Note Highlight */}
          <div className="mt-2.5 flex flex-wrap gap-x-2 gap-y-1 text-xs text-[#b3ada2]">
            {product.tastingNotes.slice(0, 3).map((note, idx) => (
              <span key={note}>
                {note}
                {idx < 2 && idx < product.tastingNotes.length - 1 ? ' ·' : ''}
              </span>
            ))}
          </div>

          {/* Legal purchase restriction hint */}
          <div className="mt-3 text-[11px] text-[#6d685e]">
            Excise limit: Max {maxLimit} bottles · {product.exciseCode}
          </div>
        </div>

        {/* Bottom Row: Price + Add Button */}
        <div className="mt-5 flex items-center justify-between border-t border-[#181a20] pt-4">
          <div>
            <span className="text-[11px] text-[#8e887d] uppercase tracking-wider block">Price</span>
            <span className="font-mono text-base font-bold text-[#f4efe6] tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentQuantity > 0 && (
              <span className="text-xs font-mono text-[#d4af37] tabular-nums">
                ({currentQuantity} in bag)
              </span>
            )}

            <button
              onClick={handleAdd}
              disabled={isMaxReached}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                isMaxReached
                  ? 'border border-[#242630] bg-[#14151b] text-[#5a564f] cursor-not-allowed'
                  : justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#d4af37] text-[#0c0d10] hover:bg-[#e8ca74] active:scale-95'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Added</span>
                </>
              ) : isMaxReached ? (
                <span>Max Limit</span>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  <span>Reserve</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
