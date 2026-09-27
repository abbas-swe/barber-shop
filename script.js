/**
 * Colombian Barbershop & Beauty Salon
 * Interactive Engine: Scroll-Driven Live Dynamics, Booking System, Gallery Lightbox, Live Hours
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. SCROLL PROGRESS BAR & HEADER SCROLL DYNAMICS
     ========================================================================== */
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const siteHeader = document.getElementById('siteHeader');
  const heroBgImg = document.getElementById('heroBgImg');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Top Progress Bar
    if (docHeight > 0 && scrollProgressBar) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    // Header Background Elevation
    if (siteHeader) {
      if (scrollTop > 50) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Parallax subtle motion on hero image
    if (heroBgImg && scrollTop < window.innerHeight) {
      heroBgImg.style.transform = `scale(1.05) translateY(${scrollTop * 0.25}px)`;
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollTop > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Active Section Spy for Desktop Nav
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // Back to top action
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     2. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-btn');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ==========================================================================
     3. INTERSECTION OBSERVER: SCROLL REVEALS & METRIC COUNTERS
     ========================================================================== */
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedElements.forEach(el => revealObserver.observe(el));

  // Dynamic Number Counter Animation
  const metricNumbers = document.querySelectorAll('.metric-number');
  let metricsCounted = false;

  const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !metricsCounted) {
        metricsCounted = true;
        animateAllCounters();
      }
    });
  }, { threshold: 0.5 });

  const metricsBar = document.querySelector('.hero-metrics-bar');
  if (metricsBar) {
    metricsObserver.observe(metricsBar);
  }

  function animateAllCounters() {
    metricNumbers.forEach(counter => {
      const targetStr = counter.getAttribute('data-target');
      const isDecimal = targetStr.includes('.');
      const target = parseFloat(targetStr);
      const duration = 1800; // ms
      const steps = 60;
      const stepTime = duration / steps;
      let current = 0;
      const increment = target / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = isDecimal ? target.toFixed(1) : Math.round(target).toLocaleString();
          clearInterval(timer);
        } else {
          counter.textContent = isDecimal ? current.toFixed(1) : Math.round(current).toLocaleString();
        }
      }, stepTime);
    });
  }

  /* ==========================================================================
     4. REAL-TIME SHOP OPERATING HOURS (LIVE STATUS)
     ========================================================================== */
  const liveStatusPill = document.getElementById('liveStatusPill');
  const liveStatusText = document.getElementById('liveStatusText');

  function updateShopLiveStatus() {
    if (!liveStatusPill || !liveStatusText) return;

    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
    const currentHour = now.getHours() + now.getMinutes() / 60;

    let isOpen = false;
    let closingTime = '';
    let openingTime = '';

    if (day >= 1 && day <= 5) {
      // Monday - Friday: 9:00 AM - 8:00 PM (9.0 to 20.0)
      if (currentHour >= 9 && currentHour < 20) {
        isOpen = true;
        closingTime = '8:00 PM';
      } else {
        openingTime = '9:00 AM';
      }
    } else if (day === 6) {
      // Saturday: 8:30 AM - 7:30 PM (8.5 to 19.5)
      if (currentHour >= 8.5 && currentHour < 19.5) {
        isOpen = true;
        closingTime = '7:30 PM';
      } else {
        openingTime = '8:30 AM';
      }
    } else {
      // Sunday: 10:00 AM - 5:00 PM (10.0 to 17.0)
      if (currentHour >= 10 && currentHour < 17) {
        isOpen = true;
        closingTime = '5:00 PM';
      } else {
        openingTime = '10:00 AM';
      }
    }

    if (isOpen) {
      liveStatusPill.style.background = 'rgba(34, 197, 94, 0.15)';
      liveStatusPill.style.borderColor = 'rgba(34, 197, 94, 0.4)';
      liveStatusPill.style.color = '#4ade80';
      liveStatusText.textContent = `OPEN NOW • Closes at ${closingTime}`;
    } else {
      liveStatusPill.style.background = 'rgba(230, 57, 70, 0.15)';
      liveStatusPill.style.borderColor = 'rgba(230, 57, 70, 0.4)';
      liveStatusPill.style.color = '#ff8f97';
      liveStatusText.textContent = `CURRENTLY CLOSED • Opens at ${openingTime}`;
    }
  }

  updateShopLiveStatus();

  /* ==========================================================================
     5. SERVICES FILTER TABS & QUICK BOOK BUTTONS
     ========================================================================== */
  const serviceTabs = document.querySelectorAll('.services-filter-tabs .filter-tab');
  const serviceCards = document.querySelectorAll('.services-grid .service-card');

  serviceTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      serviceTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const selectedCategory = tab.getAttribute('data-category');

      serviceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // "Book This" Quick Action on Service Cards
  const bookServiceBtns = document.querySelectorAll('.btn-book-service');
  const bookingServiceSelect = document.getElementById('bookingService');
  const summaryServiceText = document.getElementById('summaryServiceText');
  const summaryPriceText = document.getElementById('summaryPriceText');

  bookServiceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service');
      const servicePrice = btn.getAttribute('data-price');

      if (bookingServiceSelect) {
        for (let i = 0; i < bookingServiceSelect.options.length; i++) {
          if (bookingServiceSelect.options[i].value.includes(serviceName) || serviceName.includes(bookingServiceSelect.options[i].value)) {
            bookingServiceSelect.selectedIndex = i;
            break;
          }
        }
        updateBookingSummary();
      }

      // Smooth scroll to booking section
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ==========================================================================
     6. PHOTO GALLERY FILTER & LIGHTBOX MODAL
     ========================================================================== */
  const galleryTabs = document.querySelectorAll('.gallery-tab');
  const galleryCards = document.querySelectorAll('.gallery-grid .gallery-card');

  galleryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      galleryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-filter');

      galleryCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // Lightbox Modal Functionality
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxBookBtn = document.getElementById('lightboxBookBtn');
  const lightboxTriggers = document.querySelectorAll('.btn-lightbox-trigger');

  function openLightbox(imgSrc, title, desc) {
    if (!lightboxModal) return;
    lightboxImg.src = imgSrc;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = desc;
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  lightboxTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const imgSrc = trigger.getAttribute('data-img');
      const title = trigger.getAttribute('data-title');
      const desc = trigger.getAttribute('data-desc');
      openLightbox(imgSrc, title, desc);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxBookBtn) {
    lightboxBookBtn.addEventListener('click', () => {
      closeLightbox();
    });
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeBookingModal();
    }
  });

  /* ==========================================================================
     7. BOOKING FORM VALIDATION & CONFIRMATION MODAL
     ========================================================================== */
  const appointmentForm = document.getElementById('appointmentForm');
  const bookingDateInput = document.getElementById('bookingDate');

  // Set minimum date to today
  if (bookingDateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    bookingDateInput.min = `${yyyy}-${mm}-${dd}`;
    bookingDateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  function updateBookingSummary() {
    if (!bookingServiceSelect) return;
    const selectedOption = bookingServiceSelect.options[bookingServiceSelect.selectedIndex];
    
    if (selectedOption && selectedOption.value) {
      const price = selectedOption.getAttribute('data-price') || '0';
      summaryServiceText.textContent = selectedOption.text;
      summaryPriceText.textContent = `$${price}`;
    } else {
      summaryServiceText.textContent = 'Please select service above';
      summaryPriceText.textContent = '$0';
    }
  }

  if (bookingServiceSelect) {
    bookingServiceSelect.addEventListener('change', updateBookingSummary);
  }

  // Booking Success Modal
  const bookingSuccessModal = document.getElementById('bookingSuccessModal');
  const bookingModalBackdrop = document.getElementById('bookingModalBackdrop');
  const bookingModalCloseBtn = document.getElementById('bookingModalCloseBtn');

  function openBookingModal(data) {
    document.getElementById('confClientName').textContent = data.name;
    document.getElementById('confService').textContent = data.service;
    document.getElementById('confStylist').textContent = data.stylist;
    document.getElementById('confDateTime').textContent = `${data.date} at ${data.time}`;

    bookingSuccessModal.classList.add('active');
    bookingSuccessModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeBookingModal() {
    if (!bookingSuccessModal) return;
    bookingSuccessModal.classList.remove('active');
    bookingSuccessModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (bookingModalCloseBtn) bookingModalCloseBtn.addEventListener('click', closeBookingModal);
  if (bookingModalBackdrop) bookingModalBackdrop.addEventListener('click', closeBookingModal);

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const service = document.getElementById('bookingService').value;
      const stylist = document.getElementById('bookingStylist').value;
      const date = document.getElementById('bookingDate').value;
      const time = document.getElementById('bookingTime').value;
      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();

      if (!service || !date || !time || !name || !phone) {
        alert('Please fill in all required fields marked with * to confirm your reservation.');
        return;
      }

      // Format date for display
      const dateObj = new Date(date + 'T00:00:00');
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      // Show Confirmation Modal
      openBookingModal({
        name,
        service,
        stylist,
        date: formattedDate,
        time,
        phone
      });

      // Reset form
      appointmentForm.reset();
      if (bookingDateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        bookingDateInput.value = `${yyyy}-${mm}-${dd}`;
      }
      updateBookingSummary();
    });
  }

  /* ==========================================================================
     8. DYNAMIC YEAR UPDATE IN FOOTER
     ========================================================================== */
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
