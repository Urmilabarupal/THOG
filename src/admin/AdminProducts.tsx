/**
 * @file src/admin/AdminProducts.tsx
 * @purpose Admin Product Management module with full CRUD operations, variant configurations, and pricing controls.
 * @dependencies lucide-react, ../context/StoreContext.tsx, ../types/index.ts.
 * @implementation Allows store managers to create, edit, price, and delete golf inventory without code edits.
 */

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Eye, X, Check, Filter } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { Product } from '../types/index.ts';

export const AdminProducts: React.FC = () => {
  const { products, categories, refreshProducts, formatINR, showToast } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    brand: 'CCDL Tour Edition',
    category: 'golf-clubs',
    regularPrice: 24999,
    salePrice: 19999,
    stockQuantity: 15,
    shortDescription: '',
    description: '',
    featured: false,
    status: 'published' as 'published' | 'draft' | 'archived',
    image: '/src/assets/images/golf_driver_titanium_pro_1794483678734.jpg'
  });

  const [isSaving, setIsSaving] = useState(false);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `CCDL-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: 'CCDL Tour Edition',
      category: 'golf-clubs',
      regularPrice: 24999,
      salePrice: 19999,
      stockQuantity: 15,
      shortDescription: 'Tournament-validated golf equipment with precision forged construction.',
      description: 'Manufactured to strict OEM tolerances for exceptional aerodynamic performance and acoustic feel.',
      featured: false,
      status: 'published',
      image: '/src/assets/images/golf_driver_titanium_pro_1794483678734.jpg'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      brand: p.brand,
      category: p.category,
      regularPrice: p.regularPrice,
      salePrice: p.salePrice || 0,
      stockQuantity: p.stockQuantity,
      shortDescription: p.shortDescription || '',
      description: p.description || '',
      featured: p.featured,
      status: p.status,
      image: p.images[0] || '/src/assets/images/golf_driver_titanium_pro_1794483678734.jpg'
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.regularPrice) {
      showToast('Name and price are required.', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        regularPrice: Number(formData.regularPrice),
        salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
        stockQuantity: Number(formData.stockQuantity),
        images: [formData.image]
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        showToast(editingProduct ? 'Product updated successfully.' : 'New product created.');
        setIsModalOpen(false);
        refreshProducts();
      } else {
        showToast(data.error || 'Failed to save product.', 'error');
      }
    } catch {
      showToast('Error saving product.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Product "${name}" deleted.`);
        refreshProducts();
      } else {
        showToast('Failed to delete product.', 'error');
      }
    } catch {
      showToast('Error deleting product.', 'error');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Inventory Catalog</span>
          <h1 className="text-2xl font-serif-display font-bold text-stone-900 mt-0.5">
            Product Management ({products.length} Products)
          </h1>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#0D3B2E] text-white text-xs font-semibold rounded hover:bg-[#092b21] flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Golf Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name, SKU, or brand..."
            className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-stone-500 font-medium">Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-stone-200 rounded overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Equipment Name & Brand</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Regular Price</th>
              <th className="py-3 px-4">Sale Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-stone-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images[0] || '/src/assets/images/golf_driver_titanium_pro_1794483678734.jpg'}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded border border-stone-200 shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-stone-900 line-clamp-1">{product.name}</p>
                      <div className="flex items-center gap-2 text-[11px] text-stone-400">
                        <span>{product.brand}</span>
                        <span>·</span>
                        <span className="font-mono text-[10px]">SKU: {product.sku}</span>
                        {product.featured && <span className="text-amber-700 font-semibold">★ Featured</span>}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4 capitalize">{product.category.replace('-', ' ')}</td>

                <td className="py-3 px-4 tabular-nums font-medium text-stone-900">
                  {formatINR(product.regularPrice)}
                </td>

                <td className="py-3 px-4 tabular-nums font-semibold text-[#0D3B2E]">
                  {product.salePrice ? formatINR(product.salePrice) : '—'}
                </td>

                <td className="py-3 px-4 tabular-nums font-medium">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      product.stockQuantity <= 5
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    {product.stockQuantity} in stock
                  </span>
                </td>

                <td className="py-3 px-4 uppercase text-[10px] font-bold">
                  <span
                    className={`px-2 py-0.5 rounded ${
                      product.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-1.5 text-stone-500 hover:text-[#0D3B2E] rounded hover:bg-stone-100 transition-colors"
                      title="Edit Product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-100 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded shadow-2xl p-6 sm:p-8 space-y-6 text-xs text-stone-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#0D3B2E]">Backoffice Catalog Form</span>
                <h3 className="text-lg font-serif-display font-bold text-stone-900">
                  {editingProduct ? `Edit: ${editingProduct.name}` : 'Add New Golf Equipment'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Product Title *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. CCDL Aurum Titanium EVO 9.0° Driver"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">SKU Code *</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. CCDL-DRV-AURUM9"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Callaway, Titleist, CCDL Tour Edition"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Regular Price (INR ₹) *</label>
                  <input
                    type="number"
                    value={formData.regularPrice}
                    onChange={(e) => setFormData({ ...formData, regularPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Sale Price (INR ₹)</label>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                    placeholder="Optional sale rate"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Initial Stock Quantity *</label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Short Description (Card Teaser)</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="e.g. Forged beta-titanium face with carbon crown"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Full Technical Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Product Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0D3B2E]"
                  >
                    <option value="published">Published (Live in Store)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 accent-[#0D3B2E]"
                  />
                  <label htmlFor="featured" className="text-stone-700 font-medium cursor-pointer">
                    Display as Featured Hero Equipment
                  </label>
                </div>
              </div>

              <div className="border-t border-stone-200 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#0D3B2E] text-white font-semibold rounded hover:bg-[#092b21] transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
