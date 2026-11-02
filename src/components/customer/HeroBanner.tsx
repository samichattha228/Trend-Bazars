import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { settings, setCustomerTab, setSelectedCategory } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = settings.banners && settings.banners.length > 0 ? settings.banners : [
    {
      id: 'ban_default',
      title: 'Mega Season Super Sale',
      subtitle: 'Flat 50% - 70% Off on Latest Streetwear & Gadgets',
      badge: 'LIMITED TIME DEAL',
      ctaText: 'Shop Trending Now',
      link: '/category/electronics',
      imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
      bgColor: 'from-blue-700 via-indigo-600 to-blue-900',
    },
  ];

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  const banner = banners[currentSlide] || banners[0];

  const handleCtaClick = () => {
    setSelectedCategory('all');
    setCustomerTab('categories');
  };

  return (
    <div className="relative overflow-hidden rounded-2xl mx-3 my-2 shadow-lg shadow-blue-900/10 border border-blue-100/50">
      <div className={`relative min-h-[190px] p-5 flex flex-col justify-end text-white overflow-hidden bg-gradient-to-br ${banner.bgColor || 'from-blue-800 to-indigo-900'}`}>
        {/* Background image overlay */}
        {banner.imageUrl && (
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="absolute inset-0 w-full h-full object-cover object-center mix-blend-overlay opacity-35 scale-105 transition-transform duration-700 ease-out"
          />
        )}

        {/* Gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-transparent" />

        <div className="relative z-10 space-y-1.5 max-w-sm">
          {banner.badge && (
            <div className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full tracking-wider shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>{banner.badge}</span>
            </div>
          )}

          <h2 className="text-xl font-extrabold tracking-tight text-white leading-tight drop-shadow-sm">
            {banner.title}
          </h2>

          <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
            {banner.subtitle}
          </p>

          <div className="pt-2">
            <button
              onClick={handleCtaClick}
              className="inline-flex items-center gap-2 bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs px-4 py-2 rounded-xl shadow-md active:scale-95 transition-all"
            >
              <span>{banner.ctaText || 'Shop Now'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
            </button>
          </div>
        </div>

        {/* Slide Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all rounded-full ${
                  idx === currentSlide
                    ? 'w-5 h-1.5 bg-white'
                    : 'w-1.5 h-1.5 bg-white/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
