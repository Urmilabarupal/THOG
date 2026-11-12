/**
 * @file src/components/Header.tsx
 * @purpose Top navigation header complying with the strict 3-zone Top Bar Contract.
 * @dependencies lucide-react, ../context/StoreContext.tsx.
 * @implementation Features Zone 1 brand wordmark, Zone 2 single-line text links with subtle
 * hover states, and Zone 3 cart/account actions. Includes search trigger, comparison badge,
 * wishlist counter, and administrative portal switcher.
 */

import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, BarChart3, User as UserIcon, Shield, ChevronDown, Menu, X } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const Header: React.FC = () => {
  const {
    navigate,
    cartItemsCount,
    cartSubtotal,
    setIsCartOpen,
    wishlist,
    compareList,
    user,
    logout,
    quickLoginAs,
    formatINR,
    settings
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate('search', { search: searchInput.trim() });
      setIsSearchOpen(false);
      setSearchInput('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Promotional Top Bar */}
      {settings?.bannerEnabled && (
        <div className="bg-[#0D3B2E] text-stone-100 text-xs py-2 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2">
          <span>{settings.bannerAnnouncement}</span>
          <span className="hidden md:inline text-[#C5A880]">· Certified Official Retail Partner</span>
        </div>
      )}

      {/* Main 3-Zone Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* ZONE 1: Single text element wordmark */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-stone-600 hover:text-stone-900"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <button
            onClick={() => navigate('home')}
            className="text-2xl font-serif-display font-semibold tracking-tight text-[#0D3B2E] whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            The House of Gaunt
          </button>
        </div>

        {/* ZONE 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-700">
          <button
            onClick={() => navigate('shop')}
            className="hover:text-[#0D3B2E] transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Shop All
          </button>
          <button
            onClick={() => navigate('categories')}
            className="hover:text-[#0D3B2E] transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Categories
          </button>
          <button
            onClick={() => navigate('shop', { category: 'golf-clubs' })}
            className="hover:text-[#0D3B2E] transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Tour Clubs
          </button>
          <button
            onClick={() => navigate('about')}
            className="hover:text-[#0D3B2E] transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Custom Fitting & Heritage
          </button>
          <button
            onClick={() => navigate('blog')}
            className="hover:text-[#0D3B2E] transition-colors whitespace-nowrap shrink-0 py-1"
          >
            The Journal
          </button>
        </nav>

        {/* ZONE 3: 1 primary action cluster */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 text-stone-600 hover:text-[#0D3B2E] transition-colors rounded-full hover:bg-stone-100"
            aria-label="Search Catalog"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Comparison */}
          <button
            onClick={() => navigate('compare')}
            className="relative p-2 text-stone-600 hover:text-[#0D3B2E] transition-colors rounded-full hover:bg-stone-100 hidden sm:block"
            title="Club Comparison"
            aria-label="Compare Equipment"
          >
            <BarChart3 className="w-5 h-5" />
            {compareList.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-stone-800 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {compareList.length}
              </span>
            )}
          </button>

          {/* Wishlist */}
          <button
            onClick={() => navigate('wishlist')}
            className="relative p-2 text-stone-600 hover:text-[#0D3B2E] transition-colors rounded-full hover:bg-stone-100 hidden sm:block"
            title="Saved Gear"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#0D3B2E] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Account & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className="flex items-center gap-1.5 p-2 text-stone-700 hover:text-[#0D3B2E] transition-colors rounded-lg hover:bg-stone-100 text-xs font-medium"
              aria-label="User Account Menu"
            >
              <UserIcon className="w-5 h-5 text-stone-600" />
              <span className="hidden lg:inline-block max-w-[100px] truncate">
                {user ? user.fullName.split(' ')[0] : 'Sign In'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {isAccountMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white border border-stone-200 rounded-lg shadow-xl py-2 z-50 text-xs text-stone-700"
                onMouseLeave={() => setIsAccountMenuOpen(false)}
              >
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="font-semibold text-stone-900 truncate">{user.fullName}</p>
                      <p className="text-stone-500 text-[11px] truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-medium text-[#0D3B2E]">
                        Role: {user.role === 'admin' ? 'Administrator' : 'Customer'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        navigate('customer-dashboard');
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-stone-50 transition-colors"
                    >
                      Customer Dashboard
                    </button>
                    <button
                      onClick={() => {
                        navigate('my-orders');
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-stone-50 transition-colors"
                    >
                      My Orders & Invoices
                    </button>
                    <button
                      onClick={() => {
                        navigate('order-tracking');
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-stone-50 transition-colors"
                    >
                      Live Shiprocket Tracking
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          navigate('admin');
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-[#0D3B2E] font-semibold bg-emerald-50/60 hover:bg-emerald-50 transition-colors flex items-center justify-between"
                      >
                        <span>Open Admin Panel</span>
                        <Shield className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <div className="border-t border-stone-100 my-1"></div>
                    <button
                      onClick={() => {
                        logout();
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate('login');
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 font-medium hover:bg-stone-50"
                    >
                      Log In to Your Account
                    </button>
                    <button
                      onClick={() => {
                        navigate('register');
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-stone-50"
                    >
                      Create Customer Account
                    </button>
                  </>
                )}

                {/* Developer Role Switcher */}
                <div className="border-t border-stone-100 mt-1 pt-1 px-4 py-1.5 bg-stone-50/80">
                  <p className="text-[10px] text-stone-400 font-medium uppercase tracking-wider mb-1">Quick Role Switch</p>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        quickLoginAs('customer');
                        setIsAccountMenuOpen(false);
                      }}
                      className="flex-1 py-1 px-2 text-[10px] bg-white border border-stone-200 rounded text-stone-700 hover:border-stone-400 text-center font-medium"
                    >
                      Customer
                    </button>
                    <button
                      onClick={() => {
                        quickLoginAs('admin');
                        setIsAccountMenuOpen(false);
                      }}
                      className="flex-1 py-1 px-2 text-[10px] bg-[#0D3B2E] text-white rounded text-center font-medium hover:bg-[#092b21]"
                    >
                      Admin
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Primary Action: Shopping Cart Drawer Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0D3B2E] rounded-md hover:bg-[#092b21] transition-colors whitespace-nowrap shrink-0 shadow-sm"
            aria-label="View Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#C5A880] text-[#0D3B2E] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline tabular-nums">
              {cartItemsCount > 0 ? formatINR(cartSubtotal) : 'Golf Bag'}
            </span>
          </button>
        </div>
      </div>

      {/* Expandable Search Drawer */}
      {isSearchOpen && (
        <div className="border-t border-stone-200 bg-stone-50 px-4 py-4 animate-in fade-in duration-150">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-5 h-5 absolute left-3.5 text-stone-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search drivers, tour bags, urethane balls, Rangefinders, Titleist, TaylorMade..."
                className="w-full pl-10 pr-24 py-2.5 bg-white border border-stone-300 rounded-md text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#0D3B2E] focus:border-[#0D3B2E]"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#0D3B2E] rounded hover:bg-[#092b21] transition-colors"
              >
                Search
              </button>
            </form>
            <div className="mt-2.5 flex items-center gap-2 text-xs text-stone-500">
              <span className="font-medium text-stone-700">Popular Searches:</span>
              <button onClick={() => navigate('search', { search: 'Titanium Driver' })} className="hover:text-[#0D3B2E] underline">Titanium Driver</button>
              <span>·</span>
              <button onClick={() => navigate('search', { search: 'Tour Bag' })} className="hover:text-[#0D3B2E] underline">Tour Bag</button>
              <span>·</span>
              <button onClick={() => navigate('search', { search: 'Pro V1' })} className="hover:text-[#0D3B2E] underline">Pro V1</button>
              <span>·</span>
              <button onClick={() => navigate('search', { search: 'Waterproof Shoes' })} className="hover:text-[#0D3B2E] underline">Waterproof Shoes</button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 py-6 space-y-4">
          <button
            onClick={() => { navigate('shop'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left text-base font-medium text-stone-800 py-1"
          >
            Shop All Products
          </button>
          <button
            onClick={() => { navigate('categories'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left text-base font-medium text-stone-800 py-1"
          >
            Product Categories
          </button>
          <button
            onClick={() => { navigate('shop', { category: 'golf-clubs' }); setIsMobileMenuOpen(false); }}
            className="block w-full text-left text-base font-medium text-stone-800 py-1"
          >
            Golf Clubs & Drivers
          </button>
          <button
            onClick={() => { navigate('compare'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left text-base font-medium text-stone-800 py-1"
          >
            Club Comparison ({compareList.length})
          </button>
          <button
            onClick={() => { navigate('wishlist'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left text-base font-medium text-stone-800 py-1"
          >
            Saved Wishlist ({wishlist.length})
          </button>
          <button
            onClick={() => { navigate('about'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left text-base font-medium text-stone-800 py-1"
          >
            About The House of Gaunt
          </button>
          <button
            onClick={() => { navigate('contact'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left text-base font-medium text-stone-800 py-1"
          >
            Fitting Studios & Showrooms
          </button>
          <button
            onClick={() => { navigate('blog'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left text-base font-medium text-stone-800 py-1"
          >
            The Journal
          </button>
          <button
            onClick={() => { navigate('faq'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left text-base font-medium text-stone-800 py-1"
          >
            FAQs & Fitting Guidance
          </button>
          <div className="pt-4 border-t border-stone-200">
            <button
              onClick={() => { navigate('admin'); setIsMobileMenuOpen(false); }}
              className="w-full py-2.5 px-4 bg-stone-900 text-white rounded text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Management Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
