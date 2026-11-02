import React from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useStore();

  const rawNumber = settings.whatsappNumber || '919876543210';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanNumber}?text=Hi%20Trend%20Bazar%20Support,%20I%20have%20an%20inquiry%20regarding%20products%20and%20orders.`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-18 right-4 z-30 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white px-3.5 py-2.5 rounded-full shadow-lg shadow-emerald-500/30 transition-all font-bold text-xs"
    >
      <MessageCircle className="w-4 h-4 fill-white" />
      <span className="hidden xs:inline">WhatsApp Help</span>
    </a>
  );
};
