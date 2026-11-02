import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CustomerHeader } from './CustomerHeader';
import { BottomNav } from './BottomNav';
import { HeroBanner } from './HeroBanner';
import { CategoryList } from './CategoryList';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { CartDrawer } from './CartDrawer';
import { CheckoutModal } from './CheckoutModal';
import { OrderTrackingModal } from './OrderTrackingModal';
import { AccountView } from './AccountView';
import { WishlistView } from './WishlistView';
import { WhatsAppButton } from './WhatsAppButton';
import {
  Flame,
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Star,
  CheckCircle2,
  Copy,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface CustomerViewProps {
  mobileFrame: boolean;
}

export const CustomerView: React.FC<CustomerViewProps> = ({ mobileFrame }) => {
  const {
    customerTab,
    setCustomerTab,
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    coupons,
    showToast,
    settings,
  } = useStore();

  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'trending' | 'bestseller' | 'new'>('all');

  const copyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    showToast(`Coupon "${code}" copied to clipboard!`);
  };

  // Filter products for Home/Explore/Search
  let filteredProducts = products.filter(p => p.isActive);

  if (customerTab === 'categories' && selectedCategory !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.categoryId === selectedCategory);
  }

  if (customerTab === 'search' || (customerTab === 'home' && searchQuery.trim())) {
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      filteredProducts = filteredProducts.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }
  }

  // Home section slices
  const trendingProducts = products.filter(p => p.isTrending && p.isActive).slice(0, 4);
  const bestSellerProducts = products.filter(p => p.isBestSeller && p.isActive).slice(0, 4);
  const newArrivalProducts = products.filter(p => p.isNewArrival && p.isActive).slice(0, 4);

  const content = (
    <div className="bg-slate-50 min-h-screen pb-20 relative selection:bg-blue-600 selection:text-white">
      {/* Mobile Sticky Header */}
      <CustomerHeader />

      {/* Main View Router */}
      {customerTab === 'account' ? (
        <AccountView />
      ) : customerTab === 'wishlist' ? (
        <WishlistView />
      ) : customerTab === 'categories' ? (
        /* Categories View */
        <div className="p-3.5 space-y-4 max-w-xl mx-auto animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900">Browse by Category</h2>
            <span className="text-xs text-slate-400">{filteredProducts.length} Products</span>
          </div>

          <CategoryList />

          <div className="grid grid-cols-2 gap-3 pt-2">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              No products found in this category.
            </div>
          )}
        </div>
      ) : customerTab === 'search' ? (
        /* Search View */
        <div className="p-3.5 space-y-4 max-w-xl mx-auto animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Explore All Products'}
            </h2>
            <span className="text-xs text-slate-500 font-bold">{filteredProducts.length} items</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-16 text-center space-y-2">
              <p className="text-sm font-bold text-slate-700">No matching products found</p>
              <p className="text-xs text-slate-400">Try searching for "earbuds", "sneakers", or "charger"</p>
            </div>
          )}
        </div>
      ) : (
        /* HOME TAB */
        <div className="space-y-4 max-w-xl mx-auto animate-in fade-in-50">
          {/* Hero Promotional Banner */}
          <HeroBanner />

          {/* Featured Categories Carousel */}
          <CategoryList />

          {/* Flash Deals / Special Offers Card */}
          <div className="mx-3.5 p-3.5 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl text-white shadow-md space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
                <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                  Special Offer Code
                </span>
              </div>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono font-bold">
                LIMITED
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-black">Get Flat 20% OFF Everything</p>
                <p className="text-[11px] text-blue-100">Use coupon at checkout on orders over $30</p>
              </div>

              <button
                onClick={() => copyCoupon('TREND20')}
                className="shrink-0 flex items-center gap-1 bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl font-bold text-xs shadow hover:bg-amber-300 active:scale-95 transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>TREND20</span>
              </button>
            </div>
          </div>

          {/* Section: Trending Products */}
          <div className="px-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  Trending Now
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setCustomerTab('categories');
                }}
                className="text-xs font-bold text-blue-600 flex items-center gap-0.5 hover:text-blue-700"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2 per row grid */}
            <div className="grid grid-cols-2 gap-3">
              {trendingProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          {/* Section: Best-Selling Products */}
          <div className="px-3.5 space-y-2.5 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  Best-Selling Products
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setCustomerTab('categories');
                }}
                className="text-xs font-bold text-blue-600 flex items-center gap-0.5 hover:text-blue-700"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2 per row grid */}
            <div className="grid grid-cols-2 gap-3">
              {bestSellerProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          {/* Section: New Arrivals */}
          <div className="px-3.5 space-y-2.5 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  New Arrivals
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setCustomerTab('categories');
                }}
                className="text-xs font-bold text-blue-600 flex items-center gap-0.5 hover:text-blue-700"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2 per row grid */}
            <div className="grid grid-cols-2 gap-3">
              {newArrivalProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          {/* Trust Value Props */}
          <div className="mx-3.5 p-4 bg-white rounded-2xl border border-slate-100 shadow-xs grid grid-cols-3 gap-2 text-center">
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <p className="text-[11px] font-bold text-slate-800">Free Delivery</p>
              <p className="text-[9px] text-slate-400">On orders &gt; ${settings.freeDeliveryThreshold}</p>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-[11px] font-bold text-slate-800">Cash on Delivery</p>
              <p className="text-[9px] text-slate-400">Pay safely at home</p>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
                <RotateCcw className="w-4 h-4" />
              </div>
              <p className="text-[11px] font-bold text-slate-800">7-Day Return</p>
              <p className="text-[9px] text-slate-400">Instant replacement</p>
            </div>
          </div>

          {/* Customer Reviews Highlight */}
          <div className="mx-3.5 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-blue-900 uppercase tracking-wider text-[10px]">
                Customer Love
              </span>
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-bold text-slate-800 ml-1">4.9 / 5 Rating</span>
              </div>
            </div>
            <p className="text-xs text-slate-700 italic">
              "Ordered the Pro ANC earbuds with Cash on Delivery. Got it within 48 hours in Mumbai! Packaging was top-notch and product is authentic."
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="font-bold text-slate-700">— Vikram S., Mumbai</span>
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Buyer
              </span>
            </div>
          </div>

          {/* Footer Mobile Info */}
          <footer className="px-4 py-6 text-center space-y-2 text-slate-400 text-xs">
            <p className="font-bold text-slate-600">{settings.storeName || 'TREND BAZAR'}</p>
            <p className="text-[11px]">{settings.tagline}</p>
            <p className="text-[10px]">Support: {settings.supportPhone} • {settings.supportEmail}</p>
            <p className="text-[10px] text-slate-400 pt-2">© 2026 Trend Bazar. All Rights Reserved.</p>
          </footer>
        </div>
      )}

      {/* Floating WhatsApp Support Button */}
      <WhatsAppButton />

      {/* Fixed Mobile Bottom Navigation Bar */}
      <BottomNav />

      {/* Slide-overs & Modals */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
    </div>
  );

  // If mobile frame is toggled on desktop, wrap inside a sleek iPhone/Android frame preview
  if (mobileFrame) {
    return (
      <div className="min-h-screen bg-slate-950 py-6 px-4 flex items-center justify-center">
        <div className="w-full max-w-[410px] bg-black rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-800 border-4 border-slate-800 relative">
          {/* Phone Speaker & Camera pill */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-800 mr-2" />
            <div className="w-12 h-1 bg-slate-800 rounded-full" />
          </div>

          <div className="w-full h-[840px] overflow-y-auto rounded-[36px] bg-slate-50 relative no-scrollbar">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/60 flex justify-center">
      <div className="w-full max-w-xl bg-slate-50 shadow-sm min-h-screen">
        {content}
      </div>
    </div>
  );
};
