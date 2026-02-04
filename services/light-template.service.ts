/**
 * AURORA LIGHT PREMIUM - Ultra Premium Light Theme Template v2.0
 * 
 * Design Inspiration: Linear, Stripe, Vercel, Apple, Raycast, Arc Browser
 * 
 * Features:
 * ✅ Animated aurora gradients
 * ✅ 3D perspective cards with depth
 * ✅ Morphing blob backgrounds
 * ✅ Magnetic cursor effects
 * ✅ Text gradient animations
 * ✅ Scroll-triggered reveals with stagger
 * ✅ Parallax floating elements
 * ✅ Glass morphism panels
 * ✅ Interactive hover states
 * ✅ Smooth page transitions
 * ✅ Particle constellation effect
 * ✅ 3D tilt on hover
 * ✅ Spotlight cursor follow
 * ✅ Counter animations
 * ✅ Premium micro-interactions
 */

import { GeneratedContent } from './ai-content.service';
import { ExtractedColors } from './color-extraction.service';

export interface LightTemplateInput {
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

class AuroraLightTemplateGenerator {
  async generate(input: LightTemplateInput): Promise<GeneratedFiles> {
    console.log(`☀️ Generating AURORA LIGHT template for ${input.businessName}...`);

    const html = this.generateHTML(input);
    const css = this.generateCSS(input);
    const js = this.generateJS(input);

    return {
      'index.html': html,
      'styles.css': css,
      'script.js': js,
    };
  }

