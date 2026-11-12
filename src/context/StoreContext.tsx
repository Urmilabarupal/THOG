/**
 * @file src/context/StoreContext.tsx
 * @purpose Global application state container for The House of Gaunt e-commerce platform.
 * @dependencies React (hooks, createContext, useContext), ../types/index.ts.
 * @implementation Provides reactive state for routing across all 23 storefront views and
 * admin panel, shopping cart state with local storage persistence, coupon discounts,
 * wishlist management, product comparison, customer/admin authentication, and API synchronization.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CartItem,
  ProductVariant,
  User,
  AppView,
  StoreSettings,
  Order
} from '../types/index.ts';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppliedCoupon {
  code: string;
  discountAmount: number;
  description: string;
}

interface StoreContextType {
  // Navigation
  currentView: AppView;
  activeProductId: string | null;
  activeBlogSlug: string | null;
  activeCategory: string | null;
  activeBrand: string | null;
  searchQuery: string;
  navigate: (view: AppView, params?: {
    productId?: string;
    blogSlug?: string;
    category?: string;
    brand?: string;
    search?: string;
  }) => void;

  // Catalog
  products: Product[];
  categories: Category[];
  isLoadingProducts: boolean;
  refreshProducts: () => Promise<void>;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartTax: number;
  cartTotal: number;
  cartItemsCount: number;

  // Coupon
  appliedCoupon: AppliedCoupon | null;
  applyCouponCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCouponCode: () => void;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Comparison
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;

  // Auth
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  quickLoginAs: (role: 'customer' | 'admin') => void;

  // Settings & Orders
  settings: StoreSettings | null;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;

  // UI Utilities
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  formatINR: (amount: number) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Parse browser URL hash for deep linking, back/forward history, and direct refresh
const parseHash = (): {
  view: AppView;
  productId?: string;
  blogSlug?: string;
  category?: string;
  brand?: string;
  search?: string;
} => {
  if (typeof window === 'undefined') return { view: 'home' };
  const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
  if (!rawHash) return { view: 'home' };

  const [pathPart, queryPart] = rawHash.split('?');
  const params = new URLSearchParams(queryPart || '');

  if (pathPart.startsWith('product/')) {
    const pId = pathPart.replace('product/', '');
    return { view: 'product-detail', productId: pId };
  }
  if (pathPart.startsWith('blog/')) {
    const bSlug = pathPart.replace('blog/', '');
    return { view: 'blog', blogSlug: bSlug };
  }
  if (pathPart === 'shop') {
    return {
      view: 'shop',
      category: params.get('category') || undefined,
      brand: params.get('brand') || undefined
    };
  }
  if (pathPart === 'search') {
    return { view: 'search', search: params.get('q') || '' };
  }

  const validViews: AppView[] = [
    'home', 'shop', 'categories', 'product-detail', 'search', 'cart', 'checkout',
    'order-confirmation', 'login', 'register', 'forgot-password', 'customer-dashboard',
    'my-orders', 'order-tracking', 'wishlist', 'compare', 'about', 'contact',
    'blog', 'blog-post', 'faq', 'privacy-policy', 'terms-conditions', 'shipping-policy',
    'refund-policy', 'admin'
  ];

  if (validViews.includes(pathPart as AppView)) {
    return { view: pathPart as AppView };
  }

  return { view: 'home' };
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State with URL Hash Synchronization
  const initialNav = parseHash();
  const [currentView, setCurrentView] = useState<AppView>(initialNav.view);
  const [activeProductId, setActiveProductId] = useState<string | null>(initialNav.productId || null);
  const [activeBlogSlug, setActiveBlogSlug] = useState<string | null>(initialNav.blogSlug || null);
  const [activeCategory, setActiveCategory] = useState<string | null>(initialNav.category || null);
  const [activeBrand, setActiveBrand] = useState<string | null>(initialNav.brand || null);
  const [searchQuery, setSearchQuery] = useState<string>(initialNav.search || '');

  // Catalog State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

  // Cart State with Local Storage Persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('house_of_gaunt_cart') || localStorage.getItem('ccdl_fairway_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(() => {
    try {
      const saved = localStorage.getItem('house_of_gaunt_coupon') || localStorage.getItem('ccdl_fairway_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('house_of_gaunt_wishlist') || localStorage.getItem('ccdl_fairway_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Compare State
  const [compareList, setCompareList] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('house_of_gaunt_compare') || localStorage.getItem('ccdl_fairway_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Auth State
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('house_of_gaunt_user') || localStorage.getItem('ccdl_fairway_user');
      return saved ? JSON.parse(saved) : {
        id: 'cust-demo',
        fullName: 'Sandeep Rao',
        email: 'sandeepaliens01@gmail.com',
        phone: '+91 98450 12345',
        role: 'customer'
      };
    } catch {
      return null;
    }
  });

  // Settings & Orders
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const formatINR = (amount: number): string => {
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  };

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('house_of_gaunt_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('house_of_gaunt_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('house_of_gaunt_compare', JSON.stringify(compareList));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [compareList]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('house_of_gaunt_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('house_of_gaunt_user');
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('house_of_gaunt_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('house_of_gaunt_coupon');
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [appliedCoupon]);

  // Reactive Browser History & URL Hash Listener
  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHash();
      setCurrentView(parsed.view);
      if (parsed.productId !== undefined) setActiveProductId(parsed.productId);
      if (parsed.blogSlug !== undefined) setActiveBlogSlug(parsed.blogSlug);
      if (parsed.category !== undefined) setActiveCategory(parsed.category);
      if (parsed.brand !== undefined) setActiveBrand(parsed.brand);
      if (parsed.search !== undefined) setSearchQuery(parsed.search);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Load products & settings from backend API
  const refreshProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const [prodRes, catRes, setRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/settings')
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.data || []);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.data || []);
      }
      if (setRes.ok) {
        const setData = await setRes.json();
        setSettings(setData.data || null);
      }
    } catch (err) {
      console.error('Failed to load initial catalog data:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  // Navigation Handler with Browser History Synchronization
  const navigate = (
    view: AppView,
    params?: {
      productId?: string;
      blogSlug?: string;
      category?: string;
      brand?: string;
      search?: string;
    }
  ) => {
    setCurrentView(view);
    if (params?.productId !== undefined) setActiveProductId(params.productId);
    if (params?.blogSlug !== undefined) setActiveBlogSlug(params.blogSlug);
    if (params?.category !== undefined) setActiveCategory(params.category);
    if (params?.brand !== undefined) setActiveBrand(params.brand);
    if (params?.search !== undefined) setSearchQuery(params.search);

    // Compute URL hash for instant history and back/forward navigation
    let targetHash = `#/${view}`;
    if (view === 'home') targetHash = '#/';
    else if (view === 'product-detail' && params?.productId) targetHash = `#/product/${params.productId}`;
    else if (view === 'product-detail' && activeProductId) targetHash = `#/product/${activeProductId}`;
    else if (view === 'blog' && params?.blogSlug) targetHash = `#/blog/${params.blogSlug}`;
    else if (view === 'search' && params?.search) targetHash = `#/search?q=${encodeURIComponent(params.search)}`;
    else if (view === 'shop' && params?.category) targetHash = `#/shop?category=${encodeURIComponent(params.category)}`;

    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Management
  const addToCart = (product: Product, variant?: ProductVariant, quantity = 1) => {
    const unitPrice = variant ? (variant.salePrice || variant.price) : (product.salePrice || product.regularPrice);
    const itemId = `${product.id}-${variant?.id || 'base'}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          variant,
          quantity,
          price: unitPrice
        }
      ];
    });

    showToast(`Added ${product.name} to your golf bag.`);
    setIsCartOpen(true);
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removed from cart.', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Financial Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const taxableBase = Math.max(0, cartSubtotal - cartDiscount);
  const cartTax = Math.round(taxableBase * 0.18); // 18% GST standard Indian sports rate
  const cartTotal = taxableBase + cartTax;
  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Coupon Logic
  const applyCouponCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartSubtotal })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Invalid coupon code.' };
      }
      setAppliedCoupon({
        code: data.data.code,
        discountAmount: data.data.discountAmount,
        description: data.data.description
      });
      showToast(`Coupon ${data.data.code} applied! Saved ${formatINR(data.data.discountAmount)}.`);
      return { success: true, message: `Coupon applied: ${data.data.description}` };
    } catch {
      return { success: false, message: 'Failed to validate coupon code.' };
    }
  };

  const removeCouponCode = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.', 'info');
  };

  // Wishlist
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed from wishlist: ${product.name}`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Saved to wishlist: ${product.name}`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Comparison
  const addToCompare = (product: Product) => {
    if (compareList.some((p) => p.id === product.id)) {
      showToast(`${product.name} is already in comparison table.`, 'info');
      return;
    }
    if (compareList.length >= 4) {
      showToast('You can compare a maximum of 4 clubs side-by-side.', 'error');
      return;
    }
    setCompareList((prev) => [...prev, product]);
    showToast(`Added ${product.name} to comparison.`);
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  // Auth
  const login = (userData: User) => {
    setUser(userData);
    showToast(`Welcome back, ${userData.fullName}.`);
  };

  const logout = () => {
    setUser(null);
    showToast('You have signed out successfully.', 'info');
    navigate('home');
  };

  const quickLoginAs = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      const adminUser: User = {
        id: 'admin-1',
        fullName: 'CCDL Store Administrator',
        email: 'admin@fairwaylinks.ccdl.in',
        role: 'admin',
        token: 'mock_jwt_admin_token'
      };
      setUser(adminUser);
      showToast('Switched to Administrator session.');
      navigate('admin');
    } else {
      const customerUser: User = {
        id: 'cust-demo',
        fullName: 'Sandeep Rao',
        email: 'sandeepaliens01@gmail.com',
        phone: '+91 98450 12345',
        role: 'customer',
        token: 'mock_jwt_customer_token'
      };
      setUser(customerUser);
      showToast('Signed in as Sandeep Rao (Customer).');
    }
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        activeProductId,
        activeBlogSlug,
        activeCategory,
        activeBrand,
        searchQuery,
        navigate,

        products,
        categories,
        isLoadingProducts,
        refreshProducts,

        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartDiscount,
        cartTax,
        cartTotal,
        cartItemsCount,

        appliedCoupon,
        applyCouponCode,
        removeCouponCode,

        wishlist,
        toggleWishlist,
        isInWishlist,

        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,

        user,
        login,
        logout,
        quickLoginAs,

        settings,
        lastPlacedOrder,
        setLastPlacedOrder,

        toasts,
        showToast,
        removeToast,
        formatINR
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
