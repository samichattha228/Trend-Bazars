import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Phone,
} from 'lucide-react';

export const OrderTrackingModal: React.FC = () => {
  const { trackingOrder, setTrackingOrder, cancelCustomerOrder, settings, showToast } = useStore();
  const [cancelling, setCancelling] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);

  if (!trackingOrder) return null;

  const order = trackingOrder;
  const currency = settings.currencySymbol || '$';

  const steps = [
    { key: 'Pending', label: 'Order Placed', desc: 'Received & logged in database' },
    { key: 'Confirmed', label: 'Confirmed', desc: 'Stock verified by dispatch' },
    { key: 'Processing', label: 'Processing', desc: 'Inspected and packed securely' },
    { key: 'Shipped', label: 'Shipped', desc: order.courier ? `With ${order.courier}` : 'Dispatched' },
    { key: 'Delivered', label: 'Delivered', desc: 'Delivered & COD collected' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Confirmed':
        return 1;
      case 'Processing':
        return 2;
      case 'Shipped':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 0;
    }
  };

  const isCancelled = order.orderStatus === 'Cancelled';
  const isReturned = order.orderStatus === 'Returned';
  const currentStepIdx = getStepIndex(order.orderStatus);

  const canCancel = order.orderStatus === 'Pending' || order.orderStatus === 'Confirmed';

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await cancelCustomerOrder(order.id, 'Customer requested cancellation via tracking view');
      if (res.success) {
        setTrackingOrder(null);
      }
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setTrackingOrder(null)}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col z-10 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Track Order #{order.orderNumber}
              </h3>
              <p className="text-[11px] text-slate-500">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <button
            onClick={() => setTrackingOrder(null)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Tracking Details */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Status highlight banner */}
          <div
            className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between ${
              isCancelled
                ? 'bg-red-50 text-red-900 border-red-200'
                : isReturned
                ? 'bg-amber-50 text-amber-900 border-amber-200'
                : order.orderStatus === 'Delivered'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-blue-50 text-blue-900 border-blue-200'
            }`}
          >
            <div>
              <span className="font-bold uppercase tracking-wider text-[10px]">Current Status</span>
              <p className="text-sm font-black mt-0.5">{order.orderStatus}</p>
            </div>

            <div className="text-right">
              <span className="font-bold text-[10px] text-slate-500 uppercase">Payment (COD)</span>
              <p className="font-bold text-xs">
                {currency}{order.totalAmount.toFixed(2)} ({order.paymentStatus})
              </p>
            </div>
          </div>

          {/* Courier & Tracking Number info if Shipped */}
          {order.trackingNumber && (
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Courier Partner</span>
                <span className="font-bold text-slate-800">{order.courier || 'Express Air Courier'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Tracking AWB</span>
                <span className="font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {order.trackingNumber}
                </span>
              </div>
            </div>
          )}

          {/* Stepper Timeline */}
          {!isCancelled && !isReturned && (
            <div className="border border-slate-100 rounded-2xl p-4 bg-white shadow-xs">
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">
                Delivery Timeline
              </p>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {steps.map((step, idx) => {
                  const isPassed = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div key={step.key} className="relative">
                      {/* Node circle */}
                      <div
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-white transition-all ${
                          isPassed
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                      </div>

                      <div className="leading-tight">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-xs font-bold ${
                              isPassed ? 'text-slate-900' : 'text-slate-400'
                            }`}
                          >
                            {step.label}
                          </p>
                          {isCurrent && (
                            <span className="bg-blue-100 text-blue-700 font-bold text-[9px] px-1.5 py-0.2 rounded animate-pulse">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ordered Products preview */}
          <div className="border border-slate-100 rounded-2xl p-3 bg-white space-y-2">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Ordered Items ({order.items.length})
            </p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-10 h-10 object-cover rounded-lg border border-slate-100 bg-slate-50 shrink-0"
                  />
                  <div className="flex-1 truncate">
                    <p className="font-semibold text-slate-800 truncate">{item.productName}</p>
                    <p className="text-[10px] text-slate-400">
                      Qty: {item.quantity} {item.variant ? `• ${item.variant}` : ''}
                    </p>
                  </div>
                  <span className="font-bold text-slate-800">
                    {currency}{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
            <p className="font-bold text-slate-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              Delivery To:
            </p>
            <p className="text-slate-800 font-medium">{order.customerName} ({order.phone})</p>
            <p className="text-slate-600">{order.address}, {order.city} - {order.postalCode}</p>
          </div>

          {/* Cancellation section */}
          {canCancel && !isCancelled && (
            <div className="pt-2">
              {!showCancelPrompt ? (
                <button
                  onClick={() => setShowCancelPrompt(true)}
                  className="w-full py-2.5 text-red-600 hover:bg-red-50 font-bold text-xs rounded-xl border border-red-200 transition-colors"
                >
                  Cancel This Order
                </button>
              ) : (
                <div className="bg-red-50 p-3 rounded-2xl border border-red-200 space-y-2 text-xs text-red-900 animate-in fade-in-50">
                  <p className="font-bold">Are you sure you want to cancel order #{order.orderNumber}?</p>
                  <p className="text-[11px] text-red-700">
                    Stock will be released back to the store inventory.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleCancel}
                      disabled={cancelling}
                      className="flex-1 py-2 bg-red-600 text-white font-bold rounded-xl text-xs hover:bg-red-700 disabled:opacity-50"
                    >
                      {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
                    </button>
                    <button
                      onClick={() => setShowCancelPrompt(false)}
                      className="px-4 py-2 bg-white text-slate-700 font-bold rounded-xl text-xs border border-slate-200"
                    >
                      Keep Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