  private generateHTML(input: LightTemplateInput): string {
    const { businessName, content, logoUrl, heroImageUrl, additionalImages, contactInfo } = input;

    const serviceIcons = [
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`,
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M20.84 5A10 10 0 0 0 12 2v10h10a10 10 0 0 0-1.16-7"/></svg>`,
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
    ];

    // Gallery section
    const galleryHTML = additionalImages && additionalImages.length > 0 ? `
    <!-- Gallery Section -->
    <section class="section gallery" id="gallery">
      <div class="container">
        <div class="section-header" data-animate="fade-up">
          <span class="section-eyebrow">
            <span class="eyebrow-line"></span>
            Portfolio
            <span class="eyebrow-line"></span>
          </span>
          <h2 class="section-title">
            <span class="title-word" data-animate="word">Our</span>
            <span class="title-word gradient-text" data-animate="word">Creative</span>
            <span class="title-word" data-animate="word">Work</span>
          </h2>
          <p class="section-desc">A showcase of excellence and innovation</p>
        </div>
        
        <div class="gallery-masonry">
          ${additionalImages.map((img, i) => `
          <div class="gallery-item" data-animate="scale" data-delay="${i * 0.1}">
            <div class="gallery-card">
              <div class="gallery-image-wrapper">
                <img src="${img}" alt="Gallery ${i + 1}" loading="lazy" />
                <div class="gallery-shine"></div>
              </div>
              <div class="gallery-overlay">
                <div class="gallery-content">
                  <span class="gallery-tag">Project ${i + 1}</span>
                  <h4>Creative Excellence</h4>
                  <button class="gallery-zoom magnetic" onclick="openLightbox('${img}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          `).join('')}
        </div>
      </div>
    </section>` : '';

    // Testimonials section - Premium 3D Carousel
    const testimonialsHTML = content.testimonials && content.testimonials.length > 0 ? `
    <!-- Testimonials Section - Premium 3D Carousel -->
    <section class="section testimonials" id="testimonials">
      <div class="testimonials-bg">
        <div class="testimonials-gradient"></div>
        <div class="testimonials-glow testimonials-glow-1"></div>
        <div class="testimonials-glow testimonials-glow-2"></div>
      </div>
      <div class="container">
        <div class="section-header light" data-animate="fade-up">
          <span class="section-eyebrow light">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Testimonials
          </span>
          <h2 class="section-title light">
            <span class="title-word" data-animate="word">Trusted</span>
            <span class="title-word" data-animate="word">by</span>
            <span class="title-word gradient-text-light" data-animate="word">Hundreds</span>
          </h2>
          <p class="section-desc light">Real stories from real customers who love what we do.</p>
        </div>
        
        <!-- 3D Carousel - Infinite Scroll -->
        <div class="testimonials-marquee" data-animate="fade-up" data-delay="0.2">
          <div class="marquee-container">
            <div class="marquee-track" id="testimonialTrack3D">
              ${[...content.testimonials, ...content.testimonials].map((testimonial: { quote: string; author?: string; authorName?: string; role?: string; authorRole?: string }, i: number) => `
              <div class="testimonial-card-3d" data-index="${i}">
                <div class="card-3d-inner">
                  <div class="card-3d-glow"></div>
                  <div class="card-3d-border"></div>
                  
                  <!-- Quote Icon -->
                  <div class="quote-icon-3d">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.956.76-3.022.66-1.065 1.515-1.867 2.558-2.403L9.373 5c-.8.396-1.56.898-2.26 1.505-.71.607-1.34 1.305-1.9 2.094s-.98 1.68-1.25 2.69-.346 2.04-.217 3.1c.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002.003zm9.124 0c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.692-1.327-.817-.56-.124-1.074-.13-1.54-.022-.16-.94.09-1.95.75-3.02.66-1.06 1.514-1.86 2.557-2.4L18.49 5c-.8.396-1.555.898-2.26 1.505-.708.607-1.34 1.305-1.894 2.094-.556.79-.97 1.68-1.24 2.69-.273 1-.345 2.04-.217 3.1.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l-.007.003z"/></svg>
                  </div>
                  
                  <!-- Animated Stars -->
                  <div class="star-rating-3d">
                    ${[1,2,3,4,5].map(star => `
                    <svg class="star-3d star-3d-${star}" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    `).join('')}
                  </div>
                  
                  <!-- Quote Text -->
                  <blockquote class="quote-text-3d">"${testimonial.quote}"</blockquote>
                  
                  <!-- Author -->
                  <div class="author-section-3d">
                    <div class="author-avatar-3d">
                      <div class="avatar-gradient-3d">
                        <span>${((testimonial.authorName || testimonial.author) || 'A').charAt(0).toUpperCase()}</span>
                      </div>
                      <div class="avatar-ring-3d"></div>
                    </div>
                    <div class="author-details-3d">
                      <span class="author-name-3d">${(testimonial.authorName || testimonial.author) || 'Happy Customer'}</span>
                      <span class="author-role-3d">${(testimonial.authorRole || testimonial.role) || 'Verified Client'}</span>
                    </div>
                    <div class="verified-badge-3d">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                  </div>
                </div>
              </div>
              `).join('')}
            </div>
          </div>
        </div>
          
          <!-- Swipe Hint (Mobile) -->
          <div class="swipe-hint-3d">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            <span>Swipe to explore</span>
          </div>
        </div>
      </div>
    </section>` : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${businessName} - ${content.hero.subheadline}</title>
  <meta name="description" content="${content.about.paragraphs[0]?.substring(0, 160) || ''}">
  <link rel="stylesheet" href="styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
</head>
<body>
  <!-- Aurora Background -->
  <div class="aurora-bg">
    <div class="aurora aurora-1"></div>
    <div class="aurora aurora-2"></div>
    <div class="aurora aurora-3"></div>
    <div class="noise-overlay"></div>
    <div class="grid-pattern"></div>
  </div>

  <!-- Cursor Spotlight -->
  <div class="cursor-spotlight" id="cursorSpotlight"></div>
  <div class="cursor-dot" id="cursorDot"></div>

  <!-- Floating Particles -->
  <div class="particles" id="particles"></div>

  <!-- Navigation -->
  <header class="header" id="header">
    <div class="container">
      <a href="#" class="logo magnetic">
        ${logoUrl 
          ? `<img src="${logoUrl}" alt="${businessName}" class="logo-img">`
          : `<span class="logo-text">${businessName}</span>`
        }
      </a>
      
      <nav class="nav-desktop" id="navDesktop">
        <a href="#about" class="nav-link magnetic">About</a>
        <a href="#services" class="nav-link magnetic">Services</a>
        ${additionalImages && additionalImages.length > 0 ? '<a href="#gallery" class="nav-link magnetic">Gallery</a>' : ''}
        <a href="#contact" class="nav-link magnetic">Contact</a>
      </nav>
      
      <a href="#contact" class="nav-cta magnetic">
        <span>Get Started</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>

      <button class="menu-toggle" id="menuToggle" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </header>

  <!-- Mobile Navigation -->
  <div class="nav-mobile" id="navMobile">
    <nav class="nav-mobile-links">
      <a href="#about" class="nav-mobile-link">About</a>
      <a href="#services" class="nav-mobile-link">Services</a>
      ${additionalImages && additionalImages.length > 0 ? '<a href="#gallery" class="nav-mobile-link">Gallery</a>' : ''}
      <a href="#contact" class="nav-mobile-link">Contact</a>
    </nav>
  </div>

  <!-- Hero Section -->
  <section class="hero" id="hero">
    ${heroImageUrl ? `
    <div class="hero-image-container">
      <div class="hero-image-wrapper" data-parallax>
        <img src="${heroImageUrl}" alt="${businessName}" class="hero-image">
        <div class="hero-image-overlay"></div>
      </div>
    </div>
    ` : ''}
    
    <div class="container">
      <div class="hero-content">
        <div class="hero-badge" data-animate="fade-up">
          <span class="badge-glow"></span>
          <span class="badge-dot"></span>
          <span>Welcome to ${businessName}</span>
        </div>
        
        <h1 class="hero-title" data-animate="split-text">
          ${content.hero.headline}
        </h1>
        
        <p class="hero-subtitle" data-animate="fade-up" data-delay="0.2">
          ${content.hero.subheadline}
        </p>
        
        <div class="hero-actions" data-animate="fade-up" data-delay="0.4">
          <a href="#contact" class="btn btn-primary magnetic">
            <span class="btn-bg"></span>
            <span class="btn-text">${content.hero.ctaPrimary || 'Get Started'}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="#about" class="btn btn-outline magnetic">
            <span class="btn-text">${content.hero.ctaSecondary || 'Learn More'}</span>
          </a>
        </div>

        <div class="hero-stats" data-animate="fade-up" data-delay="0.6">
          <div class="stat-item">
            <span class="stat-number" data-count="500">0</span>
            <span class="stat-plus">+</span>
            <span class="stat-label">Happy Clients</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number" data-count="98">0</span>
            <span class="stat-plus">%</span>
            <span class="stat-label">Satisfaction</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number" data-count="10">0</span>
            <span class="stat-plus">+</span>
            <span class="stat-label">Years Experience</span>
          </div>
        </div>
      </div>
    </div>

    <div class="hero-scroll" data-animate="fade-up" data-delay="0.8">
      <span>Scroll to explore</span>
      <div class="scroll-indicator">
        <div class="scroll-line"></div>
      </div>
    </div>

    <!-- 3D Floating Elements -->
    <div class="hero-shapes">
      <div class="shape shape-1" data-parallax-speed="0.05"></div>
      <div class="shape shape-2" data-parallax-speed="0.08"></div>
      <div class="shape shape-3" data-parallax-speed="0.03"></div>
      <div class="shape shape-4" data-parallax-speed="0.06"></div>
    </div>
  </section>

  <!-- About Section -->
  <section class="section about" id="about">
    <div class="container">
      <div class="about-grid">
        <div class="about-content" data-animate="fade-right">
          <span class="section-eyebrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            About Us
          </span>
          <h2 class="section-title">
            <span class="title-word" data-animate="word">Crafting</span>
            <span class="title-word gradient-text" data-animate="word">Excellence</span>
            <span class="title-word" data-animate="word">Together</span>
          </h2>
          <div class="about-text">
            ${content.about.paragraphs.map(p => `<p>${p}</p>`).join('')}
          </div>
          <div class="about-features">
            ${content.services.slice(0, 3).map((service: { title: string; description: string }, i: number) => `
            <div class="feature-item" data-animate="fade-up" data-delay="${i * 0.1}">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span>${service.title}</span>
            </div>
            `).join('')}
          </div>
          <a href="#contact" class="btn btn-primary magnetic" data-animate="fade-up" data-delay="0.3">
            <span class="btn-bg"></span>
            <span class="btn-text">Work With Us</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
        
        <div class="about-visual" data-animate="fade-left">
          <div class="about-card-stack">
            <div class="about-card about-card-1">
              <div class="card-shine"></div>
              <div class="card-content">
                <div class="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <div class="card-text">
                  <h4>Innovation First</h4>
                  <p>Pushing boundaries with cutting-edge solutions</p>
                </div>
              </div>
            </div>
            <div class="about-card about-card-2">
              <div class="card-shine"></div>
              <div class="card-content">
                <div class="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div class="card-text">
                  <h4>On-Time Delivery</h4>
                  <p>Reliable service that respects your timeline</p>
                </div>
              </div>
            </div>
            <div class="about-card about-card-3">
              <div class="card-shine"></div>
              <div class="card-content">
                <div class="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </div>
                <div class="card-text">
                  <h4>Client Focused</h4>
                  <p>Your success is our ultimate priority</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Services Section -->
  <section class="section services" id="services">
    <div class="services-bg">
      <div class="services-gradient"></div>
    </div>
    <div class="container">
      <div class="section-header center" data-animate="fade-up">
        <span class="section-eyebrow">
          <span class="eyebrow-line"></span>
          What We Do
          <span class="eyebrow-line"></span>
        </span>
        <h2 class="section-title">
          <span class="title-word" data-animate="word">Our</span>
          <span class="title-word gradient-text" data-animate="word">Premium</span>
          <span class="title-word" data-animate="word">Services</span>
        </h2>
        <p class="section-desc">${content.cta.subheadline || 'Comprehensive solutions tailored to elevate your business'}</p>
      </div>
      
      <div class="services-grid">
        ${content.services.slice(0, 6).map((service: { title: string; description: string }, i: number) => `
        <div class="service-card" data-animate="fade-up" data-delay="${i * 0.1}">
          <div class="service-glow"></div>
          <div class="service-shine"></div>
          <div class="service-content">
            <div class="service-icon">
              ${serviceIcons[i % serviceIcons.length]}
            </div>
            <h3 class="service-title">${service.title}</h3>
            <p class="service-desc">${service.description}</p>
            <div class="service-link">
              <span>Learn more</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
          <div class="service-number">${String(i + 1).padStart(2, '0')}</div>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  ${galleryHTML}
  
  ${testimonialsHTML}

  <!-- CTA Section -->
  <section class="section cta" id="cta">
    <div class="cta-bg">
      <div class="cta-aurora cta-aurora-1"></div>
      <div class="cta-aurora cta-aurora-2"></div>
      <div class="cta-particles"></div>
    </div>
    <div class="container">
      <div class="cta-content" data-animate="fade-up">
        <h2 class="cta-title">
          <span class="title-word" data-animate="word">${content.cta.headline || "Ready to"}</span>
          <span class="title-word gradient-text-light" data-animate="word">Transform</span>
          <span class="title-word" data-animate="word">Your Vision?</span>
        </h2>
        <p class="cta-desc">${content.cta.subheadline || "Let's create something extraordinary together"}</p>
        <div class="cta-actions">
          <a href="#contact" class="btn btn-white magnetic">
            <span class="btn-text">${content.cta.buttonText || 'Start Your Project'}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact Section -->
  <section class="section contact" id="contact">
    <div class="container">
      <div class="contact-grid">
        <div class="contact-info" data-animate="fade-right">
          <span class="section-eyebrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            Get in Touch
          </span>
          <h2 class="section-title">
            <span class="title-word" data-animate="word">Let's</span>
            <span class="title-word gradient-text" data-animate="word">Connect</span>
          </h2>
          <p class="contact-desc">Ready to start your project? Reach out and let's discuss how we can help bring your vision to life.</p>
          
          <div class="contact-methods">
            <a href="mailto:${contactInfo.email}" class="contact-method magnetic" data-tilt>
              <div class="method-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <div class="method-content">
                <span class="method-label">Email Us</span>
                <span class="method-value">${contactInfo.email}</span>
              </div>
            </a>
            ${contactInfo.phone ? `
            <a href="tel:${contactInfo.phone}" class="contact-method magnetic" data-tilt>
              <div class="method-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div class="method-content">
                <span class="method-label">Call Us</span>
                <span class="method-value">${contactInfo.phone}</span>
              </div>
            </a>
            ` : ''}
            ${contactInfo.address ? `
            <div class="contact-method" data-tilt>
              <div class="method-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div class="method-content">
                <span class="method-label">Visit Us</span>
                <span class="method-value">${contactInfo.address}</span>
              </div>
            </div>
            ` : ''}
          </div>

          ${contactInfo.social && Object.values(contactInfo.social).some(v => v) ? `
          <div class="contact-social">
            <span class="social-label">Follow Us</span>
            <div class="social-links">
              ${contactInfo.social.facebook ? `<a href="${contactInfo.social.facebook}" class="social-link magnetic" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>` : ''}
              ${contactInfo.social.instagram ? `<a href="${contactInfo.social.instagram}" class="social-link magnetic" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>` : ''}
              ${contactInfo.social.linkedin ? `<a href="${contactInfo.social.linkedin}" class="social-link magnetic" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>` : ''}
              ${contactInfo.social.twitter ? `<a href="${contactInfo.social.twitter}" class="social-link magnetic" aria-label="Twitter"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>` : ''}
            </div>
          </div>
          ` : ''}
        </div>
        
        <div class="contact-form-wrapper" data-animate="fade-left">
          <form class="contact-form" id="contactForm">
            <div class="form-header">
              <h3>Send us a message</h3>
              <p>We'll get back to you within 24 hours</p>
            </div>
            <div class="form-row">
              <div class="form-group">
                <input type="text" id="name" name="name" required placeholder=" ">
                <label for="name">Your Name</label>
                <div class="input-highlight"></div>
              </div>
              <div class="form-group">
                <input type="email" id="email" name="email" required placeholder=" ">
                <label for="email">Your Email</label>
                <div class="input-highlight"></div>
              </div>
            </div>
            <div class="form-group">
              <input type="text" id="subject" name="subject" required placeholder=" ">
              <label for="subject">Subject</label>
              <div class="input-highlight"></div>
            </div>
            <div class="form-group">
              <textarea id="message" name="message" rows="5" required placeholder=" "></textarea>
              <label for="message">Your Message</label>
              <div class="input-highlight"></div>
            </div>
            <button type="submit" class="btn btn-primary btn-block magnetic">
              <span class="btn-bg"></span>
              <span class="btn-text">Send Message</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-top">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            ${logoUrl ? `<img src="${logoUrl}" alt="${businessName}" class="footer-logo">` : `<span class="footer-logo-text">${businessName}</span>`}
            <p class="footer-desc">${content.hero.subheadline}</p>
          </div>
          
          <div class="footer-links-group">
            <h4>Quick Links</h4>
            <nav class="footer-links">
              <a href="#about">About Us</a>
              <a href="#services">Services</a>
              ${additionalImages && additionalImages.length > 0 ? '<a href="#gallery">Gallery</a>' : ''}
              <a href="#contact">Contact</a>
            </nav>
          </div>
          
          <div class="footer-links-group">
            <h4>Services</h4>
            <nav class="footer-links">
              ${content.services.slice(0, 4).map((s: { title: string; description: string }) => `<a href="#services">${s.title}</a>`).join('')}
            </nav>
          </div>
          
          <div class="footer-links-group">
            <h4>Contact</h4>
            <nav class="footer-links">
              <a href="mailto:${contactInfo.email}">${contactInfo.email}</a>
              ${contactInfo.phone ? `<a href="tel:${contactInfo.phone}">${contactInfo.phone}</a>` : ''}
            </nav>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="container">
        <p>&copy; ${new Date().getFullYear()} ${businessName}. All rights reserved.</p>
        <div class="footer-social">
          ${contactInfo.social?.facebook ? `<a href="${contactInfo.social.facebook}" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>` : ''}
          ${contactInfo.social?.instagram ? `<a href="${contactInfo.social.instagram}" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>` : ''}
          ${contactInfo.social?.linkedin ? `<a href="${contactInfo.social.linkedin}" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>` : ''}
          ${contactInfo.social?.twitter ? `<a href="${contactInfo.social.twitter}" aria-label="Twitter"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>` : ''}
        </div>
      </div>
    </div>
  </footer>

  <!-- Back to Top -->
  <button class="back-to-top magnetic" id="backToTop" aria-label="Back to top">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
  </button>

  <!-- Lightbox -->
  <div class="lightbox" id="lightbox" onclick="closeLightbox()">
    <button class="lightbox-close" onclick="closeLightbox()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <img src="" alt="" id="lightboxImage">
  </div>

  <script src="script.js"></script>
</body>
</html>`;
  }

  private generateCSS(input: LightTemplateInput): string {
    const { colors } = input;
    const primary = colors.primary || '#0ea5e9';
    const secondary = colors.secondary || '#6366f1';
    const accent = colors.accent || '#8b5cf6';

    return `/* 
 * AURORA LIGHT PREMIUM v2.0
 * Ultra Premium Light Theme Styles
 */

:root {
  --primary: ${primary};
  --primary-rgb: ${this.hexToRgb(primary)};
  --secondary: ${secondary};
  --secondary-rgb: ${this.hexToRgb(secondary)};
  --accent: ${accent};
  --accent-rgb: ${this.hexToRgb(accent)};
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --bg-dark: #0f172a;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #94a3b8;
  --text-light: #ffffff;
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(255, 255, 255, 0.5);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.12);
  --shadow-xl: 0 25px 60px rgba(0, 0, 0, 0.15);
  --shadow-glow: 0 0 60px rgba(var(--primary-rgb), 0.3);
  --shadow-glow-lg: 0 0 100px rgba(var(--primary-rgb), 0.4);
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-display: 'Outfit', 'Inter', system-ui, sans-serif;
  --section-padding: clamp(80px, 12vw, 140px);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 100px; }
body { font-family: var(--font-sans); background: var(--bg-primary); color: var(--text-primary); line-height: 1.7; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
::selection { background: var(--primary); color: white; }
img { max-width: 100%; height: auto; display: block; }
a { color: inherit; text-decoration: none; }
button { font-family: inherit; cursor: pointer; border: none; background: none; }

.aurora-bg { position: fixed; inset: 0; pointer-events: none; z-index: -1; overflow: hidden; }
.aurora { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.5; animation: auroraFloat 20s ease-in-out infinite; }
.aurora-1 { width: 800px; height: 800px; background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.4), rgba(var(--accent-rgb), 0.2)); top: -400px; right: -200px; }
.aurora-2 { width: 600px; height: 600px; background: linear-gradient(135deg, rgba(var(--secondary-rgb), 0.3), rgba(var(--primary-rgb), 0.2)); bottom: -200px; left: -200px; animation-delay: -7s; }
.aurora-3 { width: 500px; height: 500px; background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.25), rgba(var(--secondary-rgb), 0.15)); top: 40%; left: 30%; animation-delay: -14s; }
@keyframes auroraFloat { 0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); } 25% { transform: translate(100px, -50px) rotate(5deg) scale(1.1); } 50% { transform: translate(-50px, 100px) rotate(-5deg) scale(0.95); } 75% { transform: translate(-100px, -30px) rotate(3deg) scale(1.05); } }

