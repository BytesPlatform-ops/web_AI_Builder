/**
 * STUNNING Premium Website Template Generator v2.0
 * 
 * Design Inspiration: Stripe, Linear, Vercel, Apple
 * 
 * Features:
 * - GSAP Scroll Animations (reveal on scroll)
 * - Glassmorphism navigation
 * - Gradient overlays & backgrounds
 * - Smooth micro-interactions
 * - Parallax hero effects
 * - Modern typography (Inter font)
 * - Premium card designs
 * - Floating elements & decorations
 * - Dark/Light mode ready
 * - Mobile-first responsive
 */

import { GeneratedContent } from './ai-content.service';
import { ExtractedColors } from './color-extraction.service';

export interface TemplateInput {
  businessName: string;
  content: GeneratedContent;
  colors: ExtractedColors;
  logoUrl?: string;
  heroImageUrl?: string;
  additionalImages?: string[];
  contactInfo: {
    email: string;
    phone?: string;
    address?: string;
    social?: {
      facebook?: string;
      instagram?: string;
      linkedin?: string;
      twitter?: string;
    };
  };
}

export interface GeneratedFiles {
  'index.html': string;
  'styles.css': string;
  'script.js': string;
}

class PremiumTemplateGenerator {
  async generate(input: TemplateInput): Promise<GeneratedFiles> {
    console.log(`🎨 Generating STUNNING premium template for ${input.businessName}...`);

    const html = this.generateHTML(input);
    const css = this.generateCSS(input);
    const js = this.generateJS(input);

    return {
      'index.html': html,
      'styles.css': css,
      'script.js': js,
    };
  }

