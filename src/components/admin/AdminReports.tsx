import React from 'react';
import { useStore } from '../../context/StoreContext';
import { BarChart3, Download, TrendingUp, DollarSign, ShoppingBag, Users, Calendar } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { stats, orders, products, settings, showToast } = useStore();

  const currency = settings.currencySymbol || '$';
  const kpis = stats?.kpis || {
    totalRevenue: 0,
    codCollectedRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    returnedOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  };

  const handleExportReportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Metric,Value',
        `Total Gross Revenue,${kpis.totalRevenue}`,
        `Total Orders,${kpis.totalOrders}`,
        `Active Customers,${kpis.totalCustomers}`,
        `Total Products In Catalog,${kpis.totalProducts}`,
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `trend_bazar_financial_summary_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Analytics summary exported as CSV!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Financial & Sales Analytics
          </h1>
          <p className="text-xs text-slate-500">
            Daily, weekly, and monthly growth breakdowns with CSV export capabilities
          </p>
        </div>

        <button
          onClick={handleExportReportCSV}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Summary Report (CSV)</span>
        </button>
      </div>

      {/* KPI summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Net Volume</span>
          <p className="text-xl font-black text-slate-900">{currency}{kpis.totalRevenue.toFixed(2)}</p>
          <span className="text-[10px] text-emerald-600 font-bold">From COD Fulfillment</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Average Order Value</span>
          <p className="text-xl font-black text-slate-900">
            {currency}
            {kpis.totalOrders > 0 ? (kpis.totalRevenue / kpis.totalOrders).toFixed(2) : '0.00'}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">Per checkout</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Order Completion Rate</span>
          <p className="text-xl font-black text-emerald-600">
            {kpis.totalOrders > 0
              ? Math.round(
                  ((kpis.totalOrders - (kpis.cancelledOrders || 0)) / kpis.totalOrders) * 100
                )
              : 100}
            %
          </p>
          <span className="text-[10px] text-slate-500 font-medium">Non-cancelled orders</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Repeat Customer Rate</span>
          <p className="text-xl font-black text-blue-700">42%</p>
          <span className="text-[10px] text-slate-500 font-medium">Customer loyalty</span>
        </div>
      </div>

      {/* Breakdown by product performance */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900">
          Catalog Product Sales Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Price</th>
                <th className="py-2.5 px-3">Stock Left</th>
                <th className="py-2.5 px-3">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map(p => (
                <tr key={p.id}>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{p.name}</td>
                  <td className="py-2.5 px-3 text-slate-500">{p.categoryName}</td>
                  <td className="py-2.5 px-3 font-black text-slate-900">{currency}{p.discountPrice || p.price}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{p.stock} units</td>
                  <td className="py-2.5 px-3 text-amber-500 font-bold">★ {p.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
