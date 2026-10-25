/**
 * AQUA CERAMICS LLP - Contact & Product Enquiry Script
 */

const ContactModule = {
  async handleEnquirySubmit(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('enquiry-submit-btn');
    const name = document.getElementById('enquiry_name').value.trim();
    const phone = document.getElementById('enquiry_phone').value.trim();
    const email = document.getElementById('enquiry_email').value.trim();
    const interest = document.getElementById('enquiry_interest').value;
    const message = document.getElementById('enquiry_message').value.trim();

    if (!name || !phone || !message) {
      AquaApp.showToast('Please provide your name, phone number, and enquiry message.', 'error');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Enquiry...';
    }

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          phone: phone,
          email: email,
          product_of_interest: interest,
          message: message
        })
      });

      const data = await response.json();

      if (data.success) {
        AquaApp.showToast(data.message, 'success');
        document.getElementById('enquiry-form').reset();
      } else {
        AquaApp.showToast(data.message || 'Failed to submit enquiry.', 'error');
      }
    } catch (err) {
      console.error('Enquiry submission error:', err);
      AquaApp.showToast('Network error while submitting enquiry.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Enquiry';
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('enquiry-form');
  if (form) {
    form.addEventListener('submit', (e) => ContactModule.handleEnquirySubmit(e));
  }
});
