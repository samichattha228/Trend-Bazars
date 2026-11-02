import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  Eye,
  FileText,
  Boxes,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { stats, orders, products, settings, setAdminTab, setTrackingOrder } = useStore();

  const currency = settings.currencySymbol || '$';
  const kpis = stats?.kpis || {
    totalRevenue: 279.51,
    codCollectedRevenue: 62.55,
    totalOrders: 4,
    pendingOrders: 1,
    processingOrders: 1,
    shippedOrders: 1,
    deliveredOrders: 1,
    cancelledOrders: 0,
    returnedOrders: 0,
    totalCustomers: 2,
    totalProducts: 8,
    lowStockCount: 2,
    outOfStockCount: 0,
  };

  const chartData = stats?.chartData || [];
  const maxSales = Math.max(...chartData.map(d => d.sales), 100);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Business Executive Overview
          </h1>
          <p className="text-xs text-slate-500">
            Real-time live database performance metrics for Trend Bazar operations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminTab('orders')}
            className="px-3.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors"
          >
            Manage Orders ({orders.length})
          </button>
          <button
            onClick={() => setAdminTab('add-product')}
            className="px-3.5 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            + Add New Product
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {currency}{kpis.totalRevenue.toLocaleString()}
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>COD Collected: {currency}{kpis.codCollectedRevenue.toLocaleString()}</span>
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {kpis.totalOrders}
            </h3>
            <p className="text-[11px] text-slate-500">
              {kpis.pendingOrders} pending • {kpis.processingOrders} processing
            </p>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Customers
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {kpis.totalCustomers}
            </h3>
            <p className="text-[11px] text-slate-500">
              Registered shopping profiles
            </p>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Inventory Status
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
              kpis.lowStockCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {kpis.totalProducts} <span className="text-xs font-normal text-slate-400">Products</span>
            </h3>
            <p className={`text-[11px] font-semibold ${
              kpis.lowStockCount > 0 ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {kpis.lowStockCount > 0 ? `⚠️ ${kpis.lowStockCount} products low on stock` : '✓ All products well-stocked'}
            </p>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Order Pipeline Status Breakdown
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/50 text-center">
            <span className="text-[10px] font-bold text-amber-800 uppercase">Pending</span>
            <p className="text-lg font-black text-amber-900 mt-0.5">{kpis.pendingOrders}</p>
          </div>
          <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-200/50 text-center">
            <span className="text-[10px] font-bold text-blue-800 uppercase">Processing</span>
            <p className="text-lg font-black text-blue-900 mt-0.5">{kpis.processingOrders}</p>
          </div>
          <div className="bg-purple-50/70 p-2.5 rounded-xl border border-purple-200/50 text-center">
            <span className="text-[10px] font-bold text-purple-800 uppercase">Shipped</span>
            <p className="text-lg font-black text-purple-900 mt-0.5">{kpis.shippedOrders}</p>
          </div>
          <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/50 text-center">
            <span className="text-[10px] font-bold text-emerald-800 uppercase">Delivered</span>
            <p className="text-lg font-black text-emerald-900 mt-0.5">{kpis.deliveredOrders}</p>
          </div>
          <div className="bg-red-50/70 p-2.5 rounded-xl border border-red-200/50 text-center">
            <span className="text-[10px] font-bold text-red-800 uppercase">Cancelled</span>
            <p className="text-lg font-black text-red-900 mt-0.5">{kpis.cancelledOrders}</p>
          </div>
          <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-700 uppercase">Returned</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">{kpis.returnedOrders}</p>
          </div>
          <div className="bg-sky-50/70 p-2.5 rounded-xl border border-sky-200/50 text-center">
            <span className="text-[10px] font-bold text-sky-800 uppercase">Total Logged</span>
            <p className="text-lg font-black text-sky-900 mt-0.5">{kpis.totalOrders}</p>
          </div>
        </div>
      </div>

      {/* Charts & Top Sellers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Weekly Sales & Revenue Trend
              </h3>
              <p className="text-[11px] text-slate-500">Daily gross turnover from confirmed COD orders</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
              Last 7 Days
            </span>
          </div>

          {/* Interactive Bar Chart */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
            {chartData.map((d, idx) => {
              const heightPct = Math.max(12, Math.round((d.sales / maxSales) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    ${d.sales}
                  </span>
                  <div className="w-full max-w-[42px] bg-slate-100 rounded-t-xl h-44 flex items-end overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-xl group-hover:from-blue-800 group-hover:to-sky-400 transition-all duration-300"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">{d.day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Legend: Daily Gross Revenue in USD ($)</span>
            <button
              onClick={() => setAdminTab('reports')}
              className="text-blue-600 font-bold hover:underline"
            >
              View Detailed Analytics →
            </button>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">Top Selling Products</h3>
            <button
              onClick={() => setAdminTab('products')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              All Products
            </button>
          </div>

          <div className="space-y-3">
            {stats?.topSellingProducts && stats.topSellingProducts.length > 0 ? (
              stats.topSellingProducts.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-11 h-11 object-cover rounded-xl border border-slate-100 bg-slate-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-800 truncate">{item.name}</h5>
                    <p className="text-[11px] text-slate-500">{item.count} units sold</p>
                  </div>
                  <span className="text-xs font-black text-blue-700">
                    {currency}{item.revenue.toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">No sales data recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-2">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Recent Customer Orders</h3>
            <p className="text-[11px] text-slate-500">Live order management and verification</p>
          </div>
          <button
            onClick={() => setAdminTab('orders')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All Orders ({orders.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Desktop Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone / City</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 5).map(o => (
                <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">
                    #{o.orderNumber}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {o.customerName}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {o.phone} • {o.city}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {o.items.length} item{o.items.length > 1 ? 's' : ''}
                  </td>
                  <td className="py-3 px-4 font-black text-slate-900">
                    {currency}{o.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        o.paymentStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      COD ({o.paymentStatus})
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        o.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : o.orderStatus === 'Shipped'
                          ? 'bg-purple-100 text-purple-800'
                          : o.orderStatus === 'Processing'
                          ? 'bg-blue-100 text-blue-800'
                          : o.orderStatus === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setAdminTab('orders')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold rounded-lg transition-colors text-[11px]"
                    >
                      Manage
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
