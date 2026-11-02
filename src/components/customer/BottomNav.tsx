import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Home, Grid, Search, Heart, User } from 'lucide-react';

interface NavItem {
  id: 'home' | 'categories' | 'search' | 'wishlist' | 'account';
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export const BottomNav: React.FC = () => {
  const { customerTab, setCustomerTab, wishlist, cartItemCount } = useStore();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, badge: wishlist.length },
    { id: 'account', label: 'Account', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] max-w-xl mx-auto transition-all print:hidden">
      <div className="flex items-center justify-around py-1.5 px-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = customerTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCustomerTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-blue-600 scale-105'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'stroke-[2.4] text-blue-600' : 'stroke-[1.8]'
                  } ${item.id === 'wishlist' && wishlist.length > 0 && isActive ? 'fill-red-500 text-red-500' : ''}`}
                />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white rounded-full text-[9px] font-bold w-4 h-4 flex items-center justify-center ring-2 ring-white">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight font-medium ${
                  isActive ? 'font-bold text-blue-600' : 'text-slate-600'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 bg-blue-600 rounded-full mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
