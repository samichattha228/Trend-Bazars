import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Coupon } from '../../types';
import { TicketPercent, Plus, Trash2, CheckCircle2, XCircle, Calendar, Tag, X } from 'lucide-react';

export const AdminCoupons: React.FC = () => {
  const { coupons, saveCoupon, deleteCoupon, settings, showToast } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number | string>('15');
  const [minOrderAmount, setMinOrderAmount] = useState<number | string>('25');
  const [maxDiscount, setMaxDiscount] = useState<number | string>('50');
  const [expiryDate, setExpiryDate] = useState('2027-12-31');
  const [usageLimit, setUsageLimit] = useState<number | string>('500');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const currency = settings.currencySymbol || '$';

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || discountValue === '') {
      showToast('Coupon code and discount value are required', 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await saveCoupon({
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount) || 0,
        maxDiscount: maxDiscount !== '' ? Number(maxDiscount) : undefined,
        expiryDate,
        usageLimit: Number(usageLimit) || 500,
        isActive,
      });

      if (res.success) {
        setIsModalOpen(false);
        setCode('');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, couponCode: string) => {
    if (window.confirm(`Delete coupon "${couponCode}"?`)) {
      await deleteCoupon(id);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Coupons & Promotional Discounts
          </h1>
          <p className="text-xs text-slate-500">
            Create checkout promo codes, manage minimum purchase rules, and monitor usage
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount Type</th>
                <th className="py-3 px-4">Value</th>
                <th className="py-3 px-4">Min. Order</th>
                <th className="py-3 px-4">Usage Count</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coupons.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 text-xs tracking-wider">
                      {c.code}
                    </span>
                  </td>

                  <td className="py-3 px-4 capitalize font-medium text-slate-700">
                    {c.discountType === 'percentage' ? 'Percentage %' : 'Fixed Amount'}
                  </td>

                  <td className="py-3 px-4 font-black text-slate-900">
                    {c.discountType === 'percentage' ? `${c.discountValue}%` : `${currency}${c.discountValue}`}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {c.minOrderAmount > 0 ? `${currency}${c.minOrderAmount}` : 'None'}
                  </td>

                  <td className="py-3 px-4 text-slate-600 font-mono">
                    {c.usedCount} / {c.usageLimit}
                  </td>

                  <td className="py-3 px-4 text-slate-500">
                    {c.expiryDate}
                  </td>

                  <td className="py-3 px-4">
                    {c.isActive ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="text-slate-400 font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Inactive
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(c.id, c.code)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      title="Delete coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-5 z-10 space-y-4 animate-in fade-in-50">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900">Create New Coupon Code</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  required
                  placeholder="e.g. FLASH30, DIWALI15"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono uppercase bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={e => setDiscountValue(e.target.value)}
                    required
                    placeholder="20"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Min. Order Amount ($)
                  </label>
                  <input
                    type="number"
                    value={minOrderAmount}
                    onChange={e => setMinOrderAmount(e.target.value)}
                    placeholder="30"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Usage Limit (Times)
                  </label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={e => setUsageLimit(e.target.value)}
                    placeholder="500"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={e => setExpiryDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
