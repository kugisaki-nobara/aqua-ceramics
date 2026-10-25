/**
 * AQUA CERAMICS LLP - Administration Portal Script
 */

const AdminModule = {
  getToken() {
    return localStorage.getItem('aqua_admin_token');
  },

  setToken(token) {
    localStorage.setItem('aqua_admin_token', token);
  },

  logout() {
    localStorage.removeItem('aqua_admin_token');
    window.location.href = '/admin-login.html';
  },

  async handleLogin(e) {
    e.preventDefault();
    const userElem = document.getElementById('admin_username');
    const passElem = document.getElementById('admin_password');
    const loginBtn = document.getElementById('admin-login-btn');

    if (!userElem || !passElem) return;

    if (loginBtn) {
      loginBtn.disabled = true;
      loginBtn.textContent = 'Authenticating...';
    }

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userElem.value.trim(),
          password: passElem.value.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        this.setToken(data.token);
        AquaApp.showToast('Authentication successful', 'success');
        setTimeout(() => {
          window.location.href = '/admin.html';
        }, 500);
      } else {
        AquaApp.showToast(data.message || 'Authentication failed.', 'error');
      }
    } catch (err) {
      console.error('Login error:', err);
      AquaApp.showToast('Network error during authentication.', 'error');
    } finally {
      if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Sign In to Admin Portal';
      }
    }
  },

  async loadAdminData() {
    const token = this.getToken();
    if (!token) {
      window.location.href = '/admin-login.html';
      return;
    }

    this.loadOrders();
    this.loadEnquiries();
    this.loadProducts();
  },

  async loadOrders() {
    const token = this.getToken();
    const container = document.getElementById('admin-orders-list');
    if (!container) return;

    try {
      const response = await fetch('/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) {
        if (data.data.length === 0) {
          container.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px;">No customer orders found.</td></tr>';
          return;
        }

        container.innerHTML = data.data.map(ord => `
          <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 12px; font-weight: 700; color: var(--primary-blue-deep);">${ord.order_ref}</td>
            <td style="padding: 12px;">
              <div><strong>${ord.customer_name}</strong></div>
              <div style="font-size: 0.85rem; color: var(--text-muted);">${ord.customer_phone}</div>
            </td>
            <td style="padding: 12px; font-weight: 700;">${AquaApp.formatCurrency(ord.total_amount)}</td>
            <td style="padding: 12px;">
              <span class="badge" style="background: #e2e8f0; color: var(--text-main);">${ord.payment_method} (${ord.payment_status})</span>
            </td>
            <td style="padding: 12px;">
              <select onchange="AdminModule.updateOrderStatus(${ord.id}, this.value)" style="padding: 6px 10px; border-radius: 4px; border: 1px solid var(--border-color);">
                <option value="Pending" ${ord.order_status === 'Pending' ? 'selected' : ''}>Pending</option>
                <option value="Processing" ${ord.order_status === 'Processing' ? 'selected' : ''}>Processing</option>
                <option value="Shipped" ${ord.order_status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                <option value="Delivered" ${ord.order_status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                <option value="Cancelled" ${ord.order_status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
              </select>
            </td>
            <td style="padding: 12px; font-size: 0.85rem; color: var(--text-muted);">${new Date(ord.created_at).toLocaleDateString()}</td>
          </tr>
        `).join('');
      } else if (response.status === 401 || response.status === 403) {
        this.logout();
      }
    } catch (e) {
      console.error('Admin orders fetch error:', e);
    }
  },

  async updateOrderStatus(orderId, newStatus) {
    const token = this.getToken();
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ order_status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        AquaApp.showToast(data.message, 'success');
      }
    } catch (e) {
      AquaApp.showToast('Failed to update status.', 'error');
    }
  },

  async loadEnquiries() {
    const token = this.getToken();
    const container = document.getElementById('admin-enquiries-list');
    if (!container) return;

    try {
      const response = await fetch('/api/admin/enquiries', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) {
        if (data.data.length === 0) {
          container.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">No customer enquiries yet.</td></tr>';
          return;
        }

        container.innerHTML = data.data.map(enq => `
          <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 12px;">
              <div><strong>${enq.name}</strong></div>
              <div style="font-size: 0.85rem; color: var(--text-muted);">${enq.phone} ${enq.email ? '| ' + enq.email : ''}</div>
            </td>
            <td style="padding: 12px; font-weight: 600; color: var(--primary-blue);">${enq.product_of_interest}</td>
            <td style="padding: 12px; font-size: 0.9rem;">${enq.message}</td>
            <td style="padding: 12px;"><span class="badge badge-in-stock">${enq.status}</span></td>
            <td style="padding: 12px; font-size: 0.85rem; color: var(--text-muted);">${new Date(enq.created_at).toLocaleDateString()}</td>
          </tr>
        `).join('');
      }
    } catch (e) {
      console.error('Enquiries fetch error:', e);
    }
  },

  async loadProducts() {
    const container = document.getElementById('admin-products-list');
    if (!container) return;

    try {
      const response = await fetch('/api/products');
      const data = await response.json();

      if (data.success) {
        container.innerHTML = data.data.map(p => `
          <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 12px; font-weight: 700; color: var(--primary-blue-deep);">${p.code}</td>
            <td style="padding: 12px;"><strong>${p.name}</strong></td>
            <td style="padding: 12px;">${p.category}</td>
            <td style="padding: 12px; font-weight: 700;">${AquaApp.formatCurrency(p.price)}</td>
            <td style="padding: 12px;">${p.stock}</td>
            <td style="padding: 12px;">
              <button class="btn btn-outline btn-sm" onclick="AdminModule.deleteProduct(${p.id})">Delete</button>
            </td>
          </tr>
        `).join('');
      }
    } catch (e) {
      console.error('Admin products fetch error:', e);
    }
  },

  async deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const token = this.getToken();
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        AquaApp.showToast(data.message, 'success');
        this.loadProducts();
      }
    } catch (e) {
      AquaApp.showToast('Failed to delete product', 'error');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('admin-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => AdminModule.handleLogin(e));
  }

  if (document.getElementById('admin-orders-list')) {
    AdminModule.loadAdminData();
  }
});
