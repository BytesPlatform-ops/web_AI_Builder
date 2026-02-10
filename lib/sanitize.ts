/**
 * Input Sanitization Utilities
 * 
 * Prevents XSS (Cross-Site Scripting) attacks by sanitizing user input.
 * NEVER trust raw user input - always sanitize before storing or rendering.
 */

import sanitizeHtml from 'sanitize-html';

/**
 * Sanitize a string - removes ALL HTML tags
 * Use for: business name, tagline, email, phone, etc.
 */
export function sanitizeText(input: string | null | undefined): string {
  if (!input) return '';
  
  // Remove all HTML tags
  const sanitized = sanitizeHtml(input, {
    allowedTags: [],         // No HTML tags allowed
    allowedAttributes: {},   // No attributes allowed
    disallowedTagsMode: 'recursiveEscape',
  });

  // Also escape any remaining special characters
  return sanitized
    .replace(/&amp;/g, '&')    // Decode ampersands
    .replace(/&lt;/g, '<')     // Keep < as text
    .replace(/&gt;/g, '>')     // Keep > as text
    .replace(/&quot;/g, '"')   // Decode quotes
    .replace(/&#x27;/g, "'")   // Decode apostrophes
    .trim();
}

/**
 * Sanitize text but allow basic formatting (for about/description fields)
 * Allows: <p>, <br>, <strong>, <em>, <ul>, <ol>, <li>
 * Use for: about text, descriptions
 */
export function sanitizeRichText(input: string | null | undefined): string {
  if (!input) return '';
  
  return sanitizeHtml(input, {
    allowedTags: ['p', 'br', 'strong', 'em', 'b', 'i', 'ul', 'ol', 'li'],
    allowedAttributes: {},
    disallowedTagsMode: 'recursiveEscape',
  }).trim();
}

/**
 * Sanitize a URL - validate and clean URL input
 * Use for: social links, hero image URL, gallery URLs
 */
export function sanitizeUrl(input: string | null | undefined): string {
  if (!input) return '';
  
  const trimmed = input.trim();
  
  // Only allow http, https, and data URLs (for images)
  const allowedProtocols = ['http:', 'https:', 'data:'];
  
  try {
    const url = new URL(trimmed);
    if (!allowedProtocols.includes(url.protocol)) {
      console.warn(`Blocked URL with disallowed protocol: ${url.protocol}`);
      return '';
    }
    
    // Block javascript: protocol (XSS vector)
    if (url.protocol === 'javascript:') {
      console.warn('Blocked javascript: URL');
      return '';
    }
    
    return trimmed;
  } catch {
    // If it's not a valid URL, check if it's a relative path
    if (trimmed.startsWith('/') || trimmed.startsWith('./')) {
      return sanitizeText(trimmed);
    }
    
    // Try adding https:// prefix
    if (!trimmed.includes('://')) {
      try {
        new URL('https://' + trimmed);
        return 'https://' + trimmed;
      } catch {
        return '';
      }
    }
    
    return '';
  }
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(input: string | null | undefined): string {
  if (!input) return '';
  
  const email = sanitizeText(input).toLowerCase();
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return '';
  }
  
  return email;
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(input: string | null | undefined): string {
  if (!input) return '';
  
  // Remove everything except digits, +, -, (, ), and spaces
  return input.replace(/[^\d+\-() ]/g, '').trim();
}

/**
 * Sanitize color hex code
 */
export function sanitizeColor(input: string | null | undefined): string {
  if (!input) return '';
  
  const color = input.trim();
  
  // Validate hex color format
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!hexRegex.test(color)) {
    return '';
  }
  
  return color;
}

/**
 * Sanitize an array of strings
 */
export function sanitizeStringArray(
  input: string[] | null | undefined,
  sanitizer: (s: string) => string = sanitizeText
): string[] {
  if (!input || !Array.isArray(input)) return [];
  
  return input
    .map(item => sanitizer(item))
    .filter(item => item.length > 0);
}

/**
 * Sanitize form submission data (complete sanitization)
 */
export interface SanitizedFormData {
  businessName: string;
  email: string;
  tagline: string;
  industry: string;
  aboutBusiness: string;
  services: string[];
  phone: string;
  address: string;
  businessHours: Record<string, string>;
  socialLinks: Record<string, string>;
  heroImageUrl: string;
  galleryImages: string[];
  testimonials: Array<{ name: string; text: string; role?: string }>;
  templateType: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export function sanitizeFormSubmission(data: Record<string, unknown>): SanitizedFormData {
  return {
    // Basic text fields
    businessName: sanitizeText(data.businessName as string),
    email: sanitizeEmail(data.email as string),
    tagline: sanitizeText(data.tagline as string),
    industry: sanitizeText(data.industry as string),
    
    // Rich text (allows basic formatting)
    aboutBusiness: sanitizeRichText(data.aboutBusiness as string),
    
    // Arrays
    services: sanitizeStringArray(data.services as string[]),
    
    // Contact info
    phone: sanitizePhone(data.phone as string),
    address: sanitizeText(data.address as string),
    
    // Business hours object
    businessHours: sanitizeBusinessHours(data.businessHours),
    
    // Social links
    socialLinks: sanitizeSocialLinks(data.socialLinks),
    
    // URLs
    heroImageUrl: sanitizeUrl(data.heroImageUrl as string),
    galleryImages: sanitizeStringArray(data.galleryImages as string[], sanitizeUrl),
    
    // Testimonials
    testimonials: sanitizeTestimonials(data.testimonials),
    
    // Style
    templateType: (data.templateType as string) === 'light' ? 'light' : 'dark',
    primaryColor: sanitizeColor(data.primaryColor as string) || '#6366f1',
    secondaryColor: sanitizeColor(data.secondaryColor as string) || '#8b5cf6',
    accentColor: sanitizeColor(data.accentColor as string) || '#f59e0b',
  };
}

function sanitizeBusinessHours(hours: unknown): Record<string, string> {
  if (!hours || typeof hours !== 'object') return {};
  
  const result: Record<string, string> = {};
  const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  for (const [key, value] of Object.entries(hours as Record<string, unknown>)) {
    if (validDays.includes(key.toLowerCase()) && typeof value === 'string') {
      result[key.toLowerCase()] = sanitizeText(value);
    }
  }
  
  return result;
}

function sanitizeSocialLinks(links: unknown): Record<string, string> {
  if (!links || typeof links !== 'object') return {};
  
  const result: Record<string, string> = {};
  const validPlatforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok', 'website'];
  
  for (const [key, value] of Object.entries(links as Record<string, unknown>)) {
    if (validPlatforms.includes(key.toLowerCase()) && typeof value === 'string') {
      const sanitizedUrl = sanitizeUrl(value);
      if (sanitizedUrl) {
        result[key.toLowerCase()] = sanitizedUrl;
      }
    }
  }
  
  return result;
}

function sanitizeTestimonials(
  testimonials: unknown
): Array<{ name: string; text: string; role?: string }> {
  if (!testimonials || !Array.isArray(testimonials)) return [];
  
  return testimonials
    .filter(t => t && typeof t === 'object')
    .map(t => ({
      name: sanitizeText((t as Record<string, unknown>).name as string),
      text: sanitizeText((t as Record<string, unknown>).text as string),
      role: sanitizeText((t as Record<string, unknown>).role as string) || undefined,
    }))
    .filter(t => t.name && t.text);
}

/**
 * Escape HTML entities for safe rendering in generated HTML
 * Use this when inserting user content into generated HTML templates
 */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
