import fs from 'fs';
import path from 'path';
import {
  User,
  Category,
  Product,
  Order,
  Coupon,
  Review,
  InventoryLog,
  WebsiteSettings,
  OrderStatus,
  PaymentStatus,
} from './types.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'trend_bazar_db.json');

interface DatabaseSchema {
  users: User[];
  categories: Category[];
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  reviews: Review[];
  inventoryLogs: InventoryLog[];
  settings: WebsiteSettings;
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
  banners: [
    {
      id: 'ban_1',
      title: 'Mega Season Super Sale',
      subtitle: 'Flat 50% - 70% Off on Latest Streetwear & Gadgets',
      badge: 'LIMITED TIME DEAL',
      ctaText: 'Shop Trending Now',
      link: '/category/electronics',
      imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
      bgColor: 'from-blue-700 via-indigo-600 to-blue-900',
    },
    {
      id: 'ban_2',
      title: 'Next-Gen Wireless Audio',
      subtitle: 'Immersive sound with Active Noise Cancellation',
      badge: 'NEW ARRIVAL',
      ctaText: 'Explore Audio',
      link: '/category/audio',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
      bgColor: 'from-cyan-700 via-blue-600 to-indigo-800',
    },
    {
      id: 'ban_3',
      title: 'Premium Sneakers & Kicks',
      subtitle: 'Step up your street style with iconic footwear',
      badge: 'HOT TREND',
      ctaText: 'Get Sneakers',
      link: '/category/footwear',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
      bgColor: 'from-blue-900 via-sky-700 to-slate-900',
    },
  ],
  socialLinks: {
    instagram: 'https://instagram.com/trendbazar',
    facebook: 'https://facebook.com/trendbazar',
    twitter: 'https://twitter.com/trendbazar',
    youtube: 'https://youtube.com/@trendbazar',
  },
};

