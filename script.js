// script.js

document.addEventListener('DOMContentLoaded', () => {

  // --- Navigation & UI Effects ---

  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navMobile = document.querySelector('.nav-mobile');

  // Navigation scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Show/hide back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (window.scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navMobile.classList.toggle('active');
    const isOpen = navMobile.classList.contains('active');
    navToggle.innerHTML = isOpen
      ? '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
      : '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
  });

  // Smooth scrolling

  

  function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile menu if open
      if (navMobile.classList.contains('active')) {
        navMobile.classList.remove('active');
        navToggle.innerHTML = '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
      }
    }
  }

  // Add click listeners to all navigation links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href');
      smoothScroll(target);
    });
  });

  // Back to top button
  document.querySelector('.back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Scroll indicator
  document.querySelector('.scroll-indicator').addEventListener('click', () => {
    smoothScroll('#about');
  });

  // Open external links in new tab
  document.querySelectorAll('.project-card button, .social-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const url = btn.getAttribute('data-url');
      if (url && url !== '#') {
        window.open(url, '_blank');
      }
    });
  });

  // --- Contact Form Logic ---

  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const nameInput = this.querySelector('[name="from_name"]');
    const emailInput = this.querySelector('[name="from_email"]');
    const messageInput = this.querySelector('[name="message"]');

    // Basic validation
    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    if (!isValidEmail(emailInput.value.trim())) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    // If validation passes, send the email
    emailjs.sendForm('service_mtghmqa', 'template_z3r6imr', this)
      .then(() => {
        showToast('Message sent! Thank you for reaching out.', 'success');
        contactForm.reset(); // Clear the form
      }, (err) => {
        showToast('Failed to send message. Please try again.', 'error');
        console.error('EmailJS Error:', err);
      });
  });

  // Email validation helper
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Toast notification
  function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
      max-width: 400px;
    `;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
      toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
  }

  // Add toast animations to the document's head
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

});