  private generateHTML(input: TemplateInput): string {
    const { businessName, content, logoUrl, heroImageUrl, contactInfo } = input;

    // Generate service icons based on index
    const serviceIcons = [
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`,
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>`,
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`,
    ];

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${content.hero.subheadline}">
  <title>${businessName} | ${content.hero.headline}</title>
  
  <!-- Preconnect for performance -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- Inter Font - Modern & Clean -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- GSAP for animations -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
  
  <link rel="stylesheet" href="styles.css">
  ${logoUrl ? `<link rel="icon" type="image/png" href="${logoUrl}">` : ''}
</head>
<body>
  <!-- Cursor follower (desktop only) -->
  <div class="cursor-glow"></div>
  
  <!-- Floating decorations -->
  <div class="floating-shapes">
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>
    <div class="shape shape-3"></div>
  </div>

  <!-- Navigation - Glassmorphism -->
  <nav class="nav" id="nav">
    <div class="nav-container">
      <a href="#" class="nav-logo">
        ${logoUrl 
          ? `<img src="${logoUrl}" alt="${businessName}" class="logo-img">`
          : `<span class="logo-text">${businessName}</span>`
        }
      </a>
      
      <div class="nav-links" id="navLinks">
        <a href="#services" class="nav-link">Services</a>
        <a href="#about" class="nav-link">About</a>
        <a href="#contact" class="nav-link nav-cta">${content.hero.ctaPrimary}</a>
      </div>
      
      <button class="nav-toggle" id="navToggle" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>

  <!-- Hero Section - Full Screen with Parallax -->
  <section class="hero" id="hero">
    <div class="hero-bg">
      ${heroImageUrl ? `<img src="${heroImageUrl}" alt="" class="hero-bg-img">` : ''}
      <div class="hero-gradient"></div>
    </div>
    
    <div class="hero-content">
      <div class="hero-badge animate-fade-up">
        <span class="badge-dot"></span>
        <span>Trusted by hundreds of happy customers</span>
      </div>
      
      <h1 class="hero-title animate-fade-up delay-1">
        ${content.hero.headline}
      </h1>
      
      <p class="hero-subtitle animate-fade-up delay-2">
        ${content.hero.subheadline}
      </p>
      
      <div class="hero-buttons animate-fade-up delay-3">
        <a href="#contact" class="btn btn-primary btn-lg">
          <span>${content.hero.ctaPrimary}</span>
          <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
        <a href="#services" class="btn btn-secondary btn-lg">
          ${content.hero.ctaSecondary}
        </a>
      </div>
      
      <!-- Stats removed - user can provide their own stats via form if needed -->
    </div>
    
    <div class="hero-scroll">
      <span>Scroll to explore</span>
      <div class="scroll-line">
        <div class="scroll-dot"></div>
      </div>
    </div>
  </section>

  <!-- Services Section -->
  <section class="services" id="services">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">What We Do</span>
        <h2 class="section-title">Our Services</h2>
        <p class="section-subtitle">Discover how we can help transform your business with our comprehensive range of professional services.</p>
      </div>
      
      <div class="services-grid">
        ${content.services.map((service, index) => `
        <div class="service-card" data-animate="fade-up" data-delay="${index * 0.1}">
          <div class="service-icon">
            ${serviceIcons[index % serviceIcons.length]}
          </div>
          <h3 class="service-title">${service.title}</h3>
          <p class="service-desc">${service.description}</p>
          <a href="#contact" class="service-link">
            Learn more
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- About Section - Split Layout -->
  <section class="about" id="about">
    <div class="container">
      <div class="about-grid">
        <div class="about-content">
          <span class="section-tag">About Us</span>
          <h2 class="section-title text-left">${content.about.headline}</h2>
          ${content.about.paragraphs.map((p, i) => `
          <p class="about-text" data-animate="fade-up" data-delay="${i * 0.1}">${p}</p>
          `).join('')}
          
          <div class="about-features" data-animate="fade-up">
            <div class="feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>Professional Excellence</span>
            </div>
            <div class="feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>Customer Focused</span>
            </div>
            <div class="feature">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>Quality Guaranteed</span>
            </div>
          </div>
        </div>
        
        <div class="about-visual" data-animate="scale-in">
          <div class="about-image-wrapper">
            <div class="about-placeholder">
              <span class="placeholder-text">${businessName.charAt(0)}</span>
            </div>
            <div class="about-image-decoration"></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials Section Removed - We don't generate fake reviews -->

  <!-- CTA Section - Gradient Background -->
  <section class="cta" id="contact">
    <div class="cta-bg">
      <div class="cta-glow cta-glow-1"></div>
      <div class="cta-glow cta-glow-2"></div>
    </div>
    
    <div class="container">
      <div class="cta-content" data-animate="fade-up">
        <h2 class="cta-title">${content.cta.headline}</h2>
        <p class="cta-subtitle">${content.cta.subheadline}</p>
        
        <div class="cta-buttons">
          ${contactInfo.phone ? `
          <a href="tel:${contactInfo.phone}" class="btn btn-white btn-lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>Call ${contactInfo.phone}</span>
          </a>
          ` : ''}
          <a href="mailto:${contactInfo.email}" class="btn btn-outline-white btn-lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span>${content.cta.buttonText}</span>
          </a>
        </div>
        
        <div class="cta-contact-info">
          ${contactInfo.address ? `
          <div class="contact-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>${contactInfo.address}</span>
          </div>
          ` : ''}
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          ${logoUrl 
            ? `<img src="${logoUrl}" alt="${businessName}" class="footer-logo">`
            : `<span class="footer-logo-text">${businessName}</span>`
          }
          <p class="footer-tagline">${content.hero.subheadline.substring(0, 100)}...</p>
        </div>
        
        <div class="footer-links">
          <div class="footer-column">
            <h4>Quick Links</h4>
            <a href="#services">Services</a>
            <a href="#about">About Us</a>
            <a href="#testimonials">Reviews</a>
            <a href="#contact">Contact</a>
          </div>
          
          <div class="footer-column">
            <h4>Contact</h4>
            <a href="mailto:${contactInfo.email}">${contactInfo.email}</a>
            ${contactInfo.phone ? `<a href="tel:${contactInfo.phone}">${contactInfo.phone}</a>` : ''}
            ${contactInfo.address ? `<span>${contactInfo.address}</span>` : ''}
          </div>
        </div>
        
        ${contactInfo.social ? `
        <div class="footer-social">
          ${contactInfo.social.facebook ? `
          <a href="${contactInfo.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook" class="social-link">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          ` : ''}
          ${contactInfo.social.instagram ? `
          <a href="${contactInfo.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram" class="social-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          ` : ''}
          ${contactInfo.social.linkedin ? `
          <a href="${contactInfo.social.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn" class="social-link">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
          ` : ''}
          ${contactInfo.social.twitter ? `
          <a href="${contactInfo.social.twitter}" target="_blank" rel="noopener" aria-label="Twitter" class="social-link">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
          </a>
          ` : ''}
        </div>
        ` : ''}
      </div>
      
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} ${businessName}. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;
  }

  private generateCSS(input: TemplateInput): string {
    const { colors } = input;

    return `/*
 * STUNNING Premium Website Template
 * Modern, Animated, Professional
 */

/* ===== CSS VARIABLES ===== */
:root {
  /* Brand Colors */
  --primary: ${colors.primary};
  --primary-dark: ${this.darkenColor(colors.primary, 15)};
  --primary-light: ${this.lightenColor(colors.primary, 15)};
  --secondary: ${colors.secondary};
  --accent: ${colors.accent};
  
  /* Neutral Colors */
  --white: #ffffff;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  --black: #000000;
  
  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;
  --font-size-6xl: 3.75rem;
  --font-size-7xl: 4.5rem;
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  --space-32: 8rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --shadow-glow: 0 0 40px -10px var(--primary);
  
  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-2xl: 2rem;
  --radius-full: 9999px;
  
  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-bounce: 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* ===== RESET & BASE ===== */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--gray-700);
  background: var(--white);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
}

/* ===== UTILITIES ===== */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.text-left { text-align: left; }
.text-center { text-align: center; }

/* ===== CURSOR GLOW (Desktop) ===== */
.cursor-glow {
  position: fixed;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, ${this.hexToRgba(colors.primary, 0.15)} 0%, transparent 70%);
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

@media (hover: hover) {
  .cursor-glow { opacity: 1; }
}

/* ===== FLOATING SHAPES ===== */
.floating-shapes {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: var(--primary-light);
  top: -100px;
  right: -100px;
  animation: float 20s ease-in-out infinite;
}

.shape-2 {
  width: 300px;
  height: 300px;
  background: var(--secondary);
  bottom: 20%;
  left: -100px;
  animation: float 25s ease-in-out infinite reverse;
}

.shape-3 {
  width: 200px;
  height: 200px;
  background: var(--accent);
  bottom: -50px;
  right: 20%;
  animation: float 18s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(20px, -30px) rotate(5deg); }
  50% { transform: translate(-10px, 20px) rotate(-5deg); }
  75% { transform: translate(30px, 10px) rotate(3deg); }
}

/* ===== NAVIGATION ===== */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: var(--space-4) 0;
  transition: var(--transition);
}

.nav.scrolled {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--gray-100);
  padding: var(--space-3) 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  z-index: 1001;
}