.noise-overlay { position: absolute; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); opacity: 0.03; }
.grid-pattern { position: absolute; inset: 0; background-image: linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px); background-size: 80px 80px; mask-image: radial-gradient(ellipse 80% 50% at 50% 0%, black 70%, transparent 100%); }

.cursor-spotlight { position: fixed; width: 600px; height: 600px; background: radial-gradient(circle, rgba(var(--primary-rgb), 0.08) 0%, transparent 60%); border-radius: 50%; pointer-events: none; z-index: 9998; transform: translate(-50%, -50%); opacity: 0; transition: opacity 0.3s ease; }
body:hover .cursor-spotlight { opacity: 1; }
.cursor-dot { position: fixed; width: 8px; height: 8px; background: var(--primary); border-radius: 50%; pointer-events: none; z-index: 9999; transform: translate(-50%, -50%); opacity: 0; transition: transform 0.15s ease, opacity 0.3s ease; mix-blend-mode: difference; }
body:hover .cursor-dot { opacity: 1; }
.cursor-dot.hover { transform: translate(-50%, -50%) scale(4); background: var(--primary); opacity: 0.5; }

.particles { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.particle { position: absolute; width: 4px; height: 4px; background: var(--primary); border-radius: 50%; opacity: 0.3; animation: particleFloat 15s ease-in-out infinite; }
@keyframes particleFloat { 0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; } 50% { transform: translateY(-100px) translateX(50px); opacity: 0.6; } }

.container { width: 100%; max-width: 1280px; margin: 0 auto; padding: 0 clamp(20px, 5vw, 40px); position: relative; }

.header { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; padding: 20px 0; transition: all 0.4s var(--ease-out-expo); }
.header.scrolled { padding: 12px 0; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); border-bottom: 1px solid rgba(0, 0, 0, 0.05); box-shadow: var(--shadow-sm); }
.header .container { display: flex; align-items: center; justify-content: space-between; }
.logo { display: flex; align-items: center; z-index: 1001; }
.logo-img { height: 44px; width: auto; transition: transform 0.3s var(--ease-out-expo); }
.logo:hover .logo-img { transform: scale(1.05); }
.logo-text { font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; background-clip: text; color: transparent; }

