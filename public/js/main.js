/**
 * AQUA CERAMICS LLP - Main JavaScript Framework
 * Shared utilities, cart counter, toast notifications, mobile nav
 */

const AquaApp = {
  // Update header cart badge
  updateCartBadge() {
    const cart = this.getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badgeElements = document.querySelectorAll('.cart-badge');
    badgeElements.forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    });
  },

  // Get cart array from localStorage
  getCart() {
    try {
      const stored = localStorage.getItem('aqua_cart');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  // Save cart array to localStorage
  saveCart(cart) {
    try {
      localStorage.setItem('aqua_cart', JSON.stringify(cart));
      this.updateCartBadge();
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  },

  // Add item to cart
  addToCart(product, quantity = 1) {
    let cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      const newQty = cart[existingIndex].quantity + quantity;
      if (newQty > product.stock) {
        this.showToast(`Cannot add more. Only ${product.stock} units available in stock.`, 'warning');
        return false;
      }
      cart[existingIndex].quantity = newQty;
    } else {
      if (quantity > product.stock) {
        this.showToast(`Cannot add. Only ${product.stock} units available in stock.`, 'warning');
        return false;
      }
      cart.push({
        id: product.id,
        code: product.code,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        stock: product.stock,
        quantity: quantity
      });
    }

    this.saveCart(cart);
    this.showToast(`Added "${product.name}" to cart.`, 'success');
    return true;
  },

  // Display Toast Notification
  showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  // Format INR Currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  },

  // Initialize common UI listeners
  init() {
    this.updateCartBadge();

    // Mobile nav drawer listener
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
      menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('open');
      });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mainNav && mainNav.classList.contains('open') && !mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
        mainNav.classList.remove('open');
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AquaApp.init();
});
