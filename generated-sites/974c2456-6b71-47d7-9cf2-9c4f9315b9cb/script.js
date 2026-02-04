// Aurora Light Theme - Premium JavaScript
// Smooth animations & interactions

document.addEventListener('DOMContentLoaded', () => {
  // Initialize GSAP
  gsap.registerPlugin(ScrollTrigger);
  
  // Header scroll effect
  const header = document.getElementById('header');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
  
  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  
  menuToggle?.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });
  
  // Close menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle?.classList.remove('active');
      nav?.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  // Hero animations with GSAP
  const heroTl = gsap.timeline({ delay: 0.3 });
  
  heroTl
    .from('.hero-badge', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.hero-title .title-line', { y: 60, opacity: 0, stagger: 0.15, duration: 1, ease: 'power3.out' }, '-=0.5')
    .from('.hero-desc', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.7')
    .from('.hero-actions .btn', { y: 20, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out' }, '-=0.5')
    .from('.hero-stats .stat', { y: 20, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out' }, '-=0.3')
    .from('.hero-card', { y: 50, opacity: 0, scale: 0.95, duration: 1, ease: 'power3.out' }, '-=1')
    .from('.floating-card', { y: 30, opacity: 0, stagger: 0.2, duration: 0.8, ease: 'power3.out' }, '-=0.5');
  
  // Scroll-triggered animations
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  animatedElements.forEach((el, i) => {
    const delay = parseFloat(el.dataset.delay) || 0;
    
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        setTimeout(() => {
          el.classList.add('animated');
        }, delay * 1000);
      }
    });
  });
  
  // Counter animation
  const counters = document.querySelectorAll('.stat-value[data-count]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.count);
    
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          innerHTML: target,
          duration: 2,
          ease: 'power2.out',
          snap: { innerHTML: 1 },
          onUpdate: function() {
            counter.innerHTML = Math.round(parseFloat(counter.innerHTML));
          }
        });
      }
    });
  });
  
  // Parallax effect for floating cards
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX - window.innerWidth / 2) / 50;
      const y = (e.clientY - window.innerHeight / 2) / 50;
      
      parallaxElements.forEach((el, i) => {
        const speed = (i + 1) * 0.5;
        gsap.to(el, {
          x: x * speed,
          y: y * speed,
          duration: 0.5,
          ease: 'power2.out'
        });
      });
    });
  }
  
  // 3D tilt effect on hero card
  const heroCard = document.querySelector('.hero-card');
  
  if (heroCard && window.innerWidth > 768) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      gsap.to(heroCard, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
    
    heroCard.addEventListener('mouseleave', () => {
      gsap.to(heroCard, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  }
  
  // Magnetic buttons
  const magneticBtns = document.querySelectorAll('.magnetic');
  
  magneticBtns.forEach(btn => {
    if (window.innerWidth > 768) {
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
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    }
  });
  
  // Service cards hover
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -8,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        gsap.to(window, {
          scrollTo: { y: target, offsetY: 80 },
          duration: 1,
          ease: 'power3.inOut'
        });
      }
    });
  });
  
  // Form interactions
  const form = document.getElementById('contactForm');
  
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    
    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = '<span>Message Sent! ✓</span>';
      btn.style.background = '#22c55e';
      
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    }, 1500);
  });
  
  console.log('🌟 Aurora Light Theme loaded successfully!');
});

// Lightbox functions
function openLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  
  lightboxImage.src = src;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

// Close lightbox on background click
document.getElementById('lightbox')?.addEventListener('click', (e) => {
  if (e.target.id === 'lightbox') {
    closeLightbox();
  }
});

// Close lightbox on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
  }
});