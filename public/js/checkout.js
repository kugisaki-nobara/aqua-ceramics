/**
 * AQUA CERAMICS LLP - Checkout & Order Submission Handler
 */

const CheckoutModule = {
  renderOrderSummary() {
    const summaryContainer = document.getElementById('checkout-order-summary');
    const totalElem = document.getElementById('checkout-grand-total');

    if (!summaryContainer) return;

    const cart = AquaApp.getCart();

    if (cart.length === 0) {
      window.location.href = '/cart.html';
      return;
    }

    let total = 0;

    summaryContainer.innerHTML = cart.map(item => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      return `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border-color);">
          <div>
            <div style="font-weight: 700; color: var(--primary-blue-deep); font-size: 0.95rem;">${item.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${item.code} x ${item.quantity}</div>
          </div>
          <div style="font-weight: 700; color: var(--text-main);">${AquaApp.formatCurrency(subtotal)}</div>
        </div>
      `;
    }).join('');

    if (totalElem) totalElem.textContent = AquaApp.formatCurrency(total);
  },

  async handleOrderSubmission(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submit-order-btn');
    const cart = AquaApp.getCart();

    if (cart.length === 0) {
      AquaApp.showToast('Your shopping cart is empty.', 'warning');
      return;
    }

    const name = document.getElementById('customer_name').value.trim();
    const phone = document.getElementById('customer_phone').value.trim();
    const email = document.getElementById('customer_email').value.trim();
    const address = document.getElementById('delivery_address').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const postal_code = document.getElementById('postal_code').value.trim();
    const notes = document.getElementById('order_notes') ? document.getElementById('order_notes').value.trim() : '';
    const paymentMethod = document.querySelector('input[name="payment_method"]:checked')?.value || 'COD';

    if (!name || !phone || !address || !city || !state || !postal_code) {
      AquaApp.showToast('Please fill in all required delivery address fields.', 'error');
      return;
    }

    const items = cart.map(i => ({
      productId: i.id,
      quantity: i.quantity
    }));

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Processing Order...';
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name,
          customer_phone: phone,
          customer_email: email,
          address: address,
          city: city,
          state: state,
          postal_code: postal_code,
          notes: notes,
          payment_method: paymentMethod,
          items: items
        })
      });

      const data = await response.json();

      if (data.success) {
        // Clear local cart
        localStorage.removeItem('aqua_cart');
        AquaApp.updateCartBadge();

        AquaApp.showToast('Order placed successfully!', 'success');
        
        // Store reference for confirmation page view
        sessionStorage.setItem('last_order_ref', data.data.order_ref);
        
        setTimeout(() => {
          window.location.href = `/order-confirmation.html?ref=${data.data.order_ref}`;
        }, 800);
      } else {
        AquaApp.showToast(data.message || 'Order submission failed.', 'error');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Confirm & Place Order';
        }
      }
    } catch (err) {
      console.error('Checkout error:', err);
      AquaApp.showToast('Network error while processing order.', 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirm & Place Order';
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CheckoutModule.renderOrderSummary();

  const form = document.getElementById('checkout-form');
  if (form) {
    form.addEventListener('submit', (e) => CheckoutModule.handleOrderSubmission(e));
  }
});
