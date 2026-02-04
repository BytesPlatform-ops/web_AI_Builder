/**
 * Form and API Types
 */

// Template types available for website generation
export type TemplateType = 'dark' | 'light';

export const TEMPLATE_OPTIONS = [
  {
    id: 'dark' as TemplateType,
    name: 'Midnight Pro',
    description: 'Sleek dark theme with neon accents, glassmorphism, and smooth animations',
    preview: '🌙',
    colors: ['#0a0a0f', '#1a1a2e', '#6366f1'],
  },
  {
    id: 'light' as TemplateType,
    name: 'Aurora Light',
    description: 'Stunning light theme with vibrant gradients, 3D effects, and fluid animations',
    preview: '☀️',
    colors: ['#ffffff', '#f8fafc', '#3b82f6'],
  },
];

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

  // Template Selection
  templateType?: TemplateType;

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