.nav-desktop { display: flex; align-items: center; gap: 8px; }
.nav-link { position: relative; padding: 10px 18px; font-size: 0.925rem; font-weight: 500; color: var(--text-secondary); border-radius: 100px; transition: all 0.3s var(--ease-out-expo); z-index: 1; }
.nav-link::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.1), rgba(var(--accent-rgb), 0.08)); border-radius: 100px; opacity: 0; transform: scale(0.9); transition: all 0.3s var(--ease-out-expo); z-index: -1; }
.nav-link::after { content: ''; position: absolute; bottom: 6px; left: 50%; width: 0; height: 2px; background: linear-gradient(90deg, var(--primary), var(--secondary)); border-radius: 2px; transform: translateX(-50%); transition: width 0.3s var(--ease-out-expo); }
.nav-link:hover { color: var(--primary); }
.nav-link:hover::before { opacity: 1; transform: scale(1); }
.nav-link:hover::after { width: 60%; }
.nav-link span { position: relative; z-index: 1; }

.nav-cta { display: flex; align-items: center; gap: 8px; padding: 12px 24px; background: var(--text-primary); color: var(--text-light); font-size: 0.925rem; font-weight: 600; border-radius: 100px; transition: all 0.4s var(--ease-out-expo); box-shadow: var(--shadow-md); }
.nav-cta svg { width: 18px; height: 18px; transition: transform 0.3s var(--ease-out-expo); }
.nav-cta:hover { background: var(--primary); transform: translateY(-2px); box-shadow: var(--shadow-glow); }
.nav-cta:hover svg { transform: translateX(4px); }

.menu-toggle { display: none; flex-direction: column; gap: 5px; padding: 10px; z-index: 1001; }
.menu-toggle span { display: block; width: 24px; height: 2px; background: var(--text-primary); border-radius: 2px; transition: all 0.3s var(--ease-out-expo); transform-origin: center; }
.menu-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.menu-toggle.active span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.menu-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

.nav-mobile { position: fixed; inset: 0; background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(20px); z-index: 999; display: flex; align-items: center; justify-content: center; opacity: 0; visibility: hidden; transition: all 0.4s var(--ease-out-expo); }
.nav-mobile.active { opacity: 1; visibility: visible; }
.nav-mobile-links { display: flex; flex-direction: column; align-items: center; gap: 24px; }
.nav-mobile-link { font-family: var(--font-display); font-size: 2rem; font-weight: 700; color: var(--text-primary); transition: all 0.3s ease; }
.nav-mobile-link:hover { color: var(--primary); }

@media (max-width: 768px) {
  .nav-desktop, .nav-cta { display: none; }
  .menu-toggle { display: flex; }
}

.hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 140px 0 100px; position: relative; overflow: hidden; }
.hero-image-container { position: absolute; inset: 0; z-index: 0; }
.hero-image-wrapper { width: 100%; height: 100%; position: relative; }
.hero-image { width: 100%; height: 100%; object-fit: cover; filter: brightness(1.1) contrast(1.08); }
.hero-image-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(255, 255, 255, 0.50) 0%, rgba(255, 255, 255, 0.40) 40%, rgba(255, 255, 255, 0.55) 100%); }
.hero-content { position: relative; z-index: 2; text-align: center; max-width: 900px; margin: 0 auto; padding: 0 20px; display: flex; flex-direction: column; align-items: center; }

.hero-badge { display: inline-flex; align-items: center; gap: 12px; padding: 8px 20px 8px 12px; background: rgba(255, 255, 255, 0.85); border: 1px solid rgba(0, 0, 0, 0.08); border-radius: 100px; font-size: 0.875rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 32px; backdrop-filter: blur(10px); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); position: relative; overflow: hidden; }
.badge-glow { position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(var(--primary-rgb), 0.1), transparent); transform: translateX(-100%); animation: badgeGlow 3s ease-in-out infinite; }
@keyframes badgeGlow { 0% { transform: translateX(-100%); } 50%, 100% { transform: translateX(100%); } }
.badge-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; animation: pulse 2s ease-in-out infinite; box-shadow: 0 0 10px #22c55e; }
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } }

.hero-title { font-family: var(--font-display); font-size: clamp(2.75rem, 7vw, 5rem); font-weight: 800; line-height: 1.15; letter-spacing: -0.03em; color: var(--text-primary); margin-bottom: 28px; text-align: center; text-shadow: 0 2px 4px rgba(255,255,255,0.8), 0 4px 12px rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.1); width: 100%; }
.hero-title .word { display: inline-block; opacity: 0; transform: translateY(40px) rotateX(-30deg); margin: 0 0.15em; }
.gradient-text { background: linear-gradient(135deg, var(--primary), var(--secondary), var(--accent), var(--primary)); -webkit-background-clip: text; background-clip: text; color: transparent; background-size: 300% 300%; animation: gradientShift 4s ease infinite; font-style: italic; }
@keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

.hero-subtitle { font-size: clamp(1.125rem, 2vw, 1.375rem); color: var(--text-secondary); max-width: 600px; margin: 0 auto 40px; line-height: 1.7; text-align: center; text-shadow: 0 1px 3px rgba(255,255,255,0.9), 0 2px 8px rgba(255,255,255,0.5); font-weight: 500; }
.hero-actions { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 16px; margin-bottom: 60px; width: 100%; }

.hero-stats { display: flex; align-items: center; justify-content: center; gap: 48px; flex-wrap: wrap; padding: 24px 32px; background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(10px); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.5); }
.stat-item { text-align: center; }
.stat-number { font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; color: var(--text-primary); display: inline; }
.stat-plus { font-family: var(--font-display); font-size: 2rem; font-weight: 700; background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.stat-label { display: block; font-size: 0.875rem; color: var(--text-secondary); margin-top: 4px; font-weight: 500; }
.stat-divider { width: 1px; height: 40px; background: linear-gradient(to bottom, transparent, rgba(var(--primary-rgb), 0.3), transparent); }

.hero-scroll { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 12px; color: var(--text-tertiary); font-size: 0.75rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; }
.scroll-indicator { width: 24px; height: 44px; border: 2px solid rgba(0, 0, 0, 0.1); border-radius: 100px; position: relative; }
.scroll-line { position: absolute; top: 8px; left: 50%; transform: translateX(-50%); width: 2px; height: 8px; background: var(--primary); border-radius: 100px; animation: scrollLine 2s ease-in-out infinite; }
@keyframes scrollLine { 0%, 100% { top: 8px; opacity: 1; height: 8px; } 50% { top: 24px; opacity: 0.3; height: 4px; } }

.hero-shapes { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.shape { position: absolute; border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.1), rgba(var(--accent-rgb), 0.05)); animation: shapeFloat 15s ease-in-out infinite; }
.shape-1 { width: 300px; height: 300px; top: 10%; left: -100px; }
.shape-2 { width: 200px; height: 200px; top: 60%; right: -50px; animation-delay: -5s; }
.shape-3 { width: 150px; height: 150px; bottom: 20%; left: 10%; animation-delay: -10s; }
.shape-4 { width: 100px; height: 100px; top: 30%; right: 20%; animation-delay: -7s; }
@keyframes shapeFloat { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(20px, -30px) rotate(5deg); } 50% { transform: translate(-10px, 20px) rotate(-5deg); } 75% { transform: translate(30px, 10px) rotate(3deg); } }

.btn { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 16px 32px; font-size: 1rem; font-weight: 600; border-radius: 100px; overflow: hidden; transition: all 0.4s var(--ease-out-expo); }
.btn-text { position: relative; z-index: 2; }
.btn svg { width: 20px; height: 20px; position: relative; z-index: 2; transition: transform 0.4s var(--ease-out-expo); }
.btn:hover svg { transform: translateX(5px); }
.btn-primary { background: var(--text-primary); color: var(--text-light); box-shadow: var(--shadow-md); }
.btn-primary .btn-bg { position: absolute; inset: 0; background: linear-gradient(135deg, var(--primary), var(--secondary)); opacity: 0; transition: opacity 0.4s ease; }
.btn-primary:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(var(--primary-rgb), 0.35), 0 0 0 2px rgba(var(--primary-rgb), 0.1); }
.btn-primary:hover .btn-bg { opacity: 1; }
.btn-outline { background: rgba(255, 255, 255, 0.8); color: var(--text-primary); border: 2px solid rgba(0, 0, 0, 0.1); backdrop-filter: blur(10px); }
.btn-outline:hover { border-color: var(--primary); color: var(--primary); background: rgba(var(--primary-rgb), 0.08); box-shadow: 0 10px 30px rgba(var(--primary-rgb), 0.15); transform: translateY(-3px); }
.btn-white { background: white; color: var(--text-primary); box-shadow: var(--shadow-lg); }
.btn-white:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15); }
.btn-block { width: 100%; }
.btn-block .btn-bg { border-radius: 100px; }

