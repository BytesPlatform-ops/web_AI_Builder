/**
 * Form and API Types
 */

export interface Testimonial {
  authorName: string;
  authorRole: string;
  quote: string;
}

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface FormSubmissionData {
  // Business Info
  businessName: string;
  tagline?: string;
  about: string;
  industry?: string;
  services: string[];
  targetAudience?: string;

  // Contact Info
  email: string;
  phone?: string;
  address?: string;

  // Social Links
  social?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };

  // Brand Colors (optional - if not provided, will be extracted from logo)
  brandColors?: BrandColors;

  // Testimonials (optional - only show if provided)
  testimonials?: Testimonial[];
}

export interface FileUploadResponse {
  url: string;
  size: number;
  width?: number;
  height?: number;
}

export interface FormSubmissionResponse {
  success: boolean;
  message: string;
  formSubmissionId?: string;
  error?: string;
}

export interface GeneratedWebsiteResponse {
  success: boolean;
  websiteId: string;
  previewUrl: string;
  message: string;
}
