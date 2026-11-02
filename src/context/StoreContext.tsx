import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  Order,
  Coupon,
  WebsiteSettings,
  CartItem,
  User,
  DashboardStats,
} from '../types';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface StoreContextType {
  // Navigation / Views
  currentView: 'customer' | 'admin';
  setCurrentView: (view: 'customer' | 'admin') => void;
  customerTab: 'home' | 'categories' | 'search' | 'wishlist' | 'account';
  setCustomerTab: (tab: 'home' | 'categories' | 'search' | 'wishlist' | 'account') => void;
  adminTab: string;
  setAdminTab: (tab: string) => void;

  // Data
  products: Product[];
  categories: Category[];
  settings: WebsiteSettings;
  coupons: Coupon[];
  orders: Order[];
  stats: DashboardStats | null;
  loading: boolean;
  refreshData: () => Promise<void>;

  // Customer actions & Cart
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  removeFromCart: (productId: string, variant?: string) => void;
  updateCartQty: (productId: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // UI Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  trackingOrder: Order | null;
  setTrackingOrder: (o: Order | null) => void;

  // Customer Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;

  // User & Auth
  currentUser: User | null;
  setCurrentUser: (u: User | null) => void;
  loginUser: (email: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logoutUser: () => void;

  // Orders
  placeOrder: (payload: {
    customerName: string;
    phone: string;
    email: string;
    city: string;
    address: string;
    postalCode: string;
    notes?: string;
    couponCode?: string | null;
  }) => Promise<{ success: boolean; order?: Order; error?: string }>;
  cancelCustomerOrder: (orderId: string, reason?: string) => Promise<{ success: boolean; error?: string }>;

  // Admin actions
  adminUser: User | null;
  setAdminUser: (u: User | null) => void;
  saveProduct: (productData: Partial<Product> & { name: string; price: number }) => Promise<{ success: boolean; product?: Product; error?: string }>;
  deleteProduct: (id: string) => Promise<boolean>;
  updateOrderStatus: (
    orderId: string,
    status: Order['orderStatus'],
    options?: { trackingNumber?: string; courier?: string; paymentStatus?: Order['paymentStatus']; note?: string }
  ) => Promise<{ success: boolean; order?: Order; error?: string }>;
  saveCoupon: (couponData: Partial<Coupon> & { code: string; discountValue: number }) => Promise<{ success: boolean; coupon?: Coupon; error?: string }>;
  deleteCoupon: (id: string) => Promise<boolean>;
  updateSettings: (newSettings: Partial<WebsiteSettings>) => Promise<{ success: boolean; settings?: WebsiteSettings; error?: string }>;
  toggleCustomerBlock: (customerId: string, blocked?: boolean) => Promise<{ success: boolean; user?: User; error?: string }>;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const DEFAULT_SETTINGS: WebsiteSettings = {
  storeName: 'TREND BAZAR',
  tagline: 'Your Premier Mobile & Online Shopping Destination',
  logoText: 'TREND BAZAR',
  logoUrl: '',
  supportPhone: '+91 98765 43210',
  whatsappNumber: '919876543210',
  supportEmail: 'support@trendbazar.com',
  announcementText: '🔥 MEGA FESTIVAL SALE: Extra 20% OFF using code TREND20 | Free Cash on Delivery on orders over $49!',
  currencySymbol: '$',
  standardDeliveryCharge: 4.99,
  freeDeliveryThreshold: 49.00,
  banners: [],
  socialLinks: {
    instagram: 'https://instagram.com/trendbazar',
    facebook: 'https://facebook.com/trendbazar',
    twitter: 'https://twitter.com/trendbazar',
    youtube: 'https://youtube.com/@trendbazar',
  },
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'customer' | 'admin'>('customer');
  const [customerTab, setCustomerTab] = useState<'home' | 'categories' | 'search' | 'wishlist' | 'account'>('home');
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_SETTINGS);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Cart & Wishlist persisted in localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('tb_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tb_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User accounts
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('tb_user');
      return saved
        ? JSON.parse(saved)
        : {
            id: 'usr_cust1',
            name: 'Rahul Sharma',
            email: 'rahul.sharma@example.com',
            phone: '+91 98234 11223',
            role: 'customer',
            isBlocked: false,
            addresses: [
              {
                id: 'addr_1',
                name: 'Rahul Sharma',
                phone: '+91 98234 11223',
                address: 'Flat 402, Skyline Residency, Bandra West',
                city: 'Mumbai',
                postalCode: '400050',
                isDefault: true,
              },
            ],
            createdAt: '2026-03-15T11:20:00.000Z',
          };
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState<User | null>({
    id: 'usr_admin',
    name: 'Trend Bazar Admin',
    email: 'admin@trendbazar.com',
    phone: '+91 98765 00000',
    role: 'admin',
    isBlocked: false,
    addresses: [],
    createdAt: '2026-01-10T10:00:00.000Z',
  });

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync cart & wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tb_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('tb_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('tb_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('tb_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Fetch initial data
  const refreshData = async () => {
    try {
      const [prodRes, catRes, setRes, cpnRes, ordRes, statsRes] = await Promise.all([
        fetch('/api/products').then(r => r.json()),
        fetch('/api/categories').then(r => r.json()),
        fetch('/api/settings').then(r => r.json()),
        fetch('/api/coupons').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/stats').then(r => r.json()),
      ]);

      if (prodRes.success) setProducts(prodRes.products);
      if (catRes.success) setCategories(catRes.categories);
      if (setRes.success) setSettings(setRes.settings);
      if (cpnRes.success) setCoupons(cpnRes.coupons);
      if (ordRes.success) setOrders(ordRes.orders);
      if (statsRes.success) setStats(statsRes.stats);
    } catch (err) {
      console.error('Error fetching data from API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Cart operations
  const addToCart = (product: Product, quantity = 1, variant?: string) => {
    if (product.stock <= 0) {
      showToast(`Sorry, "${product.name}" is currently out of stock.`, 'error');
      return;
    }

    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedVariant === variant
      );
      if (existingIndex >= 0) {
        const currentQty = prev[existingIndex].quantity;
        const newQty = currentQty + quantity;
        if (newQty > product.stock) {
          showToast(`Cannot add more. Only ${product.stock} units available in stock.`, 'error');
          return prev;
        }
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        showToast(`Added another "${product.name}" to cart!`);
        return updated;
      } else {
        showToast(`"${product.name}" added to cart!`);
        return [...prev, { product, quantity, selectedVariant: variant }];
      }
    });
  };

  const removeFromCart = (productId: string, variant?: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedVariant === variant)));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQty = (productId: string, quantity: number, variant?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId && item.selectedVariant === variant) {
          if (quantity > item.product.stock) {
            showToast(`Maximum available stock is ${item.product.stock}`, 'error');
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to wishlist! ❤️');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Auth operations
  const loginUser = async (email: string, name?: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.error || 'Login failed', 'error');
        return { success: false, error: data.error };
      }
      setCurrentUser(data.user);
      showToast(`Welcome back, ${data.user.name}!`);
      return { success: true };
    } catch (err: any) {
      showToast(err.message || 'Login error', 'error');
      return { success: false, error: err.message };
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    showToast('Logged out successfully', 'info');
  };

  // Place Order
  const placeOrder = async (payload: {
    customerName: string;
    phone: string;
    email: string;
    city: string;
    address: string;
    postalCode: string;
    notes?: string;
    couponCode?: string | null;
  }) => {
    if (cart.length === 0) {
      showToast('Your shopping cart is empty!', 'error');
      return { success: false, error: 'Cart is empty' };
    }

    try {
      const orderPayload = {
        ...payload,
        customerId: currentUser?.id || null,
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          variant: item.selectedVariant,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!data.success) {
        showToast(data.error || 'Failed to place order', 'error');
        return { success: false, error: data.error };
      }

      // Success
      clearCart();
      await refreshData();
      showToast(`🎉 Order ${data.order.orderNumber} placed successfully!`, 'success');
      return { success: true, order: data.order };
    } catch (err: any) {
      showToast(err.message || 'Network error while placing order', 'error');
      return { success: false, error: err.message };
    }
  };

  const cancelCustomerOrder = async (orderId: string, reason?: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.error || 'Unable to cancel order', 'error');
        return { success: false, error: data.error };
      }
      showToast('Order cancelled. Refund/release processed.', 'info');
      await refreshData();
      return { success: true };
    } catch (err: any) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  // Admin Actions
  const saveProduct = async (productData: Partial<Product> & { name: string; price: number }) => {
    try {
      const isEdit = Boolean(productData.id);
      const url = isEdit ? `/api/products/${productData.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.error || 'Failed to save product', 'error');
        return { success: false, error: data.error };
      }
      showToast(isEdit ? 'Product updated successfully' : 'New product published to store!');
      await refreshData();
      return { success: true, product: data.product };
    } catch (err: any) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Product deleted from catalog', 'info');
        await refreshData();
        return true;
      }
      showToast(data.error || 'Failed to delete product', 'error');
      return false;
    } catch (err: any) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    status: Order['orderStatus'],
    options?: { trackingNumber?: string; courier?: string; paymentStatus?: Order['paymentStatus']; note?: string }
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...options }),
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.error || 'Failed to update order', 'error');
        return { success: false, error: data.error };
      }
      showToast(`Order status updated to "${status}"`);
      await refreshData();
      return { success: true, order: data.order };
    } catch (err: any) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const saveCoupon = async (couponData: Partial<Coupon> & { code: string; discountValue: number }) => {
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(couponData),
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.error || 'Failed to save coupon', 'error');
        return { success: false, error: data.error };
      }
      showToast(`Coupon "${couponData.code}" saved!`);
      await refreshData();
      return { success: true, coupon: data.coupon };
    } catch (err: any) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Coupon removed', 'info');
        await refreshData();
        return true;
      }
      return false;
    } catch (err: any) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const updateSettings = async (newSettings: Partial<WebsiteSettings>) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.error || 'Failed to update settings', 'error');
        return { success: false, error: data.error };
      }
      setSettings(data.settings);
      showToast('Store settings updated and live!');
      return { success: true, settings: data.settings };
    } catch (err: any) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const toggleCustomerBlock = async (customerId: string, blocked?: boolean) => {
    try {
      const res = await fetch(`/api/customers/${customerId}/block`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocked }),
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.error || 'Failed to update customer status', 'error');
        return { success: false, error: data.error };
      }
      showToast(data.user.isBlocked ? 'Customer account blocked' : 'Customer account unblocked');
      await refreshData();
      return { success: true, user: data.user };
    } catch (err: any) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        customerTab,
        setCustomerTab,
        adminTab,
        setAdminTab,
        products,
        categories,
        settings,
        coupons,
        orders,
        stats,
        loading,
        refreshData,
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartTotal,
        cartItemCount,
        toggleWishlist,
        isInWishlist,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProduct,
        setSelectedProduct,
        trackingOrder,
        setTrackingOrder,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        currentUser,
        setCurrentUser,
        loginUser,
        logoutUser,
        placeOrder,
        cancelCustomerOrder,
        adminUser,
        setAdminUser,
        saveProduct,
        deleteProduct,
        updateOrderStatus,
        saveCoupon,
        deleteCoupon,
        updateSettings,
        toggleCustomerBlock,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
