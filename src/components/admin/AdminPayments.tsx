import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CreditCard, Banknote, CheckCircle2, Clock, RotateCcw, DollarSign, ArrowUpRight } from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const { orders, updateOrderStatus, settings, showToast } = useStore();

  const currency = settings.currencySymbol || '$';

  // COD Calculations
  const codOrders = orders.filter(o => o.paymentMethod === 'COD');
  const collectedOrders = codOrders.filter(o => o.paymentStatus === 'Paid');
  const pendingOrders = codOrders.filter(o => o.paymentStatus === 'Unpaid');
  const refundedOrders = codOrders.filter(o => o.paymentStatus === 'Refunded');

  const totalCollected = collectedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalPending = pendingOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalRefunded = refundedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const togglePaymentPaid = async (orderId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Paid' ? 'Unpaid' : 'Paid';
    await updateOrderStatus(orderId, orders.find(o => o.id === orderId)!.orderStatus, {
      paymentStatus: nextStatus as any,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            COD Payments & Reconciliation
          </h1>
          <p className="text-xs text-slate-500">
            Track Cash on Delivery collections from doorstep delivery agents and courier partners
          </p>
        </div>

        <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-xl border border-emerald-200">
          Payment Gateway: Cash on Delivery (COD) Active
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Cash Collected (COD)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            {currency}{totalCollected.toFixed(2)}
          </h3>
          <p className="text-[11px] text-emerald-600 font-semibold">
            {collectedOrders.length} orders reconciled
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Pending In-Transit Cash</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            {currency}{totalPending.toFixed(2)}
          </h3>
          <p className="text-[11px] text-amber-600 font-semibold">
            {pendingOrders.length} orders awaiting courier remittance
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Refunds Processed</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            {currency}{totalRefunded.toFixed(2)}
          </h3>
          <p className="text-[11px] text-slate-500">
            {refundedOrders.length} orders
          </p>
        </div>
      </div>

      {/* Payment Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900">Payment Collection Records</h3>
          <span className="text-xs text-slate-400">Total COD Orders: {codOrders.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Delivery Status</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Collection Status</th>
                <th className="py-3 px-4 text-right">Quick Reconciliation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {codOrders.map(o => (
                <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">
                    #{o.orderNumber}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {o.customerName}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-[10px] uppercase text-slate-600">
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    Cash on Delivery
                  </td>
                  <td className="py-3 px-4 font-black text-slate-900">
                    {currency}{o.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        o.paymentStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : o.paymentStatus === 'Refunded'
                          ? 'bg-slate-200 text-slate-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => togglePaymentPaid(o.id, o.paymentStatus)}
                      className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-colors ${
                        o.paymentStatus === 'Paid'
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs'
                      }`}
                    >
                      {o.paymentStatus === 'Paid' ? 'Mark as Unpaid' : 'Mark Cash Collected'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
