import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, ShieldAlert, Key, UserCheck, Lock, CheckCircle2 } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { adminUser } = useStore();

  const adminRoles = [
    {
      name: 'Owner (Super Admin)',
      email: 'admin@trendbazar.com',
      role: 'Owner',
      status: 'Active',
      permissions: [
        'Full Database Read & Write',
        'Financial Revenue & COD Settlement',
        'Website Customization & Banners',
        'Product & Catalog Creation/Deletion',
        'Order Fulfillment & Status Editing',
        'Customer Account Suspension',
      ],
      badge: 'Owner Access',
      isCurrentUser: true,
    },
    {
      name: 'Fulfillment Dispatch Manager',
      email: 'logistics@trendbazar.com',
      role: 'Staff',
      status: 'Active',
      permissions: [
        'Order Processing & Tracking AWBs',
        'Stock Verification & Inventory Restock',
        'Customer Address Verification',
      ],
      badge: 'Logistics Staff',
      isCurrentUser: false,
    },
    {
      name: 'Customer Support Representative',
      email: 'support@trendbazar.com',
      role: 'Support',
      status: 'Active',
      permissions: [
        'Customer Reviews Moderation',
        'Order Status Tracking',
        'Customer Inquiries & WhatsApp Assistance',
      ],
      badge: 'Support Staff',
      isCurrentUser: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Admin Access & Role Permissions (RBAC)
          </h1>
          <p className="text-xs text-slate-500">
            Enterprise role-based security policies, staff accounts, and administrative authority
          </p>
        </div>

        <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-xl border border-blue-200 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>RLS & Token Verification Active</span>
        </span>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {adminRoles.map((role, idx) => (
          <div
            key={idx}
            className={`bg-white p-5 rounded-2xl border shadow-2xs space-y-4 ${
              role.isCurrentUser ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  role.role === 'Owner'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {role.badge}
              </span>
              {role.isCurrentUser && (
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Logged In
                </span>
              )}
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-slate-900">{role.name}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{role.email}</p>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
              <p className="font-bold text-[10px] uppercase text-slate-400">Granted Privileges</p>
              <ul className="space-y-1.5">
                {role.permissions.map((perm, pIdx) => (
                  <li key={pIdx} className="flex items-center gap-2 text-slate-700 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{perm}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Security Architecture Notice */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md space-y-2">
        <div className="flex items-center gap-2 text-amber-400">
          <Lock className="w-4 h-4" />
          <h4 className="font-bold text-xs uppercase tracking-wider">
            Protected Administration Boundary
          </h4>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Admin API endpoints (`/api/products`, `/api/orders/:id/status`, `/api/settings`) enforce server-side validation. Sensitive operations like price modifications and database overrides require elevated administrative roles. Supabase PostgreSQL Row Level Security (RLS) policies are maintained in `supabase-schema.sql`.
        </p>
      </div>
    </div>
  );
};
