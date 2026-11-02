import React from 'react';
import { Order } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Printer, X, ShoppingBag, ShieldCheck } from 'lucide-react';

interface AdminInvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const AdminInvoiceModal: React.FC<AdminInvoiceModalProps> = ({ order, onClose }) => {
  const { settings } = useStore();

  if (!order) return null;

  const currency = settings.currencySymbol || '$';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:p-0 print:bg-white">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[92vh] print:max-h-none print:shadow-none print:p-0">
        {/* Actions bar (hidden in print) */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-slate-800">
              Commercial Tax Invoice
            </span>
            <span className="bg-blue-50 text-blue-700 font-mono font-bold text-xs px-2 py-0.5 rounded">
              #{order.orderNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Document */}
        <div className="space-y-6 pt-4 text-xs text-slate-700">
          {/* Brand header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                  TB
                </div>
                <h2 className="text-lg font-black text-blue-900 tracking-tight">
                  {settings.storeName || 'TREND BAZAR'}
                </h2>
              </div>
              <p className="text-slate-500 text-[11px]">{settings.tagline}</p>
              <p className="text-slate-500 text-[11px]">Email: {settings.supportEmail}</p>
              <p className="text-slate-500 text-[11px]">Helpline: {settings.supportPhone}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Invoice
              </span>
              <p className="font-mono text-base font-black text-slate-900">
                INV-{order.orderNumber}
              </p>
              <p className="text-slate-500 text-[11px] mt-1">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-slate-500 text-[11px]">
                Payment: <strong className="text-slate-800">Cash on Delivery (COD)</strong>
              </p>
              <span className="inline-block mt-1 bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                Payment Status: {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Customer & Shipping information */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <p className="font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                Billed & Shipped To:
              </p>
              <p className="font-extrabold text-slate-900 text-sm">{order.customerName}</p>
              <p className="text-slate-600 mt-0.5">{order.address}</p>
              <p className="text-slate-600">{order.city} - {order.postalCode}</p>
              <p className="text-slate-500 mt-1">Phone: {order.phone}</p>
              <p className="text-slate-500">Email: {order.email}</p>
            </div>

            <div className="text-right space-y-1">
              <p className="font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                Fulfillment Logistics:
              </p>
              <p className="text-slate-700">Order Status: <strong className="text-blue-700">{order.orderStatus}</strong></p>
              <p className="text-slate-700">Courier: <strong>{order.courier || 'Express Surface'}</strong></p>
              <p className="text-slate-700">Tracking AWB: <strong className="font-mono text-slate-900">{order.trackingNumber || 'Pending Dispatch'}</strong></p>
            </div>
          </div>

          {/* Itemized Table */}
          <table className="w-full text-left">
            <thead className="bg-slate-100 uppercase text-[10px] font-bold text-slate-600">
              <tr>
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((it, idx) => (
                <tr key={idx}>
                  <td className="py-2.5 px-3">
                    <p className="font-bold text-slate-800">{it.productName}</p>
                    {it.variant && <p className="text-[10px] text-slate-400">{it.variant}</p>}
                  </td>
                  <td className="py-2.5 px-3 text-center font-medium">{it.quantity}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{currency}{it.price.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold">
                    {currency}{(it.price * it.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-mono">{currency}{order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount ({order.couponCode})</span>
                  <span className="font-mono">-{currency}{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Delivery / Shipping Fee</span>
                <span className="font-mono">
                  {order.deliveryCharge === 0 ? 'FREE' : `${currency}${order.deliveryCharge.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-2">
                <span>Total Amount Due (COD)</span>
                <span className="font-mono text-blue-700 text-base">{currency}{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="border-t border-slate-200 pt-4 text-center text-[10px] text-slate-400 space-y-0.5">
            <p className="font-medium text-slate-600">Thank you for ordering with Trend Bazar!</p>
            <p>For any queries, please WhatsApp or call our support line at {settings.supportPhone}.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
