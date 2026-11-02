import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Star,
  Boxes,
  Zap,
  Filter,
  Image as ImageIcon,
  Save,
  X,
} from 'lucide-react';

interface AdminProductsProps {
  initialAddNew?: boolean;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({ initialAddNew }) => {
  const { products, categories, saveProduct, deleteProduct, settings, showToast } = useStore();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(initialAddNew || false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat_electronics');
  const [price, setPrice] = useState<number | string>('');
  const [discountPrice, setDiscountPrice] = useState<number | string>('');
  const [stock, setStock] = useState<number | string>('10');
  const [description, setDescription] = useState('');
  const [imagesInput, setImagesInput] = useState('');
  const [badge, setBadge] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const currency = settings.currencySymbol || '$';

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setSku(`TB-${Math.floor(1000 + Math.random() * 9000)}`);
    setCategoryId(categories[0]?.id || 'cat_electronics');
    setPrice('');
    setDiscountPrice('');
    setStock('15');
    setDescription('');
    setImagesInput('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80');
    setBadge('NEW');
    setIsFeatured(false);
    setIsTrending(false);
    setIsBestSeller(false);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setCategoryId(p.categoryId);
    setPrice(p.price);
    setDiscountPrice(p.discountPrice || '');
    setStock(p.stock);
    setDescription(p.description);
    setImagesInput(p.images.join('\n'));
    setBadge(p.badge || '');
    setIsFeatured(p.isFeatured);
    setIsTrending(p.isTrending);
    setIsBestSeller(p.isBestSeller);
    setIsActive(p.isActive);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price === '') {
      showToast('Name and price are required', 'error');
      return;
    }

    setSaving(true);
    try {
      const selectedCat = categories.find(c => c.id === categoryId);
      const imagesList = imagesInput
        .split('\n')
        .map(url => url.trim())
        .filter(url => Boolean(url));

      const payload = {
        id: editingProduct?.id,
        name: name.trim(),
        sku: sku.trim(),
        categoryId,
        categoryName: selectedCat ? selectedCat.name : 'General',
        price: Number(price),
        discountPrice: discountPrice !== '' ? Number(discountPrice) : Number(price),
        stock: Number(stock) || 0,
        description: description.trim(),
        images: imagesList.length > 0 ? imagesList : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
        badge: badge.trim(),
        isFeatured,
        isTrending,
        isBestSeller,
        isActive,
      };

      const result = await saveProduct(payload);
      if (result.success) {
        setIsModalOpen(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, prodName: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${prodName}" from catalog?`)) {
      await deleteProduct(id);
    }
  };

  // Filter products
  let filtered = products;
  if (categoryFilter !== 'all') {
    filtered = filtered.filter(p => p.categoryId === categoryFilter);
  }
  if (stockFilter === 'low') {
    filtered = filtered.filter(p => p.stock > 0 && p.stock <= 5);
  } else if (stockFilter === 'out') {
    filtered = filtered.filter(p => p.stock === 0);
  }
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
    );
  }

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Product Catalog Management
          </h1>
          <p className="text-xs text-slate-500">
            Add, update inventory, adjust prices, and control storefront availability
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search box */}
          <div className="relative min-w-[200px] flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search product name, SKU..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium text-slate-700"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={e => setStockFilter(e.target.value as any)}
            className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium text-slate-700"
          >
            <option value="all">All Stock Status</option>
            <option value="low">Low Stock (≤ 5 units)</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        <span className="text-xs font-bold text-slate-500">
          Showing {filtered.length} of {products.length} products
        </span>
      </div>

      {/* Products Table (Desktop First) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Discount Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => {
                const isOutOfStock = p.stock <= 0;
                const isLowStock = p.stock > 0 && p.stock <= 5;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Product image & name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-11 h-11 object-cover rounded-xl border border-slate-100 bg-slate-50 shrink-0"
                        />
                        <div className="max-w-xs">
                          <h4 className="font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                            <span className="flex items-center text-amber-500">
                              <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                              {p.rating}
                            </span>
                            <span>•</span>
                            <span>{p.reviewsCount} reviews</span>
                            {p.badge && (
                              <span className="bg-amber-100 text-amber-800 px-1 rounded font-bold">
                                {p.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3 px-4 font-mono font-medium text-slate-600">
                      {p.sku}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg font-medium text-[11px]">
                        {p.categoryName}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 text-slate-500">
                      {currency}{p.price.toFixed(2)}
                    </td>

                    {/* Discount Price */}
                    <td className="py-3 px-4 font-black text-blue-700">
                      {currency}{p.discountPrice.toFixed(2)}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4">
                      {isOutOfStock ? (
                        <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1 w-fit">
                          <Zap className="w-3 h-3 fill-amber-500" />
                          {p.stock} units (Low)
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          {p.stock} in stock
                        </span>
                      )}
                    </td>

                    {/* Active */}
                    <td className="py-3 px-4">
                      {p.isActive ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="text-slate-400 font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Disabled
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl max-h-[90vh] flex flex-col z-10 overflow-hidden animate-in fade-in-50">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product to Store'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="overflow-y-auto p-5 space-y-4 flex-1">
              {/* Name & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="e.g. Pro Wireless ANC Earbuds"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">SKU</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={e => setSku(e.target.value)}
                    placeholder="TB-AUD-01"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-slate-50 focus:bg-white font-mono"
                  />
                </div>
              </div>

              {/* Category, Prices, Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-slate-50 focus:bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Original Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    required
                    placeholder="89.99"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-slate-50 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Discount Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={discountPrice}
                    onChange={e => setDiscountPrice(e.target.value)}
                    placeholder="49.99"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-slate-50 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                    required
                    placeholder="25"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-slate-50 focus:bg-white font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Key features, specifications, battery life, material..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-slate-50 focus:bg-white"
                />
              </div>

              {/* Images URLs */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Image URLs (1 per line)
                </label>
                <textarea
                  rows={2}
                  value={imagesInput}
                  onChange={e => setImagesInput(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-slate-50 focus:bg-white font-mono"
                />
              </div>

              {/* Badges & Checkbox Flags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Product Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={e => setBadge(e.target.value)}
                    placeholder="e.g. HOT DEAL, 40% OFF, BESTSELLER"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="flex flex-wrap gap-4 items-center pt-5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={e => setIsFeatured(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Featured</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isTrending}
                      onChange={e => setIsTrending(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Trending</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isBestSeller}
                      onChange={e => setIsBestSeller(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Best Seller</span>
                  </label>

                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={e => setIsActive(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Active in Store</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Publish Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
