/**
 * @file src/types/index.ts
 * @purpose Client-side TypeScript interfaces for state management, e-commerce entities, and UI navigation.
 * @dependencies None.
 * @implementation Mirrors backend domain models and defines client views, cart items,
 * filters, and auth state.
 */

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
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
  category: string;
  description: string;
  shortDescription: string;
  regularPrice: number;
  salePrice?: number;
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
}

export interface Address {
  fullName: string;
  phone: string;
  email: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CartItem {
  id: string; // unique item id: `${productId}-${variantId || 'base'}`
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  price: number;
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
  orderNumber: string;
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
  taxAmount: number;
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

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin' | 'store_manager';
  token?: string;
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

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  currencySymbol: string;
  gstRate: number;
  freeShippingThreshold: number;
  standardShippingFee: number;
  expressShippingFee: number;
  razorpayKeyId: string;
  razorpayTestMode: boolean;
  shiprocketMode: 'sandbox' | 'live';
  bannerAnnouncement: string;
  bannerEnabled: boolean;
}

export type AppView =
  | 'home'
  | 'shop'
  | 'categories'
  | 'product-detail'
  | 'search'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'customer-dashboard'
  | 'my-orders'
  | 'order-tracking'
  | 'wishlist'
  | 'compare'
  | 'about'
  | 'contact'
  | 'blog'
  | 'blog-post'
  | 'faq'
  | 'privacy-policy'
  | 'terms-conditions'
  | 'shipping-policy'
  | 'refund-policy'
  | 'admin';
