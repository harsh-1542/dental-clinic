/* ===================================
   Tathastu Dental Clinic - JavaScript
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ===== NAVBAR SCROLL BEHAVIOR =====
  const navbar = document.getElementById('navbar');
  const handleNavbarScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // Initial check

  // ===== MOBILE HAMBURGER MENU =====
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMenu);
  navOverlay.addEventListener('click', toggleMenu);

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== ACTIVE NAV LINK ON SCROLL =====
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = navLinks.querySelectorAll('a:not(.nav-cta)');

  const highlightNavLink = () => {
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinksAll.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavLink);

  // ===== SCROLL ANIMATIONS (Intersection Observer) =====
  const animateElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation for grid items
        const parent = entry.target.parentElement;
        const siblings = parent ? Array.from(parent.children).filter(
          child => child.classList.contains('fade-in') || 
                   child.classList.contains('fade-in-left') || 
                   child.classList.contains('fade-in-right')
        ) : [];
        
        const siblingIndex = siblings.indexOf(entry.target);
        const delay = siblingIndex >= 0 ? siblingIndex * 100 : 0;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Math.min(delay, 500)); // Cap delay at 500ms

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => observer.observe(el));

  // ===== GALLERY LIGHTBOX =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galleryItems = document.querySelectorAll('.gallery-item');

  let currentImageIndex = 0;
  const galleryImages = [];

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    galleryImages.push({
      src: img.src,
      alt: img.alt
    });

    item.addEventListener('click', () => {
      currentImageIndex = index;
      openLightbox();
    });
  });

  const openLightbox = () => {
    lightboxImage.src = galleryImages[currentImageIndex].src;
    lightboxImage.alt = galleryImages[currentImageIndex].alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  const navigateLightbox = (direction) => {
    currentImageIndex += direction;
    if (currentImageIndex < 0) currentImageIndex = galleryImages.length - 1;
    if (currentImageIndex >= galleryImages.length) currentImageIndex = 0;
    
    lightboxImage.style.opacity = '0';
    lightboxImage.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      lightboxImage.src = galleryImages[currentImageIndex].src;
      lightboxImage.alt = galleryImages[currentImageIndex].alt;
      lightboxImage.style.opacity = '1';
      lightboxImage.style.transform = 'scale(1)';
    }, 200);
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  lightboxNext.addEventListener('click', () => navigateLightbox(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    switch(e.key) {
      case 'Escape': closeLightbox(); break;
      case 'ArrowLeft': navigateLightbox(-1); break;
      case 'ArrowRight': navigateLightbox(1); break;
    }
  });

  // ===== APPOINTMENT FORM =====
  const appointmentForm = document.getElementById('appointmentForm');
  const formSuccess = document.getElementById('formSuccess');

  appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(appointmentForm);
    const data = Object.fromEntries(formData);
    
    // Simple validation
    if (!data.name || !data.phone || !data.service) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Simulate form submission
    const submitBtn = appointmentForm.querySelector('.form-submit');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      appointmentForm.style.display = 'none';
      formSuccess.classList.add('show');
      
      // Reset after 5 seconds
      setTimeout(() => {
        appointmentForm.style.display = '';
        appointmentForm.reset();
        formSuccess.classList.remove('show');
        submitBtn.innerHTML = '<span>📅</span> Book Appointment';
        submitBtn.disabled = false;
      }, 5000);
    }, 1500);
  });

  // ===== SMOOTH IMAGE TRANSITIONS =====
  lightboxImage.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

  // ===== COUNTER ANIMATION (about section badge) =====
  const counterElement = document.querySelector('.about-image-badge .number');
  if (counterElement) {
    let counted = false;
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
          counted = true;
          animateCounter(counterElement, 0, 6, 1500);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterObserver.observe(counterElement);
  }

  function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * easeOut);
      
      element.textContent = current + '+';
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    
    requestAnimationFrame(update);
  }

});
