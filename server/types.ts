/**
 * @file server/types.ts
 * @purpose Type definitions for backend data models, requests, and API contracts.
 * @dependencies None (pure TypeScript definitions).
 * @implementation Provides strongly typed interfaces for Products, Categories, Brands,
 * Orders, Reviews, Coupons, Customers, Admin Settings, Razorpay & Shiprocket payloads.
 */

export interface ProductVariant {
  id: string;
  name: string; // e.g. "9.0° / Stiff Shaft" or "Size 10 UK / White"
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  attributes: Record<string, string>; // { loft: "9.0°", flex: "Stiff", hand: "Right-Handed" }
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerName: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
  status: 'approved' | 'pending' | 'rejected';
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  brand: string;
  category: string; // "golf-clubs", "golf-balls", "golf-bags", etc.
  description: string;
  shortDescription: string;
  regularPrice: number; // in INR ₹
  salePrice?: number;   // in INR ₹
  stockQuantity: number;
  featured: boolean;
  status: 'published' | 'draft' | 'archived';
  images: string[];
  specifications: ProductSpecification[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  hand?: 'Right-Handed' | 'Left-Handed' | 'Universal';
  flex?: 'Regular' | 'Stiff' | 'Extra Stiff' | 'Senior' | 'Ladies';
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image?: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  country: string;
  description: string;
  logo?: string;
}

export interface Address {
  fullName: string;
  phone: string;
  email: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string; // Indian state e.g. "Karnataka", "Delhi NCR", "Maharashtra"
  postalCode: string; // 6-digit Indian PIN code
  country: string; // "India"
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "CCDL-2026-1042"
  customerId?: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  billingAddress?: Address;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  shippingFee: number;
  taxAmount: number; // GST 18%
  totalAmount: number;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  shiprocketAwb?: string;
  shiprocketStatus?: string;
  trackingHistory: {
    status: string;
    location: string;
    timestamp: string;
    note?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseAmount: number;
  maxDiscount?: number;
  expiryDate: string;
  isActive: boolean;
  usageCount: number;
  description: string;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin' | 'store_manager';
  addresses: Address[];
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  currencySymbol: string;
  gstRate: number; // percentage, e.g. 18
  freeShippingThreshold: number; // e.g. ₹5000
  standardShippingFee: number; // e.g. ₹350
  expressShippingFee: number; // e.g. ₹750
  razorpayKeyId: string;
  razorpayTestMode: boolean;
  shiprocketMode: 'sandbox' | 'live';
  bannerAnnouncement: string;
  bannerEnabled: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  readTime: string;
  publishedAt: string;
  coverImage?: string;
  category: string;
}
