/**
 * Premium Website Template Generator
 * 
 * THIS IS NOT COPIED FROM INSPIRATION - Built from scratch
 * Goal: Generate PREMIUM quality websites (not pathetic like old system)
 * 
 * Design Philosophy:
 * - Modern Minimal (Apple/Stripe style)
 * - Fast loading (< 1.5s)
 * - Mobile-first responsive
 * - Generous whitespace
 * - Large typography
 * - Smooth animations
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
  /**
   * Generate complete website files
   */
  async generate(input: TemplateInput): Promise<GeneratedFiles> {
    console.log(`🎨 Generating premium template for ${input.businessName}...`);

    const html = this.generateHTML(input);
    const css = this.generateCSS(input);
    const js = this.generateJS(input);

    return {
      'index.html': html,
      'styles.css': css,
      'script.js': js,
    };
  }

  /**
   * Generate HTML structure (semantic, accessible, SEO-optimized)
   */
  private generateHTML(input: TemplateInput): string {
    const { businessName, content, logoUrl, heroImageUrl, contactInfo } = input;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${content.hero.subheadline}">
  <title>${businessName} - ${content.hero.headline}</title>
  
  <!-- Performance: Preload critical resources -->
  <link rel="preload" href="styles.css" as="style">
  <link rel="stylesheet" href="styles.css">
  
  <!-- Favicon -->
  ${logoUrl ? `<link rel="icon" type="image/png" href="${logoUrl}">` : ''}
</head>
<body>
  <!-- Navigation -->
  <nav class="nav">
    <div class="container nav-content">
      ${logoUrl ? `<img src="${logoUrl}" alt="${businessName}" class="logo">` : `<span class="logo-text">${businessName}</span>`}
      
      <div class="nav-links">
        <a href="#services">Services</a>
        <a href="#about">About</a>
        <a href="#testimonials">Testimonials</a>
        <a href="#contact" class="btn-primary">${content.hero.ctaPrimary}</a>
      </div>
      
      <button class="mobile-menu-toggle" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="hero" ${heroImageUrl ? `style="background-image: url('${heroImageUrl}')"` : ''}>
    <div class="hero-overlay"></div>
    <div class="container hero-content">
      <h1 class="hero-headline">${content.hero.headline}</h1>
      <p class="hero-subheadline">${content.hero.subheadline}</p>
      <div class="hero-cta">
        <a href="#contact" class="btn-primary btn-large">${content.hero.ctaPrimary}</a>
        <a href="#services" class="btn-secondary btn-large">${content.hero.ctaSecondary}</a>
      </div>
    </div>
    <div class="scroll-indicator">
      <span>Scroll</span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </div>
  </section>

  <!-- Services Section -->
  <section id="services" class="services">
    <div class="container">
      <h2 class="section-headline">What We Offer</h2>
      <div class="services-grid">
        ${content.services.map((service, index) => `
          <div class="service-card" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="service-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 class="service-title">${service.title}</h3>
            <p class="service-description">${service.description}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- About Section -->
  <section id="about" class="about">
    <div class="container about-content">
      <div class="about-text">
        <h2 class="section-headline">${content.about.headline}</h2>
        ${content.about.paragraphs.map(p => `<p class="about-paragraph">${p}</p>`).join('')}
      </div>
      <div class="about-image">
        ${heroImageUrl ? `<img src="${heroImageUrl}" alt="${businessName}">` : ''}
      </div>
    </div>
  </section>

  <!-- Testimonials Section -->
  <section id="testimonials" class="testimonials">
    <div class="container">
      <h2 class="section-headline">What Our Clients Say</h2>
      <div class="testimonials-grid">
        ${content.testimonials.map((testimonial, index) => `
          <div class="testimonial-card" data-aos="zoom-in" data-aos-delay="${index * 100}">
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-quote">"${testimonial.quote}"</p>
            <div class="testimonial-author">
              <strong>${testimonial.author}</strong>
              <span>${testimonial.role}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section id="contact" class="cta">
    <div class="container cta-content">
      <h2 class="cta-headline">${content.cta.headline}</h2>
      <p class="cta-subheadline">${content.cta.subheadline}</p>
      <div class="cta-buttons">
        ${contactInfo.phone ? `<a href="tel:${contactInfo.phone}" class="btn-primary btn-large">Call ${contactInfo.phone}</a>` : ''}
        <a href="mailto:${contactInfo.email}" class="btn-secondary btn-large">${content.cta.buttonText}</a>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container footer-content">
      <div class="footer-brand">
        ${logoUrl ? `<img src="${logoUrl}" alt="${businessName}" class="footer-logo">` : `<span class="footer-logo-text">${businessName}</span>`}
      </div>
      
      <div class="footer-contact">
        ${contactInfo.email ? `<p>Email: <a href="mailto:${contactInfo.email}">${contactInfo.email}</a></p>` : ''}
        ${contactInfo.phone ? `<p>Phone: <a href="tel:${contactInfo.phone}">${contactInfo.phone}</a></p>` : ''}
        ${contactInfo.address ? `<p>${contactInfo.address}</p>` : ''}
      </div>
      
      ${contactInfo.social ? `
      <div class="footer-social">
        ${contactInfo.social.facebook ? `<a href="${contactInfo.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook">FB</a>` : ''}
        ${contactInfo.social.instagram ? `<a href="${contactInfo.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram">IG</a>` : ''}
        ${contactInfo.social.linkedin ? `<a href="${contactInfo.social.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">IN</a>` : ''}
        ${contactInfo.social.twitter ? `<a href="${contactInfo.social.twitter}" target="_blank" rel="noopener" aria-label="Twitter">TW</a>` : ''}
      </div>
      ` : ''}
      
      <div class="footer-copyright">
        <p>&copy; ${new Date().getFullYear()} ${businessName}. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;
  }

  /**
   * Generate CSS (modern, responsive, performance-optimized)
   */
  private generateCSS(input: TemplateInput): string {
    const { colors } = input;

    return `/* Premium Website Template - Modern Minimal Style */

/* CSS Variables (Brand Colors) */
:root {
  --color-primary: ${colors.primary};
  --color-secondary: ${colors.secondary};
  --color-accent: ${colors.accent};
  --color-text: #1a1a1a;
  --color-text-light: #666;
  --color-bg: #ffffff;
  --color-bg-light: #f8f9fa;
  
  --font-heading: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', sans-serif;
  --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', sans-serif;
  
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 2rem;
  --spacing-lg: 4rem;
  --spacing-xl: 6rem;
  
  --border-radius: 12px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Reset & Base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  font-family: var(--font-body);
  color: var(--color-text);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

/* Typography */
h1, h2, h3, h4 {
  font-family: var(--font-heading);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.section-headline {
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

/* Navigation */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  transition: var(--transition);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
}

.logo {
  height: 40px;
  width: auto;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.nav-links {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: var(--color-text);
  font-weight: 500;
  transition: var(--transition);
}

.nav-links a:hover {
  color: var(--color-primary);
}

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
}

.mobile-menu-toggle span {
  width: 24px;
  height: 3px;
  background: var(--color-text);
  transition: var(--transition);
}

/* Hero Section */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  background-size: cover;
  background-position: center;
  color: white;
  text-align: center;
  padding: var(--spacing-xl) 0;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4));
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
}

.hero-headline {
  font-size: clamp(2.5rem, 8vw, 5rem);
  margin-bottom: var(--spacing-md);
  animation: fadeInUp 0.8s ease-out;
}

.hero-subheadline {
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  margin-bottom: var(--spacing-lg);
  opacity: 0.95;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.hero-cta {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

/* Buttons */
.btn-primary, .btn-secondary {
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
  cursor: pointer;
  border: 2px solid transparent;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-secondary);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.btn-secondary {
  background: transparent;
  color: white;
  border-color: white;
}

.btn-secondary:hover {
  background: white;
  color: var(--color-primary);
}

.btn-large {
  padding: 1.25rem 2.5rem;
  font-size: 1.1rem;
}

/* Services Section */
.services {
  padding: var(--spacing-xl) 0;
  background: var(--color-bg-light);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.service-card {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  transition: var(--transition);
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.12);
}

.service-icon {
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.service-title {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-sm);
}

.service-description {
  color: var(--color-text-light);
}

/* About Section */
.about {
  padding: var(--spacing-xl) 0;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  align-items: center;
}

.about-paragraph {
  font-size: 1.1rem;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-light);
}

.about-image img {
  width: 100%;
  border-radius: var(--border-radius);
  box-shadow: 0 20px 60px rgba(0,0,0,0.1);
}

/* Testimonials */
.testimonials {
  padding: var(--spacing-xl) 0;
  background: var(--color-bg-light);
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.testimonial-card {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.testimonial-stars {
  color: #fbbf24;
  font-size: 1.25rem;
  margin-bottom: var(--spacing-sm);
}

.testimonial-quote {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: var(--spacing-md);
  font-style: italic;
}

.testimonial-author {
  display: flex;
  flex-direction: column;
}

.testimonial-author strong {
  color: var(--color-text);
}

.testimonial-author span {
  color: var(--color-text-light);
  font-size: 0.9rem;
}

/* CTA Section */
.cta {
  padding: var(--spacing-xl) 0;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  text-align: center;
}

.cta-headline {
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: var(--spacing-md);
}

.cta-subheadline {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-lg);
  opacity: 0.95;
}

.cta-buttons {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  flex-wrap: wrap;
}

/* Footer */
.footer {
  background: var(--color-text);
  color: white;
  padding: var(--spacing-lg) 0;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  text-align: center;
}

.footer a {
  color: white;
  text-decoration: none;
  transition: var(--transition);
}

.footer a:hover {
  color: var(--color-accent);
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .mobile-menu-toggle {
    display: flex;
  }
  
  .about-content {
    grid-template-columns: 1fr;
  }
  
  .hero-cta {
    flex-direction: column;
  }
}

/* Performance: Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}`;
  }

  /**
   * Generate JavaScript (minimal, progressive enhancement)
   */
  private generateJS(input: TemplateInput): string {
    return `// Premium Website Template - Minimal JS
// Only essential interactivity (mobile menu, smooth scroll)

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  
  // Simple scroll reveal animation
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('[data-aos]').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
  
  console.log('✨ Website loaded successfully');
});`;
  }
}

export const premiumTemplateGenerator = new PremiumTemplateGenerator();