/* Button Ripple Effect */
.btn { position: relative; overflow: hidden; }
.btn-ripple { position: absolute; border-radius: 50%; background: rgba(var(--primary-rgb), 0.3); transform: scale(0); animation: ripple 0.6s ease-out forwards; pointer-events: none; }
@keyframes ripple { to { transform: scale(4); opacity: 0; } }

.section { padding: var(--section-padding) 0; position: relative; }
.section-header { margin-bottom: 60px; }
.section-header.center { text-align: center; max-width: 700px; margin-left: auto; margin-right: auto; }
.section-eyebrow { display: inline-flex; align-items: center; gap: 12px; font-size: 0.875rem; font-weight: 600; color: var(--primary); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; }
.section-eyebrow svg { width: 18px; height: 18px; }
.section-eyebrow.light { color: rgba(255, 255, 255, 0.8); }
.eyebrow-line { width: 40px; height: 2px; background: linear-gradient(90deg, var(--primary), transparent); }
.section-title { font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; color: var(--text-primary); margin-bottom: 20px; }
.section-title.light { color: white; }
.title-word { display: inline-block; }
.gradient-text-light { background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.section-desc { font-size: 1.125rem; color: var(--text-secondary); line-height: 1.7; }

.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
@media (max-width: 1024px) { .about-grid { grid-template-columns: 1fr; gap: 60px; } }
.about-text { margin-bottom: 32px; }
.about-text p { color: var(--text-secondary); margin-bottom: 16px; }
.about-text p:last-child { margin-bottom: 0; }
.about-features { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 32px; }
.feature-item { display: flex; align-items: center; gap: 10px; padding: 10px 18px; background: var(--bg-secondary); border-radius: 100px; font-size: 0.875rem; font-weight: 500; color: var(--text-primary); transition: all 0.3s var(--ease-out-expo); border: 1px solid transparent; cursor: default; }
.feature-item:hover { background: white; border-color: rgba(var(--primary-rgb), 0.2); box-shadow: 0 8px 24px rgba(var(--primary-rgb), 0.15); transform: translateY(-3px); }
.feature-icon { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: 50%; color: white; transition: transform 0.3s ease; }
.feature-item:hover .feature-icon { transform: scale(1.15) rotate(10deg); }
.feature-icon svg { width: 12px; height: 12px; }

.about-visual { position: relative; display: flex; flex-direction: column; gap: 20px; }
.about-card-stack { display: flex; flex-direction: column; gap: 20px; width: 100%; }
.about-card { position: relative; width: 100%; padding: 24px 28px; background: white; border-radius: 20px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); border: 1px solid rgba(0, 0, 0, 0.06); transition: all 0.4s var(--ease-out-expo); overflow: hidden; }
.about-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.06), rgba(var(--accent-rgb), 0.03)); opacity: 0; transition: opacity 0.4s ease; }
.about-card:hover::before { opacity: 1; }
.about-card::after { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: linear-gradient(180deg, var(--primary), var(--secondary)); border-radius: 4px 0 0 4px; opacity: 0; transition: opacity 0.4s ease; }
.about-card:hover::after { opacity: 1; }
.card-shine { position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent); transition: left 0.6s ease; pointer-events: none; }
.about-card:hover .card-shine { left: 100%; }
.about-card-1, .about-card-2, .about-card-3 { position: relative; top: auto; right: auto; z-index: 1; }
.about-card:hover { transform: translateX(8px); box-shadow: 0 12px 40px rgba(var(--primary-rgb), 0.15); }
.card-content { position: relative; z-index: 2; display: flex; align-items: flex-start; gap: 20px; }
.card-icon { width: 48px; height: 48px; min-width: 48px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.12), rgba(var(--accent-rgb), 0.08)); border-radius: 12px; transition: all 0.4s var(--ease-out-expo); }
.card-icon svg { width: 24px; height: 24px; color: var(--primary); transition: all 0.4s ease; }
.about-card:hover .card-icon { background: linear-gradient(135deg, var(--primary), var(--secondary)); transform: scale(1.1); box-shadow: 0 8px 20px rgba(var(--primary-rgb), 0.25); }
.about-card:hover .card-icon svg { color: white; }
.card-text { flex: 1; }
.about-card h4 { font-family: var(--font-display); font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px; transition: color 0.3s ease; }
.about-card:hover h4 { color: var(--primary); }
.about-card p { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; margin: 0; }
@media (max-width: 640px) { .about-visual { width: 100%; } .about-card-stack { gap: 16px; } .card-content { gap: 16px; } }

.services { position: relative; overflow: hidden; }
.services-bg { position: absolute; inset: 0; z-index: 0; }
.services-gradient { position: absolute; inset: 0; background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%); }
.services-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; position: relative; z-index: 1; }
@media (max-width: 768px) { .services-grid { grid-template-columns: 1fr; } }
.service-card { position: relative; padding: 32px; background: white; border-radius: 24px; border: 1px solid rgba(0, 0, 0, 0.06); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); transition: all 0.5s var(--ease-out-expo); overflow: hidden; }
.service-card::before { content: ''; position: absolute; inset: -2px; background: linear-gradient(135deg, var(--primary), var(--secondary), var(--accent)); border-radius: 26px; opacity: 0; z-index: -1; transition: opacity 0.4s ease; }
.service-card:hover::before { opacity: 1; }
.service-glow { position: absolute; top: -100px; left: -100px; width: 350px; height: 350px; background: radial-gradient(circle, rgba(var(--primary-rgb), 0.2), rgba(var(--accent-rgb), 0.1) 40%, transparent 70%); opacity: 0; transition: opacity 0.5s ease, transform 0.5s ease; pointer-events: none; }
.service-card:hover .service-glow { opacity: 1; transform: translate(20px, 20px); }
.service-shine { position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent); transition: left 0.7s ease; pointer-events: none; }
.service-card:hover .service-shine { left: 100%; }
.service-content { position: relative; z-index: 2; }
.service-icon { width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.12), rgba(var(--accent-rgb), 0.06)); border-radius: 14px; margin-bottom: 20px; transition: all 0.4s var(--ease-out-expo); }
.service-icon svg { width: 26px; height: 26px; color: var(--primary); transition: all 0.4s var(--ease-out-expo); }
.service-card:hover .service-icon { background: linear-gradient(135deg, var(--primary), var(--secondary)); transform: scale(1.08); box-shadow: 0 8px 24px rgba(var(--primary-rgb), 0.25); }
.service-card:hover .service-icon svg { color: white; }
.service-title { font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 10px; }
.service-desc { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.65; margin-bottom: 18px; }
.service-link { display: inline-flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 600; color: var(--primary); transition: all 0.3s var(--ease-out-expo); }
.service-link svg { width: 16px; height: 16px; transition: transform 0.3s ease; }
.service-card:hover .service-link { gap: 10px; }
.service-card:hover .service-link svg { transform: translateX(3px); }
.service-number { position: absolute; top: 24px; right: 24px; font-family: var(--font-display); font-size: 3.5rem; font-weight: 800; color: rgba(0, 0, 0, 0.04); line-height: 1; transition: all 0.4s var(--ease-out-expo); }
.service-card:hover .service-number { color: rgba(var(--primary-rgb), 0.15); transform: scale(1.15); }
.service-card:hover { transform: translateY(-12px); box-shadow: 0 30px 60px rgba(var(--primary-rgb), 0.15), 0 15px 30px rgba(var(--accent-rgb), 0.1); border-color: transparent; }

