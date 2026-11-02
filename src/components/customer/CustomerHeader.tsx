import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShoppingBag,
  Search,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Phone,
  Truck,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const CustomerHeader: React.FC = () => {
  const {
    settings,
    cartItemCount,
    wishlist,
    setIsCartOpen,
    customerTab,
    setCustomerTab,
    searchQuery,
    setSearchQuery,
    categories,
    setSelectedCategory,
    currentUser,
  } = useStore();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerTab('search');
    setShowSearchInput(false);
  };

  const selectCat = (catId: string) => {
    setSelectedCategory(catId);
    setCustomerTab('categories');
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Top Announcement Bar */}
      {settings.announcementText && (
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white text-[11px] font-medium py-1.5 px-3 text-center tracking-tight flex items-center justify-center gap-1.5 shadow-sm">
          <span>{settings.announcementText}</span>
        </div>
      )}

      {/* Main Mobile Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
        <div className="px-3.5 py-2.5 flex items-center justify-between gap-2 max-w-xl mx-auto">
          {/* Hamburger Menu & Brand */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="p-1.5 -ml-1 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setCustomerTab('home');
                setSelectedCategory('all');
              }}
              className="flex items-center gap-1.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <span className="font-extrabold text-base tracking-tight text-blue-900 group-hover:text-blue-600 transition-colors">
                  {settings.storeName || 'TREND BAZAR'}
                </span>
                <span className="block text-[9px] font-bold text-blue-600 uppercase tracking-widest -mt-0.5">
                  Shop Smart
                </span>
              </div>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSearchInput(!showSearchInput)}
              aria-label="Search"
              className="p-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCustomerTab('wishlist')}
              aria-label="Wishlist"
              className="p-2 text-slate-700 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors relative"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-red-500 fill-red-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart"
              className="p-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5 text-blue-700" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-white animate-scale-in">
                  {cartItemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCustomerTab('account')}
              aria-label="Account"
              className={`p-2 rounded-full transition-colors ${
                customerTab === 'account'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <UserIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Expandable Search Input on Mobile */}
        {showSearchInput && (
          <div className="px-3 pb-2.5 pt-1 max-w-xl mx-auto border-t border-slate-100 animate-in slide-in-from-top-2">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search smart gadgets, sneakers, hoodies..."
                autoFocus
                className="w-full pl-9 pr-16 py-2 bg-slate-100 focus:bg-white text-xs font-medium rounded-full border border-transparent focus:border-blue-500 focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-1 px-3 py-1 bg-blue-600 text-white text-[11px] font-semibold rounded-full hover:bg-blue-700 transition-colors"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 bg-gradient-to-r from-blue-700 to-blue-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">{settings.storeName || 'TREND BAZAR'}</h3>
                  <p className="text-[10px] text-blue-100">Welcome, {currentUser ? currentUser.name : 'Shopper'}</p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 text-white/80 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Navigation */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Explore Categories</p>
                <div className="space-y-1">
                  <button
                    onClick={() => selectCat('all')}
                    className="w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    <span>All Products</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => selectCat(cat.id)}
                      className="w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full font-semibold">
                        {cat.productCount}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Customer Care</p>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50/60 text-blue-900">
                    <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Free Shipping on orders &gt; ${settings.freeDeliveryThreshold}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cash on Delivery (COD) Available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
              <p className="font-medium text-slate-700">Need Help?</p>
              <p className="text-[11px] mt-0.5">Call: {settings.supportPhone}</p>
              <p className="text-[11px]">Email: {settings.supportEmail}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
