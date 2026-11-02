import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Lock,
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const {
    currentUser,
    loginUser,
    logoutUser,
    orders,
    setTrackingOrder,
    setCustomerTab,
    settings,
    setCurrentView,
    setAdminTab,
  } = useStore();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [activeAccountTab, setActiveAccountTab] = useState<'orders' | 'profile' | 'addresses'>('orders');

  const currency = settings.currencySymbol || '$';

  // Filter orders for this customer (or match by email)
  const myOrders = orders.filter(
    o => (currentUser && o.customerId === currentUser.id) || (currentUser && o.email === currentUser.email)
  );

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await loginUser(email, name);
  };

  const handleQuickDemoLogin = async () => {
    await loginUser('rahul.sharma@example.com', 'Rahul Sharma');
  };

  if (!currentUser) {
    return (
      <div className="p-4 max-w-md mx-auto space-y-5 animate-in fade-in-50">
        <div className="text-center space-y-1.5 pt-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-sky-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-600/20">
            <UserIcon className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Customer Account</h2>
          <p className="text-xs text-slate-500">Sign in to track orders, manage addresses & checkout faster</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              authMode === 'login' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              authMode === 'register' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          {authMode === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                required
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-slate-50 focus:bg-white"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-slate-50 focus:bg-white"
            />
          </div>

          {authMode === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-slate-50 focus:bg-white"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-slate-50 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-600/30 hover:bg-blue-700 transition-all"
          >
            {authMode === 'login' ? 'Sign In to Trend Bazar' : 'Create Customer Account'}
          </button>

          {/* Quick Demo Login */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl w-full"
            >
              ⚡ 1-Click Demo Customer Login (Rahul Sharma)
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-3.5 space-y-4 max-w-xl mx-auto pb-24">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-4 rounded-2xl shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg border border-white/20">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-extrabold text-sm">{currentUser.name}</h3>
            <p className="text-[11px] text-blue-100">{currentUser.email}</p>
            <span className="inline-block mt-1 text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Verified Shopper
            </span>
          </div>
        </div>

        <button
          onClick={logoutUser}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Internal Subtabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
        <button
          onClick={() => setActiveAccountTab('orders')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeAccountTab === 'orders' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>My Orders ({myOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveAccountTab('addresses')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeAccountTab === 'addresses' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Saved Addresses</span>
        </button>
      </div>

      {/* Tab: Orders */}
      {activeAccountTab === 'orders' && (
        <div className="space-y-3">
          {myOrders.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center space-y-2">
              <Package className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No orders placed yet</p>
              <button
                onClick={() => setCustomerTab('home')}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                Browse catalog & place your first order
              </button>
            </div>
          ) : (
            myOrders.map(order => (
              <div
                key={order.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                  <div>
                    <span className="font-mono font-bold text-slate-800">#{order.orderNumber}</span>
                    <p className="text-[10px] text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`font-bold text-[10px] uppercase px-2 py-0.5 rounded-full ${
                      order.orderStatus === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700'
                        : order.orderStatus === 'Cancelled'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                {/* Items preview */}
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {order.items.map((it, idx) => (
                    <img
                      key={idx}
                      src={it.image}
                      alt={it.productName}
                      className="w-12 h-12 object-cover rounded-lg border border-slate-100 bg-slate-50 shrink-0"
                    />
                  ))}
                  <div className="text-[11px] text-slate-600 pl-1 shrink-0">
                    <p className="font-bold">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                    <p className="font-black text-blue-700">{currency}{order.totalAmount.toFixed(2)} (COD)</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setTrackingOrder(order)}
                    className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Live Status</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Addresses */}
      {activeAccountTab === 'addresses' && (
        <div className="space-y-3">
          {currentUser.addresses && currentUser.addresses.length > 0 ? (
            currentUser.addresses.map(addr => (
              <div
                key={addr.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{addr.name}</span>
                  {addr.isDefault && (
                    <span className="text-[9px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.2 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-slate-600">{addr.address}, {addr.city} - {addr.postalCode}</p>
                <p className="text-slate-400 text-[11px]">Phone: {addr.phone}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">No saved addresses yet.</p>
          )}
        </div>
      )}

      {/* Switch to Admin link */}
      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={() => {
            setCurrentView('admin');
            setAdminTab('dashboard');
          }}
          className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Open Trend Bazar Admin Dashboard (Desktop)</span>
        </button>
      </div>
    </div>
  );
};