.gallery-masonry { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
@media (max-width: 1024px) { .gallery-masonry { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .gallery-masonry { grid-template-columns: 1fr; } }
.gallery-item { position: relative; aspect-ratio: 4/3; }
.gallery-card { position: relative; border-radius: 20px; overflow: hidden; background: var(--bg-secondary); height: 100%; transition: all 0.5s var(--ease-out-expo); }
.gallery-card::before { content: ''; position: absolute; inset: -3px; background: linear-gradient(135deg, var(--primary), var(--secondary), var(--accent)); border-radius: 23px; opacity: 0; z-index: -1; transition: opacity 0.4s ease; }
.gallery-card:hover::before { opacity: 1; }
.gallery-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 40px rgba(var(--primary-rgb), 0.2); }
.gallery-image-wrapper { position: absolute; inset: 0; }
.gallery-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s var(--ease-out-expo); }
.gallery-shine { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent 60%); opacity: 0; transition: opacity 0.4s ease; pointer-events: none; }
.gallery-card:hover img { transform: scale(1.06); }
.gallery-card:hover .gallery-shine { opacity: 1; }
.gallery-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.75) 100%); opacity: 0; transition: opacity 0.4s ease; }
.gallery-card:hover .gallery-overlay { opacity: 1; }
.gallery-content { position: absolute; bottom: 24px; left: 24px; right: 24px; transform: translateY(20px); opacity: 0; transition: all 0.4s var(--ease-out-expo); }
.gallery-card:hover .gallery-content { transform: translateY(0); opacity: 1; }
.gallery-tag { display: inline-block; padding: 6px 12px; background: rgba(255,255,255,0.2); border-radius: 100px; font-size: 0.75rem; font-weight: 600; color: white; margin-bottom: 8px; backdrop-filter: blur(10px); }
.gallery-content h4 { font-size: 1.25rem; font-weight: 700; color: white; }
.gallery-zoom { position: absolute; top: 24px; right: 24px; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: white; border-radius: 50%; color: var(--text-primary); transform: scale(0); opacity: 0; transition: all 0.4s var(--ease-out-back); box-shadow: var(--shadow-lg); }
.gallery-zoom svg { width: 22px; height: 22px; }
.gallery-card:hover .gallery-zoom { transform: scale(1); opacity: 1; }
.gallery-zoom:hover { background: var(--primary); color: white; }

.testimonials { position: relative; overflow: hidden; padding: var(--section-padding) 0; }
.testimonials-bg { position: absolute; inset: 0; z-index: 0; }
.testimonials-gradient { position: absolute; inset: 0; background: linear-gradient(135deg, #1e293b, #0f172a 50%, #1e293b); }
.testimonials-glow { position: absolute; width: 500px; height: 500px; border-radius: 50%; filter: blur(120px); opacity: 0.4; }
.testimonials-glow-1 { background: var(--primary); top: -200px; left: -100px; animation: testimonialGlow 8s ease-in-out infinite; }
.testimonials-glow-2 { background: var(--accent); bottom: -200px; right: -100px; animation: testimonialGlow 8s ease-in-out infinite 4s; }
@keyframes testimonialGlow { 0%, 100% { transform: scale(1); opacity: 0.4; } 50% { transform: scale(1.2); opacity: 0.6; } }
.testimonials .section-header.light { text-align: center; position: relative; z-index: 2; margin-bottom: 50px; }
.section-desc.light { color: rgba(255, 255, 255, 0.7); }

/* Testimonials Marquee - Infinite Scroll */
.testimonials-marquee { position: relative; z-index: 2; padding: 20px 0; overflow: hidden; }
.marquee-container { overflow: hidden; margin: 0 -1rem; padding: 1rem; }
.marquee-track { display: flex; gap: 1.5rem; animation: marqueeScroll 30s linear infinite; width: max-content; }
.marquee-track:hover { animation-play-state: paused; }
@keyframes marqueeScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* 3D Card */
.testimonial-card-3d { flex: 0 0 380px; max-width: 420px; perspective: 1000px; }
@media (max-width: 768px) { .testimonial-card-3d { flex: 0 0 320px; } }

.card-3d-inner { position: relative; background: linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03)); border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; padding: 2rem; transform-style: preserve-3d; transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); overflow: hidden; }
.testimonial-card-3d:hover .card-3d-inner { transform: translateY(-8px) rotateX(2deg); border-color: rgba(var(--primary-rgb), 0.5); box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 60px rgba(var(--primary-rgb), 0.2); }

.card-3d-glow { position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(var(--primary-rgb), 0.2), transparent 60%); opacity: 0; transition: opacity 0.4s ease; }
.testimonial-card-3d:hover .card-3d-glow { opacity: 1; }

.card-3d-border { position: absolute; inset: -1px; background: linear-gradient(145deg, rgba(var(--primary-rgb), 0.5), transparent 50%); border-radius: 24px; opacity: 0; transition: opacity 0.4s ease; z-index: -1; }
.testimonial-card-3d:hover .card-3d-border { opacity: 1; }

/* Quote Icon */
.quote-icon-3d { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: 12px; margin-bottom: 1.25rem; transform: rotate(-5deg); }
.quote-icon-3d svg { width: 24px; height: 24px; color: white; }

/* Animated Stars */
.star-rating-3d { display: flex; gap: 4px; margin-bottom: 1rem; }
.star-3d { width: 20px; height: 20px; color: #fbbf24; opacity: 0; transform: scale(0) rotate(-180deg); animation: starPop3d 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
.star-3d-1 { animation-delay: 0.1s; }
.star-3d-2 { animation-delay: 0.2s; }
.star-3d-3 { animation-delay: 0.3s; }
.star-3d-4 { animation-delay: 0.4s; }
.star-3d-5 { animation-delay: 0.5s; }
@keyframes starPop3d { to { opacity: 1; transform: scale(1) rotate(0deg); } }

/* Quote Text */
.quote-text-3d { font-size: 1.0625rem; color: rgba(255, 255, 255, 0.9); line-height: 1.75; margin-bottom: 1.5rem; font-style: italic; border: none; padding: 0; }

/* Author Section */
.author-section-3d { display: flex; align-items: center; gap: 0.875rem; padding-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.1); }
.author-avatar-3d { position: relative; width: 52px; height: 52px; }
.avatar-gradient-3d { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--primary), var(--accent)); border-radius: 50%; font-size: 1.125rem; font-weight: 700; color: white; }
.avatar-ring-3d { position: absolute; inset: -3px; border: 2px solid rgba(var(--primary-rgb), 0.4); border-radius: 50%; animation: ringPulse3d 2s ease-in-out infinite; }
@keyframes ringPulse3d { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 0.2; } }

.author-details-3d { flex: 1; }
.author-name-3d { display: block; font-weight: 600; color: white; font-size: 0.9375rem; margin-bottom: 2px; }
.author-role-3d { display: block; font-size: 0.8125rem; color: rgba(255, 255, 255, 0.6); }

.verified-badge-3d { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: rgba(34, 197, 94, 0.2); border-radius: 50%; }
.verified-badge-3d svg { width: 16px; height: 16px; color: #22c55e; }

/* Navigation Dots */
.carousel-nav-3d { display: flex; justify-content: center; gap: 10px; margin-top: 2rem; }
.carousel-dot-3d { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.3); border: none; cursor: pointer; transition: all 0.3s ease; position: relative; }
.carousel-dot-3d::before { content: ''; position: absolute; inset: -4px; border: 2px solid transparent; border-radius: 50%; transition: all 0.3s ease; }
.carousel-dot-3d.active { background: var(--primary); transform: scale(1.2); }
.carousel-dot-3d.active::before { border-color: rgba(var(--primary-rgb), 0.4); }
.carousel-dot-3d:hover:not(.active) { background: rgba(255,255,255,0.5); }

/* Swipe Hint */
.swipe-hint-3d { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 1.5rem; color: rgba(255,255,255,0.5); font-size: 0.8125rem; animation: swipeHint3d 2s ease-in-out infinite; }
.swipe-hint-3d svg { width: 18px; height: 18px; }
@keyframes swipeHint3d { 0%, 100% { transform: translateX(0); opacity: 0.5; } 50% { transform: translateX(10px); opacity: 1; } }
@media (min-width: 768px) { .swipe-hint-3d { display: none; } }

