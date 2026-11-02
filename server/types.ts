export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'admin' | 'staff' | 'customer';
  isBlocked: boolean;
  avatar?: string;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  featured: boolean;
  productCount: number;
}

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  categoryName: string;
  price: number;
  discountPrice: number;
  sku: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  variants: ProductVariant[];
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  badge?: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
  sku?: string;
}

export interface OrderTimeline {
  status: string;
  title: string;
  timestamp: string;
  description: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export type PaymentStatus = 'Unpaid' | 'Paid' | 'Refunded';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string | null;
  customerName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  postalCode: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  couponCode: string | null;
  totalAmount: number;
  paymentMethod: 'COD';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber: string | null;
  courier: string | null;
  timeline: OrderTimeline[];
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  change: number;
  type: 'restock' | 'order_deduction' | 'manual_adjustment' | 'return';
  notes: string;
  timestamp: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  ctaText: string;
  link: string;
  imageUrl: string;
  bgColor: string;
}

export interface WebsiteSettings {
  storeName: string;
  tagline: string;
  logoText: string;
  logoUrl: string;
  supportPhone: string;
  whatsappNumber: string;
  supportEmail: string;
  announcementText: string;
  currencySymbol: string;
  standardDeliveryCharge: number;
  freeDeliveryThreshold: number;
  banners: Banner[];
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
    youtube: string;
  };
}
