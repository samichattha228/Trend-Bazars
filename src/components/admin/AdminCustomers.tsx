import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { User } from '../../types';
import { Search, Users, ShieldAlert, ShieldCheck, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { toggleCustomerBlock, orders, settings, showToast } = useStore();
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = () => {
    setLoading(true);
    fetch('/api/customers?role=customer')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setCustomers(data.users);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleBlock = async (id: string, currentBlocked: boolean) => {
    const res = await toggleCustomerBlock(id, !currentBlocked);
    if (res.success) {
      fetchCustomers();
    }
  };

  const currency = settings.currencySymbol || '$';

  let filtered = customers;
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q)
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Customer Account Management
          </h1>
          <p className="text-xs text-slate-500">
            View registered shoppers, order history, contact details, and account security
          </p>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          Total Customers: {customers.length}
        </span>
      </div>

      {/* Search */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs max-w-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search customer by name, email, phone..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Customer Desktop Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(c => {
                const customerOrders = orders.filter(
                  o => o.customerId === c.id || o.email.toLowerCase() === c.email.toLowerCase()
                );
                const totalSpent = customerOrders.reduce((sum, o) => sum + o.totalAmount, 0);

                return (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{c.name}</p>
                          <p className="text-[10px] text-slate-400">{c.addresses[0]?.city || 'India'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {c.email}
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-mono">
                      {c.phone || 'N/A'}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800">{customerOrders.length} orders</span>
                      <p className="text-[10px] text-emerald-600 font-bold">
                        {currency}{totalSpent.toFixed(2)} spent
                      </p>
                    </td>

                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {new Date(c.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3 px-4">
                      {c.isBlocked ? (
                        <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase flex items-center gap-1 w-fit">
                          <ShieldAlert className="w-3 h-3" /> Suspended
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase flex items-center gap-1 w-fit">
                          <ShieldCheck className="w-3 h-3" /> Active
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleBlock(c.id, c.isBlocked)}
                        className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-colors ${
                          c.isBlocked
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-700 hover:bg-red-100'
                        }`}
                      >
                        {c.isBlocked ? 'Unblock Account' : 'Block Account'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
