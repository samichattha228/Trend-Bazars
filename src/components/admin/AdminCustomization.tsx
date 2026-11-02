import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Banner, WebsiteSettings } from '../../types';
import {
  Sliders,
  Save,
  MessageCircle,
  Truck,
  Image as ImageIcon,
  Share2,
  Phone,
  Mail,
  CheckCircle2,
  Plus,
  Trash2,
} from 'lucide-react';

export const AdminCustomization: React.FC = () => {
  const { settings, updateSettings, showToast } = useStore();

  const [storeName, setStoreName] = useState(settings.storeName || 'TREND BAZAR');
  const [tagline, setTagline] = useState(settings.tagline || '');
  const [announcementText, setAnnouncementText] = useState(settings.announcementText || '');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '919876543210');
  const [supportPhone, setSupportPhone] = useState(settings.supportPhone || '+91 98765 43210');
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail || 'support@trendbazar.com');
  const [standardDeliveryCharge, setStandardDeliveryCharge] = useState<number | string>(
    settings.standardDeliveryCharge ?? 4.99
  );
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState<number | string>(
    settings.freeDeliveryThreshold ?? 49.0
  );
  const [banners, setBanners] = useState<Banner[]>(settings.banners || []);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({
        storeName: storeName.trim(),
        tagline: tagline.trim(),
        announcementText: announcementText.trim(),
        whatsappNumber: whatsappNumber.trim(),
        supportPhone: supportPhone.trim(),
        supportEmail: supportEmail.trim(),
        standardDeliveryCharge: Number(standardDeliveryCharge) || 0,
        freeDeliveryThreshold: Number(freeDeliveryThreshold) || 0,
        banners,
      });
    } finally {
      setSaving(false);
    }
  };

  const addBanner = () => {
    const newBanner: Banner = {
      id: `ban_${Date.now()}`,
      title: 'Exciting New Arrivals',
      subtitle: 'Exclusive discounts on premier collections',
      badge: 'SPECIAL OFFER',
      ctaText: 'Shop Now',
      link: '/category/electronics',
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
      bgColor: 'from-blue-700 via-indigo-600 to-blue-900',
    };
    setBanners(prev => [...prev, newBanner]);
  };

  const removeBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  const updateBannerField = (id: string, field: keyof Banner, val: string) => {
    setBanners(prev =>
      prev.map(b => (b.id === id ? { ...b, [field]: val } : b))
    );
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Live Storefront Customizer
          </h1>
          <p className="text-xs text-slate-500">
            Edit branding, announcement banners, delivery rules, and WhatsApp support live without code
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Publishing Changes...' : 'Publish to Live Store'}</span>
        </button>
      </div>

      {/* Brand Identity & Announcement */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span>1. Brand Identity & Global Announcements</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Store Name
            </label>
            <input
              type="text"
              value={storeName}
              onChange={e => setStoreName(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Store Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Top Announcement Ticker (Displayed across mobile storefront header)
            </label>
            <textarea
              rows={2}
              value={announcementText}
              onChange={e => setAnnouncementText(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Delivery Charges & Thresholds */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <Truck className="w-4 h-4 text-blue-600" />
          <span>2. Shipping & Delivery Rules</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Standard COD Shipping Fee ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={standardDeliveryCharge}
              onChange={e => setStandardDeliveryCharge(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Free Delivery Order Threshold ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={freeDeliveryThreshold}
              onChange={e => setFreeDeliveryThreshold(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* WhatsApp & Contact Details */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>3. WhatsApp Customer Support & Contact Channels</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              WhatsApp Support Number (Country Code + Phone)
            </label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={e => setWhatsappNumber(e.target.value)}
              placeholder="e.g. 919876543210"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none font-mono"
            />
            <p className="text-[10px] text-slate-400 mt-1">Directly opens customer WhatsApp chat</p>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Customer Support Helpline
            </label>
            <input
              type="text"
              value={supportPhone}
              onChange={e => setSupportPhone(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Support Email Address
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={e => setSupportEmail(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Hero Carousel Banners */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <span>4. Homepage Hero Banners ({banners.length})</span>
          </h3>
          <button
            type="button"
            onClick={addBanner}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl font-bold text-xs hover:bg-blue-100"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Banner</span>
          </button>
        </div>

        <div className="space-y-3">
          {banners.map((ban, idx) => (
            <div
              key={ban.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Banner #{idx + 1}</span>
                {banners.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBanner(ban.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Banner Title</label>
                  <input
                    type="text"
                    value={ban.title}
                    onChange={e => updateBannerField(ban.id, 'title', e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={ban.badge}
                    onChange={e => updateBannerField(ban.id, 'badge', e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={ban.subtitle}
                    onChange={e => updateBannerField(ban.id, 'subtitle', e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={ban.imageUrl}
                    onChange={e => updateBannerField(ban.id, 'imageUrl', e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white font-mono"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
