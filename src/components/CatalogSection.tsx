import React, { useState, useMemo } from 'react';
import { Search, ShieldAlert, Lock, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { Category, Product } from '../types/index.ts';
import { ProductCard } from './ProductCard.tsx';
import { ProductDetailModal } from './ProductDetailModal.tsx';

const CATEGORIES: { label: string; value: 'all' | Category }[] = [
  { label: 'All Cellar Reserves', value: 'all' },
  { label: 'Single Malt & Whisky', value: 'whisky' },
  { label: 'Artisanal Gin', value: 'gin' },
  { label: 'Wine & Champagne', value: 'wine' },
  { label: 'Artisanal Tequila & Agave', value: 'tequila' },
  { label: 'Craft Vodka', value: 'vodka' },
  { label: 'Trappist Beers', value: 'beer' },
  { label: 'Speakeasy Kits', value: 'cocktail_kits' }
];

export const CatalogSection: React.FC = () => {
  const {
    products,
    loadingProducts,
    isAgeVerified,
    setShowAgeModal,
    selectedProduct,
    setSelectedProduct
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<'all' | Category>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.subCategory.toLowerCase().includes(q) ||
        item.origin.toLowerCase().includes(q) ||
        item.tastingNotes.some((n) => n.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <section id="cellar-section" className="border-b border-[#181a20] bg-[#090a0d] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-10 border-b border-[#181a20]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#d4af37] uppercase">
              <span>Curated Nocturnal Reserve</span>
              <span aria-hidden="true">·</span>
              <span>Controlled Dispatch</span>
            </div>
            <h2
              className="mt-2 text-3xl font-bold tracking-tight text-[#f4efe6] sm:text-4xl"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              The Late-Night Cellar
            </h2>
            <p className="mt-2 max-w-xl text-xs sm:text-sm text-[#8e887d]">
              Artisanal spirits and allocated vintages cellared at optimal conditions. Available exclusively during permitted legal hours (11:00 PM – 5:00 AM).
            </p>
          </div>

          {/* Statutory Demo Data Notice */}
          <div className="rounded-lg border border-[#242630] bg-[#121318] px-4 py-2.5 text-[11px] text-[#b3ada2] max-w-md">
            <span className="font-semibold text-[#e8ca74]">Statutory Notice: </span>
            Products shown represent demonstration inventory under active FL-III retail permit guidelines. Deliveries require physical original photo ID verification at destination.
          </div>
        </div>

        {/* LOCKED STATE IF UNVERIFIED */}
        {!isAgeVerified ? (
          <div className="mt-12 rounded-2xl border border-[#d4af37]/30 bg-gradient-to-b from-[#13141a] to-[#0c0d10] p-10 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#d4af37]/10 text-[#d4af37]">
              <Lock className="h-8 w-8" />
            </div>
            <h3
              className="mt-5 text-2xl font-bold tracking-tight text-[#f4efe6]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Age-Restricted Spirits Catalog
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-sm text-[#b3ada2]">
              In strict adherence to local excise laws and the Digital Personal Data Protection Act, this beverage catalog is only accessible following legal age confirmation.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowAgeModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#d4af37] px-7 py-3 text-xs font-semibold text-[#0c0d10] shadow-lg shadow-[#d4af37]/10 hover:bg-[#e8ca74] transition-all"
              >
                <span>Verify Age to Unlock Cellar</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          /* UNLOCKED CATALOG VIEW */
          <div className="mt-8 space-y-8">
            {/* Filter Controls Bar (Interactive functional buttons) */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Category Segmented Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#121318] border border-[#1e2029]">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setActiveCategory(cat.value)}
                    className={`whitespace-nowrap px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      activeCategory === cat.value
                        ? 'bg-[#d4af37] text-[#0c0d10] font-semibold shadow-sm'
                        : 'text-[#8e887d] hover:text-[#f4efe6] hover:bg-[#181a20]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full lg:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8e887d]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search botanical, distillery, vintage..."
                  className="w-full rounded-lg border border-[#242630] bg-[#121318] py-2 pl-9 pr-4 text-xs text-[#f4efe6] placeholder-[#5a564f] focus:border-[#d4af37] focus:outline-none"
                />
              </div>
            </div>

            {/* Products Grid */}
            {loadingProducts ? (
              <div className="py-20 text-center text-xs text-[#8e887d]">
                Loading allocated cellar reserves...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-xl border border-[#181a20] bg-[#121318] p-12 text-center">
                <p className="text-sm font-medium text-[#f4efe6]">
                  No allocations found matching your search.
                </p>
                <p className="mt-1 text-xs text-[#8e887d]">
                  Try modifying your filter or clear your search query.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 rounded-lg border border-[#242630] px-4 py-2 text-xs font-semibold text-[#d4af37] hover:bg-[#181a20]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetails={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
};
