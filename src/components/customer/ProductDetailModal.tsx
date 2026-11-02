import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Review } from '../../types';
import {
  X,
  Star,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Heart,
  Plus,
  Minus,
  MessageSquare,
  Send,
  CheckCircle2,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCheckoutOpen,
    settings,
    currentUser,
    showToast,
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // New review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const product = selectedProduct;

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setQuantity(1);

      // Default variant selection
      const initial: Record<string, string> = {};
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach(v => {
          if (v.options && v.options.length > 0) {
            initial[v.name] = v.options[0];
          }
        });
      }
      setSelectedVariants(initial);

      // Fetch reviews
      setLoadingReviews(true);
      fetch(`/api/reviews?productId=${product.id}`)
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            setReviews(data.reviews);
          }
        })
        .catch(console.error)
        .finally(() => setLoadingReviews(false));
    }
  }, [product]);

  if (!product) return null;

  const currency = settings.currencySymbol || '$';
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const activePrice = hasDiscount ? product.discountPrice : product.price;
  const isOutOfStock = product.stock <= 0;
  const isFavorited = isInWishlist(product.id);

  const variantString = Object.entries(selectedVariants)
    .map(([k, v]) => `${k}: ${v}`)
    .join(' / ');

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, variantString || undefined);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, variantString || undefined);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userName: currentUser ? currentUser.name : 'Verified Customer',
          rating: newReviewRating,
          comment: newReviewComment.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => [data.review, ...prev]);
        setNewReviewComment('');
        setShowReviewForm(false);
        showToast('Review submitted successfully! Thank you.');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setSelectedProduct(null)}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col z-10 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
        {/* Sticky Modal Header */}
        <div className="flex items-center justify-between p-3.5 border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              {product.categoryName}
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-500 font-mono px-1.5 py-0.5 rounded">
              SKU: {product.sku}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleWishlist(product.id)}
              className="p-1.5 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-50"
            >
              <Heart
                className={`w-5 h-5 ${isFavorited ? 'text-red-500 fill-red-500' : ''}`}
              />
            </button>
            <button
              onClick={() => setSelectedProduct(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4 pb-24">
          {/* Mobile Image Gallery */}
          <div className="space-y-2">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {hasDiscount && (
                <div className="absolute top-3 left-3 bg-blue-600 text-white font-extrabold text-xs px-2 py-1 rounded-lg shadow-md uppercase tracking-wider">
                  {discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      idx === activeImageIndex
                        ? 'border-blue-600 ring-2 ring-blue-500/20 scale-95'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Price */}
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {product.name}
            </h2>

            {/* Rating & Stock */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-slate-400">({product.reviewsCount} reviews)</span>
              </div>

              <div>
                {isOutOfStock ? (
                  <span className="bg-red-50 text-red-600 font-bold px-2 py-1 rounded-md text-[11px]">
                    Out of Stock
                  </span>
                ) : product.stock <= 5 ? (
                  <span className="bg-amber-50 text-amber-700 font-bold px-2 py-1 rounded-md text-[11px] flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-amber-500" /> Only {product.stock} units left!
                  </span>
                ) : (
                  <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded-md text-[11px]">
                    ✓ In Stock ({product.stock} available)
                  </span>
                )}
              </div>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-2xl font-black text-blue-700 tracking-tight">
                {currency}{activePrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-slate-400 line-through">
                    {currency}{product.price.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Save {currency}{(product.price - activePrice).toFixed(2)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
            <p className="font-semibold text-slate-800">Product Highlights</p>
            <p>{product.description}</p>
          </div>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3 border-t border-slate-100 pt-3">
              {product.variants.map(variant => (
                <div key={variant.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">{variant.name}:</span>
                    <span className="text-blue-600 font-medium">{selectedVariants[variant.name]}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map(option => {
                      const isSelected = selectedVariants[variant.name] === option;
                      return (
                        <button
                          key={option}
                          onClick={() =>
                            setSelectedVariants(prev => ({ ...prev, [variant.name]: option }))
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity Stepper */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-xs font-bold text-slate-700">Quantity</span>
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl p-1 bg-slate-50">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-xs font-bold text-slate-800">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
                className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Trust & Delivery Badges */}
          <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
            <div className="bg-blue-50/50 p-2 rounded-xl text-center flex flex-col items-center">
              <Truck className="w-4 h-4 text-blue-600 mb-1" />
              <span className="text-[10px] font-bold text-slate-800">Fast Delivery</span>
              <span className="text-[9px] text-slate-500">2-4 Business Days</span>
            </div>
            <div className="bg-emerald-50/50 p-2 rounded-xl text-center flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
              <span className="text-[10px] font-bold text-slate-800">COD Available</span>
              <span className="text-[9px] text-slate-500">Pay at Doorstep</span>
            </div>
            <div className="bg-amber-50/50 p-2 rounded-xl text-center flex flex-col items-center">
              <RotateCcw className="w-4 h-4 text-amber-600 mb-1" />
              <span className="text-[10px] font-bold text-slate-800">Easy Return</span>
              <span className="text-[9px] text-slate-500">7 Days Hassle-Free</span>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="border-t border-slate-100 pt-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-slate-800">
                  Customer Reviews ({reviews.length})
                </h4>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                {showReviewForm ? 'Cancel' : '+ Write Review'}
              </button>
            </div>

            {/* Write Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2.5 animate-in fade-in-50">
                <p className="text-xs font-bold text-slate-800">Rate this product</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= newReviewRating
                            ? 'text-amber-500 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-600 ml-2">
                    {newReviewRating} out of 5
                  </span>
                </div>

                <textarea
                  value={newReviewComment}
                  onChange={e => setNewReviewComment(e.target.value)}
                  placeholder="Share details of your experience with this item..."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none bg-white"
                  required
                />

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingReview ? 'Submitting...' : 'Post Customer Review'}</span>
                </button>
              </form>
            )}

            {/* Reviews List */}
            {loadingReviews ? (
              <p className="text-xs text-slate-400">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-2">
                {reviews.map(r => (
                  <div key={r.id} className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">{r.userName}</span>
                        {r.verifiedPurchase && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-semibold px-1 rounded flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sticky Mobile Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-100 flex items-center gap-2 z-20">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 active:scale-95'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-blue-600" />
            <span>Add to Cart</span>
          </button>

          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
              isOutOfStock
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-blue-600/30 hover:from-blue-800 hover:to-blue-700 active:scale-95'
            }`}
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Buy Now (COD)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
