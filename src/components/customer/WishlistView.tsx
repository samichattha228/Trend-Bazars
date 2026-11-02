import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';

export const WishlistView: React.FC = () => {
  const { wishlist, products, setCustomerTab } = useStore();

  const favoriteProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="p-3.5 space-y-4 max-w-xl mx-auto pb-24 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
            <Heart className="w-4 h-4 fill-red-500" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">My Wishlist</h2>
            <p className="text-[11px] text-slate-500">{favoriteProducts.length} saved item{favoriteProducts.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-slate-100 p-6">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-400 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-sm">Your wishlist is empty</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Tap the heart icon on any product to save items you love for later!
          </p>
          <button
            onClick={() => setCustomerTab('home')}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-700 transition-all"
          >
            Explore Trending Items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {favoriteProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
};
