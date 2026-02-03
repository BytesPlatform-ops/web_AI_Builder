/**
 * STUNNING Premium Website - Interactive Scripts
 */

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  // Initialize GSAP
  gsap.registerPlugin(ScrollTrigger);
  
  // Cursor Glow Effect (Desktop)
  const cursor = document.querySelector('.cursor-glow');
  if (window.matchMedia('(hover: hover)').matches && cursor) {
    document.addEventListener('mousemove', (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  }
  
  // Navigation Scroll Effect
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
  
  // Mobile Navigation Toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  
  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });
  
  // Close mobile menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle?.classList.remove('active');
      navLinks?.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  // Scroll Animations with GSAP
  document.querySelectorAll('[data-animate]').forEach(el => {
    const animation = el.dataset.animate;
    const delay = parseFloat(el.dataset.delay) || 0;
    
    const props = {
      opacity: 1,
      duration: 0.8,
      delay: delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    };
    
    if (animation === 'fade-up') {
      props.y = 0;
    } else if (animation === 'scale-in') {
      props.scale = 1;
    }
    
    gsap.to(el, props);
  });
  
  // Counter Animation for Stats
  document.querySelectorAll('.stat-number').forEach(counter => {
    const target = parseInt(counter.dataset.count);
    
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(counter, {
          textContent: target,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: 1 },
          onUpdate: function() {
            counter.textContent = Math.round(this.targets()[0].textContent);
          }
        });
      },
      once: true
    });
  });
  
  // Parallax Effect for Hero
  gsap.to('.hero-bg-img', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
  
  // Floating Shapes Animation Enhancement
  gsap.to('.shape-1', {
    x: 50,
    y: -30,
    rotation: 10,
    duration: 20,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
  
  gsap.to('.shape-2', {
    x: -30,
    y: 50,
    rotation: -10,
    duration: 25,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Button hover ripple effect
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function(e) {
      const x = e.clientX - this.getBoundingClientRect().left;
      const y = e.clientY - this.getBoundingClientRect().top;
      
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out forwards;
        pointer-events: none;
        width: 100px;
        height: 100px;
        left: ${x - 50}px;
        top: ${y - 50}px;
      `;
      
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
  
  // Add ripple animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  console.log('✨ Premium website initialized');
});
