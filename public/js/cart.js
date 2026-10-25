/**
 * AQUA CERAMICS LLP - Shopping Cart View Handler
 */

const CartModule = {
  renderCartPage() {
    const cartContainer = document.getElementById('cart-items-container');
    const subtotalElem = document.getElementById('cart-subtotal');
    const grandTotalElem = document.getElementById('cart-grand-total');

    if (!cartContainer) return;

    const cart = AquaApp.getCart();

    if (cart.length === 0) {
      cartContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <div style="font-size: 3.5rem; margin-bottom: 16px; color: var(--primary-blue);">🛒</div>
          <h2 style="color: var(--primary-blue-deep); margin-bottom: 8px;">Your Shopping Cart is Empty</h2>
          <p style="color: var(--text-muted); margin-bottom: 24px;">Explore our premium sanitaryware collection and add your desired items.</p>
          <a href="/products.html" class="btn btn-primary">Browse Product Catalogue</a>
        </div>
      `;
      if (subtotalElem) subtotalElem.textContent = AquaApp.formatCurrency(0);
      if (grandTotalElem) grandTotalElem.textContent = AquaApp.formatCurrency(0);
      return;
    }

    let grandTotal = 0;

    cartContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${cart.map(item => {
          const itemSubtotal = item.price * item.quantity;
          grandTotal += itemSubtotal;
          return `
            <div style="display: grid; grid-template-columns: 80px 1fr auto auto; gap: 16px; align-items: center; background: #ffffff; padding: 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
              <img src="${item.image_url}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px;" onerror="this.src='/images/hero_sanitaryware_banner.jpg'" />
              <div>
                <span style="font-size: 0.75rem; color: var(--primary-blue); font-weight: 700;">${item.code}</span>
                <h4 style="font-size: 1.05rem; color: var(--primary-blue-deep); margin: 2px 0;">${item.name}</h4>
                <div style="color: var(--text-muted); font-size: 0.9rem;">Price: ${AquaApp.formatCurrency(item.price)}</div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <button class="btn btn-outline btn-sm" onclick="CartModule.updateQuantity(${item.id}, -1)">-</button>
                <span style="font-weight: 700; width: 24px; text-align: center;">${item.quantity}</span>
                <button class="btn btn-outline btn-sm" onclick="CartModule.updateQuantity(${item.id}, 1)">+</button>
              </div>
              <div style="text-align: right;">
                <div style="font-weight: 800; font-size: 1.1rem; color: var(--primary-blue-deep);">${AquaApp.formatCurrency(itemSubtotal)}</div>
                <button style="background: none; border: none; color: #e11d48; cursor: pointer; font-size: 0.85rem; margin-top: 4px;" onclick="CartModule.removeItem(${item.id})">Remove</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    if (subtotalElem) subtotalElem.textContent = AquaApp.formatCurrency(grandTotal);
    if (grandTotalElem) grandTotalElem.textContent = AquaApp.formatCurrency(grandTotal);
  },

  updateQuantity(productId, delta) {
    let cart = AquaApp.getCart();
    const item = cart.find(i => i.id === productId);

    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      this.removeItem(productId);
      return;
    }

    if (newQty > item.stock) {
      AquaApp.showToast(`Stock limit reached. Maximum ${item.stock} available.`, 'warning');
      return;
    }

    item.quantity = newQty;
    AquaApp.saveCart(cart);
    this.renderCartPage();
  },

  removeItem(productId) {
    let cart = AquaApp.getCart();
    cart = cart.filter(i => i.id !== productId);
    AquaApp.saveCart(cart);
    AquaApp.showToast('Item removed from cart', 'info');
    this.renderCartPage();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CartModule.renderCartPage();
});
