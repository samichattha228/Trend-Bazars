import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Smartphone,
  Headphones,
  Shirt,
  Footprints,
  Watch,
  Lamp,
  Tag,
  Sparkles,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Smartphone,
  Headphones,
  Shirt,
  Footprints,
  Watch,
  Lamp,
  Tag,
};

export const CategoryList: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory, setCustomerTab } = useStore();

  const handleSelect = (catId: string) => {
    setSelectedCategory(catId);
    setCustomerTab('categories');
  };

  return (
    <div className="py-2">
      <div className="flex items-center justify-between px-3.5 mb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Featured Categories
        </h3>
        <button
          onClick={() => {
            setSelectedCategory('all');
            setCustomerTab('categories');
          }}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          See All
        </button>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar px-3.5 pb-1">
        {/* All Products pill */}
        <button
          onClick={() => handleSelect('all')}
          className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
              : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>All</span>
        </button>

        {categories.map(cat => {
          const Icon = ICON_MAP[cat.icon] || Tag;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-blue-600" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