.cta { position: relative; overflow: hidden; text-align: center; padding: var(--section-padding) 0; }
.cta-bg { position: absolute; inset: 0; background: linear-gradient(160deg, #1e293b 0%, #0f172a 50%, #1e293b 100%); z-index: 0; }
.cta-aurora { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.5; animation: ctaAurora 12s ease-in-out infinite; }
.cta-aurora-1 { width: 500px; height: 500px; background: linear-gradient(135deg, var(--primary), var(--secondary)); top: -200px; left: -150px; }
.cta-aurora-2 { width: 400px; height: 400px; background: linear-gradient(135deg, var(--accent), var(--primary)); bottom: -150px; right: -100px; animation-delay: -6s; }
@keyframes ctaAurora { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(40px, 20px) scale(1.15); } }
.cta-content { position: relative; z-index: 2; max-width: 700px; margin: 0 auto; }
.cta-title { font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; line-height: 1.2; color: white; margin-bottom: 20px; }
.cta-desc { font-size: 1.1rem; color: rgba(255, 255, 255, 0.7); margin-bottom: 36px; }
.cta-actions { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }

.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
@media (max-width: 1024px) { .contact-grid { grid-template-columns: 1fr; gap: 60px; } }
.contact-desc { color: var(--text-secondary); margin-bottom: 32px; }
.contact-methods { display: flex; flex-direction: column; gap: 16px; margin-bottom: 40px; }
.contact-method { display: flex; align-items: center; gap: 20px; padding: 20px; background: var(--bg-secondary); border-radius: 20px; border: 1px solid transparent; transition: all 0.4s var(--ease-out-expo); position: relative; overflow: hidden; }
.contact-method::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.05), rgba(var(--accent-rgb), 0.03)); opacity: 0; transition: opacity 0.4s ease; }
.contact-method:hover::before { opacity: 1; }
.contact-method:hover { background: white; border-color: rgba(var(--primary-rgb), 0.15); box-shadow: 0 15px 40px rgba(var(--primary-rgb), 0.12); transform: translateX(10px) translateY(-2px); }
.method-icon { width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.1), rgba(var(--accent-rgb), 0.05)); border-radius: 14px; transition: all 0.4s var(--ease-out-expo); }
.method-icon svg { width: 24px; height: 24px; color: var(--primary); }
.contact-method:hover .method-icon { background: linear-gradient(135deg, var(--primary), var(--secondary)); }
.contact-method:hover .method-icon svg { color: white; }
.method-label { display: block; font-size: 0.8125rem; color: var(--text-tertiary); margin-bottom: 4px; }
.method-value { font-size: 1rem; font-weight: 600; color: var(--text-primary); }
.contact-social { padding-top: 24px; border-top: 1px solid rgba(0, 0, 0, 0.06); }
.social-label { display: block; font-size: 0.875rem; font-weight: 600; color: var(--text-tertiary); margin-bottom: 16px; }
.social-links { display: flex; gap: 12px; }
.social-link { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: var(--bg-secondary); border-radius: 12px; color: var(--text-secondary); transition: all 0.3s var(--ease-out-expo); position: relative; overflow: hidden; }
.social-link svg { width: 20px; height: 20px; position: relative; z-index: 1; }
.social-link::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, var(--primary), var(--secondary)); opacity: 0; transition: opacity 0.3s ease; }
.social-link:hover::before { opacity: 1; }
.social-link:hover { color: white; transform: translateY(-5px) scale(1.1); box-shadow: 0 10px 25px rgba(var(--primary-rgb), 0.3); }

.contact-form-wrapper { background: white; border-radius: 28px; padding: 36px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08); border: 1px solid rgba(0, 0, 0, 0.04); }
.form-header { margin-bottom: 28px; }
.form-header h3 { font-family: var(--font-display); font-size: 1.35rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px; }
.form-header p { font-size: 0.9rem; color: var(--text-secondary); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 640px) { .form-row { grid-template-columns: 1fr; } }
.form-group { position: relative; margin-bottom: 20px; }
.form-group input, .form-group textarea { width: 100%; padding: 16px 18px; font-size: 0.95rem; font-family: inherit; background: var(--bg-secondary); border: 1.5px solid transparent; border-radius: 14px; color: var(--text-primary); transition: all 0.3s var(--ease-out-expo); }
.form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--primary); background: white; box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.08); }
.form-group label { position: absolute; top: 50%; left: 20px; transform: translateY(-50%); font-size: 1rem; color: var(--text-tertiary); pointer-events: none; transition: all 0.3s var(--ease-out-expo); }
.form-group textarea ~ label { top: 20px; transform: none; }
.form-group input:focus ~ label, .form-group input:not(:placeholder-shown) ~ label, .form-group textarea:focus ~ label, .form-group textarea:not(:placeholder-shown) ~ label { top: -10px; left: 16px; font-size: 0.75rem; font-weight: 600; color: var(--primary); background: white; padding: 2px 8px; border-radius: 4px; }
.input-highlight { position: absolute; bottom: 0; left: 50%; width: 0; height: 2px; background: linear-gradient(90deg, var(--primary), var(--secondary)); transition: all 0.4s var(--ease-out-expo); transform: translateX(-50%); border-radius: 2px; }
.form-group input:focus ~ .input-highlight, .form-group textarea:focus ~ .input-highlight { width: calc(100% - 4px); }

.footer { background: var(--bg-secondary); position: relative; }
.footer-top { padding: 80px 0 60px; border-bottom: 1px solid rgba(0, 0, 0, 0.06); }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 60px; }
@media (max-width: 1024px) { .footer-grid { grid-template-columns: repeat(2, 1fr); gap: 40px; } }
@media (max-width: 640px) { .footer-grid { grid-template-columns: 1fr; gap: 32px; } }
.footer-logo { height: 40px; margin-bottom: 16px; }
.footer-logo-text { font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.footer-desc { color: var(--text-secondary); max-width: 300px; }
.footer-links-group h4 { font-family: var(--font-display); font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 20px; }
.footer-links { display: flex; flex-direction: column; gap: 12px; }
.footer-links a { font-size: 0.9375rem; color: var(--text-secondary); transition: all 0.3s ease; display: inline-block; position: relative; }
.footer-links a::after { content: '→'; position: absolute; right: -20px; opacity: 0; transition: all 0.3s ease; color: var(--primary); }
.footer-links a:hover { color: var(--primary); transform: translateX(6px); }
.footer-links a:hover::after { opacity: 1; right: -24px; }
.footer-bottom { padding: 24px 0; display: flex; align-items: center; justify-content: space-between; }
.footer-bottom p { font-size: 0.875rem; color: var(--text-tertiary); }
.footer-social { display: flex; gap: 12px; }
.footer-social a { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); transition: all 0.3s ease; }
.footer-social a svg { width: 20px; height: 20px; }
.footer-social a:hover { color: var(--primary); transform: translateY(-3px); }
@media (max-width: 640px) { .footer-bottom { flex-direction: column; gap: 16px; text-align: center; } }

.back-to-top { position: fixed; bottom: 32px; right: 32px; width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; background: white; border-radius: 50%; color: var(--text-primary); box-shadow: var(--shadow-lg); z-index: 100; opacity: 0; visibility: hidden; transform: translateY(20px); transition: all 0.4s var(--ease-out-expo); overflow: hidden; }
.back-to-top svg { width: 24px; height: 24px; position: relative; z-index: 1; transition: transform 0.3s ease; }
.back-to-top::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, var(--primary), var(--secondary)); opacity: 0; transition: opacity 0.3s ease; }
.back-to-top.visible { opacity: 1; visibility: visible; transform: translateY(0); }
.back-to-top:hover::before { opacity: 1; }
.back-to-top:hover { color: white; transform: translateY(-6px); box-shadow: 0 15px 35px rgba(var(--primary-rgb), 0.3); }
.back-to-top:hover svg { transform: translateY(-2px); }

.lightbox { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.95); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 40px; opacity: 0; visibility: hidden; transition: all 0.4s var(--ease-out-expo); }
.lightbox.active { opacity: 1; visibility: visible; }
.lightbox img { max-width: 100%; max-height: 90vh; object-fit: contain; border-radius: 12px; transform: scale(0.9); transition: transform 0.4s var(--ease-out-expo); }
.lightbox.active img { transform: scale(1); }
.lightbox-close { position: absolute; top: 24px; right: 24px; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.1); border-radius: 50%; color: white; transition: all 0.3s ease; }
.lightbox-close:hover { background: white; color: var(--text-primary); }

.magnetic { transition: transform 0.3s var(--ease-out-expo); }
[data-tilt] { transform-style: preserve-3d; }
[data-animate] { opacity: 0; }
[data-animate].animated { opacity: 1; }

/* Reduced Motion - Accessibility */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
  .shape, .hero-aurora, .testimonials-glow { animation: none !important; }
  [data-tilt] { transform: none !important; }
}

/* Print Styles */
@media print { .nav, .cursor, .cursor-follow, .hero-aurora, #backToTop { display: none !important; } .hero { min-height: auto; padding: 2rem 0; } }

/* Focus Styles - Accessibility */
:focus-visible { outline: 2px solid var(--primary); outline-offset: 3px; }
.btn:focus-visible { box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.3); }

