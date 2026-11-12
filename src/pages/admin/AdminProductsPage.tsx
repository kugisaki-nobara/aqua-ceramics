import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Package, 
  Check, 
  X, 
  Sparkles, 
  RotateCcw,
  SlidersHorizontal,
  Image as ImageIcon,
  AlertTriangle,
  Building2,
  DollarSign,
  Tag,
  Layers,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Product } from '../../types';

export const AdminProductsPage: React.FC = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [submitting, setSubmitting] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Delete Confirmation Modal State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form Fields
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Sanitaryware & Closets');
  const [formBrand, setFormBrand] = useState('Aqua Ceramics');
  const [formPrice, setFormPrice] = useState<number | ''>(0);
  const [formPromoPrice, setFormPromoPrice] = useState<number | ''>('');
  const [formStock, setFormStock] = useState<number | ''>(25);
  const [formAvailability, setFormAvailability] = useState('Available for Supply');
  const [formDesc, setFormDesc] = useState('');
  const [formDimensions, setFormDimensions] = useState('');
  const [formMaterial, setFormMaterial] = useState('');
  const [formColorVariants, setFormColorVariants] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formSourceRef, setFormSourceRef] = useState('');
  const [formKeyFeatures, setFormKeyFeatures] = useState('');
  const [formFeatured, setFormFeatured] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/products/categories')
      ]);

      if (prodRes.ok) {
        const data = await prodRes.json();
        setProducts(data.products || []);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.categories || []);
      }
    } catch (e) {
      console.error('Failed to load products/categories', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormCode(`AQ-${Date.now().toString().slice(-6)}`);
    setFormName('');
    setFormCategory(categories[0] || 'Sanitaryware & Closets');
    setFormBrand('Aqua Ceramics');
    setFormPrice(0);
    setFormPromoPrice('');
    setFormStock(20);
    setFormAvailability('Available for Supply');
    setFormDesc('');
    setFormDimensions('');
    setFormMaterial('');
    setFormColorVariants('');
    setFormImageUrl('');
    setFormSourceRef('');
    setFormKeyFeatures('');
    setFormFeatured(0);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormCode(p.code);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormBrand(p.brand || 'Aqua Ceramics');
    setFormPrice(p.price !== undefined ? p.price : 0);
    setFormPromoPrice(p.promotional_price !== undefined && p.promotional_price !== null ? p.promotional_price : '');
    setFormStock(p.stock !== undefined ? p.stock : 0);
    setFormAvailability(p.availability || 'Available for Supply');
    setFormDesc(p.description || '');
    setFormDimensions(p.dimensions || '');
    setFormMaterial(p.material_finish || '');
    setFormColorVariants(p.color_variants || '');
    setFormImageUrl(p.image_url || '');
    setFormSourceRef(p.source_ref || '');
    
    // Format key features as newline-separated
    let featuresStr = '';
    if (Array.isArray(p.key_features)) {
      featuresStr = p.key_features.join('\n');
    } else if (typeof p.key_features === 'string') {
      try {
        const parsed = JSON.parse(p.key_features);
        featuresStr = Array.isArray(parsed) ? parsed.join('\n') : p.key_features;
      } catch (e) {
        featuresStr = p.key_features;
      }
    }
    setFormKeyFeatures(featuresStr);
    setFormFeatured(p.is_featured || 0);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError('Product name is required.');
      return;
    }
    if (!formCode.trim()) {
      setFormError('Product code / SKU is required.');
      return;
    }
    if (!formCategory.trim()) {
      setFormError('Please select or specify a category.');
      return;
    }

    try {
      setSubmitting(true);

      const featuresArray = formKeyFeatures
        .split('\n')
        .map(f => f.trim())
        .filter(f => f.length > 0);

      const payload = {
        code: formCode.trim().toUpperCase(),
        name: formName.trim(),
        category: formCategory.trim(),
        brand: formBrand.trim() || 'Aqua Ceramics',
        price: formPrice === '' ? 0 : Number(formPrice),
        promotional_price: formPromoPrice === '' || formPromoPrice === null ? null : Number(formPromoPrice),
        stock: formStock === '' ? 0 : Number(formStock),
        availability: formAvailability.trim() || 'Available for Supply',
        description: formDesc.trim(),
        dimensions: formDimensions.trim(),
        material_finish: formMaterial.trim(),
        color_variants: formColorVariants.trim(),
        image_url: formImageUrl.trim(),
        source_ref: formSourceRef.trim(),
        key_features: featuresArray,
        is_featured: formFeatured ? 1 : 0
      };

      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();

      if (!res.ok || !resData.success) {
        throw new Error(resData.message || resData.error || 'Failed to save product');
      }

      setIsModalOpen(false);
      await fetchProducts();
    } catch (err: any) {
      setFormError(err.message || 'Error saving product details.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteProduct = (p: Product) => {
    setProductToDelete(p);
  };

  const executeDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/products/${productToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProductToDelete(null);
        await fetchProducts();
      } else {
        alert(data.message || 'Failed to delete product.');
      }
    } catch (e: any) {
      alert(e.message || 'Network error deleting product.');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch = 
      p.name.toLowerCase().includes(q) || 
      p.code.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q));

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold uppercase tracking-wider mb-1">
            Authorized Admin Control
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">
            Catalog &amp; Product Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Add new listings, edit names, brands, descriptions, pictures, prices, and manage active SKUs.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, SKU code, brand, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
          >
            <option value="All">All Categories ({products.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
            Showing <strong className="text-slate-900">{filtered.length}</strong> of {products.length}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Product &amp; Image</th>
                <th className="py-3.5 px-4 font-semibold">SKU / Code</th>
                <th className="py-3.5 px-4 font-semibold">Brand</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Pricing</th>
                <th className="py-3.5 px-4 font-semibold">Stock / Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    Loading catalog database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No products matching your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Product & Image */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0 text-slate-400">
                          {product.image_url ? (
                            <img 
                              src={product.image_url} 
                              alt={product.name} 
                              className="w-full h-full object-contain p-1"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="text-[9px] text-center px-1 font-medium text-slate-400 leading-tight">
                              Pending Image
                            </div>
                          )}
                        </div>
                        <div className="max-w-xs">
                          <div className="font-bold text-slate-900 leading-snug line-clamp-1">{product.name}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {product.description || 'No description provided.'}
                          </div>
                          {product.dimensions && (
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              Dim: {product.dimensions}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* SKU Code */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                      {product.code}
                    </td>

                    {/* Brand */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {product.brand || 'Aqua Ceramics'}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-slate-600 font-medium max-w-[160px] truncate">
                      {product.category}
                    </td>

                    {/* Pricing */}
                    <td className="py-3.5 px-4 font-mono">
                      {product.price > 0 ? (
                        <>
                          <div className="font-bold text-slate-900">
                            ₹{product.price.toLocaleString('en-IN')}
                          </div>
                          {product.promotional_price ? (
                            <span className="block text-[10px] text-emerald-600 font-sans font-medium">
                              Promo: ₹{product.promotional_price.toLocaleString('en-IN')}
                            </span>
                          ) : null}
                        </>
                      ) : (
                        <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-sans font-semibold">
                          Price not listed
                        </span>
                      )}
                    </td>

                    {/* Stock / Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        product.stock > 10
                          ? 'bg-emerald-100 text-emerald-800'
                          : product.stock > 0
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {product.stock} units
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {product.availability}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDeleteProduct(product)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-xl font-serif font-bold text-slate-900">
                  {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product to Catalog'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Changes take effect immediately across the public catalog and search filters.
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-5 text-xs">
              {/* Row 1: Name, Code & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. AGL Marco Thin-Rim Table Top Basin"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    SKU / Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="e.g. AGL-S127212556"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white font-mono text-sm uppercase"
                  />
                </div>
              </div>

              {/* Row 2: Category & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <input
                    type="text"
                    list="catalog-categories-list"
                    required
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="Select or enter category..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  />
                  <datalist id="catalog-categories-list">
                    {categories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="e.g. AGL, Jaquar, Zero B, Ardex Endura, COLORS"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Row 3: Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Price (₹) <span className="font-normal text-slate-400 lowercase">(0 for quote)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Promotional Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formPromoPrice}
                    onChange={(e) => setFormPromoPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Optional discount price"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white font-mono"
                  />
                </div>
              </div>

              {/* Row 4: Image URL & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Product Image URL
                  </label>
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="/images/products/... or web URL (Leave empty if to be attached)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Leave blank to show clean "Image to be attached" placeholder.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Availability Status
                  </label>
                  <select
                    value={formAvailability}
                    onChange={(e) => setFormAvailability(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  >
                    <option value="Available for Supply">Available for Supply</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Price not listed - Request Quote">Price not listed - Request Quote</option>
                    <option value="Made to Order / Project Supply">Made to Order / Project Supply</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Dimensions, Material & Source Reference */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    value={formDimensions}
                    onChange={(e) => setFormDimensions(e.target.value)}
                    placeholder="e.g. 405 x 405 x 130 mm"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Material / Finish
                  </label>
                  <input
                    type="text"
                    value={formMaterial}
                    onChange={(e) => setFormMaterial(e.target.value)}
                    placeholder="e.g. Ceramic Glaze / Chrome"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Featured Item?
                  </label>
                  <select
                    value={formFeatured}
                    onChange={(e) => setFormFeatured(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white"
                  >
                    <option value={0}>No (Standard Listing)</option>
                    <option value={1}>Yes (Featured in Showcase)</option>
                  </select>
                </div>
              </div>

              {/* Source PDF Citation Reference */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Source Catalog Reference (Citation / Page)
                </label>
                <input
                  type="text"
                  value={formSourceRef}
                  onChange={(e) => setFormSourceRef(e.target.value)}
                  placeholder="e.g. AGL SEP 26 Faucet Pricelist.pdf — printed page 14 (PDF page 14)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white font-mono"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Product Description *
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Official specifications, model overview, application scope..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white leading-relaxed"
                />
              </div>

              {/* Key Features */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Key Specifications / Features (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formKeyFeatures}
                  onChange={(e) => setFormKeyFeatures(e.target.value)}
                  placeholder="Spout Reach: 120 mm&#10;Total Height: 165 mm&#10;Aerator with Neoperl flow cartridge"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white font-mono leading-relaxed"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">
              Confirm Product Deletion
            </h3>
            
            <p className="text-slate-600 text-xs leading-relaxed mb-6">
              Are you sure you want to permanently delete <strong className="text-slate-900">"{productToDelete.name}"</strong> (<span className="font-mono">{productToDelete.code}</span>) from the live catalog?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setProductToDelete(null)}
                className="px-5 py-2.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={executeDeleteProduct}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
