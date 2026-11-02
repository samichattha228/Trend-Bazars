import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  Truck,
  CheckCircle2,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQty,
    clearCart,
    cartTotal,
    cartItemCount,
    settings,
    setIsCheckoutOpen,
    showToast,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    message: string;
  } | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  if (!isCartOpen) return null;

  const currency = settings.currencySymbol || '$';
  const deliveryCharge =
    cartTotal >= settings.freeDeliveryThreshold || cart.length === 0
      ? 0
      : settings.standardDeliveryCharge;

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(0, cartTotal - discountAmount + deliveryCharge);
  const amountToFreeDelivery = Math.max(0, settings.freeDeliveryThreshold - cartTotal);
  const progressPercent = Math.min(100, Math.round((cartTotal / settings.freeDeliveryThreshold) * 100));

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setValidatingCoupon(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), subtotal: cartTotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon({
          code: data.coupon.code,
          discountAmount: data.discountAmount,
          message: data.message,
        });
        showToast(data.message);
      } else {
        showToast(data.message, 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Your Shopping Cart</h3>
              <p className="text-[11px] text-slate-500">{cartItemCount} item{cartItemCount !== 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] text-slate-400 hover:text-red-500 font-medium px-2 py-1 rounded"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free delivery progress tracker */}
        <div className="bg-blue-50/70 px-4 py-2.5 border-b border-blue-100/60">
          <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
            <span className="flex items-center gap-1 text-blue-900">
              <Truck className="w-3.5 h-3.5 text-blue-600" />
              {amountToFreeDelivery === 0
                ? '🎉 You unlocked FREE Delivery!'
                : `Add ${currency}${amountToFreeDelivery.toFixed(2)} more for FREE Delivery`}
            </span>
            <span className="text-blue-700">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-blue-200/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-700 text-sm">Your cart is currently empty</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Explore trending gadgets, stylish sneakers, and apparel now!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-700 transition-all"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map(item => {
              const activePrice =
                item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
              return (
                <div
                  key={`${item.product.id}-${item.selectedVariant || ''}`}
                  className="flex gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-xs hover:border-slate-200 transition-all"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-xl bg-slate-50 shrink-0 border border-slate-100"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                          className="text-slate-400 hover:text-red-500 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.selectedVariant && (
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                          {item.selectedVariant}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-black text-blue-700">
                        {currency}{(activePrice * item.quantity).toFixed(2)}
                      </span>

                      {/* Stepper */}
                      <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                        <button
                          onClick={() =>
                            updateCartQty(item.product.id, item.quantity - 1, item.selectedVariant)
                          }
                          className="w-5 h-5 rounded bg-white shadow-2xs flex items-center justify-center text-slate-600 hover:bg-slate-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQty(item.product.id, item.quantity + 1, item.selectedVariant)
                          }
                          className="w-5 h-5 rounded bg-white shadow-2xs flex items-center justify-center text-slate-600 hover:bg-slate-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Coupon Code Section */}
          {cart.length > 0 && (
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Coupon (e.g. TREND20)"
                    className="w-full pl-8 pr-2 py-1.5 text-xs font-mono uppercase bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={validatingCoupon || !couponInput.trim()}
                  className="px-3.5 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {validatingCoupon ? 'Checking...' : 'Apply'}
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-{currency}{appliedCoupon.discountAmount.toFixed(2)})</span>
                  </div>
                  <button
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCouponInput('');
                    }}
                    className="text-slate-400 hover:text-slate-600 text-xs font-bold ml-2"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Quick Coupon hints */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] text-slate-500">
                <span className="font-bold text-slate-400 shrink-0">Try:</span>
                <button
                  type="button"
                  onClick={() => setCouponInput('TREND20')}
                  className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono font-bold hover:bg-blue-100 shrink-0"
                >
                  TREND20 (20% OFF)
                </button>
                <button
                  type="button"
                  onClick={() => setCouponInput('FREESHIP')}
                  className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold hover:bg-slate-200 shrink-0"
                >
                  FREESHIP
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{currency}{cartTotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span>-{currency}{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge</span>
                <span>
                  {deliveryCharge === 0 ? (
                    <span className="font-bold text-emerald-600">FREE</span>
                  ) : (
                    `${currency}${deliveryCharge.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200/80 pt-2">
                <span>Final Payable Amount</span>
                <span className="text-blue-700 text-base">{currency}{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 hover:from-blue-800 hover:to-blue-700 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