const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat_electronics',
    name: 'Smart Gadgets',
    slug: 'electronics',
    icon: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    featured: true,
    productCount: 4,
  },
  {
    id: 'cat_audio',
    name: 'Audio & Sound',
    slug: 'audio',
    icon: 'Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    featured: true,
    productCount: 3,
  },
  {
    id: 'cat_fashion_men',
    name: "Men's Fashion",
    slug: 'mens-fashion',
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=600&q=80',
    featured: true,
    productCount: 3,
  },
  {
    id: 'cat_footwear',
    name: 'Sneakers & Shoes',
    slug: 'footwear',
    icon: 'Footprints',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    featured: true,
    productCount: 3,
  },
  {
    id: 'cat_watches',
    name: 'Watches & Luxe',
    slug: 'watches',
    icon: 'Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    featured: true,
    productCount: 2,
  },
  {
    id: 'cat_home',
    name: 'Home & Lifestyle',
    slug: 'home-lifestyle',
    icon: 'Lamp',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
    featured: false,
    productCount: 2,
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prd_1',
    name: 'Pro ANC Wireless Earbuds with Touch Display Case',
    slug: 'pro-anc-wireless-earbuds',
    description: 'Ultra-low latency studio audio with 45dB Active Noise Cancellation, Smart LCD touch battery case, and up to 38 hours playback. IPX5 water resistance for workouts.',
    categoryId: 'cat_audio',
    categoryName: 'Audio & Sound',
    price: 89.99,
    discountPrice: 49.99,
    sku: 'TB-AUD-01',
    stock: 24,
    rating: 4.8,
    reviewsCount: 142,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { name: 'Color', options: ['Obsidian Black', 'Pearl White', 'Navy Blue'] },
    ],
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    isNewArrival: false,
    isActive: true,
    badge: 'HOT DEAL 44% OFF',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'prd_2',
    name: 'Ultra Slim AMOLED Bluetooth Calling Smartwatch',
    slug: 'ultra-slim-amoled-smartwatch',
    description: '1.96-inch curved AMOLED always-on display, aerospace titanium alloy casing, 120+ sport modes, 24/7 heart & SpO2 monitor with 10 days battery life.',
    categoryId: 'cat_watches',
    categoryName: 'Watches & Luxe',
    price: 119.00,
    discountPrice: 69.50,
    sku: 'TB-WTC-02',
    stock: 18,
    rating: 4.9,
    reviewsCount: 88,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { name: 'Color', options: ['Midnight Titanium', 'Silver Milanese', 'Rose Gold'] },
    ],
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    isNewArrival: true,
    isActive: true,
    badge: 'BESTSELLER',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'prd_3',
    name: 'Retro Crimson Running Sports Sneakers',
    slug: 'retro-crimson-running-sports-sneakers',
    description: 'Lightweight responsive air-cushion sole engineered for all-day comfort and street appeal. Breathable mesh upper with reinforced TPU heel cage.',
    categoryId: 'cat_footwear',
    categoryName: 'Sneakers & Shoes',
    price: 135.00,
    discountPrice: 84.99,
    sku: 'TB-SH-03',
    stock: 12,
    rating: 4.7,
    reviewsCount: 96,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { name: 'Size', options: ['US 8', 'US 9', 'US 10', 'US 11'] },
      { name: 'Color', options: ['Crimson Red / Black', 'Triple Black', 'Glacier White'] },
    ],
    isFeatured: true,
    isTrending: true,
    isBestSeller: false,
    isNewArrival: true,
    isActive: true,
    badge: '37% OFF',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'prd_4',
    name: 'Premium Oversized Heavyweight Cotton Hoodie',
    slug: 'oversized-heavyweight-hoodie',
    description: '450 GSM luxury brushed French terry cotton. Drop shoulder boxy silhouette with double-layered hood and ribbed cuffs. Minimalist street essential.',
    categoryId: 'cat_fashion_men',
    categoryName: "Men's Fashion",
    price: 75.00,
    discountPrice: 44.99,
    sku: 'TB-FAS-04',
    stock: 35,
    rating: 4.6,
    reviewsCount: 64,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { name: 'Size', options: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', options: ['Slate Charcoal', 'Cobalt Blue', 'Vintage Oatmeal'] },
    ],
    isFeatured: true,
    isTrending: false,
    isBestSeller: true,
    isNewArrival: true,
    isActive: true,
    badge: 'TRENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: 'prd_5',
    name: 'Fast 65W GaN Dual USB-C Ultra Compact Wall Charger',
    slug: '65w-gan-dual-charger',
    description: 'Gallium Nitride technology powers your laptop, tablet, and smartphone at high speed in a miniature pocket form factor with over-voltage protection.',
    categoryId: 'cat_electronics',
    categoryName: 'Smart Gadgets',
    price: 49.99,
    discountPrice: 29.99,
    sku: 'TB-ELC-05',
    stock: 45,
    rating: 4.9,
    reviewsCount: 110,
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { name: 'Color', options: ['Matte Black', 'Arctic White'] },
    ],
    isFeatured: false,
    isTrending: true,
    isBestSeller: true,
    isNewArrival: false,
    isActive: true,
    badge: 'TOP ACCESSORY',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: 'prd_6',
    name: 'Acoustic RGB Wireless Portable Bass Speaker',
    slug: 'acoustic-rgb-wireless-speaker',
    description: '360° omnidirectional stereo sound with dual passive radiators and beating beat-synced dynamic RGB lights. 24 hours battery and waterproof.',
    categoryId: 'cat_audio',
    categoryName: 'Audio & Sound',
    price: 95.00,
    discountPrice: 59.99,
    sku: 'TB-AUD-06',
    stock: 4, // low stock test
    rating: 4.7,
    reviewsCount: 78,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { name: 'Color', options: ['Midnight Stealth', 'Ocean Blue', 'Military Camo'] },
    ],
    isFeatured: true,
    isTrending: true,
    isBestSeller: false,
    isNewArrival: false,
    isActive: true,
    badge: 'ONLY 4 LEFT!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: 'prd_7',
    name: 'Minimalist Magnetic Desk Lamp with Wireless Charging Pad',
    slug: 'magnetic-desk-lamp-charger',
    description: 'Architectural aluminum alloy LED desk lamp with 3 color temperatures, stepless dimming, and integrated 15W Qi wireless quick-charging base.',
    categoryId: 'cat_home',
    categoryName: 'Home & Lifestyle',
    price: 69.99,
    discountPrice: 39.99,
    sku: 'TB-HME-07',
    stock: 19,
    rating: 4.8,
    reviewsCount: 42,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { name: 'Finish', options: ['Space Gray', 'Pure White'] },
    ],
    isFeatured: false,
    isTrending: false,
    isBestSeller: false,
    isNewArrival: true,
    isActive: true,
    badge: 'NEW',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: 'prd_8',
    name: 'Vintage Aviator Polarized UV400 Sunglasses',
    slug: 'vintage-aviator-sunglasses',
    description: 'Stainless steel frame with TAC polarized 9-layer anti-glare scratch resistant lenses. Includes magnetic leather travel case.',
    categoryId: 'cat_watches',
    categoryName: 'Watches & Luxe',
    price: 55.00,
    discountPrice: 32.00,
    sku: 'TB-ACC-08',
    stock: 28,
    rating: 4.8,
    reviewsCount: 51,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    ],
    variants: [
      { name: 'Lens', options: ['Gold / Emerald Green', 'Gunmetal / Smoke Black'] },
    ],
    isFeatured: true,
    isTrending: false,
    isBestSeller: true,
    isNewArrival: false,
    isActive: true,
    badge: '42% OFF',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
];

