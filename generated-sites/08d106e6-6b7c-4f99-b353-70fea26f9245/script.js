/*
 * ULTIMATE Premium Website Template v3.0
 * Animations & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);
  
  const isMobile = window.innerWidth < 768 || !window.matchMedia('(hover: hover)').matches;

  // ===== SPOTLIGHT EFFECT =====
  const spotlight = document.getElementById('spotlight');
  
  if (spotlight && !isMobile) {
    document.addEventListener('mousemove', (e) => {
      spotlight.style.left = e.clientX + 'px';
      spotlight.style.top = e.clientY + 'px';
    });
  }

  // ===== NAVIGATION =====
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });

  // Mobile toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== MOBILE INTERSECTION OBSERVER =====
  if (isMobile) {
    const mobileObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // Optional: unobserve after animation
          // mobileObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all animatable elements
    document.querySelectorAll('.bento-card, .gallery-item, .testimonial-card-3d, .about-card, [data-animate]').forEach(el => {
      mobileObserver.observe(el);
    });
  }

  // ===== SCROLL ANIMATIONS (Desktop) =====
  if (!isMobile) {
    const animateElements = document.querySelectorAll('[data-animate]');
    
    animateElements.forEach(el => {
      const delay = parseFloat(el.dataset.delay) || 0;
      
      gsap.fromTo(el, 
        { 
          opacity: 0, 
          y: el.dataset.animate === 'zoom-in' ? 0 : 40,
          scale: el.dataset.animate === 'zoom-in' ? 0.9 : 1
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => el.classList.add('animated')
          }
        }
      );
    });
  }

  // ===== TESTIMONIALS CAROUSEL =====
  const carouselTrack = document.getElementById('testimonialTrack');
  const carouselDots = document.querySelectorAll('.carousel-dot');
  
  if (carouselTrack && carouselDots.length) {
    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    const cards = carouselTrack.querySelectorAll('.testimonial-card-3d');
    const cardCount = cards.length;
    
    function getCardWidth() {
      if (cards[0]) {
        return cards[0].offsetWidth + 24; // card width + gap
      }
      return 400;
    }
    
    function updateCarousel(animate = true) {
      const cardWidth = getCardWidth();
      const offset = -currentIndex * cardWidth;
      carouselTrack.style.transition = animate ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
      carouselTrack.style.transform = `translateX(${offset}px)`;
      
      // Update dots
      carouselDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
      
      // Update card states
      cards.forEach((card, i) => {
        card.classList.toggle('active', i === currentIndex);
      });
    }
    
    function goToSlide(index) {
      currentIndex = Math.max(0, Math.min(index, cardCount - 1));
      updateCarousel();
    }
    
    // Dot navigation
    carouselDots.forEach((dot, i) => {
      dot.addEventListener('click', () => goToSlide(i));
    });
    
    // Touch/Swipe support
    carouselTrack.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      carouselTrack.style.transition = 'none';
    }, { passive: true });
    
    carouselTrack.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      const cardWidth = getCardWidth();
      const offset = -currentIndex * cardWidth + diff;
      carouselTrack.style.transform = `translateX(${offset}px)`;
    }, { passive: true });
    
    carouselTrack.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      const diff = currentX - startX;
      const threshold = 50;
      
      if (diff < -threshold && currentIndex < cardCount - 1) {
        currentIndex++;
      } else if (diff > threshold && currentIndex > 0) {
        currentIndex--;
      }
      
      updateCarousel();
    });
    
    // Mouse drag support for desktop
    carouselTrack.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      isDragging = true;
      carouselTrack.style.transition = 'none';
      carouselTrack.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      currentX = e.clientX;
      const diff = currentX - startX;
      const cardWidth = getCardWidth();
      const offset = -currentIndex * cardWidth + diff;
      carouselTrack.style.transform = `translateX(${offset}px)`;
    });
    
    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      const diff = currentX - startX;
      const threshold = 50;
      
      if (diff < -threshold && currentIndex < cardCount - 1) {
        currentIndex++;
      } else if (diff > threshold && currentIndex > 0) {
        currentIndex--;
      }
      
      updateCarousel();
      carouselTrack.style.cursor = 'grab';
    });
    
    // Auto-play with pause on hover
    let autoplayInterval;
    
    function startAutoplay() {
      autoplayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % cardCount;
        updateCarousel();
      }, 5000);
    }
    
    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }
    
    carouselTrack.addEventListener('mouseenter', stopAutoplay);
    carouselTrack.addEventListener('mouseleave', startAutoplay);
    carouselTrack.addEventListener('touchstart', stopAutoplay, { passive: true });
    
    // Start autoplay
    startAutoplay();
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
      if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
    });
  }

  // ===== COUNTER ANIMATION =====
  const counters = document.querySelectorAll('[data-count]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.count);
    
    if (isMobile) {
      // Mobile: Use IntersectionObserver
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(counter, target);
            observer.unobserve(counter);
          }
        });
      }, { threshold: 0.5 });
      observer.observe(counter);
    } else {
      // Desktop: Use ScrollTrigger
      ScrollTrigger.create({
        trigger: counter,
        start: 'top 85%',
        once: true,
        onEnter: () => animateCounter(counter, target)
      });
    }
  });
  
  function animateCounter(counter, target) {
    const duration = 2000;
    const start = performance.now();
    
    function update() {
      const elapsed = performance.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      counter.textContent = Math.round(target * eased);
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }

  // ===== 3D TILT EFFECT =====
  const tiltCards = document.querySelectorAll('[data-tilt]');
  
  if (!isMobile) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      });
    });
  }

  // ===== BACK TO TOP =====
  const backToTop = document.getElementById('backToTop');
  
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===== PARALLAX ORBS =====
  const orbs = document.querySelectorAll('.orb');
  
  if (!isMobile && orbs.length) {
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 0.05;
        orb.style.transform = `translateY(${scrollY * speed}px)`;
      });
    });
  }

  // ===== MAGNETIC BUTTONS =====
  if (!isMobile) {
    const magneticButtons = document.querySelectorAll('.btn, .nav-cta, .gallery-zoom');
    
    magneticButtons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(btn, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        });
      });
    });
  }

  // ===== RIPPLE EFFECT ON BUTTONS =====
  const rippleButtons = document.querySelectorAll('.btn');
  
  rippleButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ===== TEXT REVEAL ON SCROLL =====
  const textElements = document.querySelectorAll('.section-title, .hero-headline');
  
  if (!isMobile) {
    textElements.forEach(el => {
      const text = el.textContent;
      el.innerHTML = text.split('').map(char => 
        char === ' ' ? ' ' : `<span class="char">${char}</span>`
      ).join('');
      
      gsap.from(el.querySelectorAll('.char'), {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        },
        y: 50,
        opacity: 0,
        stagger: 0.02,
        duration: 0.8,
        ease: 'power3.out'
      });
    });
  }

  console.log('✨ Ultimate Premium Template v3.0 Loaded');
});

// ===== LIGHTBOX =====
function openLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImage');
  if (lightbox && img) {
    img.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close lightbox on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});
