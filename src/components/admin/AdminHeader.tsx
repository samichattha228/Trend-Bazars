import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Menu,
  Search,
  Bell,
  Plus,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  ShoppingBag,
} from 'lucide-react';

interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const {
    orders,
    products,
    refreshData,
    loading,
    setAdminTab,
    setCurrentView,
    adminUser,
    showToast,
  } = useStore();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending');
  const lowStockProds = products.filter(p => p.stock <= 5 && p.isActive);
  const totalNotifications = pendingOrders.length + lowStockProds.length;

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    setAdminTab('orders');
    showToast(`Filtering admin data for "${globalSearch.trim()}"`);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl lg:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleGlobalSearch} className="relative w-full hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={globalSearch}
            onChange={e => setGlobalSearch(e.target.value)}
            placeholder="Search orders (#TB-...), products, customers..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
          />
        </form>
      </div>

      {/* Right: Date Time, Quick Actions, Notifications, Admin Profile */}
      <div className="flex items-center gap-3">
        {/* Live Date and Time ticker */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 font-mono">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          <span className="text-slate-300">•</span>
          <span>{currentTime.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>

        {/* Quick Add Product CTA */}
        <button
          onClick={() => setAdminTab('add-product')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Product</span>
        </button>

        {/* Refresh Data */}
        <button
          onClick={() => {
            refreshData();
            showToast('Database refreshed');
          }}
          title="Refresh database"
          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {totalNotifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-scale-in">
                {totalNotifications}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-3 space-y-2 animate-in fade-in-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">
                  Business Alerts ({totalNotifications})
                </span>
                <span className="text-[10px] text-blue-600 font-semibold">Live Feed</span>
              </div>

              <div className="space-y-1.5 max-h-64 overflow-y-auto text-xs">
                {pendingOrders.map(o => (
                  <div
                    key={o.id}
                    onClick={() => {
                      setAdminTab('orders');
                      setShowNotifications(false);
                    }}
                    className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-100 cursor-pointer transition-colors space-y-0.5"
                  >
                    <p className="font-bold text-amber-900 flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3 text-amber-600" />
                      New Order #{o.orderNumber}
                    </p>
                    <p className="text-[11px] text-amber-700">
                      {o.customerName} ordered {o.items.length} items (${o.totalAmount})
                    </p>
                  </div>
                ))}

                {lowStockProds.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setAdminTab('inventory');
                      setShowNotifications(false);
                    }}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 cursor-pointer transition-colors space-y-0.5"
                  >
                    <p className="font-bold text-red-900 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-red-600" />
                      Low Stock: {p.name}
                    </p>
                    <p className="text-[11px] text-red-700">Only {p.stock} units remaining</p>
                  </div>
                ))}

                {totalNotifications === 0 && (
                  <p className="text-center py-4 text-slate-400 text-xs">
                    All orders processed & stock levels healthy! ✨
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {adminUser?.name?.charAt(0) || 'A'}
          </div>
          <div className="hidden md:block text-left leading-tight">
            <span className="block text-xs font-bold text-slate-800">
              {adminUser?.name || 'Admin User'}
            </span>
            <span className="block text-[10px] text-emerald-600 font-semibold">
              Super Admin (Owner)
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