@media (max-width: 768px) { .hero { padding: 120px 0 80px; } .hero-stats { gap: 24px; } .stat-divider { display: none; } .hero-scroll { display: none; } .contact-form-wrapper { padding: 24px; } }
`;
  }

  private generateJS(input: LightTemplateInput): string {
    return `document.addEventListener('DOMContentLoaded',()=>{
gsap.registerPlugin(ScrollTrigger);
const isMobile=window.innerWidth<768||!window.matchMedia('(hover: hover)').matches;

/* Cursor Effects (Desktop Only) */
const spotlight=document.getElementById('cursorSpotlight'),cursorDot=document.getElementById('cursorDot'),magneticElements=document.querySelectorAll('.magnetic');
if(spotlight&&cursorDot&&!isMobile){
let mouseX=0,mouseY=0,spotX=0,spotY=0,dotX=0,dotY=0;
document.addEventListener('mousemove',e=>{mouseX=e.clientX;mouseY=e.clientY});
function animateCursor(){spotX+=(mouseX-spotX)*0.08;spotY+=(mouseY-spotY)*0.08;spotlight.style.left=spotX+'px';spotlight.style.top=spotY+'px';dotX+=(mouseX-dotX)*0.2;dotY+=(mouseY-dotY)*0.2;cursorDot.style.left=dotX+'px';cursorDot.style.top=dotY+'px';requestAnimationFrame(animateCursor)}
animateCursor();
magneticElements.forEach(el=>{el.addEventListener('mousemove',e=>{const rect=el.getBoundingClientRect(),x=e.clientX-rect.left-rect.width/2,y=e.clientY-rect.top-rect.height/2;gsap.to(el,{x:x*0.3,y:y*0.3,duration:0.3,ease:'power2.out'});cursorDot.classList.add('hover')});el.addEventListener('mouseleave',()=>{gsap.to(el,{x:0,y:0,duration:0.5,ease:'elastic.out(1, 0.3)'});cursorDot.classList.remove('hover')})});
}

/* Particles */
const particlesContainer=document.getElementById('particles');
if(particlesContainer&&!isMobile){for(let i=0;i<30;i++){const particle=document.createElement('div');particle.className='particle';particle.style.left=Math.random()*100+'%';particle.style.top=Math.random()*100+'%';particle.style.animationDelay=Math.random()*15+'s';particle.style.animationDuration=(15+Math.random()*10)+'s';particlesContainer.appendChild(particle)}}

/* Header */
const header=document.getElementById('header'),menuToggle=document.getElementById('menuToggle'),navMobile=document.getElementById('navMobile');
window.addEventListener('scroll',()=>{if(window.pageYOffset>50){header.classList.add('scrolled')}else{header.classList.remove('scrolled')}});
if(menuToggle&&navMobile){menuToggle.addEventListener('click',()=>{menuToggle.classList.toggle('active');navMobile.classList.toggle('active');document.body.style.overflow=navMobile.classList.contains('active')?'hidden':''});navMobile.querySelectorAll('a').forEach(link=>{link.addEventListener('click',()=>{menuToggle.classList.remove('active');navMobile.classList.remove('active');document.body.style.overflow=''})})}

/* Mobile Intersection Observer */
if(isMobile){
const mobileObserver=new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');entry.target.style.opacity='1';entry.target.style.transform='translateY(0)'}})},{threshold:0.1,rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('.service-card,.gallery-item,.testimonial-card-3d,.about-card,[data-animate]').forEach(el=>{el.style.opacity='0';el.style.transform='translateY(30px)';el.style.transition='opacity 0.6s ease, transform 0.6s ease';mobileObserver.observe(el)});
}

/* Hero Title Animation */
const heroTitle=document.querySelector('.hero-title');
if(heroTitle){const text=heroTitle.textContent,words=text.split(' ');heroTitle.innerHTML=words.map((word,i)=>{const isGradient=i===1||word.toLowerCase().includes('vision')||word.toLowerCase().includes('transform');return\`<span class="word \${isGradient?'gradient-text':''}">\${word}</span>\`}).join(' ');gsap.fromTo('.hero-title .word',{opacity:0,y:50,rotateX:-30},{opacity:1,y:0,rotateX:0,duration:0.8,stagger:0.1,ease:'power3.out',delay:0.3})}

/* Scroll Animations (Desktop) */
if(!isMobile){
const animateElements=document.querySelectorAll('[data-animate]');
animateElements.forEach(el=>{const delay=parseFloat(el.dataset.delay)||0,type=el.dataset.animate;let fromVars={opacity:0};switch(type){case'fade-up':fromVars.y=60;break;case'fade-down':fromVars.y=-60;break;case'fade-left':fromVars.x=60;break;case'fade-right':fromVars.x=-60;break;case'scale':fromVars.scale=0.8;break;case'word':fromVars.y=40;fromVars.rotateX=-20;break}gsap.fromTo(el,fromVars,{opacity:1,x:0,y:0,scale:1,rotateX:0,duration:0.9,delay:delay,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%',once:true,onEnter:()=>el.classList.add('animated')}})});
}

/* Counters */
const counters=document.querySelectorAll('[data-count]');
counters.forEach(counter=>{
const target=parseInt(counter.dataset.count);
function animateCounter(){const duration=2000,start=performance.now();function update(){const elapsed=performance.now()-start,progress=Math.min(elapsed/duration,1),eased=1-Math.pow(1-progress,3);counter.textContent=Math.round(target*eased);if(progress<1)requestAnimationFrame(update)}requestAnimationFrame(update)}
if(isMobile){const obs=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){animateCounter();obs.unobserve(counter)}})},{threshold:0.5});obs.observe(counter)}else{ScrollTrigger.create({trigger:counter,start:'top 85%',once:true,onEnter:animateCounter})}
});

/* 3D Tilt (Desktop) */
const tiltCards=document.querySelectorAll('[data-tilt]');
if(!isMobile){tiltCards.forEach(card=>{card.addEventListener('mousemove',e=>{const rect=card.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top,centerX=rect.width/2,centerY=rect.height/2,rotateX=(y-centerY)/15,rotateY=(centerX-x)/15;gsap.to(card,{rotateX:-rotateX,rotateY:rotateY,duration:0.5,ease:'power2.out',transformPerspective:1000})});card.addEventListener('mouseleave',()=>{gsap.to(card,{rotateX:0,rotateY:0,duration:0.7,ease:'elastic.out(1, 0.5)'})})})}

/* Parallax Shapes (Desktop) */
const shapes=document.querySelectorAll('.shape[data-parallax-speed]');
if(shapes.length&&!isMobile){window.addEventListener('scroll',()=>{const scrollY=window.pageYOffset;shapes.forEach(shape=>{const speed=parseFloat(shape.dataset.parallaxSpeed)||0.05;gsap.to(shape,{y:scrollY*speed*100,duration:0.5,ease:'power1.out'})})})}

/* Back to Top */
const backToTop=document.getElementById('backToTop');
if(backToTop){window.addEventListener('scroll',()=>{backToTop.classList.toggle('visible',window.pageYOffset>500)});backToTop.addEventListener('click',()=>{window.scrollTo({top:0,behavior:'smooth'})})}

/* Smooth Scroll */
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{anchor.addEventListener('click',function(e){e.preventDefault();const target=document.querySelector(this.getAttribute('href'));if(target){target.scrollIntoView({behavior:'smooth'})}})});

/* Contact Form */
const contactForm=document.getElementById('contactForm');
if(contactForm){contactForm.addEventListener('submit',e=>{e.preventDefault();alert('Thank you for your message! We will get back to you soon.');contactForm.reset()})}

/* Magnetic Buttons */
if(!isMobile){
const magneticButtons=document.querySelectorAll('.btn,.nav-cta,.gallery-zoom,.magnetic');
magneticButtons.forEach(btn=>{
btn.addEventListener('mousemove',e=>{
const rect=btn.getBoundingClientRect(),x=e.clientX-rect.left-rect.width/2,y=e.clientY-rect.top-rect.height/2;
gsap.to(btn,{x:x*0.3,y:y*0.3,duration:0.3,ease:'power2.out'})});
btn.addEventListener('mouseleave',()=>{gsap.to(btn,{x:0,y:0,duration:0.5,ease:'elastic.out(1, 0.3)'})})
})}

/* Ripple Effect */
const rippleButtons=document.querySelectorAll('.btn');
rippleButtons.forEach(btn=>{
btn.addEventListener('click',function(e){
const rect=this.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;
const ripple=document.createElement('span');
ripple.className='btn-ripple';
ripple.style.left=x+'px';
ripple.style.top=y+'px';
this.appendChild(ripple);
setTimeout(()=>ripple.remove(),600)})});

console.log('✨ Aurora Light Premium v2.1 Loaded');
});
function openLightbox(src){const lightbox=document.getElementById('lightbox'),img=document.getElementById('lightboxImage');if(lightbox&&img){img.src=src;lightbox.classList.add('active');document.body.style.overflow='hidden'}}
function closeLightbox(){const lightbox=document.getElementById('lightbox');if(lightbox){lightbox.classList.remove('active');document.body.style.overflow=''}}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox()});`;
  }

  private hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
    }
    return '14, 165, 233';
  }
}

export const auroraLightTemplateGenerator = new AuroraLightTemplateGenerator();
