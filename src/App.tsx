import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { CustomerView } from './components/customer/CustomerView';
import { AdminView } from './components/admin/AdminView';
import { ViewSwitcher } from './components/common/ViewSwitcher';
import { Toast } from './components/common/Toast';

const AppContent: React.FC = () => {
  const { currentView } = useStore();
  const [mobileFrame, setMobileFrame] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Switcher Bar allowing easy switching between Mobile Customer view and Desktop Admin Panel */}
      <ViewSwitcher mobileFrame={mobileFrame} setMobileFrame={setMobileFrame} />

      {/* Main View Router */}
      <div className="flex-1">
        {currentView === 'customer' ? (
          <CustomerView mobileFrame={mobileFrame} />
        ) : (
          <AdminView />
        )}
      </div>

      {/* Toast notifications */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
