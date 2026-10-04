import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Clock, MapPin, AlertCircle, CheckCircle2, Copy } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { Order } from '../types/index.ts';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    cartTotalCount,
    isAgeVerified,
    verificationToken,
    setShowAgeModal,
    isOpenNow,
    compliance,
    toggleSimulateOpen,
    setLastPlacedOrder
  } = useApp();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'success'>('cart');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [pincode, setPincode] = useState('400050');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [legalConfirmed, setLegalConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  if (!isCartOpen) return null;

  // Financial calculations
  const exciseTax = Math.round(cartSubtotal * 0.10);
  const deliveryFee = cartSubtotal >= 20000 || cartSubtotal === 0 ? 0 : 500;
  const grandTotal = cartSubtotal + exciseTax + deliveryFee;

  const maxOrderLimit = compliance?.maxBottlesPerOrder || 3;
  const isOverBottleLimit = cartTotalCount > maxOrderLimit;
  const isPincodeServiceable = compliance?.permittedPincodes.includes(pincode.trim());

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isAgeVerified) {
      setShowAgeModal(true);
      return;
    }

    if (!isOpenNow) {
      setErrorMessage(
        `Orders can only be legally processed during permitted nocturnal hours (${compliance?.serviceWindowStart} to ${compliance?.serviceWindowEnd}). You may toggle simulated mode in the header to preview checkout.`
      );
      return;
    }

    if (!isPincodeServiceable) {
      setErrorMessage(`Pincode ${pincode} is outside our licensed excise jurisdiction.`);
      return;
    }

    if (isOverBottleLimit) {
      setErrorMessage(`Total order exceeds legal limit of ${maxOrderLimit} bottles.`);
      return;
    }

    if (!legalConfirmed) {
      setErrorMessage('You must accept the statutory legal affirmation.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          fullName,
          phone,
          email,
          addressLine1,
          city: 'Mumbai',
          pincode: pincode.trim(),
          deliveryNotes
        },
        items: cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          category: item.product.category,
          volume: item.product.volume,
          unitPrice: item.product.price,
          quantity: item.quantity,
          totalPrice: item.product.price * item.quantity
        })),
        verificationToken: verificationToken?.token,
        verificationMethod: verificationToken?.provider || 'Physical Doorstep Validation Contract',
        legalAffirmationAccepted: true
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || data.reasons?.join(', ') || 'Failed to place order.');
        setIsSubmitting(false);
        return;
      }

      setCreatedOrder(data.order);
      setLastPlacedOrder(data.order);
      clearCart();
      setCheckoutStep('success');
    } catch (err: any) {
      setErrorMessage('Network error submitting order to nocturnal dispatch server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="relative flex h-full w-full max-w-lg flex-col border-l border-[#242630] bg-[#0c0d10] text-[#f4efe6] shadow-2xl"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#181a20] px-6 py-5">
          <div className="flex items-center gap-2">
            <span
              id="cart-drawer-title"
              className="text-lg font-bold tracking-tight text-[#f4efe6]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {checkoutStep === 'cart'
                ? 'Your Reserve Bag'
                : checkoutStep === 'details'
                ? 'Dispatch & ID Affirmation'
                : 'Dispatch Confirmed'}
            </span>
            <span className="font-mono text-xs text-[#d4af37] tabular-nums">
              ({cartTotalCount} {cartTotalCount === 1 ? 'bottle' : 'bottles'})
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close drawer"
            className="rounded-lg p-2 text-[#8e887d] hover:bg-[#181a20] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Operating Window Status Banner in Drawer */}
        <div className={`px-6 py-2.5 text-xs flex items-center justify-between ${isOpenNow ? 'bg-[#121a15] text-emerald-300 border-b border-emerald-900/30' : 'bg-[#1d1611] text-amber-300 border-b border-amber-900/30'}`}>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {isOpenNow
                ? 'Nocturnal dispatch active (11 PM – 5 AM)'
                : 'Service window currently closed (11 PM – 5 AM)'}
            </span>
          </div>
          {!isOpenNow && (
            <button
              onClick={toggleSimulateOpen}
              className="underline text-[11px] text-[#e8ca74] hover:text-white"
            >
              Simulate Open
            </button>
          )}
        </div>

        {/* --- STEP 1: CART ITEMS VIEW --- */}
        {checkoutStep === 'cart' && (
          <div className="flex flex-1 flex-col justify-between overflow-hidden">
            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-sm font-medium text-[#f4efe6]">Your Reserve Bag is empty</p>
                  <p className="mt-1 text-xs text-[#8e887d]">
                    Select rare single malts, botanical gins, or fine wines from the cellar.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 rounded-lg bg-[#181a20] px-5 py-2.5 text-xs font-semibold text-[#d4af37] hover:bg-[#242630]"
                  >
                    Explore Cellar
                  </button>
                </div>
              ) : (
                <>
                  {/* Bottle limit warning */}
                  {isOverBottleLimit && (
                    <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-300 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>
                        Excise limits permit a maximum of {maxOrderLimit} bottles per order. Please adjust quantities.
                      </span>
                    </div>
                  )}

                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between rounded-xl border border-[#1e2029] bg-[#121318] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-14 w-14 rounded-lg object-cover bg-[#090a0d] shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="text-xs font-semibold text-[#f4efe6] line-clamp-1">
                            {item.product.name}
                          </h4>
                          <span className="text-[11px] text-[#8e887d] font-mono">
                            {item.product.volume} · ₹{item.product.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-lg border border-[#242630] bg-[#0c0d10]">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 text-[#8e887d] hover:text-white"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 font-mono text-xs font-bold text-[#f4efe6] tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1.5 text-[#8e887d] hover:text-white"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          aria-label="Remove item"
                          className="text-[#8e887d] hover:text-red-400 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Cart Footer & Financials */}
            {cart.length > 0 && (
              <div className="border-t border-[#181a20] bg-[#090a0d] p-6 space-y-3">
                <div className="space-y-1.5 text-xs text-[#8e887d]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-[#f4efe6] tabular-nums">
                      ₹{cartSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Excise VAT (10% statutory)</span>
                    <span className="font-mono text-[#f4efe6] tabular-nums">
                      ₹{exciseTax.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nocturnal Cold-Chain Delivery</span>
                    <span className="font-mono text-[#f4efe6] tabular-nums">
                      {deliveryFee === 0 ? 'Complimentary (Over ₹20,000)' : `₹${deliveryFee}`}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between border-t border-[#1e2029] pt-3 text-sm font-bold text-[#f4efe6]">
                  <span>Total Amount</span>
                  <span className="font-mono text-base text-[#d4af37] tabular-nums">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (!isAgeVerified) {
                      setShowAgeModal(true);
                    } else {
                      setCheckoutStep('details');
                    }
                  }}
                  disabled={isOverBottleLimit}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#d4af37] py-3 text-xs font-semibold text-[#0c0d10] hover:bg-[#e8ca74] disabled:opacity-50 transition-all mt-2"
                >
                  <span>
                    {!isAgeVerified ? 'Verify Age to Continue' : 'Proceed to Dispatch Details'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- STEP 2: RECIPIENT & DISPATCH DETAILS VIEW --- */}
        {checkoutStep === 'details' && (
          <form onSubmit={handleCheckoutSubmit} className="flex flex-1 flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {errorMessage && (
                <div className="rounded-lg border border-red-500/40 bg-red-950/20 p-3 text-xs text-red-300">
                  {errorMessage}
                </div>
              )}

              {/* Verified Age Token Badge */}
              <div className="flex items-center gap-2 rounded-lg border border-[#242630] bg-[#121318] p-3 text-xs text-[#d1cbbe]">
                <ShieldCheck className="h-4 w-4 text-[#d4af37] shrink-0" />
                <div className="text-[11px]">
                  <span className="font-semibold text-[#f4efe6]">Age Status: </span>
                  {verificationToken ? (
                    <span>Verified ({verificationToken.provider})</span>
                  ) : (
                    <span>Statutory affirmation pending doorstep ID</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#d1cbbe] mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name matching government photo ID"
                  className="w-full rounded-lg border border-[#242630] bg-[#121318] px-3.5 py-2 text-xs text-[#f4efe6] placeholder-[#5a564f] focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#d1cbbe] mb-1">
                    Phone Number (SMS/WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 00000"
                    className="w-full rounded-lg border border-[#242630] bg-[#121318] px-3 py-2 text-xs text-[#f4efe6] placeholder-[#5a564f] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#d1cbbe] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patron@domain.com"
                    className="w-full rounded-lg border border-[#242630] bg-[#121318] px-3 py-2 text-xs text-[#f4efe6] placeholder-[#5a564f] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#d1cbbe] mb-1">
                  Delivery Address & Apartment *
                </label>
                <textarea
                  required
                  rows={2}
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Tower / Flat / Street / Landmark"
                  className="w-full rounded-lg border border-[#242630] bg-[#121318] px-3.5 py-2 text-xs text-[#f4efe6] placeholder-[#5a564f] focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#d1cbbe] mb-1">
                    Delivery Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="400050"
                    className={`w-full rounded-lg border px-3 py-2 text-xs text-[#f4efe6] focus:outline-none ${
                      isPincodeServiceable
                        ? 'border-[#242630] bg-[#121318] focus:border-[#d4af37]'
                        : 'border-red-500/50 bg-red-950/20'
                    }`}
                  />
                  {!isPincodeServiceable && (
                    <span className="text-[10px] text-red-400 mt-1 block">
                      Outside licensed service zone
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#d1cbbe] mb-1">
                    City Jurisdiction
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Mumbai (Excise Licensed Hub)"
                    className="w-full rounded-lg border border-[#242630] bg-[#0c0d10] px-3 py-2 text-xs text-[#8e887d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#d1cbbe] mb-1">
                  Discreet Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Ring Apt 1204 directly, concierge pre-cleared"
                  className="w-full rounded-lg border border-[#242630] bg-[#121318] px-3.5 py-2 text-xs text-[#f4efe6] placeholder-[#5a564f] focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              {/* Payment Mode Note */}
              <div className="rounded-lg border border-[#1e2029] bg-[#121318] p-3 text-[11px] text-[#b3ada2] space-y-1">
                <span className="font-semibold text-[#d4af37]">Payment & Escrow Layer: </span>
                <span>
                  Licensed partner payment gateway / contactless card on delivery (POS) supported. No charges are captured until courier ID verification is certified.
                </span>
              </div>

              {/* Mandatory Legal Affirmation */}
              <label className="flex items-start gap-2.5 rounded-lg border border-[#242630] bg-[#121318] p-3 text-xs text-[#b3ada2] cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={legalConfirmed}
                  onChange={(e) => setLegalConfirmed(e.target.checked)}
                  className="mt-0.5 rounded border-[#242630] bg-[#0c0d10] text-[#d4af37] focus:ring-0"
                />
                <span className="leading-snug text-[11px]">
                  I declare under penalty of law that I am of legal age ({compliance?.minLegalAge || 21}+) in this jurisdiction. I understand that the courier will inspect original physical government photo ID upon delivery and will refuse delivery without refund if identification is absent or invalid.
                </span>
              </label>
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-[#181a20] bg-[#090a0d] p-6 flex gap-3">
              <button
                type="button"
                onClick={() => setCheckoutStep('cart')}
                className="rounded-lg border border-[#242630] px-4 py-3 text-xs font-medium text-[#8e887d] hover:text-[#f4efe6]"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !isPincodeServiceable}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#d4af37] py-3 text-xs font-semibold text-[#0c0d10] hover:bg-[#e8ca74] disabled:opacity-50 transition-all"
              >
                {isSubmitting ? (
                  <span>Processing Compliant Dispatch...</span>
                ) : (
                  <>
                    <span>Confirm Nocturnal Dispatch</span>
                    <span className="font-mono tabular-nums">
                      (₹{grandTotal.toLocaleString('en-IN')})
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* --- STEP 3: DISPATCH CONFIRMED RECEIPT VIEW --- */}
        {checkoutStep === 'success' && createdOrder && (
          <div className="flex flex-1 flex-col justify-between overflow-y-auto p-6 space-y-6">
            <div className="text-center pt-6 space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <h3
                className="text-2xl font-bold tracking-tight text-[#f4efe6]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Dispatch Initiated
              </h3>

              <p className="text-xs text-[#8e887d]">
                Your nocturnal cellar order has been transmitted to our sommelier packing hub.
              </p>

              <div className="inline-block rounded-lg border border-[#242630] bg-[#121318] px-4 py-2 font-mono text-sm font-bold text-[#d4af37]">
                Order #{createdOrder.id}
              </div>
            </div>

            {/* Order Receipt Details */}
            <div className="rounded-xl border border-[#1e2029] bg-[#121318] p-4 text-xs space-y-3">
              <div className="flex justify-between border-b border-[#181a20] pb-2">
                <span className="text-[#8e887d]">Estimated Delivery Window</span>
                <span className="font-medium text-[#f4efe6]">{createdOrder.deliveryWindow}</span>
              </div>

              <div className="flex justify-between border-b border-[#181a20] pb-2">
                <span className="text-[#8e887d]">Destination</span>
                <span className="font-medium text-[#f4efe6] text-right">
                  {createdOrder.customer.addressLine1}, {createdOrder.customer.city} ({createdOrder.customer.pincode})
                </span>
              </div>

              <div className="flex justify-between border-b border-[#181a20] pb-2">
                <span className="text-[#8e887d]">Verification Protocol</span>
                <span className="text-emerald-400 font-medium">
                  Physical Photo ID Check at Door
                </span>
              </div>

              <div className="flex justify-between font-bold text-[#f4efe6] pt-1">
                <span>Total Amount Paid / Pre-Authorized</span>
                <span className="font-mono text-[#d4af37] text-sm tabular-nums">
                  ₹{createdOrder.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Courier instructions */}
            <div className="rounded-lg border border-[#242630] bg-[#0c0d10] p-4 text-[11px] text-[#8e887d] space-y-1.5">
              <span className="font-semibold text-[#f4efe6] block">Important Courier Notice:</span>
              <p>• Unbroken cold chain: Spirits packaged in 14°C isothermal cases.</p>
              <p>• Courier will not hand over the parcel without inspecting an original government-issued photo ID of the recipient.</p>
              <p>• WhatsApp/SMS notifications have been sent to {createdOrder.customer.phone}.</p>
            </div>

            <button
              onClick={() => {
                setCheckoutStep('cart');
                setIsCartOpen(false);
              }}
              className="w-full rounded-lg bg-[#181a20] py-3 text-xs font-semibold text-[#d4af37] hover:bg-[#242630]"
            >
              Close & Return to Cellar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