.logo-img {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.logo-text {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--gray-900);
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.nav-link {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--gray-600);
  transition: var(--transition-fast);
  position: relative;
}

.nav-link:hover {
  color: var(--gray-900);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary);
  transition: var(--transition-fast);
}

.nav-link:hover::after {
  width: 100%;
}

.nav-cta {
  background: var(--primary);
  color: var(--white) !important;
  padding: var(--space-2) var(--space-5);
  border-radius: var(--radius-full);
  transition: var(--transition);
}

.nav-cta::after { display: none; }

.nav-cta:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.nav-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: var(--space-2);
  z-index: 1001;
}

.nav-toggle span {
  width: 24px;
  height: 2px;
  background: var(--gray-900);
  transition: var(--transition);
}

/* Mobile Navigation */
@media (max-width: 768px) {
  .nav-toggle { display: flex; }
  
  .nav-links {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--white);
    flex-direction: column;
    justify-content: center;
    gap: var(--space-8);
    opacity: 0;
    visibility: hidden;
    transition: var(--transition);
  }
  
  .nav-links.active {
    opacity: 1;
    visibility: visible;
  }
  
  .nav-link {
    font-size: var(--font-size-2xl);
  }
  
  .nav-toggle.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  
  .nav-toggle.active span:nth-child(2) {
    opacity: 0;
  }
  
  .nav-toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }
}

