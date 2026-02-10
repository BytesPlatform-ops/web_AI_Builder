/**
 * ULTIMATE Premium Website Template Generator v3.0
 * 
 * Design Inspiration: Aceternity UI, Linear, Vercel, Stripe, Apple
 * 
 * Features:
 * ✅ GSAP ScrollTrigger animations
 * ✅ Aceternity-style spotlight effects
 * ✅ 3D tilt cards on hover
 * ✅ Animated gradient backgrounds
 * ✅ Particles/floating orbs
 * ✅ Text reveal animations (split text)
 * ✅ Bento grid layouts
 * ✅ Glassmorphism everywhere
 * ✅ Image gallery with lightbox
 * ✅ Smooth page transitions
 * ✅ Mobile-first responsive
 * ✅ Dark theme with accent colors
 */

import { GeneratedContent } from './ai-content.service';
import { ExtractedColors } from './color-extraction.service';
import { escapeHtml } from '@/lib/sanitize';

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
  templateType?: 'dark' | 'light'; // Template selection
}

export interface GeneratedFiles {
  'index.html': string;
  'styles.css': string;
  'script.js': string;
}

class UltimatePremiumTemplateGenerator {
  async generate(input: TemplateInput): Promise<GeneratedFiles> {
    const templateType = input.templateType || 'dark';
    
    // If light theme is selected, use the Aurora Light template
    if (templateType === 'light') {
      console.log(`☀️ Generating AURORA LIGHT template for ${input.businessName}...`);
      const { auroraLightTemplateGenerator } = await import('./light-template.service');
      return auroraLightTemplateGenerator.generate(input);
    }
    
    // Default: Dark theme (Midnight Pro)
    console.log(`🌙 Generating MIDNIGHT PRO (dark) template for ${input.businessName}...`);

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
    const { businessName, content, logoUrl, heroImageUrl, additionalImages, contactInfo } = input;
    
    // SECURITY: Escape all user-provided content for safe HTML rendering
    const safeBusinessName = escapeHtml(businessName);
    const safeHeadline = escapeHtml(content.hero.headline);
    const safeSubheadline = escapeHtml(content.hero.subheadline);
    const safeEmail = escapeHtml(contactInfo.email);
    const safePhone = contactInfo.phone ? escapeHtml(contactInfo.phone) : '';
    const safeAddress = contactInfo.address ? escapeHtml(contactInfo.address) : '';

    // Service icons - modern minimal
    const serviceIcons = [
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    ];

    // Generate gallery images HTML if additional images exist
    const galleryHTML = additionalImages && additionalImages.length > 0 ? `
    <!-- Gallery Section -->
    <section class="gallery" id="gallery">
      <div class="container">
        <div class="section-header" data-animate="fade-up">
          <span class="section-badge">
            <span class="badge-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></span>
            Our Work
          </span>
          <h2 class="section-title">Gallery</h2>
          <p class="section-desc">Take a look at what we do</p>
        </div>
        
        <div class="gallery-grid">
          ${additionalImages.map((img, i) => `
          <div class="gallery-item ${i === 0 ? 'gallery-featured' : ''} ${i % 5 === 3 ? 'gallery-tall' : ''}" data-animate="zoom-in" data-delay="${i * 0.08}">
            <div class="gallery-image-wrapper">
              <img src="${img}" alt="Gallery image ${i + 1}" class="gallery-image" loading="lazy" />
              <div class="gallery-shine"></div>
              <div class="gallery-overlay">
                <div class="gallery-caption">
                  <span class="gallery-tag">View</span>
                </div>
                <button class="gallery-zoom" onclick="openLightbox('${img}')">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>
                </button>
              </div>
            </div>
          </div>
          `).join('')}
        </div>
      </div>
    </section>
    
    <!-- Contact Section -->
    <section class="contact" id="contact">
      <div class="container">
        <div class="section-header" data-animate="fade-up">
          <span class="section-badge">
            <span class="badge-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></span>
            Get in Touch
          </span>
          <h2 class="section-title">Let's Connect</h2>
          <p class="section-desc">Ready to start your project? Reach out and let's discuss how we can help bring your vision to life.</p>
        </div>
        
        <div class="contact-methods-grid">
          <a href="mailto:${safeEmail}" class="contact-method-card" data-tilt>
            <div class="method-icon-large">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <h3 class="method-title">Email Us</h3>
            <p class="method-value">${safeEmail}</p>
          </a>
          ${safePhone ? `
          <a href="tel:${safePhone}" class="contact-method-card" data-tilt>
            <div class="method-icon-large">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <h3 class="method-title">Call Us</h3>
            <p class="method-value">${safePhone}</p>
          </a>
          ` : ''}
          ${safeAddress ? `
          <div class="contact-method-card" data-tilt>
            <div class="method-icon-large">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <h3 class="method-title">Visit Us</h3>
            <p class="method-value">${safeAddress}</p>
          </div>
          ` : ''}
        </div>
      </div>
    </section>
    
    <!-- Lightbox -->
    <div class="lightbox" id="lightbox" onclick="closeLightbox()">
      <button class="lightbox-close" onclick="closeLightbox()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <img src="" alt="Fullscreen" class="lightbox-image" id="lightboxImage" />
    </div>
    ` : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${safeSubheadline}">
  <meta name="theme-color" content="#0a0a0a">
  <title>${safeBusinessName} | ${safeHeadline}</title>
  
  <!-- Preconnect -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- Fonts: Inter + Space Grotesk for headings -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  
  <!-- GSAP -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
  
  <link rel="stylesheet" href="styles.css">
  ${logoUrl ? `<link rel="icon" type="image/png" href="${logoUrl}">` : ''}
</head>
<body>
  <!-- Animated Background -->
  <div class="bg-grid"></div>
  <div class="bg-gradient"></div>
  <div class="spotlight" id="spotlight"></div>
  
  <!-- Floating Orbs -->
  <div class="orbs">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
  </div>

  <!-- Navigation -->
  <nav class="nav" id="nav">
    <div class="nav-inner">
      <a href="#" class="nav-logo">
        ${logoUrl 
          ? `<img src="${logoUrl}" alt="${safeBusinessName}" class="logo-img">`
          : `<span class="logo-text">${safeBusinessName}</span>`
        }
      </a>
      
      <div class="nav-links" id="navLinks">
        <a href="#services" class="nav-link">Services</a>
        <a href="#about" class="nav-link">About</a>
        ${additionalImages && additionalImages.length > 0 ? '<a href="#gallery" class="nav-link">Gallery</a>' : ''}
        <a href="#contact" class="nav-link">Contact</a>
      </div>
      
      <a href="#contact" class="nav-cta">
        <span>Get Started</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
      
      <button class="nav-toggle" id="navToggle" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="hero" id="hero" ${heroImageUrl ? `style="--hero-bg: url('${heroImageUrl}')"` : ''}>
    ${heroImageUrl ? '<div class="hero-bg-image"></div>' : ''}
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <div class="hero-badge" data-animate="fade-up">
        <span class="badge-pulse"></span>
        <span>Welcome to ${safeBusinessName}</span>
      </div>
      
      <h1 class="hero-title" data-animate="fade-up" data-delay="0.1">
        <span class="title-line">${safeHeadline}</span>
      </h1>
      
      <p class="hero-desc" data-animate="fade-up" data-delay="0.2">
        ${safeSubheadline}
      </p>
      
      <div class="hero-buttons" data-animate="fade-up" data-delay="0.3">
        <a href="#contact" class="btn btn-primary">
          <span>${escapeHtml(content.hero.ctaPrimary)}</span>
          <div class="btn-glow"></div>
        </a>
        <a href="#services" class="btn btn-ghost">
          <span>${escapeHtml(content.hero.ctaSecondary)}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </div>
    
    <div class="hero-scroll">
      <div class="scroll-indicator">
        <div class="scroll-dot"></div>
      </div>
      <span>Scroll down</span>
    </div>
  </section>

  <!-- Services Section - Bento Grid -->
  <section class="services" id="services">
    <div class="container">
      <div class="section-header" data-animate="fade-up">
        <span class="section-badge">
          <span class="badge-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span>
          Our Services
        </span>
        <h2 class="section-title">What We Offer</h2>
        <p class="section-desc">Discover our comprehensive range of professional services designed to help your business thrive.</p>
      </div>
      
      <div class="bento-grid">
        ${content.services.map((service, i) => `
        <div class="bento-card ${i === 0 ? 'bento-featured' : ''}" data-animate="fade-up" data-delay="${i * 0.1}" data-tilt>
          <div class="bento-glow"></div>
          <div class="shine"></div>
          <div class="bento-content">
            <div class="bento-icon">
              ${serviceIcons[i % serviceIcons.length]}
            </div>
            <h3 class="bento-title">${escapeHtml(service.title)}</h3>
            <p class="bento-desc">${escapeHtml(service.description)}</p>
            <a href="#contact" class="bento-link">
              Learn more
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- About Section -->
  <section class="about" id="about">
    <div class="container">
      <div class="about-grid">
        <div class="about-content">
          <span class="section-badge" data-animate="fade-up">
            <span class="badge-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></span>
            About Us
          </span>
          <h2 class="section-title text-left" data-animate="fade-up" data-delay="0.1">${escapeHtml(content.about.headline)}</h2>
          
          <div class="about-text" data-animate="fade-up" data-delay="0.2">
            ${content.about.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('')}
          </div>
          

          
          <div class="about-features" data-animate="fade-up" data-delay="0.4">
            <div class="feature-item">
              <div class="feature-check">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span>Professional Excellence</span>
            </div>
            <div class="feature-item">
              <div class="feature-check">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span>Customer Focused</span>
            </div>
            <div class="feature-item">
              <div class="feature-check">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span>Quality Guaranteed</span>
            </div>
          </div>
        </div>
        
        <div class="about-visual" data-animate="zoom-in" data-delay="0.2">
          <div class="about-card" data-tilt>
            <div class="about-card-glow"></div>
            ${logoUrl ? `
            <img src="${logoUrl}" alt="${safeBusinessName}" class="about-logo" />
            ` : `
            <div class="about-placeholder">
              <span>${safeBusinessName.charAt(0)}</span>
            </div>
            `}
            <div class="about-card-content">
              <h3>${safeBusinessName}</h3>
              <p>Excellence in every detail</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  ${content.testimonials && content.testimonials.length > 0 ? `
  <!-- Testimonials Section - Premium 3D Carousel -->
  <section class="testimonials" id="testimonials">
    <div class="testimonials-bg-effects">
      <div class="testimonials-glow testimonials-glow-1"></div>
      <div class="testimonials-glow testimonials-glow-2"></div>
    </div>
    <div class="container">
      <div class="section-header" data-animate="fade-up">
        <span class="section-badge">
          <span class="badge-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>
          Testimonials
        </span>
        <h2 class="section-title">What Our <span class="gradient-text">Clients</span> Say</h2>
        <p class="section-desc">Real stories from real customers who love what we do.</p>
      </div>
      
      <!-- Infinite Marquee Carousel -->
      <div class="testimonials-marquee" data-animate="fade-up" data-delay="0.2">
        <div class="marquee-wrapper">
          <div class="marquee-track" id="testimonialTrack">
            ${[...content.testimonials, ...content.testimonials].map((testimonial: { quote: string; author?: string; authorName?: string; role?: string; authorRole?: string }, i: number) => `
            <div class="testimonial-card-3d" data-index="${i}">
              <div class="card-inner">
                <div class="card-glow"></div>
                <div class="card-border"></div>
                
                <!-- Quote Icon -->
                <div class="quote-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.956.76-3.022.66-1.065 1.515-1.867 2.558-2.403L9.373 5c-.8.396-1.56.898-2.26 1.505-.71.607-1.34 1.305-1.9 2.094s-.98 1.68-1.25 2.69-.346 2.04-.217 3.1c.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l.002.003zm9.124 0c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.692-1.327-.817-.56-.124-1.074-.13-1.54-.022-.16-.94.09-1.95.75-3.02.66-1.06 1.514-1.86 2.557-2.4L18.49 5c-.8.396-1.555.898-2.26 1.505-.708.607-1.34 1.305-1.894 2.094-.556.79-.97 1.68-1.24 2.69-.273 1-.345 2.04-.217 3.1.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368l-.007.003z"/></svg>
                </div>
                
                <!-- Animated Stars -->
                <div class="star-rating">
                  ${[1,2,3,4,5].map(star => `
                  <svg class="star star-${star}" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  `).join('')}
                </div>
                
                <!-- Quote Text -->
                <blockquote class="quote-text">"${escapeHtml(testimonial.quote)}"</blockquote>
                
                <!-- Author -->
                <div class="author-section">
                  <div class="author-image">
                    <div class="avatar-gradient">
                      <span>${escapeHtml(((testimonial.authorName || testimonial.author) || 'A').charAt(0).toUpperCase())}</span>
                    </div>
                    <div class="avatar-ring"></div>
                  </div>
                  <div class="author-details">
                    <span class="author-name">${escapeHtml((testimonial.authorName || testimonial.author) || 'Happy Customer')}</span>
                    <span class="author-role">${escapeHtml((testimonial.authorRole || testimonial.role) || 'Verified Client')}</span>
                  </div>
                  <div class="verified-badge">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                </div>
              </div>
            </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  </section>
        </div>
      </div>
    </div>
  </section>
  ` : ''}

  ${galleryHTML}

  <!-- CTA Section -->
  <section class="cta" id="contact">
    <div class="cta-bg">
      <div class="cta-glow cta-glow-1"></div>
      <div class="cta-glow cta-glow-2"></div>
    </div>
    
    <div class="container">
      <div class="cta-content" data-animate="fade-up">
        <span class="section-badge section-badge-light">
          <span class="badge-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>
          Get In Touch
        </span>
        <h2 class="cta-title">${content.cta.headline}</h2>
        <p class="cta-desc">${content.cta.subheadline}</p>
        
        <div class="cta-buttons">
          ${contactInfo.phone ? `
          <a href="tel:${contactInfo.phone}" class="btn btn-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>Call Us</span>
          </a>
          ` : ''}
          <a href="mailto:${contactInfo.email}" class="btn btn-glass">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <span>Email Us</span>
          </a>
        </div>
        
        <div class="cta-info">
          ${contactInfo.phone ? `
          <div class="info-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>${contactInfo.phone}</span>
          </div>
          ` : ''}
          <div class="info-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <span>${contactInfo.email}</span>
          </div>
          ${contactInfo.address ? `
          <div class="info-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
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
      <div class="footer-grid">
        <div class="footer-brand">
          ${logoUrl 
            ? `<img src="${logoUrl}" alt="${safeBusinessName}" class="footer-logo">`
            : `<span class="footer-logo-text">${safeBusinessName}</span>`
          }
          <p class="footer-desc">${safeSubheadline.substring(0, 120)}${safeSubheadline.length > 120 ? '...' : ''}</p>
          
          ${contactInfo.social ? `
          <div class="footer-social">
            ${contactInfo.social.facebook ? `<a href="${contactInfo.social.facebook}" target="_blank" rel="noopener" class="social-link" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>` : ''}
            ${contactInfo.social.instagram ? `<a href="${contactInfo.social.instagram}" target="_blank" rel="noopener" class="social-link" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>` : ''}
            ${contactInfo.social.linkedin ? `<a href="${contactInfo.social.linkedin}" target="_blank" rel="noopener" class="social-link" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>` : ''}
            ${contactInfo.social.twitter ? `<a href="${contactInfo.social.twitter}" target="_blank" rel="noopener" class="social-link" aria-label="Twitter"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>` : ''}
          </div>
          ` : ''}
        </div>
        
        <div class="footer-links">
          <h4>Quick Links</h4>
          <a href="#hero">Home</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          ${additionalImages && additionalImages.length > 0 ? '<a href="#gallery">Gallery</a>' : ''}
          <a href="#contact">Contact</a>
        </div>
        
        <div class="footer-links">
          <h4>Contact Info</h4>
          <a href="mailto:${safeEmail}">${safeEmail}</a>
          ${safePhone ? `<a href="tel:${safePhone}">${safePhone}</a>` : ''}
          ${safeAddress ? `<span>${safeAddress}</span>` : ''}
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} ${safeBusinessName}. All rights reserved.</p>
        <p>Crafted with ❤️</p>
      </div>
    </div>
  </footer>

  <!-- Back to Top -->
  <button class="back-to-top" id="backToTop" aria-label="Back to top">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
  </button>

  <script src="script.js"></script>
</body>
</html>`;
  }

  private generateCSS(input: TemplateInput): string {
    const { colors } = input;
    
    // Create color variations
    const primary = colors.primary;
    const secondary = colors.secondary;
    const accent = colors.accent;

    return `/*
 * ULTIMATE Premium Website Template v3.0
 * Dark Theme | Glassmorphism | Animations
 */

/* ===== CSS VARIABLES ===== */
:root {
  /* Brand Colors */
  --primary: ${primary};
  --primary-rgb: ${this.hexToRgb(primary)};
  --secondary: ${secondary};
  --accent: ${accent};
  
  /* Dark Theme */
  --bg-primary: #0a0a0a;
  --bg-secondary: #111111;
  --bg-tertiary: #1a1a1a;
  --bg-card: rgba(255, 255, 255, 0.03);
  --bg-glass: rgba(255, 255, 255, 0.05);
  
  /* Text */
  --text-primary: #ffffff;
  --text-secondary: #a1a1aa;
  --text-tertiary: #71717a;
  
  /* Borders */
  --border-color: rgba(255, 255, 255, 0.1);
  --border-color-hover: rgba(255, 255, 255, 0.2);
  
  /* Fonts */
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-heading: 'Space Grotesk', sans-serif;
  
  /* Spacing */
  --section-padding: clamp(4rem, 10vw, 8rem);
  
  /* Effects */
  --glow: 0 0 60px -15px var(--primary);
  --glow-lg: 0 0 100px -20px var(--primary);
  
  /* Transitions */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ===== RESET ===== */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 100px;
}

body {
  font-family: var(--font-body);
  background: var(--bg-primary);
  color: var(--text-secondary);
  line-height: 1.7;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

::selection {
  background: var(--primary);
  color: white;
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

/* ===== BACKGROUND EFFECTS ===== */
.bg-grid {
  position: fixed;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
  z-index: 0;
}

.bg-gradient {
  position: fixed;
  inset: 0;
  background: 
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(var(--primary-rgb), 0.15), transparent),
    radial-gradient(ellipse 60% 40% at 100% 100%, rgba(var(--primary-rgb), 0.1), transparent);
  pointer-events: none;
  z-index: 0;
}

.spotlight {
  position: fixed;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(var(--primary-rgb), 0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s ease;
  transform: translate(-50%, -50%);
}

body:hover .spotlight {
  opacity: 1;
}

/* ===== ORBS ===== */
.orbs {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: orbFloat 20s ease-in-out infinite;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: var(--primary);
  top: -200px;
  right: -200px;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: var(--secondary);
  bottom: 20%;
  left: -200px;
  animation-delay: -5s;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: var(--accent);
  bottom: -100px;
  right: 30%;
  animation-delay: -10s;
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -50px) scale(1.05); }
  50% { transform: translate(-20px, 30px) scale(0.95); }
  75% { transform: translate(40px, 20px) scale(1.02); }
}

/* ===== CONTAINER ===== */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 2;
}

/* ===== NAVIGATION ===== */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 0;
  transition: all 0.4s var(--ease-out-expo);
}

.nav.scrolled {
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  padding: 0.75rem 0;
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 1001;
}

.logo-img {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.logo-text {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: color 0.3s ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary);
  transition: width 0.3s var(--ease-out-expo);
}

.nav-link:hover {
  color: var(--text-primary);
}

.nav-link:hover::after {
  width: 100%;
}

.nav-cta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: var(--primary);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 100px;
  transition: all 0.3s var(--ease-out-expo);
}

.nav-cta svg {
  width: 16px;
  height: 16px;
  transition: transform 0.3s var(--ease-out-expo);
}

.nav-cta:hover {
  transform: translateY(-2px);
  box-shadow: var(--glow);
}

.nav-cta:hover svg {
  transform: translateX(3px);
}

.nav-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 0.5rem;
  z-index: 1001;
}

.nav-toggle span {
  width: 24px;
  height: 2px;
  background: var(--text-primary);
  transition: all 0.3s ease;
  transform-origin: center;
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

@media (max-width: 768px) {
  .nav-toggle {
    display: flex;
  }
  
  .nav-links {
    position: fixed;
    inset: 0;
    background: var(--bg-primary);
    flex-direction: column;
    justify-content: center;
    gap: 2rem;
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s var(--ease-out-expo);
  }
  
  .nav-links.active {
    opacity: 1;
    visibility: visible;
  }
  
  .nav-link {
    font-size: 1.5rem;
  }
  
  .nav-cta {
    display: none;
  }
}

/* ===== HERO ===== */
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8rem 1.5rem 4rem;
  position: relative;
  overflow: hidden;
}

/* Hero Background Image */
.hero-bg-image {
  position: absolute;
  inset: 0;
  background-image: var(--hero-bg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(10, 10, 10, 0.9) 0%,
    rgba(10, 10, 10, 0.7) 40%,
    rgba(10, 10, 10, 0.5) 100%
  );
  z-index: 1;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 2;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem 0.5rem 0.5rem;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: 100px;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.badge-pulse {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.5); }
}

.hero-title {
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 1.5rem;
}

.title-line {
  display: block;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--primary) 50%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto 2.5rem;
  line-height: 1.8;
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.hero-scroll {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-tertiary);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.scroll-indicator {
  width: 24px;
  height: 40px;
  border: 2px solid var(--border-color);
  border-radius: 100px;
  position: relative;
}

.scroll-dot {
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 8px;
  background: var(--primary);
  border-radius: 100px;
  animation: scrollDot 2s ease-in-out infinite;
}

@keyframes scrollDot {
  0%, 100% { top: 6px; opacity: 1; }
  50% { top: 22px; opacity: 0.3; }
}

/* ===== BUTTONS ===== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: 100px;
  transition: all 0.3s var(--ease-out-expo);
  position: relative;
  overflow: hidden;
}

.btn svg {
  width: 18px;
  height: 18px;
  transition: transform 0.3s var(--ease-out-expo);
}

.btn:hover svg {
  transform: translateX(3px);
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--glow);
}

.btn-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.btn-primary:hover .btn-glow {
  transform: translateX(100%);
}

/* Button Ripple Effect */
.btn {
  position: relative;
  overflow: hidden;
}

.btn-ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
  transform: scale(0);
  animation: ripple 0.6s ease-out forwards;
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

/* Character animation for text reveal */
.char {
  display: inline-block;
}

.btn-ghost {
  background: var(--bg-glass);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-ghost:hover {
  background: var(--bg-tertiary);
  border-color: var(--border-color-hover);
}

.btn-white {
  background: white;
  color: var(--bg-primary);
}

.btn-white:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255,255,255,0.2);
}

.btn-glass {
  background: rgba(255,255,255,0.1);
  color: white;
  border: 1px solid rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
}

.btn-glass:hover {
  background: rgba(255,255,255,0.2);
}

/* ===== SECTIONS ===== */
section {
  padding: var(--section-padding) 0;
  position: relative;
}

.section-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 4rem;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: 100px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.section-badge-light {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.2);
  color: white;
}

.badge-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
}

.badge-icon svg {
  width: 100%;
  height: 100%;
  color: var(--primary);
}

.section-badge-light .badge-icon svg {
  color: white;
}

.section-title {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
}

.section-title.text-left {
  text-align: left;
}

.section-desc {
  font-size: 1.0625rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* ===== BENTO GRID (Services) - Premium Redesign ===== */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
}

.bento-card {
  position: relative;
  background: linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
  border: 1px solid var(--border-color);
  border-radius: 1.5rem;
  padding: 2rem;
  transition: all 0.5s var(--ease-out-expo);
  overflow: hidden;
  transform-style: preserve-3d;
}

/* Alternating card sizes for visual interest */
.bento-card:nth-child(1) { grid-column: span 2; min-height: 280px; }
.bento-card:nth-child(4) { grid-column: span 2; }

@media (max-width: 640px) {
  .bento-card:nth-child(1),
  .bento-card:nth-child(4) {
    grid-column: span 1;
    min-height: auto;
  }
}

.bento-featured {
  grid-column: span 2;
}

@media (max-width: 640px) {
  .bento-featured {
    grid-column: span 1;
  }
}

/* Gradient border on hover */
.bento-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: linear-gradient(135deg, var(--primary), var(--secondary), var(--accent));
  border-radius: 1.5rem;
  opacity: 0;
  z-index: -1;
  transition: opacity 0.4s ease;
}

.bento-card:hover::before {
  opacity: 1;
}

.bento-card::after {
  content: '';
  position: absolute;
  inset: 1px;
  background: var(--bg-secondary);
  border-radius: calc(1.5rem - 2px);
  z-index: -1;
}

.bento-card:hover {
  border-color: transparent;
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 20px 40px rgba(0,0,0,0.3),
    0 0 60px rgba(var(--primary-rgb), 0.15);
}

.bento-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(var(--primary-rgb), 0.15), transparent 50%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.bento-card:hover .bento-glow {
  opacity: 1;
  animation: glowRotate 8s linear infinite;
}

@keyframes glowRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Shine effect on hover */
.bento-card .shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  transition: left 0.6s ease;
  pointer-events: none;
}

.bento-card:hover .shine {
  left: 100%;
}

.bento-content {
  position: relative;
  z-index: 2;
}

.bento-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 16px;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 24px rgba(var(--primary-rgb), 0.25);
  transition: all 0.4s var(--ease-out-expo);
  position: relative;
  overflow: hidden;
}

/* Icon ring animation */
.bento-icon::before {
  content: '';
  position: absolute;
  inset: -3px;
  border: 2px solid rgba(var(--primary-rgb), 0.3);
  border-radius: 18px;
  opacity: 0;
  transition: all 0.4s ease;
}

.bento-card:hover .bento-icon::before {
  opacity: 1;
  animation: iconRing 1.5s ease-out infinite;
}

@keyframes iconRing {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.3); opacity: 0; }
}

.bento-card:hover .bento-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 12px 32px rgba(var(--primary-rgb), 0.4);
}

.bento-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.bento-title {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.bento-desc {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.bento-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary);
  transition: gap 0.3s var(--ease-out-expo);
}

.bento-link svg {
  width: 16px;
  height: 16px;
}

.bento-link:hover {
  gap: 0.75rem;
}

/* ===== ABOUT ===== */
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

@media (max-width: 1024px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

.about-content {
  max-width: 520px;
}

.about-text {
  margin-bottom: 2rem;
}

.about-text p {
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.about-text p:last-child {
  margin-bottom: 0;
}

.about-stats {
  display: flex;
  gap: 2rem;
  padding: 2rem 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 2rem;
}

.stat {
  text-align: center;
}

.stat-number {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-suffix {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: var(--text-tertiary);
  margin-top: 0.25rem;
}

.about-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-secondary);
}

.feature-check {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(34, 197, 94, 0.2);
  border-radius: 50%;
  flex-shrink: 0;
}

.feature-check svg {
  width: 14px;
  height: 14px;
  color: #22c55e;
}

/* About Visual */
.about-visual {
  display: flex;
  justify-content: center;
}

.about-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 2rem;
  padding: 3rem;
  text-align: center;
  max-width: 300px;
  transition: transform 0.4s var(--ease-out-expo);
}

.about-card:hover {
  transform: translateY(-8px);
}

.about-card-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, var(--primary), var(--secondary), var(--accent));
  border-radius: 2rem;
  z-index: -1;
  opacity: 0;
  filter: blur(20px);
  transition: opacity 0.4s ease;
}

.about-card:hover .about-card-glow {
  opacity: 0.5;
}

.about-logo {
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin: 0 auto 1.5rem;
}

.about-placeholder {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 1.5rem;
  margin: 0 auto 1.5rem;
}

.about-placeholder span {
  font-family: var(--font-heading);
  font-size: 3rem;
  font-weight: 700;
  color: white;
}

.about-card-content h3 {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.about-card-content p {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

/* ===== GALLERY - Premium Masonry Layout ===== */
.gallery {
  position: relative;
  overflow: hidden;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 240px;
  gap: 1.25rem;
}

@media (max-width: 1024px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 200px;
  }
}

@media (max-width: 640px) {
  .gallery-grid {
    grid-template-columns: 1fr;
    grid-auto-rows: 250px;
  }
}

.gallery-item {
  position: relative;
  border-radius: 1.25rem;
  overflow: hidden;
}

/* Featured item spans 2 columns */
.gallery-featured {
  grid-column: span 2;
  grid-row: span 2;
}

/* Tall items */
.gallery-tall {
  grid-row: span 2;
}

@media (max-width: 640px) {
  .gallery-featured,
  .gallery-tall {
    grid-column: span 1;
    grid-row: span 1;
  }
}

.gallery-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.gallery-item::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, var(--primary), var(--secondary), var(--accent));
  border-radius: 1.35rem;
  opacity: 0;
  z-index: -1;
  transition: opacity 0.4s ease;
}

.gallery-item:hover::before {
  opacity: 1;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s var(--ease-out-expo);
}

.gallery-item:hover .gallery-image {
  transform: scale(1.08);
}

.gallery-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent 60%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.gallery-item:hover .gallery-shine {
  opacity: 1;
}

.gallery-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.85) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 1.5rem;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.gallery-item:hover .gallery-overlay {
  opacity: 1;
}

.gallery-caption {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  transition: transform 0.4s ease;
}

.gallery-item:hover .gallery-caption {
  transform: translateX(-50%) translateY(0);
}

.gallery-tag {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: 1px solid rgba(255,255,255,0.2);
}

.gallery-zoom {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 50%;
  color: white;
  transition: all 0.4s var(--ease-out-back);
  box-shadow: 0 8px 24px rgba(var(--primary-rgb), 0.4);
  transform: translateY(20px);
  opacity: 0;
}

.gallery-item:hover .gallery-zoom {
  transform: translateY(0);
  opacity: 1;
}

.gallery-zoom svg {
  width: 24px;
  height: 24px;
}

.gallery-zoom:hover {
  transform: scale(1.15);
  box-shadow: 0 12px 32px rgba(var(--primary-rgb), 0.5);
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.lightbox.active {
  opacity: 1;
  visibility: visible;
}

.lightbox-close {
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  transition: all 0.3s ease;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lightbox-close svg {
  width: 24px;
  height: 24px;
}

.lightbox-image {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 0.5rem;
}

/* ===== TESTIMONIALS - PREMIUM 3D CAROUSEL ===== */
.testimonials {
  background: var(--bg-secondary);
  position: relative;
  overflow: hidden;
}

.testimonials-bg-effects {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.testimonials-glow {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.3;
}

.testimonials-glow-1 {
  background: var(--primary);
  top: -200px;
  left: -100px;
  animation: glowPulse 8s ease-in-out infinite;
}

.testimonials-glow-2 {
  background: var(--accent);
  bottom: -200px;
  right: -100px;
  animation: glowPulse 8s ease-in-out infinite 4s;
}

@keyframes glowPulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.2); opacity: 0.5; }
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Carousel Container */
.testimonials-carousel {
  position: relative;
  padding: 2rem 0;
}

/* Testimonials Marquee - Infinite Scroll */
.testimonials-marquee {
  position: relative;
  z-index: 2;
  padding: 20px 0;
  overflow: hidden;
}

.marquee-wrapper {
  overflow: hidden;
  margin: 0;
  padding: 1rem 0;
}

.marquee-track {
  display: flex;
  gap: 1.5rem;
  animation: marqueeScroll 30s linear infinite;
  width: max-content;
}

.marquee-track:hover {
  animation-play-state: paused;
}

@keyframes marqueeScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* 3D Testimonial Card */
.testimonial-card-3d {
  flex: 0 0 380px;
  max-width: 420px;
  perspective: 1000px;
}

@media (max-width: 768px) {
  .testimonial-card-3d {
    flex: 0 0 320px;
  }
}

.card-inner {
  position: relative;
  background: linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 24px;
  padding: 2rem;
  transform-style: preserve-3d;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
}

.testimonial-card-3d:hover .card-inner {
  transform: translateY(-8px) rotateX(2deg);
  border-color: rgba(var(--primary-rgb), 0.5);
  box-shadow: 
    0 20px 40px rgba(0,0,0,0.3),
    0 0 60px rgba(var(--primary-rgb), 0.15);
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(var(--primary-rgb), 0.15), transparent 60%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.testimonial-card-3d:hover .card-glow {
  opacity: 1;
}

.card-border {
  position: absolute;
  inset: -1px;
  background: linear-gradient(145deg, rgba(var(--primary-rgb), 0.5), transparent 50%, rgba(var(--primary-rgb), 0.2));
  border-radius: 24px;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: -1;
}

.testimonial-card-3d:hover .card-border {
  opacity: 1;
}

/* Quote Icon */
.quote-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 12px;
  margin-bottom: 1.25rem;
  transform: rotate(-5deg);
}

.quote-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

/* Animated Stars */
.star-rating {
  display: flex;
  gap: 4px;
  margin-bottom: 1rem;
}

.star {
  width: 20px;
  height: 20px;
  color: #fbbf24;
  opacity: 0;
  transform: scale(0) rotate(-180deg);
  animation: starPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.star-1 { animation-delay: 0.1s; }
.star-2 { animation-delay: 0.2s; }
.star-3 { animation-delay: 0.3s; }
.star-4 { animation-delay: 0.4s; }
.star-5 { animation-delay: 0.5s; }

@keyframes starPop {
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

/* Quote Text */
.quote-text {
  font-size: 1.0625rem;
  color: var(--text-secondary);
  line-height: 1.75;
  margin-bottom: 1.5rem;
  font-style: italic;
  border: none;
  padding: 0;
  position: relative;
}

/* Author Section */
.author-section {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255,255,255,0.08);
}

.author-image {
  position: relative;
  width: 52px;
  height: 52px;
}

.avatar-gradient {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  border-radius: 50%;
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
}

.avatar-ring {
  position: absolute;
  inset: -3px;
  border: 2px solid rgba(var(--primary-rgb), 0.3);
  border-radius: 50%;
  animation: ringPulse 2s ease-in-out infinite;
}

@keyframes ringPulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.2; }
}

.author-details {
  flex: 1;
}

.author-name {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9375rem;
  margin-bottom: 2px;
}

.author-role {
  display: block;
  font-size: 0.8125rem;
  color: var(--text-tertiary);
}

.verified-badge {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(34, 197, 94, 0.15);
  border-radius: 50%;
}

.verified-badge svg {
  width: 16px;
  height: 16px;
  color: #22c55e;
}

/* Navigation Dots */
.carousel-nav {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 2rem;
}

.carousel-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.carousel-dot::before {
  content: '';
  position: absolute;
  inset: -4px;
  border: 2px solid transparent;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.carousel-dot.active {
  background: var(--primary);
  transform: scale(1.2);
}

.carousel-dot.active::before {
  border-color: rgba(var(--primary-rgb), 0.3);
}

.carousel-dot:hover:not(.active) {
  background: rgba(255,255,255,0.4);
}

/* Swipe Hint */
.swipe-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 1.5rem;
  color: var(--text-tertiary);
  font-size: 0.8125rem;
  animation: swipeHint 2s ease-in-out infinite;
}

.swipe-hint svg {
  width: 18px;
  height: 18px;
}

@keyframes swipeHint {
  0%, 100% { transform: translateX(0); opacity: 0.5; }
  50% { transform: translateX(10px); opacity: 1; }
}

@media (min-width: 768px) {
  .swipe-hint {
    display: none;
  }
}

/* ===== CTA ===== */
.cta {
  position: relative;
  background: linear-gradient(135deg, var(--primary), ${this.darkenColor(colors.primary, 30)});
  overflow: hidden;
}

.cta-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.cta-glow {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
}

.cta-glow-1 {
  background: white;
  top: -300px;
  right: -200px;
}

.cta-glow-2 {
  background: var(--accent);
  bottom: -300px;
  left: -200px;
}

.cta-content {
  position: relative;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  color: white;
}

.cta-title {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.cta-desc {
  font-size: 1.125rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.cta-info {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  opacity: 0.9;
}

.info-item svg {
  width: 18px;
  height: 18px;
  opacity: 0.7;
}

/* ===== FOOTER ===== */
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: 4rem 0 2rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 4rem;
  margin-bottom: 3rem;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.footer-logo {
  height: 40px;
  width: auto;
  margin-bottom: 1rem;
}

.footer-logo-text {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.footer-desc {
  color: var(--text-secondary);
  font-size: 0.9375rem;
  margin-bottom: 1.5rem;
  max-width: 300px;
}

.footer-social {
  display: flex;
  gap: 0.75rem;
}

.social-link {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.social-link svg {
  width: 18px;
  height: 18px;
}

.social-link:hover {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
  transform: translateY(-3px);
}

.footer-links h4 {
  font-family: var(--font-heading);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}

.footer-links a,
.footer-links span {
  display: block;
  color: var(--text-secondary);
  font-size: 0.9375rem;
  padding: 0.5rem 0;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: var(--text-primary);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

@media (max-width: 640px) {
  .footer-bottom {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}

/* ===== BACK TO TOP ===== */
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  color: var(--text-secondary);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 100;
}

.back-to-top.visible {
  opacity: 1;
  visibility: visible;
}

.back-to-top:hover {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
  transform: translateY(-3px);
}

.back-to-top svg {
  width: 20px;
  height: 20px;
}

/* ===== ANIMATIONS ===== */
[data-animate] {
  opacity: 0;
  transform: translateY(30px);
}

[data-animate="fade-up"].animated {
  animation: fadeUp 0.8s var(--ease-out-expo) forwards;
}

[data-animate="zoom-in"] {
  transform: scale(0.9);
}

[data-animate="zoom-in"].animated {
  animation: zoomIn 0.8s var(--ease-out-expo) forwards;
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes zoomIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ===== MOBILE CSS ANIMATIONS (No JS Required) ===== */
@media (max-width: 768px) {
  [data-animate] {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
  }
  
  /* Mobile scroll-triggered animations via CSS */
  .hero-content, .hero-badge, .hero-title, .hero-desc, .hero-buttons {
    animation: mobileSlideUp 0.6s ease-out forwards;
  }
  
  .hero-badge { animation-delay: 0s; }
  .hero-title { animation-delay: 0.1s; }
  .hero-desc { animation-delay: 0.2s; }
  .hero-buttons { animation-delay: 0.3s; }
  
  @keyframes mobileSlideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Service cards stagger animation */
  .bento-card {
    animation: mobileCardReveal 0.5s ease-out forwards;
    animation-play-state: paused;
  }
  
  .bento-card:nth-child(1) { animation-delay: 0.1s; }
  .bento-card:nth-child(2) { animation-delay: 0.2s; }
  .bento-card:nth-child(3) { animation-delay: 0.3s; }
  .bento-card:nth-child(4) { animation-delay: 0.4s; }
  .bento-card:nth-child(5) { animation-delay: 0.5s; }
  .bento-card:nth-child(6) { animation-delay: 0.6s; }
  
  .bento-card.in-view {
    animation-play-state: running;
  }
  
  @keyframes mobileCardReveal {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Testimonial cards slide in */
  .testimonial-card-3d .card-inner {
    animation: mobileCardSlide 0.5s ease-out forwards;
  }
  
  @keyframes mobileCardSlide {
    from {
      opacity: 0;
      transform: translateX(40px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  /* Gallery items fade in */
  .gallery-item {
    animation: mobileFadeScale 0.4s ease-out forwards;
  }
  
  .gallery-item:nth-child(1) { animation-delay: 0.1s; }
  .gallery-item:nth-child(2) { animation-delay: 0.15s; }
  .gallery-item:nth-child(3) { animation-delay: 0.2s; }
  .gallery-item:nth-child(4) { animation-delay: 0.25s; }
  .gallery-item:nth-child(5) { animation-delay: 0.3s; }
  .gallery-item:nth-child(6) { animation-delay: 0.35s; }
  
  @keyframes mobileFadeScale {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  /* Touch-friendly tap feedback */
  .btn, .bento-card, .testimonial-card-3d, .gallery-item {
    -webkit-tap-highlight-color: transparent;
  }
  
  .btn:active {
    transform: scale(0.97);
  }
  
  .bento-card:active {
    transform: scale(0.98);
    background: rgba(255,255,255,0.06);
  }
}

/* ===== 3D TILT ===== */
[data-tilt] {
  transform-style: preserve-3d;
  transform: perspective(1000px);
}

/* ===== REDUCED MOTION - Accessibility ===== */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  .orb,
  .hero-bg-glow,
  .bento-glow {
    animation: none !important;
  }
  
  [data-tilt] {
    transform: none !important;
  }
}

/* ===== CONTACT SECTION ===== */
.contact {
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
}

.contact-methods-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3rem;
}

@media (max-width: 1024px) {
  .contact-methods-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .contact-methods-grid {
    grid-template-columns: 1fr;
  }
}

.contact-method-card {
  position: relative;
  background: linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
  border: 1px solid var(--border-color);
  border-radius: 1.5rem;
  padding: 2rem;
  transition: all 0.5s var(--ease-out-expo);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  text-decoration: none;
  transform-style: preserve-3d;
}

.contact-method-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: linear-gradient(135deg, var(--primary), var(--secondary), var(--accent));
  border-radius: 1.5rem;
  opacity: 0;
  z-index: -1;
  transition: opacity 0.4s ease;
}

.contact-method-card:hover::before {
  opacity: 1;
}

.contact-method-card::after {
  content: '';
  position: absolute;
  inset: 1px;
  background: var(--bg-secondary);
  border-radius: calc(1.5rem - 2px);
  z-index: -1;
}

.contact-method-card:hover {
  border-color: transparent;
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 60px rgba(var(--primary-rgb), 0.15);
}

.method-icon-large {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 16px;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 24px rgba(var(--primary-rgb), 0.25);
  transition: all 0.4s var(--ease-out-expo);
  position: relative;
}

.contact-method-card:hover .method-icon-large {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 12px 32px rgba(var(--primary-rgb), 0.4);
}

.method-icon-large svg {
  width: 28px;
  height: 28px;
  color: white;
}

.method-title {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.method-value {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0;
}

/* ===== PRINT STYLES ===== */
@media print {
  .nav,
  .spotlight,
  .orb,
  .hero-bg-glow,
  #backToTop {
    display: none !important;
  }
  
  .hero {
    min-height: auto;
    padding: 2rem 0;
  }
}

/* ===== FOCUS STYLES - Accessibility ===== */
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}

.btn:focus-visible {
  box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.3);
}
`;
  }

  private generateJS(input: TemplateInput): string {
    return `/*
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
        
        card.style.transform = \`perspective(1000px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg)\`;
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
        orb.style.transform = \`translateY(\${scrollY * speed}px)\`;
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
        char === ' ' ? ' ' : \`<span class="char">\${char}</span>\`
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
`;
  }

  // ===== UTILITY FUNCTIONS =====
  private hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
    }
    return '99, 102, 241'; // fallback
  }

  private darkenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max((num >> 16) - amt, 0);
    const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
    const B = Math.max((num & 0x0000FF) - amt, 0);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  }

  private lightenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min((num >> 16) + amt, 255);
    const G = Math.min((num >> 8 & 0x00FF) + amt, 255);
    const B = Math.min((num & 0x0000FF) + amt, 255);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  }
}

// Export instance as premiumTemplateGenerator (compatible with existing imports)
export const premiumTemplateGenerator = new UltimatePremiumTemplateGenerator();
export { UltimatePremiumTemplateGenerator };
