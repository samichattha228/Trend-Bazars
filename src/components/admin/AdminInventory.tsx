import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { InventoryLog } from '../../types';
import {
  Boxes,
  AlertTriangle,
  Plus,
  Minus,
  RotateCcw,
  History,
  Search,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const { products, saveProduct, showToast } = useStore();
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = () => {
    setLoadingLogs(true);
    fetch('/api/inventory')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setLogs(data.logs);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingLogs(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const adjustStock = async (productId: string, diff: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    const newStock = Math.max(0, prod.stock + diff);
    await saveProduct({ ...prod, stock: newStock });
    fetchLogs();
  };

  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5);
  const outOfStock = products.filter(p => p.stock === 0);

  let filtered = products;
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Inventory & Stock Control
          </h1>
          <p className="text-xs text-slate-500">
            Real-time warehouse stock ledger, low-stock threshold alerts, and instant adjustments
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-amber-50 text-amber-800 font-bold px-3 py-1.5 rounded-xl border border-amber-200">
            ⚠️ {lowStock.length} Low Stock
          </span>
          <span className="bg-red-50 text-red-800 font-bold px-3 py-1.5 rounded-xl border border-red-200">
            ⛔ {outOfStock.length} Out of Stock
          </span>
        </div>
      </div>

      {/* Stock Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900">Live Product Stock Levels</h3>
          <div className="w-64">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search product inventory..."
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => {
                const isOut = p.stock === 0;
                const isLow = p.stock > 0 && p.stock <= 5;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-9 h-9 object-cover rounded-lg border border-slate-100 bg-slate-50 shrink-0"
                        />
                        <span className="font-bold text-slate-900 truncate max-w-xs">{p.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500">{p.sku}</td>

                    <td className="py-3 px-4 text-slate-600">{p.categoryName}</td>

                    <td className="py-3 px-4 font-black text-sm text-slate-900">
                      {p.stock} units
                    </td>

                    <td className="py-3 px-4">
                      {isOut ? (
                        <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                          Optimal
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => adjustStock(p.id, -1)}
                          disabled={p.stock <= 0}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs disabled:opacity-40"
                          title="Reduce 1 unit"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => adjustStock(p.id, +5)}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs"
                          title="Restock +5 units"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => adjustStock(p.id, +20)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-2xs"
                          title="Restock +20 units"
                        >
                          +20
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Movement Audit Log */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-blue-600" />
          <h3 className="font-extrabold text-sm text-slate-900">
            Recent Inventory Movement Audit Logs
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          {logs.slice(0, 8).map(log => {
            const isPositive = log.change > 0;
            return (
              <div
                key={log.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isPositive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">{log.productName}</span>
                    <p className="text-[11px] text-slate-500">{log.notes}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-mono font-bold text-xs ${
                      isPositive ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {isPositive ? `+${log.change}` : log.change} units
                  </span>
                  <p className="text-[10px] text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
