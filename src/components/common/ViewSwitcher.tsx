import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Smartphone, Monitor, ShieldCheck, ShoppingBag, Eye, Sparkles } from 'lucide-react';

interface ViewSwitcherProps {
  mobileFrame: boolean;
  setMobileFrame: (val: boolean) => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ mobileFrame, setMobileFrame }) => {
  const { currentView, setCurrentView } = useStore();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 text-xs px-3 py-1.5 transition-all sticky top-0 z-40 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold tracking-wider text-slate-300 uppercase text-[10px] hidden sm:inline">
            Trend Bazar Dual-Interface Engine
          </span>
          <span className="bg-blue-600/30 text-blue-300 px-1.5 py-0.5 rounded text-[10px] font-semibold border border-blue-500/30">
            {currentView === 'customer' ? 'Mobile-First Customer Store' : 'Desktop-First Admin Panel'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Switcher Buttons */}
          <button
            onClick={() => setCurrentView('customer')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
              currentView === 'customer'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Customer Mobile</span>
          </button>

          <button
            onClick={() => setCurrentView('admin')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
              currentView === 'admin'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Laptop Admin Panel</span>
          </button>

          {/* If customer view, give option to view in phone frame or full responsive */}
          {currentView === 'customer' && (
            <button
              onClick={() => setMobileFrame(!mobileFrame)}
              title="Toggle mobile device frame preview"
              className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] border transition-colors ${
                mobileFrame
                  ? 'bg-slate-800 border-blue-500 text-blue-300'
                  : 'bg-transparent border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>{mobileFrame ? 'Phone Frame: ON' : 'Phone Frame: OFF'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
