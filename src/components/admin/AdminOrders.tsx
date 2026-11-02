import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import { AdminInvoiceModal } from './AdminInvoiceModal';
import {
  Search,
  Filter,
  Download,
  Eye,
  Printer,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  RotateCcw,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  X,
  Save,
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, settings, showToast } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Status updating state in details modal
  const [newStatus, setNewStatus] = useState<OrderStatus>('Pending');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courier, setCourier] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Unpaid');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const currency = settings.currencySymbol || '$';

  const openOrderDrawer = (o: Order) => {
    setSelectedOrder(o);
    setNewStatus(o.orderStatus);
    setTrackingNumber(o.trackingNumber || '');
    setCourier(o.courier || '');
    setPaymentStatus(o.paymentStatus);
    setStatusNote('');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setUpdating(true);
    try {
      const res = await updateOrderStatus(selectedOrder.id, newStatus, {
        trackingNumber: trackingNumber.trim() || undefined,
        courier: courier.trim() || undefined,
        paymentStatus,
        note: statusNote.trim() || undefined,
      });

      if (res.success && res.order) {
        setSelectedOrder(res.order);
      }
    } finally {
      setUpdating(false);
    }
  };

  // Export orders to CSV
  const handleExportCSV = () => {
    if (orders.length === 0) return;
    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'Email', 'City', 'Address', 'Total Amount', 'Payment Status', 'Order Status', 'Tracking Number'];
    const rows = orders.map(o => [
      o.orderNumber,
      new Date(o.createdAt).toISOString().slice(0, 10),
      `"${o.customerName}"`,
      `"${o.phone}"`,
      o.email,
      `"${o.city}"`,
      `"${o.address.replace(/"/g, '""')}"`,
      o.totalAmount,
      o.paymentStatus,
      o.orderStatus,
      o.trackingNumber || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `trend_bazar_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders exported to CSV file successfully!');
  };

  // Filter orders
  let filtered = orders;
  if (statusFilter !== 'all') {
    filtered = filtered.filter(o => o.orderStatus.toLowerCase() === statusFilter.toLowerCase());
  }
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
    );
  }

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Order Fulfillment Center
          </h1>
          <p className="text-xs text-slate-500">
            Verify COD payments, dispatch packages, attach tracking AWBs, and process returns
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Orders (CSV)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by Order #, customer, phone, city..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium text-slate-700"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
          </select>
        </div>

        <span className="text-xs font-bold text-slate-500">
          Showing {filtered.length} of {orders.length} orders
        </span>
      </div>

      {/* Desktop Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Phone / City</th>
                <th className="py-3 px-4">Products</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(o => (
                <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">
                    #{o.orderNumber}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {o.customerName}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    <div>{o.phone}</div>
                    <div className="text-[10px] text-slate-400">{o.city}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="font-semibold text-slate-800">
                      {o.items.length} item{o.items.length > 1 ? 's' : ''}
                    </span>
                    <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
                      {o.items.map(it => it.productName).join(', ')}
                    </p>
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
                          : o.orderStatus === 'Confirmed'
                          ? 'bg-sky-100 text-sky-800'
                          : o.orderStatus === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : o.orderStatus === 'Returned'
                          ? 'bg-slate-200 text-slate-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {new Date(o.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openOrderDrawer(o)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition-colors text-[11px]"
                      >
                        Manage
                      </button>
                      <button
                        onClick={() => setInvoiceOrder(o)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        title="Print Invoice"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Management & Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl max-h-[92vh] flex flex-col z-10 overflow-hidden animate-in fade-in-50">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Manage Order #{selectedOrder.orderNumber}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInvoiceOrder(selectedOrder)}
                  className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable details & fulfillment controls */}
            <div className="overflow-y-auto p-5 space-y-5 flex-1 text-xs">
              {/* Status Update Form */}
              <form onSubmit={handleUpdateStatus} className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 space-y-3">
                <p className="font-extrabold text-blue-900 text-xs uppercase tracking-wider">
                  Update Fulfillment & Shipping
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Order Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={e => setNewStatus(e.target.value as OrderStatus)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 focus:border-blue-500 bg-white font-semibold"
                    >
                      <option value="Pending">Pending Verification</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing & Packaging</option>
                      <option value="Shipped">Shipped / Dispatched</option>
                      <option value="Delivered">Delivered & Collected</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Returned">Returned</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      COD Payment Status
                    </label>
                    <select
                      value={paymentStatus}
                      onChange={e => setPaymentStatus(e.target.value as PaymentStatus)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 focus:border-blue-500 bg-white font-semibold"
                    >
                      <option value="Unpaid">Unpaid (Cash Pending)</option>
                      <option value="Paid">Paid (Cash Collected)</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Courier / Carrier Name
                    </label>
                    <input
                      type="text"
                      value={courier}
                      onChange={e => setCourier(e.target.value)}
                      placeholder="e.g. BlueDart, Delhivery, FedEx"
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 focus:border-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Tracking Number (AWB)
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={e => setTrackingNumber(e.target.value)}
                      placeholder="e.g. TRK-8819203"
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 focus:border-blue-500 bg-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Timeline Update Note (Visible to Customer)
                  </label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={e => setStatusNote(e.target.value)}
                    placeholder="e.g. Package dispatched via express air cargo"
                    className="w-full text-xs p-2 rounded-xl border border-slate-300 focus:border-blue-500 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{updating ? 'Saving Status...' : 'Save Order Status & Tracking'}</span>
                </button>
              </form>

              {/* Customer & Address Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <p className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1">Customer</p>
                  <p className="font-bold text-slate-800 text-sm">{selectedOrder.customerName}</p>
                  <p className="text-slate-600">Phone: {selectedOrder.phone}</p>
                  <p className="text-slate-600">Email: {selectedOrder.email}</p>
                </div>
                <div>
                  <p className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1">Delivery Address</p>
                  <p className="text-slate-800">{selectedOrder.address}</p>
                  <p className="text-slate-800 font-semibold">{selectedOrder.city} - {selectedOrder.postalCode}</p>
                  {selectedOrder.notes && (
                    <p className="text-amber-700 bg-amber-50 p-1.5 rounded-lg mt-1 text-[11px]">
                      Notes: {selectedOrder.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Ordered Items List */}
              <div className="space-y-2">
                <p className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                  Ordered Items ({selectedOrder.items.length})
                </p>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="p-3 flex items-center justify-between gap-3 bg-white">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-11 h-11 object-cover rounded-xl border border-slate-100 bg-slate-50 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-800">{item.productName}</p>
                          <p className="text-[11px] text-slate-400">
                            Qty: {item.quantity} {item.variant ? `• ${item.variant}` : ''}
                          </p>
                        </div>
                      </div>
                      <span className="font-black text-slate-900">
                        {currency}{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      <AdminInvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />
    </div>
  );
};
