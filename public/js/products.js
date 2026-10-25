/**
 * AQUA CERAMICS LLP - Product Catalogue Script
 * Handles product fetching, search, category filters, sorting, rendering
 */

const ProductModule = {
  allProducts: [],
  currentCategory: 'All',

  async fetchProducts() {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (data.success) {
        this.allProducts = data.data;
        this.renderCategoryTabs();
        this.applyFilters();
      } else {
        AquaApp.showToast('Failed to load product catalogue', 'error');
      }
    } catch (e) {
      console.error('Fetch error:', e);
      AquaApp.showToast('Error connecting to products server', 'error');
    }
  },

  renderCategoryTabs() {
    const categories = ['All', ...new Set(this.allProducts.map(p => p.category))];
    const container = document.getElementById('category-filter-container');
    if (!container) return;

    container.innerHTML = categories.map(cat => `
      <button class="btn ${this.currentCategory === cat ? 'btn-primary' : 'btn-outline'} btn-sm"
              onclick="ProductModule.filterCategory('${cat.replace(/'/g, "\\'")}')">
        ${cat}
      </button>
    `).join('');
  },

  filterCategory(category) {
    this.currentCategory = category;
    this.renderCategoryTabs();
    this.applyFilters();
  },

  applyFilters() {
    const searchInput = document.getElementById('product-search-input');
    const sortSelect = document.getElementById('product-sort-select');

    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const sortVal = sortSelect ? sortSelect.value : 'default';

    let filtered = this.allProducts.filter(p => {
      const matchesCategory = this.currentCategory === 'All' || p.category === this.currentCategory;
      const matchesSearch = !searchTerm ||
        p.name.toLowerCase().includes(searchTerm) ||
        p.code.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm);
      return matchesCategory && matchesSearch;
    });

    if (sortVal === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortVal === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortVal === 'name_asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    this.renderProductsGrid(filtered);
  },

  renderProductsGrid(products) {
    const grid = document.getElementById('products-grid-container');
    if (!grid) return;

    if (products.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <div style="font-size: 3rem; margin-bottom: 16px;">🔍</div>
          <h3 style="color: var(--primary-blue-deep); margin-bottom: 8px;">No Sanitaryware Products Found</h3>
          <p style="color: var(--text-muted); margin-bottom: 20px;">Try adjusting your search query or selecting a different category filter.</p>
          <button class="btn btn-outline" onclick="ProductModule.resetFilters()">Reset Search Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = products.map(p => `
      <div class="product-card">
        <div class="product-thumb">
          <span class="product-code-tag">${p.code}</span>
          <img src="${p.image_url}" alt="${p.name}" onerror="this.src='/images/hero_sanitaryware_banner.jpg'" />
        </div>
        <div class="product-details">
          <div class="product-cat">${p.category}</div>
          <h3 class="product-name">${p.name}</h3>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">
            Dimensions: ${p.dimensions || 'Standard'}
          </div>
          <div class="product-price-row">
            <div class="product-price">${AquaApp.formatCurrency(p.price)}</div>
            <span class="badge ${p.stock > 0 ? 'badge-in-stock' : 'badge-limited'}">
              ${p.stock > 0 ? `In Stock (${p.stock})` : 'Out of Stock'}
            </span>
          </div>
          <div class="product-card-actions">
            <a href="/product-details.html?id=${p.id}" class="btn btn-outline btn-sm">View Details</a>
            <button class="btn btn-primary btn-sm"
                    ${p.stock <= 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}
                    onclick="ProductModule.quickAddToCart(${p.id})">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `).join('');
  },

  quickAddToCart(productId) {
    const product = this.allProducts.find(p => p.id === productId);
    if (product) {
      AquaApp.addToCart(product, 1);
    }
  },

  resetFilters() {
    this.currentCategory = 'All';
    const searchInput = document.getElementById('product-search-input');
    if (searchInput) searchInput.value = '';
    this.renderCategoryTabs();
    this.applyFilters();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('products-grid-container')) {
    ProductModule.fetchProducts();

    const searchInput = document.getElementById('product-search-input');
    const sortSelect = document.getElementById('product-sort-select');

    if (searchInput) {
      searchInput.addEventListener('input', () => ProductModule.applyFilters());
    }
    if (sortSelect) {
      sortSelect.addEventListener('change', () => ProductModule.applyFilters());
    }
  }
});
