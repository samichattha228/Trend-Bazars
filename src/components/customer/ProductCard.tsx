import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Heart, ShoppingBag, Star, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedProduct,
    settings,
  } = useStore();

  const isFavorited = isInWishlist(product.id);
  const currency = settings.currencySymbol || '$';

  // Compute discount percentage
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const activePrice = hasDiscount ? product.discountPrice : product.price;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group relative">
      {/* Product Image & Badges */}
      <div
        onClick={() => setSelectedProduct(product)}
        className="relative aspect-square w-full bg-slate-50 overflow-hidden cursor-pointer"
      >
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {hasDiscount && (
            <span className="bg-blue-600 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-md shadow-sm tracking-wider uppercase">
              {discountPercent}% OFF
            </span>
          )}
          {product.badge && (
            <span className="bg-amber-400 text-slate-950 font-bold text-[8px] px-1.5 py-0.5 rounded shadow-xs tracking-tight uppercase">
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={e => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors z-10"
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorited ? 'text-red-500 fill-red-500' : 'text-slate-400'
            }`}
          />
        </button>

        {/* Stock Alert Overlay if Out of stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center p-2">
            <span className="bg-red-600 text-white font-bold text-[10px] uppercase px-2 py-1 rounded tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div
          onClick={() => setSelectedProduct(product)}
          className="cursor-pointer space-y-1"
        >
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="font-bold ml-0.5 text-slate-700">{product.rating}</span>
            </div>
            <span>•</span>
            <span className="text-[10px] text-slate-400 truncate max-w-[80px]">{product.categoryName}</span>
          </div>

          <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {product.name}
          </h4>
        </div>

        {/* Price & Action */}
        <div className="pt-2 mt-auto">
          {/* Stock availability indicator */}
          <div className="mb-1.5">
            {isOutOfStock ? (
              <span className="text-[10px] font-semibold text-red-500">Out of Stock</span>
            ) : isLowStock ? (
              <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5 fill-amber-500" /> Only {product.stock} left!
              </span>
            ) : (
              <span className="text-[10px] font-medium text-emerald-600">In Stock</span>
            )}
          </div>

          <div className="flex items-center justify-between gap-1">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-extrabold text-blue-700 tracking-tight">
                  {currency}{activePrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-[10px] text-slate-400 line-through">
                    {currency}{product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Add Button */}
            <button
              onClick={() => {
                if (!isOutOfStock) {
                  addToCart(product, 1);
                }
              }}
              disabled={isOutOfStock}
              aria-label="Add to cart"
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 hover:bg-blue-700 active:scale-90'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
