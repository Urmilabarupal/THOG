/**
 * @file src/admin/AdminLayout.tsx
 * @purpose Backoffice administration layout with sidebar navigation across all 17 management modules.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Features responsive sidebar, status metrics, module switching, and direct store return.
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  Warehouse,
  ShoppingBag,
  Users,
  CreditCard,
  RotateCcw,
  Ticket,
  Truck,
  MessageSquare,
  BarChart,
  Megaphone,
  FileText,
  UserCheck,
  Settings,
  ArrowLeft,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { AdminDashboard } from './AdminDashboard.tsx';
import { AdminProducts } from './AdminProducts.tsx';
import { AdminCategories } from './AdminCategories.tsx';
import { AdminBrands } from './AdminBrands.tsx';
import { AdminInventory } from './AdminInventory.tsx';
import { AdminOrders } from './AdminOrders.tsx';
import { AdminCustomers } from './AdminCustomers.tsx';
import { AdminPayments } from './AdminPayments.tsx';
import { AdminRefunds } from './AdminRefunds.tsx';
import { AdminCoupons } from './AdminCoupons.tsx';
import { AdminShipping } from './AdminShipping.tsx';
import { AdminReviews } from './AdminReviews.tsx';
import { AdminReports } from './AdminReports.tsx';
import { AdminBanners } from './AdminBanners.tsx';
import { AdminContent } from './AdminContent.tsx';
import { AdminUsers } from './AdminUsers.tsx';
import { AdminSettings } from './AdminSettings.tsx';

export type AdminModule =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'brands'
  | 'inventory'
  | 'orders'
  | 'customers'
  | 'payments'
  | 'refunds'
  | 'coupons'
  | 'shipping'
  | 'reviews'
  | 'reports'
  | 'banners'
  | 'content'
  | 'admin-users'
  | 'settings';

export const AdminLayout: React.FC = () => {
  const { navigate, user } = useStore();
  const [activeModule, setActiveModule] = useState<AdminModule>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Analytics', icon: LayoutDashboard },
    { id: 'products', label: 'Product Management', icon: Package },
    { id: 'categories', label: 'Category Management', icon: Layers },
    { id: 'brands', label: 'Brand Management', icon: Tag },
    { id: 'inventory', label: 'Inventory & Stock Alerts', icon: Warehouse },
    { id: 'orders', label: 'Order Management', icon: ShoppingBag },
    { id: 'customers', label: 'Customer Management', icon: Users },
    { id: 'payments', label: 'Payment Gateway (Razorpay)', icon: CreditCard },
    { id: 'refunds', label: 'Refund Management', icon: RotateCcw },
    { id: 'coupons', label: 'Coupon & Discount Codes', icon: Ticket },
    { id: 'shipping', label: 'Shipping (Shiprocket)', icon: Truck },
    { id: 'reviews', label: 'Customer Reviews Moderation', icon: MessageSquare },
    { id: 'reports', label: 'Sales Reports & Export', icon: BarChart },
    { id: 'banners', label: 'Website Announcement Banners', icon: Megaphone },
    { id: 'content', label: 'Content Management (Blog/FAQ)', icon: FileText },
    { id: 'admin-users', label: 'Admin Staff & Roles', icon: UserCheck },
    { id: 'settings', label: 'General Store Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-stone-900 text-white p-4 flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span className="font-serif-display font-bold text-sm">The House of Gaunt Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('home')}
            className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded"
          >
            Storefront
          </button>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 text-stone-300 hover:text-white"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-stone-900 text-stone-300 flex-shrink-0 border-r border-stone-800 flex flex-col justify-between`}
      >
        <div className="p-5">
          {/* Brand & Portal Label */}
          <div className="hidden md:flex items-center justify-between border-b border-stone-800 pb-4 mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Store Console
              </span>
              <h2 className="text-base font-serif-display font-bold text-white">
                The House of Gaunt Admin
              </h2>
            </div>
            <Shield className="w-5 h-5 text-emerald-500" />
          </div>

          {/* Return to Storefront button */}
          <button
            onClick={() => navigate('home')}
            className="w-full mb-4 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Live Storefront</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveModule(item.id as AdminModule);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-[#0D3B2E] text-white font-semibold'
                      : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User status */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/40 text-[11px] text-stone-400">
          <p className="font-semibold text-stone-200 truncate">{user?.fullName || 'Administrator'}</p>
          <p className="text-stone-500 truncate">{user?.email || 'admin@fairwaylinks.ccdl.in'}</p>
          <span className="inline-block mt-1 text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
            Super Admin Access
          </span>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {activeModule === 'dashboard' && <AdminDashboard setActiveModule={setActiveModule} />}
          {activeModule === 'products' && <AdminProducts />}
          {activeModule === 'categories' && <AdminCategories />}
          {activeModule === 'brands' && <AdminBrands />}
          {activeModule === 'inventory' && <AdminInventory />}
          {activeModule === 'orders' && <AdminOrders />}
          {activeModule === 'customers' && <AdminCustomers />}
          {activeModule === 'payments' && <AdminPayments />}
          {activeModule === 'refunds' && <AdminRefunds />}
          {activeModule === 'coupons' && <AdminCoupons />}
          {activeModule === 'shipping' && <AdminShipping />}
          {activeModule === 'reviews' && <AdminReviews />}
          {activeModule === 'reports' && <AdminReports />}
          {activeModule === 'banners' && <AdminBanners />}
          {activeModule === 'content' && <AdminContent />}
          {activeModule === 'admin-users' && <AdminUsers />}
          {activeModule === 'settings' && <AdminSettings />}
        </div>
      </main>
    </div>
  );
};
