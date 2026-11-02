import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Tag,
  ShoppingBag,
  Users,
  Boxes,
  TicketPercent,
  CreditCard,
  MessageSquare,
  BarChart3,
  Sliders,
  Image as ImageIcon,
  Truck,
  ShieldCheck,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight,
  Store,
} from 'lucide-react';

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { adminTab, setAdminTab, orders, products, setCurrentView, settings } = useStore();

  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Pending').length;
  const lowStockCount = products.filter(p => p.stock <= 5 && p.isActive).length;

  const menuSections = [
    {
      title: 'Core Business',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined, badgeColor: 'bg-amber-500' },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'add-product', label: 'Add Product', icon: PlusCircle },
        { id: 'categories', label: 'Categories', icon: Tag },
        { id: 'inventory', label: 'Inventory', icon: Boxes, badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined, badgeColor: 'bg-red-500' },
      ],
    },
    {
      title: 'Customers & Growth',
      items: [
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'coupons', label: 'Coupons & Promo', icon: TicketPercent },
        { id: 'reviews', label: 'Reviews & Ratings', icon: MessageSquare },
        { id: 'payments', label: 'COD & Payments', icon: CreditCard },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'Store Settings',
      items: [
        { id: 'customization', label: 'Website Customization', icon: Sliders },
        { id: 'banners', label: 'Homepage Banners', icon: ImageIcon },
        { id: 'delivery', label: 'Delivery Settings', icon: Truck },
        { id: 'admin-users', label: 'Admin Users & Roles', icon: ShieldCheck },
        { id: 'general-settings', label: 'General Settings', icon: Settings },
      ],
    },
  ];

  const handleSelect = (id: string) => {
    setAdminTab(id);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed Desktop / Laptop Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand & Store Header */}
        <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-black">
              TB
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-sm text-white tracking-tight">
                {settings.storeName || 'TREND BAZAR'}
              </span>
              <span className="block text-[10px] font-semibold text-blue-400 uppercase tracking-widest">
                Admin Suite
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 no-scrollbar">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                {section.title}
              </p>

              <div className="space-y-0.5 pt-1">
                {section.items.map(item => {
                  const Icon = item.icon;
                  const isActive = adminTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full ${
                            item.badgeColor || 'bg-blue-500'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Storefront & Logout */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-1.5">
          <button
            onClick={() => setCurrentView('customer')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 hover:bg-emerald-900/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-400" />
              <span>View Customer Store</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400/80" />
          </button>

          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 px-2">
            <span>v2.4 Enterprise</span>
            <span className="flex items-center gap-1 text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live DB
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
