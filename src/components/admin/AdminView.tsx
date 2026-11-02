import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminCustomers } from './AdminCustomers';
import { AdminInventory } from './AdminInventory';
import { AdminCoupons } from './AdminCoupons';
import { AdminPayments } from './AdminPayments';
import { AdminReviews } from './AdminReviews';
import { AdminReports } from './AdminReports';
import { AdminCustomization } from './AdminCustomization';
import { AdminUsers } from './AdminUsers';

export const AdminView: React.FC = () => {
  const { adminTab } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex font-sans selection:bg-blue-600 selection:text-white">
      {/* Desktop Fixed Left Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area (Laptop & Desktop First) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
        {/* Top Header */}
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto animate-in fade-in-50 duration-150">
          {adminTab === 'dashboard' && <AdminDashboard />}
          {adminTab === 'orders' && <AdminOrders />}
          {adminTab === 'products' && <AdminProducts initialAddNew={false} />}
          {adminTab === 'add-product' && <AdminProducts initialAddNew={true} />}
          {adminTab === 'categories' && <AdminProducts initialAddNew={false} />}
          {adminTab === 'customers' && <AdminCustomers />}
          {adminTab === 'inventory' && <AdminInventory />}
          {adminTab === 'coupons' && <AdminCoupons />}
          {adminTab === 'payments' && <AdminPayments />}
          {adminTab === 'reviews' && <AdminReviews />}
          {adminTab === 'reports' && <AdminReports />}
          {(adminTab === 'customization' ||
            adminTab === 'banners' ||
            adminTab === 'delivery' ||
            adminTab === 'general-settings') && <AdminCustomization />}
          {adminTab === 'admin-users' && <AdminUsers />}
        </main>
      </div>
    </div>
  );
};