const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cpn_1',
    code: 'TREND20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 30,
    maxDiscount: 50,
    expiryDate: '2027-12-31',
    usageLimit: 500,
    usedCount: 142,
    isActive: true,
  },
  {
    id: 'cpn_2',
    code: 'BAZAR10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 20,
    expiryDate: '2027-12-31',
    usageLimit: 1000,
    usedCount: 284,
    isActive: true,
  },
  {
    id: 'cpn_3',
    code: 'FREESHIP',
    discountType: 'fixed',
    discountValue: 4.99,
    minOrderAmount: 25,
    expiryDate: '2027-12-31',
    usageLimit: 200,
    usedCount: 89,
    isActive: true,
  },
];

const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin',
    name: 'Trend Bazar Admin',
    email: 'admin@trendbazar.com',
    phone: '+91 98765 00000',
    role: 'admin',
    isBlocked: false,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    addresses: [],
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
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
  },
  {
    id: 'usr_cust2',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 97123 44556',
    role: 'customer',
    isBlocked: false,
    addresses: [
      {
        id: 'addr_2',
        name: 'Priya Patel',
        phone: '+91 97123 44556',
        address: 'B-12, Green Park Avenue, Navrangpura',
        city: 'Ahmedabad',
        postalCode: '380009',
        isDefault: true,
      },
    ],
    createdAt: '2026-04-02T09:15:00.000Z',
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'TB-9281',
    orderNumber: 'TB-9281',
    customerId: 'usr_cust1',
    customerName: 'Rahul Sharma',
    phone: '+91 98234 11223',
    email: 'rahul.sharma@example.com',
    city: 'Mumbai',
    address: 'Flat 402, Skyline Residency, Bandra West',
    postalCode: '400050',
    notes: 'Please ring bell twice upon arrival.',
    items: [
      {
        productId: 'prd_1',
        productName: 'Pro ANC Wireless Earbuds with Touch Display Case',
        price: 49.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
        variant: 'Color: Obsidian Black',
        sku: 'TB-AUD-01',
      },
      {
        productId: 'prd_5',
        productName: 'Fast 65W GaN Dual USB-C Ultra Compact Wall Charger',
        price: 29.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
        variant: 'Color: Matte Black',
        sku: 'TB-ELC-05',
      },
    ],
    subtotal: 79.98,
    deliveryCharge: 0,
    discount: 16.00,
    couponCode: 'TREND20',
    totalAmount: 63.98,
    paymentMethod: 'COD',
    paymentStatus: 'Unpaid',
    orderStatus: 'Processing',
    trackingNumber: 'TRK-IN-889104',
    courier: 'BlueDart Express',
    timeline: [
      {
        status: 'Pending',
        title: 'Order Placed',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
        description: 'Customer selected Cash on Delivery.',
      },
      {
        status: 'Confirmed',
        title: 'Order Verified & Confirmed',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
        description: 'Order confirmed by Trend Bazar Fulfillment Team.',
      },
      {
        status: 'Processing',
        title: 'Packaging & Quality Inspection',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        description: 'Items packed in shock-proof protective box.',
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: 'TB-9280',
    orderNumber: 'TB-9280',
    customerId: 'usr_cust2',
    customerName: 'Priya Patel',
    phone: '+91 97123 44556',
    email: 'priya.patel@example.com',
    city: 'Ahmedabad',
    address: 'B-12, Green Park Avenue, Navrangpura',
    postalCode: '380009',
    notes: 'Call before delivery.',
    items: [
      {
        productId: 'prd_2',
        productName: 'Ultra Slim AMOLED Bluetooth Calling Smartwatch',
        price: 69.50,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        variant: 'Color: Midnight Titanium',
        sku: 'TB-WTC-02',
      },
    ],
    subtotal: 69.50,
    deliveryCharge: 0,
    discount: 6.95,
    couponCode: 'BAZAR10',
    totalAmount: 62.55,
    paymentMethod: 'COD',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    trackingNumber: 'TRK-DEL-551092',
    courier: 'Delhivery Surface',
    timeline: [
      {
        status: 'Pending',
        title: 'Order Placed',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        description: 'Order received via Trend Bazar Mobile.',
      },
      {
        status: 'Confirmed',
        title: 'Order Confirmed',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(),
        description: 'Verified stock and COD address.',
      },
      {
        status: 'Shipped',
        title: 'Handed to Courier',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
        description: 'Package dispatched via Delhivery (Awb: TRK-DEL-551092).',
      },
      {
        status: 'Delivered',
        title: 'Delivered Successfully',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        description: 'Cash payment of $62.55 collected at doorstep.',
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'TB-9279',
    orderNumber: 'TB-9279',
    customerId: null,
    customerName: 'Amit Verma',
    phone: '+91 91234 98765',
    email: 'amit.verma@example.com',
    city: 'New Delhi',
    address: 'Sector 15, Rohini, House #24',
    postalCode: '110085',
    items: [
      {
        productId: 'prd_3',
        productName: 'Retro Crimson Running Sports Sneakers',
        price: 84.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        variant: 'Size: US 10 / Color: Crimson Red / Black',
        sku: 'TB-SH-03',
      },
    ],
    subtotal: 84.99,
    deliveryCharge: 0,
    discount: 0,
    couponCode: null,
    totalAmount: 84.99,
    paymentMethod: 'COD',
    paymentStatus: 'Unpaid',
    orderStatus: 'Shipped',
    trackingNumber: 'TRK-EXP-992144',
    courier: 'Shadowfax Express',
    timeline: [
      {
        status: 'Pending',
        title: 'Order Placed',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        description: 'Cash on delivery order created.',
      },
      {
        status: 'Confirmed',
        title: 'Confirmed',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        description: 'Ready for fulfillment.',
      },
      {
        status: 'Shipped',
        title: 'Out for Dispatch',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        description: 'Tracking Number: TRK-EXP-992144',
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: 'TB-9282',
    orderNumber: 'TB-9282',
    customerId: null,
    customerName: 'Karan Mehra',
    phone: '+91 99887 66554',
    email: 'karan.m@example.com',
    city: 'Bengaluru',
    address: 'Indiranagar 100ft Road, Apt 3A',
    postalCode: '560038',
    notes: 'Please call before delivering.',
    items: [
      {
        productId: 'prd_4',
        productName: 'Premium Oversized Heavyweight Cotton Hoodie',
        price: 44.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
        variant: 'Size: L / Color: Slate Charcoal',
        sku: 'TB-FAS-04',
      },
    ],
    subtotal: 44.99,
    deliveryCharge: 4.99,
    discount: 0,
    couponCode: null,
    totalAmount: 49.98,
    paymentMethod: 'COD',
    paymentStatus: 'Unpaid',
    orderStatus: 'Pending',
    trackingNumber: null,
    courier: null,
    timeline: [
      {
        status: 'Pending',
        title: 'Order Received',
        timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        description: 'Order awaits confirmation from admin panel.',
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    productId: 'prd_1',
    userName: 'Vikram S.',
    rating: 5,
    comment: 'The touch screen display on the charging case is next level! Sound quality is punchy with great bass and ANC blocks metro noise effortlessly.',
    verifiedPurchase: true,
    createdAt: '2026-10-24T14:30:00.000Z',
  },
  {
    id: 'rev_2',
    productId: 'prd_1',
    userName: 'Sneha R.',
    rating: 5,
    comment: 'Super fast delivery in Mumbai within 48 hours. Cash on delivery was seamless. Product is 100% genuine.',
    verifiedPurchase: true,
    createdAt: '2026-10-26T18:10:00.000Z',
  },
  {
    id: 'rev_3',
    productId: 'prd_2',
    userName: 'Arjun N.',
    rating: 5,
    comment: 'AMOLED display is crystal clear even in direct sunlight. Bluetooth calling is loud and clear. Great battery life too.',
    verifiedPurchase: true,
    createdAt: '2026-10-28T09:45:00.000Z',
  },
  {
    id: 'rev_4',
    productId: 'prd_3',
    userName: 'Devendra K.',
    rating: 4,
    comment: 'Very comfortable sole for morning running and workouts. Color is vibrant red.',
    verifiedPurchase: true,
    createdAt: '2026-10-30T16:20:00.000Z',
  },
];

const INITIAL_INVENTORY_LOGS: InventoryLog[] = [
  {
    id: 'inv_1',
    productId: 'prd_1',
    productName: 'Pro ANC Wireless Earbuds',
    change: +50,
    type: 'restock',
    notes: 'Initial container arrival',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: 'inv_2',
    productId: 'prd_1',
    productName: 'Pro ANC Wireless Earbuds',
    change: -1,
    type: 'order_deduction',
    notes: 'Order TB-9281 fulfillment',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          users: parsed.users || INITIAL_USERS,
          categories: parsed.categories || INITIAL_CATEGORIES,
          products: parsed.products || INITIAL_PRODUCTS,
          orders: parsed.orders || INITIAL_ORDERS,
          coupons: parsed.coupons || INITIAL_COUPONS,
          reviews: parsed.reviews || INITIAL_REVIEWS,
          inventoryLogs: parsed.inventoryLogs || INITIAL_INVENTORY_LOGS,
          settings: parsed.settings ? { ...DEFAULT_SETTINGS, ...parsed.settings } : DEFAULT_SETTINGS,
        };
      }
    } catch (e) {
      console.error('Error reading database file, using fallback initial data:', e);
    }

    const defaultData: DatabaseSchema = {
      users: INITIAL_USERS,
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      coupons: INITIAL_COUPONS,
      reviews: INITIAL_REVIEWS,
      inventoryLogs: INITIAL_INVENTORY_LOGS,
      settings: DEFAULT_SETTINGS,
    };
    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database to disk:', err);
    }
  }

  // --- PRODUCTS ---
  public getProducts(filter?: {
    category?: string;
    search?: string;
    featured?: boolean;
    trending?: boolean;
    bestSeller?: boolean;
    newArrival?: boolean;
    activeOnly?: boolean;
  }): Product[] {
    let result = [...this.data.products];

    if (filter?.activeOnly) {
      result = result.filter(p => p.isActive);
    }
    if (filter?.category && filter.category !== 'all') {
      result = result.filter(
        p => p.categoryId === filter.category || p.categoryName.toLowerCase().includes(filter.category!.toLowerCase())
      );
    }
    if (filter?.featured) {
      result = result.filter(p => p.isFeatured);
    }
    if (filter?.trending) {
      result = result.filter(p => p.isTrending);
    }
    if (filter?.bestSeller) {
      result = result.filter(p => p.isBestSeller);
    }
    if (filter?.newArrival) {
      result = result.filter(p => p.isNewArrival);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }
    return result;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id || p.slug === id);
  }

  public saveProduct(productData: Partial<Product> & { name: string; price: number }): Product {
    const existingIndex = productData.id ? this.data.products.findIndex(p => p.id === productData.id) : -1;
    let savedProduct: Product;

    if (existingIndex >= 0) {
      const existing = this.data.products[existingIndex];
      // Stock change detection for inventory logs
      if (typeof productData.stock === 'number' && productData.stock !== existing.stock) {
        const diff = productData.stock - existing.stock;
        this.addInventoryLog({
          productId: existing.id,
          productName: existing.name,
          change: diff,
          type: diff > 0 ? 'restock' : 'manual_adjustment',
          notes: `Stock updated from ${existing.stock} to ${productData.stock}`,
        });
      }

      savedProduct = {
        ...existing,
        ...productData,
      } as Product;
      this.data.products[existingIndex] = savedProduct;
    } else {
      const newId = `prd_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      savedProduct = {
        id: newId,
        slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        name: productData.name,
        description: productData.description || '',
        categoryId: productData.categoryId || 'cat_electronics',
        categoryName: productData.categoryName || 'General',
        price: Number(productData.price) || 0,
        discountPrice: typeof productData.discountPrice === 'number' ? Number(productData.discountPrice) : Number(productData.price),
        sku: productData.sku || `TB-${Math.floor(1000 + Math.random() * 9000)}`,
        stock: typeof productData.stock === 'number' ? Number(productData.stock) : 10,
        rating: 5.0,
        reviewsCount: 0,
        images: productData.images && productData.images.length > 0 ? productData.images : [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        ],
        variants: productData.variants || [],
        isFeatured: Boolean(productData.isFeatured),
        isTrending: Boolean(productData.isTrending),
        isBestSeller: Boolean(productData.isBestSeller),
        isNewArrival: Boolean(productData.isNewArrival ?? true),
        isActive: productData.isActive !== false,
        badge: productData.badge || '',
        createdAt: new Date().toISOString(),
      };
      this.data.products.unshift(savedProduct);

      this.addInventoryLog({
        productId: savedProduct.id,
        productName: savedProduct.name,
        change: savedProduct.stock,
        type: 'restock',
        notes: 'Initial product stock created',
      });
    }

    // Refresh category count
    this.refreshCategoryCounts();
    this.saveData();
    return savedProduct;
  }

  public deleteProduct(id: string): boolean {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx >= 0) {
      this.data.products.splice(idx, 1);
      this.refreshCategoryCounts();
      this.saveData();
      return true;
    }
    return false;
  }

  private refreshCategoryCounts() {
    this.data.categories.forEach(cat => {
      cat.productCount = this.data.products.filter(p => p.categoryId === cat.id && p.isActive).length;
    });
  }

  // --- CATEGORIES ---
  public getCategories(): Category[] {
    return this.data.categories;
  }

  public saveCategory(cat: Partial<Category> & { name: string }): Category {
    const existingIndex = cat.id ? this.data.categories.findIndex(c => c.id === cat.id) : -1;
    let saved: Category;
    if (existingIndex >= 0) {
      saved = { ...this.data.categories[existingIndex], ...cat };
      this.data.categories[existingIndex] = saved;
    } else {
      saved = {
        id: `cat_${Date.now()}`,
        name: cat.name,
        slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        icon: cat.icon || 'Tag',
        image: cat.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
        featured: Boolean(cat.featured),
        productCount: 0,
      };
      this.data.categories.push(saved);
    }
    this.refreshCategoryCounts();
    this.saveData();
    return saved;
  }

  public deleteCategory(id: string): boolean {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx >= 0) {
      this.data.categories.splice(idx, 1);
      this.saveData();
      return true;
    }
    return false;
  }

  // --- ORDERS ---
  public getOrders(filter?: { status?: string; search?: string; customerId?: string }): Order[] {
    let result = [...this.data.orders];
    if (filter?.customerId) {
      result = result.filter(o => o.customerId === filter.customerId);
    }
    if (filter?.status && filter.status !== 'all') {
      result = result.filter(o => o.orderStatus.toLowerCase() === filter.status!.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(
        o =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.phone.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q) ||
          (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
      );
    }
    // Return newest first
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id || o.orderNumber === id);
  }

  public createOrder(payload: {
    customerId?: string | null;
    customerName: string;
    phone: string;
    email: string;
    city: string;
    address: string;
    postalCode: string;
    notes?: string;
    items: Array<{ productId: string; quantity: number; variant?: string }>;
    couponCode?: string | null;
  }): { order: Order; error?: string } {
    if (!payload.items || payload.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    const orderItems: Order['items'] = [];
    let subtotal = 0;

    // Validate stock and compute real prices on server (anti-tamper)
    for (const item of payload.items) {
      const prod = this.getProductById(item.productId);
      if (!prod || !prod.isActive) {
        throw new Error(`Product ${item.productId} is not available.`);
      }
      if (prod.stock < item.quantity) {
        throw new Error(`Insufficient stock for "${prod.name}". Only ${prod.stock} remaining.`);
      }

      const activePrice = prod.discountPrice > 0 ? prod.discountPrice : prod.price;
      orderItems.push({
        productId: prod.id,
        productName: prod.name,
        price: activePrice,
        quantity: item.quantity,
        image: prod.images[0] || '',
        variant: item.variant,
        sku: prod.sku,
      });

      subtotal += activePrice * item.quantity;

      // Deduct stock
      prod.stock -= item.quantity;
      this.addInventoryLog({
        productId: prod.id,
        productName: prod.name,
        change: -item.quantity,
        type: 'order_deduction',
        notes: `Order created: deducted ${item.quantity} units`,
      });
    }

    // Coupon calculation
    let discount = 0;
    let appliedCoupon: Coupon | null = null;
    if (payload.couponCode) {
      const validation = this.validateCoupon(payload.couponCode, subtotal);
      if (validation.valid && validation.coupon) {
        discount = validation.discountAmount;
        appliedCoupon = validation.coupon;
        appliedCoupon.usedCount += 1;
      }
    }

    // Delivery calculation
    const settings = this.getSettings();
    const deliveryCharge = subtotal >= settings.freeDeliveryThreshold ? 0 : settings.standardDeliveryCharge;
    const totalAmount = Math.max(0, Number((subtotal - discount + deliveryCharge).toFixed(2)));

    const orderNum = `TB-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: orderNum,
      orderNumber: orderNum,
      customerId: payload.customerId || null,
      customerName: payload.customerName.trim(),
      phone: payload.phone.trim(),
      email: payload.email.trim(),
      city: payload.city.trim(),
      address: payload.address.trim(),
      postalCode: payload.postalCode.trim(),
      notes: payload.notes?.trim() || '',
      items: orderItems,
      subtotal: Number(subtotal.toFixed(2)),
      deliveryCharge: Number(deliveryCharge.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      totalAmount,
      paymentMethod: 'COD',
      paymentStatus: 'Unpaid',
      orderStatus: 'Pending',
      trackingNumber: null,
      courier: null,
      timeline: [
        {
          status: 'Pending',
          title: 'Order Placed (Cash on Delivery)',
          timestamp: now,
          description: `Order successfully placed by ${payload.customerName}. Payment of $${totalAmount.toFixed(2)} due on delivery.`,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    // Auto add address to customer profile if user exists
    if (payload.customerId) {
      const user = this.data.users.find(u => u.id === payload.customerId);
      if (user) {
        const hasAddr = user.addresses.some(a => a.address.toLowerCase() === payload.address.toLowerCase());
        if (!hasAddr) {
          user.addresses.push({
            id: `addr_${Date.now()}`,
            name: payload.customerName,
            phone: payload.phone,
            address: payload.address,
            city: payload.city,
            postalCode: payload.postalCode,
            isDefault: user.addresses.length === 0,
          });
        }
      }
    }

    this.data.orders.unshift(newOrder);
    this.saveData();
    return { order: newOrder };
  }

  public updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    options?: {
      trackingNumber?: string;
      courier?: string;
      paymentStatus?: PaymentStatus;
      note?: string;
    }
  ): Order | undefined {
    const order = this.data.orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (!order) return undefined;

    const prevStatus = order.orderStatus;
    order.orderStatus = status;
    order.updatedAt = new Date().toISOString();

    if (options?.trackingNumber !== undefined) {
      order.trackingNumber = options.trackingNumber;
    }
    if (options?.courier !== undefined) {
      order.courier = options.courier;
    }
    if (options?.paymentStatus !== undefined) {
      order.paymentStatus = options.paymentStatus;
    }

    // Auto mark payment as Paid if Delivered (for COD)
    if (status === 'Delivered' && order.paymentStatus === 'Unpaid') {
      order.paymentStatus = 'Paid';
    }

    // If cancelled or returned, return stock to inventory
    if ((status === 'Cancelled' || status === 'Returned') && prevStatus !== 'Cancelled' && prevStatus !== 'Returned') {
      for (const item of order.items) {
        const prod = this.getProductById(item.productId);
        if (prod) {
          prod.stock += item.quantity;
          this.addInventoryLog({
            productId: prod.id,
            productName: prod.name,
            change: item.quantity,
            type: status === 'Cancelled' ? 'manual_adjustment' : 'return',
            notes: `Stock restored from ${status.toLowerCase()} order ${order.orderNumber}`,
          });
        }
      }
    }

    const timelineDescription =
      options?.note ||
      (status === 'Confirmed'
        ? 'Order has been verified and confirmed by the dispatch team.'
        : status === 'Processing'
        ? 'Order is being packaged and prepared for shipping.'
        : status === 'Shipped'
        ? `Order dispatched via ${order.courier || 'Express Carrier'}. Tracking: ${order.trackingNumber || 'Available shortly'}`
        : status === 'Delivered'
        ? `Delivered to customer. COD payment of $${order.totalAmount} collected.`
        : status === 'Cancelled'
        ? 'Order has been cancelled. Inventory released.'
        : `Order status updated to ${status}.`);

    order.timeline.push({
      status,
      title: `Order ${status}`,
      timestamp: new Date().toISOString(),
      description: timelineDescription,
    });

    this.saveData();
    return order;
  }

  // --- COUPONS ---
  public getCoupons(): Coupon[] {
    return this.data.coupons;
  }

  public validateCoupon(code: string, subtotal: number): { valid: boolean; message: string; discountAmount: number; coupon?: Coupon } {
    const coupon = this.data.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
      return { valid: false, message: 'Invalid coupon code', discountAmount: 0 };
    }
    if (!coupon.isActive) {
      return { valid: false, message: 'This coupon is no longer active', discountAmount: 0 };
    }
    if (coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, message: 'Coupon usage limit has been reached', discountAmount: 0 };
    }
    if (new Date(coupon.expiryDate).getTime() < Date.now()) {
      return { valid: false, message: 'Coupon has expired', discountAmount: 0 };
    }
    if (subtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        message: `Minimum order amount of $${coupon.minOrderAmount} required for this coupon`,
        discountAmount: 0,
      };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = Math.min(coupon.discountValue, subtotal);
    }

    return {
      valid: true,
      message: `Coupon "${coupon.code}" applied successfully! You saved $${discount.toFixed(2)}`,
      discountAmount: Number(discount.toFixed(2)),
      coupon,
    };
  }

  public saveCoupon(couponData: Partial<Coupon> & { code: string; discountValue: number }): Coupon {
    const idx = couponData.id ? this.data.coupons.findIndex(c => c.id === couponData.id) : -1;
    let saved: Coupon;
    if (idx >= 0) {
      saved = { ...this.data.coupons[idx], ...couponData, code: couponData.code.toUpperCase() };
      this.data.coupons[idx] = saved;
    } else {
      saved = {
        id: `cpn_${Date.now()}`,
        code: couponData.code.toUpperCase(),
        discountType: couponData.discountType || 'percentage',
        discountValue: Number(couponData.discountValue),
        minOrderAmount: Number(couponData.minOrderAmount || 0),
        maxDiscount: couponData.maxDiscount ? Number(couponData.maxDiscount) : undefined,
        expiryDate: couponData.expiryDate || '2027-12-31',
        usageLimit: Number(couponData.usageLimit || 500),
        usedCount: 0,
        isActive: couponData.isActive !== false,
      };
      this.data.coupons.push(saved);
    }
    this.saveData();
    return saved;
  }

  public deleteCoupon(id: string): boolean {
    const idx = this.data.coupons.findIndex(c => c.id === id);
    if (idx >= 0) {
      this.data.coupons.splice(idx, 1);
      this.saveData();
      return true;
    }
    return false;
  }

  // --- CUSTOMERS / USERS ---
  public getUsers(role?: 'customer' | 'admin' | 'staff'): User[] {
    if (role) {
      return this.data.users.filter(u => u.role === role);
    }
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id || u.email.toLowerCase() === id.toLowerCase());
  }

  public registerUser(name: string, email: string, phone: string, role: 'customer' | 'staff' = 'customer'): User {
    const existing = this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return existing;
    }
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      phone,
      role,
      isBlocked: false,
      addresses: [],
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.saveData();
    return newUser;
  }

  public toggleUserBlock(id: string, blocked?: boolean): User | undefined {
    const user = this.data.users.find(u => u.id === id);
    if (!user) return undefined;
    user.isBlocked = blocked !== undefined ? blocked : !user.isBlocked;
    this.saveData();
    return user;
  }

  // --- REVIEWS ---
  public getReviews(productId?: string): Review[] {
    if (productId) {
      return this.data.reviews.filter(r => r.productId === productId);
    }
    return this.data.reviews;
  }

  public addReview(review: Omit<Review, 'id' | 'createdAt'>): Review {
    const newRev: Review = {
      id: `rev_${Date.now()}`,
      ...review,
      createdAt: new Date().toISOString(),
    };
    this.data.reviews.unshift(newRev);

    // Recalculate product rating
    const prodReviews = this.data.reviews.filter(r => r.productId === review.productId);
    const prod = this.getProductById(review.productId);
    if (prod && prodReviews.length > 0) {
      const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
      prod.rating = Number(avg.toFixed(1));
      prod.reviewsCount = prodReviews.length;
    }

    this.saveData();
    return newRev;
  }

  // --- INVENTORY LOGS ---
  public getInventoryLogs(productId?: string): InventoryLog[] {
    if (productId) {
      return this.data.inventoryLogs.filter(l => l.productId === productId);
    }
    return this.data.inventoryLogs.slice(0, 50);
  }

  public addInventoryLog(log: Omit<InventoryLog, 'id' | 'timestamp'>) {
    const item: InventoryLog = {
      id: `inv_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      ...log,
      timestamp: new Date().toISOString(),
    };
    this.data.inventoryLogs.unshift(item);
    if (this.data.inventoryLogs.length > 200) {
      this.data.inventoryLogs = this.data.inventoryLogs.slice(0, 200);
    }
  }

  // --- SETTINGS ---
  public getSettings(): WebsiteSettings {
    return this.data.settings;
  }

  public updateSettings(newSettings: Partial<WebsiteSettings>): WebsiteSettings {
    this.data.settings = {
      ...this.data.settings,
      ...newSettings,
      socialLinks: {
        ...this.data.settings.socialLinks,
        ...(newSettings.socialLinks || {}),
      },
    };
    this.saveData();
    return this.data.settings;
  }

  // --- ANALYTICS & DASHBOARD STATS ---
  public getDashboardStats() {
    const orders = this.data.orders;
    const products = this.data.products;
    const users = this.data.users.filter(u => u.role === 'customer');

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;
    const processingOrders = orders.filter(o => o.orderStatus === 'Processing' || o.orderStatus === 'Confirmed').length;
    const shippedOrders = orders.filter(o => o.orderStatus === 'Shipped').length;
    const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
    const cancelledOrders = orders.filter(o => o.orderStatus === 'Cancelled').length;
    const returnedOrders = orders.filter(o => o.orderStatus === 'Returned').length;

    const validRevenueOrders = orders.filter(o => o.orderStatus !== 'Cancelled' && o.orderStatus !== 'Returned');
    const totalRevenue = Number(validRevenueOrders.reduce((acc, o) => acc + o.totalAmount, 0).toFixed(2));
    const codCollectedRevenue = Number(orders.filter(o => o.paymentStatus === 'Paid').reduce((acc, o) => acc + o.totalAmount, 0).toFixed(2));

    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock <= 5 && p.isActive);
    const outOfStockProducts = products.filter(p => p.stock === 0 && p.isActive);

    // Best sellers
    const salesByProduct: { [id: string]: { name: string; count: number; revenue: number; image: string } } = {};
    orders.forEach(o => {
      if (o.orderStatus !== 'Cancelled') {
        o.items.forEach(item => {
          if (!salesByProduct[item.productId]) {
            salesByProduct[item.productId] = {
              name: item.productName,
              count: 0,
              revenue: 0,
              image: item.image,
            };
          }
          salesByProduct[item.productId].count += item.quantity;
          salesByProduct[item.productId].revenue += item.price * item.quantity;
        });
      }
    });

    const topSellingProducts = Object.entries(salesByProduct)
      .map(([id, info]) => ({ id, ...info }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Sales charts (last 7 days)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7DaysChart = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateString = d.toISOString().slice(0, 10);
      const dayName = days[d.getDay()];

      const dayOrders = orders.filter(o => o.createdAt.slice(0, 10) === dateString && o.orderStatus !== 'Cancelled');
      const sales = Number(dayOrders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2));
      const ordersCount = dayOrders.length;

      return {
        date: dateString,
        day: dayName,
        sales,
        orders: ordersCount,
      };
    });

    return {
      kpis: {
        totalRevenue,
        codCollectedRevenue,
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        returnedOrders,
        totalCustomers: users.length,
        totalProducts,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length,
      },
      lowStockProducts,
      topSellingProducts,
      chartData: last7DaysChart,
      recentOrders: orders.slice(0, 6),
      latestCustomers: users.slice(0, 5),
    };
  }
}

export const db = new Database();
