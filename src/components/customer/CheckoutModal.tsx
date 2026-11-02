import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import confetti from 'canvas-confetti';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Truck,
  ArrowRight,
  ShoppingBag,
  CreditCard,
  Banknote,
  MapPin,
  Phone,
  User as UserIcon,
  Mail,
  FileText,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    settings,
    placeOrder,
    currentUser,
    setTrackingOrder,
    showToast,
  } = useStore();

  const [name, setName] = useState(currentUser?.name || 'Rahul Sharma');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98234 11223');
  const [email, setEmail] = useState(currentUser?.email || 'rahul.sharma@example.com');
  const [city, setCity] = useState('Mumbai');
  const [address, setAddress] = useState('Flat 402, Skyline Residency, Bandra West');
  const [postalCode, setPostalCode] = useState('400050');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const currency = settings.currencySymbol || '$';
  const deliveryCharge =
    cartTotal >= settings.freeDeliveryThreshold || cart.length === 0
      ? 0
      : settings.standardDeliveryCharge;
  const finalTotal = cartTotal + deliveryCharge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !city.trim() || !address.trim() || !postalCode.trim()) {
      showToast('Please fill all delivery address fields', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await placeOrder({
        customerName: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        city: city.trim(),
        address: address.trim(),
        postalCode: postalCode.trim(),
        notes: notes.trim(),
      });

      if (result.success && result.order) {
        setConfirmedOrder(result.order);
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {
          console.error(e);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackOrder = () => {
    if (confirmedOrder) {
      setTrackingOrder(confirmedOrder);
      setConfirmedOrder(null);
      setIsCheckoutOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (!isSubmitting && !confirmedOrder) {
            setIsCheckoutOpen(false);
          }
        }}
      />

      {/* Sheet / Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[94vh] flex flex-col z-10 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                {confirmedOrder ? 'Order Confirmed!' : 'Easy 1-Handed Checkout'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {confirmedOrder ? 'Fulfillment in progress' : 'Cash on Delivery (COD)'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4">
          {confirmedOrder ? (
            /* Order Placed Success Confirmation */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Success
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Thank you, {confirmedOrder.customerName}!
                </h3>
                <p className="text-xs text-slate-500">
                  Your order has been recorded in our live database.
                </p>
              </div>

              {/* Order Info Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Order ID</span>
                  <span className="font-mono font-bold text-blue-700 text-sm">
                    {confirmedOrder.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Total Payable at Doorstep</span>
                  <span className="font-black text-slate-900 text-base">
                    {currency}{confirmedOrder.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Payment Mode</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Banknote className="w-3.5 h-3.5 text-emerald-600" /> Cash on Delivery (COD)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Delivery Address</span>
                  <span className="font-medium text-slate-700 truncate max-w-[200px]">
                    {confirmedOrder.address}, {confirmedOrder.city}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleTrackOrder}
                  className="w-full py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>Track This Order Live</span>
                </button>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-full py-2.5 text-slate-600 hover:text-slate-900 font-semibold text-xs"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Order items preview badge */}
              <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-blue-900">
                    {cart.length} Product{cart.length > 1 ? 's' : ''} in Checkout
                  </p>
                  <p className="text-[11px] text-blue-700">
                    Total: <strong>{currency}{finalTotal.toFixed(2)}</strong> (including {deliveryCharge === 0 ? 'FREE delivery' : `${currency}${deliveryCharge.toFixed(2)} shipping`})
                  </p>
                </div>
                <span className="text-xs bg-white text-blue-700 px-2.5 py-1 rounded-xl font-bold shadow-2xs border border-blue-200">
                  COD
                </span>
              </div>

              {/* Delivery Contact Details */}
              <div className="space-y-3">
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-blue-600" />
                  1. Contact Information
                </p>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="e.g. Rahul Sharma"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-3 border-t border-slate-100 pt-3">
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  2. Delivery Address
                </p>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Complete Street Address *
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    required
                    placeholder="House/Flat number, building, street, landmark"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      required
                      placeholder="e.g. Mumbai / Delhi"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Postal Code / PIN *
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={e => setPostalCode(e.target.value)}
                      required
                      placeholder="e.g. 400050"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Delivery Instructions / Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="e.g. Leave package with security guard"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Banknote className="w-3.5 h-3.5 text-blue-600" />
                  3. Payment Method
                </p>

                <div className="p-3 rounded-2xl border-2 border-blue-600 bg-blue-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-900">Cash on Delivery (COD)</p>
                      <p className="text-[10px] text-blue-700">Pay cash/UPI when delivered to your door</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Validating Stock & Placing...'
                      : `Confirm Order - ${currency}${finalTotal.toFixed(2)} (COD)`}
                  </span>
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                  🔒 Safe & encrypted checkout • 100% genuine products guaranteed
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