/* ===== HERO SECTION ===== */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: var(--space-32) var(--space-6);
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.hero-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.6;
  filter: brightness(0.8);
}

.hero-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%),
    radial-gradient(ellipse at 20% 50%, ${this.hexToRgba(colors.primary, 0.15)} 0%, transparent 50%),
    radial-gradient(ellipse at 80% 50%, ${this.hexToRgba(colors.secondary, 0.1)} 0%, transparent 50%);
}

.hero-content {
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: rgba(255, 255, 255, 0.95);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  margin-bottom: var(--space-6);
  backdrop-filter: blur(10px);
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.hero-title {
  font-size: clamp(var(--font-size-4xl), 8vw, var(--font-size-7xl));
  font-weight: 800;
  color: #1a1a2e;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: var(--space-6);
  text-shadow: 0 2px 20px rgba(0,0,0,0.1);
}

.hero-subtitle {
  font-size: clamp(var(--font-size-lg), 2.5vw, var(--font-size-xl));
  color: #4a4a5a;
  max-width: 600px;
  margin: 0 auto var(--space-8);
  line-height: 1.7;
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  justify-content: center;
  margin-bottom: var(--space-12);
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  flex-wrap: wrap;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--gray-900);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--gray-500);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--gray-200);
}

.hero-scroll {
  position: absolute;
  bottom: var(--space-8);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  color: var(--gray-400);
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.scroll-line {
  width: 1px;
  height: 60px;
  background: var(--gray-200);
  position: relative;
  overflow: hidden;
}

.scroll-dot {
  width: 3px;
  height: 10px;
  background: var(--primary);
  border-radius: var(--radius-full);
  position: absolute;
  left: -1px;
  animation: scroll-down 2s ease-in-out infinite;
}

@keyframes scroll-down {
  0% { top: 0; opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

/* ===== BUTTONS ===== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  font-weight: 600;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.btn-lg {
  padding: var(--space-4) var(--space-8);
  font-size: var(--font-size-base);
}

.btn-primary {
  background: var(--primary);
  color: var(--white);
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.btn-secondary {
  background: var(--gray-100);
  color: var(--gray-700);
}

.btn-secondary:hover {
  background: var(--gray-200);
  transform: translateY(-2px);
}

.btn-white {
  background: var(--white);
  color: var(--gray-900);
}

.btn-white:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.btn-outline-white {
  background: transparent;
  color: var(--white);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-outline-white:hover {
  background: var(--white);
  color: var(--gray-900);
  transform: translateY(-2px);
}

.btn-arrow {
  width: 18px;
  height: 18px;
  transition: var(--transition);
}

.btn:hover .btn-arrow {
  transform: translateX(4px);
}

.btn svg:not(.btn-arrow) {
  width: 18px;
  height: 18px;
}

/* ===== SECTIONS ===== */
.section-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto var(--space-16);
}

.section-tag {
  display: inline-block;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-4);
}

.section-title {
  font-size: clamp(var(--font-size-3xl), 5vw, var(--font-size-5xl));
  font-weight: 700;
  color: var(--gray-900);
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin-bottom: var(--space-4);
}

.section-subtitle {
  font-size: var(--font-size-lg);
  color: var(--gray-500);
  line-height: 1.7;
}

/* ===== SERVICES SECTION ===== */
.services {
  padding: var(--space-32) 0;
  background: var(--gray-50);
  position: relative;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-8);
}

