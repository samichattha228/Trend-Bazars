import React, { useState, useEffect } from 'react';
import { Review } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Star, MessageSquare, CheckCircle2, Trash2 } from 'lucide-react';

export const AdminReviews: React.FC = () => {
  const { products } = useStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    setLoading(true);
    fetch('/api/reviews')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setReviews(data.reviews);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const getProductName = (id: string) => {
    const p = products.find(prod => prod.id === id);
    return p ? p.name : 'Product';
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Customer Reviews & Feedback
          </h1>
          <p className="text-xs text-slate-500">
            Moderate ratings, testimonials, and verified customer purchases
          </p>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          Total Reviews: {reviews.length}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Reviewer</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Comment</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Verified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reviews.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 max-w-xs truncate">
                    {getProductName(r.productId)}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {r.userName}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-md">
                    "{r.comment}"
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[10px] flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