.service-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  transition: var(--transition);
  border: 1px solid var(--gray-100);
  position: relative;
  overflow: hidden;
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  transform: scaleX(0);
  transform-origin: left;
  transition: var(--transition);
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.service-card:hover::before {
  transform: scaleX(1);
}

.service-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, ${this.hexToRgba(colors.primary, 0.1)}, ${this.hexToRgba(colors.secondary, 0.1)});
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-6);
  color: var(--primary);
}

.service-icon svg {
  width: 28px;
  height: 28px;
}

.service-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--space-3);
}

.service-desc {
  color: var(--gray-500);
  line-height: 1.7;
  margin-bottom: var(--space-4);
}

.service-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--primary);
  transition: var(--transition-fast);
}

.service-link svg {
  width: 16px;
  height: 16px;
  transition: var(--transition-fast);
}

.service-link:hover {
  gap: var(--space-3);
}

.service-link:hover svg {
  transform: translateX(4px);
}

/* ===== ABOUT SECTION ===== */
.about {
  padding: var(--space-32) 0;
  position: relative;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  align-items: center;
}

@media (max-width: 968px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: var(--space-12);
  }
}

.about-content .section-title {
  text-align: left;
}

.about-text {
  color: var(--gray-600);
  line-height: 1.8;
  margin-bottom: var(--space-6);
}

.about-features {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-top: var(--space-8);
}

.feature {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-weight: 500;
  color: var(--gray-700);
}

.feature svg {
  width: 24px;
  height: 24px;
  color: #22c55e;
}

.about-visual {
  position: relative;
}

.about-image-wrapper {
  position: relative;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  aspect-ratio: 4/5;
}

.about-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.about-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  font-size: var(--font-size-7xl);
  font-weight: 800;
  color: var(--white);
  opacity: 0.5;
}

.about-image-decoration {
  position: absolute;
  top: -20px;
  right: -20px;
  bottom: -20px;
  left: -20px;
  border: 2px solid var(--primary);
  border-radius: var(--radius-2xl);
  z-index: -1;
  opacity: 0.2;
}

.about-card {
  position: absolute;
  bottom: -30px;
  left: -30px;
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  box-shadow: var(--shadow-xl);
}

.about-card-icon {
  font-size: var(--font-size-2xl);
}

.about-card-number {
  display: block;
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--gray-900);
}

.about-card-label {
  font-size: var(--font-size-sm);
  color: var(--gray-500);
}

/* ===== TESTIMONIALS SECTION ===== */
.testimonials {
  padding: var(--space-32) 0;
  background: var(--gray-50);
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-8);
}

.testimonial-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  border: 1px solid var(--gray-100);
  transition: var(--transition);
}

.testimonial-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.testimonial-rating {
  color: #fbbf24;
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-4);
  letter-spacing: 2px;
}

.testimonial-quote {
  font-size: var(--font-size-lg);
  color: var(--gray-700);
  line-height: 1.7;
  margin-bottom: var(--space-6);
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.author-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-weight: 600;
  font-size: var(--font-size-lg);
}

.author-name {
  display: block;
  font-weight: 600;
  color: var(--gray-900);
}

.author-role {
  font-size: var(--font-size-sm);
  color: var(--gray-500);
}

/* ===== CTA SECTION ===== */
.cta {
  position: relative;
  padding: var(--space-32) 0;
  background: linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 100%);
  overflow: hidden;
}

.cta-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.cta-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}

.cta-glow-1 {
  width: 400px;
  height: 400px;
  background: var(--primary);
  opacity: 0.2;
  top: -100px;
  right: -100px;
}

.cta-glow-2 {
  width: 300px;
  height: 300px;
  background: var(--secondary);
  opacity: 0.15;
  bottom: -50px;
  left: 10%;
}

.cta-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.cta-title {
  font-size: clamp(var(--font-size-3xl), 5vw, var(--font-size-5xl));
  font-weight: 700;
  color: var(--white);
  line-height: 1.2;
  margin-bottom: var(--space-4);
}

.cta-subtitle {
  font-size: var(--font-size-lg);
  color: var(--gray-400);
  margin-bottom: var(--space-8);
}

.cta-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  justify-content: center;
  margin-bottom: var(--space-8);
}

.cta-contact-info {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
  justify-content: center;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--gray-400);
  font-size: var(--font-size-sm);
}

.contact-item svg {
  width: 18px;
  height: 18px;
  color: var(--primary-light);
}

/* ===== FOOTER ===== */
.footer {
  background: var(--gray-900);
  padding: var(--space-16) 0 var(--space-8);
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: var(--space-12);
  padding-bottom: var(--space-12);
  border-bottom: 1px solid var(--gray-800);
}

@media (max-width: 968px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
}

.footer-brand {
  max-width: 300px;
}

.footer-logo {
  height: 40px;
  margin-bottom: var(--space-4);
}

.footer-logo-text {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--white);
  display: block;
  margin-bottom: var(--space-4);
}

.footer-tagline {
  color: var(--gray-500);
  font-size: var(--font-size-sm);
  line-height: 1.7;
}

.footer-column h4 {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--white);
  margin-bottom: var(--space-4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-column a,
.footer-column span {
  display: block;
  color: var(--gray-500);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-3);
  transition: var(--transition-fast);
}

.footer-column a:hover {
  color: var(--white);
}

.footer-social {
  display: flex;
  gap: var(--space-3);
}

.social-link {
  width: 40px;
  height: 40px;
  background: var(--gray-800);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-400);
  transition: var(--transition);
}

.social-link:hover {
  background: var(--primary);
  color: var(--white);
  transform: translateY(-2px);
}

.social-link svg {
  width: 18px;
  height: 18px;
}

.footer-bottom {
  padding-top: var(--space-8);
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.footer-bottom p {
  color: var(--gray-600);
  font-size: var(--font-size-sm);
}

/* ===== ANIMATIONS ===== */
.animate-fade-up {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeUp 0.8s ease forwards;
}

.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
.delay-4 { animation-delay: 0.4s; }

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Elements with scroll animation (handled by GSAP) */
[data-animate] {
  opacity: 0;
}

[data-animate="fade-up"] {
  transform: translateY(40px);
}

[data-animate="scale-in"] {
  transform: scale(0.9);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .hero-stats {
    gap: var(--space-6);
  }
  
  .stat-divider {
    display: none;
  }
  
  .hero-scroll {
    display: none;
  }
  
  .about-card {
    position: relative;
    bottom: 0;
    left: 0;
    margin-top: var(--space-6);
  }
}
`;
  }

  private generateJS(input: TemplateInput): string {
    return `/**
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
      ripple.style.cssText = \`
        position: absolute;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out forwards;
        pointer-events: none;
        width: 100px;
        height: 100px;
        left: \${x - 50}px;
        top: \${y - 50}px;
      \`;
      
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
  
  // Add ripple animation keyframes
  const style = document.createElement('style');
  style.textContent = \`
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  \`;
  document.head.appendChild(style);
  
  console.log('✨ Premium website initialized');
});
`;
  }

  // Helper functions for color manipulation
  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  private darkenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max((num >> 16) - amt, 0);
    const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
    const B = Math.max((num & 0x0000FF) - amt, 0);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  }

  private lightenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min((num >> 16) + amt, 255);
    const G = Math.min((num >> 8 & 0x00FF) + amt, 255);
    const B = Math.min((num & 0x0000FF) + amt, 255);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  }
}

export const premiumTemplateGenerator = new PremiumTemplateGenerator();
