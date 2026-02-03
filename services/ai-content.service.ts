import OpenAI from 'openai';

/**
 * IMPROVED AI Content Service
 * This is NOT a copy of the old service - completely rewritten with BETTER prompts
 * Goal: Generate compelling, human-sounding, brand-specific content (not generic AI slop)
 */

export interface ContentGenerationInput {
  businessName: string;
  tagline?: string;
  about: string;
  services: string[];
  industry?: string;
  targetAudience?: string;
  uniqueSellingPoints?: string[];
}

export interface GeneratedContent {
  hero: {
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  about: {
    headline: string;
    paragraphs: string[];
  };
  services: Array<{
    title: string;
    description: string;
  }>;
  testimonials: Array<{
    quote: string;
    author: string;
    role: string;
  }>;
  cta: {
    headline: string;
    subheadline: string;
    buttonText: string;
  };
}

class ImprovedAIContentService {
  private openai: OpenAI | null = null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (apiKey && apiKey.length > 20) {
      this.openai = new OpenAI({ apiKey });
      console.log('✅ AI service initialized');
    } else {
      console.warn('⚠️  No OpenAI API key - will use template content');
    }
  }

  /**
   * Generate ALL website content with PREMIUM quality
   * Uses IMPROVED prompts that generate human-sounding, specific content
   */
  async generateWebsiteContent(
    input: ContentGenerationInput
  ): Promise<GeneratedContent> {
    if (!this.openai) {
      return this.generateFallbackContent(input);
    }

    try {
      const systemPrompt = this.buildSystemPrompt(input);
      const userPrompt = this.buildUserPrompt(input);

      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.8, // More creative (but not too wild)
        max_tokens: 2000,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content generated');
      }

      const parsed = JSON.parse(content);
      console.log('✅ AI content generated successfully');
      
      return this.validateAndClean(parsed, input);
    } catch (error) {
      console.error('❌ AI generation failed:', error);
      return this.generateFallbackContent(input);
    }
  }

  /**
   * Build IMPROVED system prompt (industry-specific, quality-focused)
   */
  private buildSystemPrompt(input: ContentGenerationInput): string {
    const industry = input.industry || 'general business';
    
    return `You are an expert copywriter for premium ${industry} businesses.

CRITICAL RULES:
1. Write like a HUMAN, not an AI
2. Be SPECIFIC to this business (use their name, services, USPs)
3. NO generic corporate speak ("trusted partner", "welcome to", "industry leader")
4. NO buzzwords without substance
5. Focus on BENEFITS and TRANSFORMATION, not just features
6. Create EMOTIONAL connection (urgency, desire, trust)
7. Use ACTIVE voice and short sentences
8. Make it SCANNABLE (clear hierarchy)

TONE: Professional but conversational. Confident but not arrogant. Warm but not cheesy.

${input.targetAudience ? `TARGET AUDIENCE: ${input.targetAudience}` : ''}

EXAMPLES OF GOOD vs BAD:
❌ BAD: "Welcome to ABC Plumbing - Your Trusted Partner in Plumbing Services"
✅ GOOD: "Emergency Plumber in LA - We Fix It in 60 Minutes or Less"

❌ BAD: "We provide quality services with a focus on customer satisfaction"
✅ GOOD: "Same-day fixes. No surprises. Backed by 500+ 5-star reviews."

Write content that makes people WANT to click, not just understand.`;
  }

  /**
   * Build user prompt with all context
   */
  private buildUserPrompt(input: ContentGenerationInput): string {
    return `Generate premium website content for this business:

BUSINESS: ${input.businessName}
${input.tagline ? `TAGLINE: ${input.tagline}` : ''}
ABOUT: ${input.about}
SERVICES: ${input.services.join(', ')}
${input.uniqueSellingPoints ? `UNIQUE STRENGTHS: ${input.uniqueSellingPoints.join(', ')}` : ''}

Return JSON with this EXACT structure:
{
  "hero": {
    "headline": "8-12 word headline that grabs attention and promises transformation",
    "subheadline": "15-25 words supporting statement - what makes them different",
    "ctaPrimary": "2-4 word action (e.g., 'Get Started', 'Book Now', 'Call Us')",
    "ctaSecondary": "2-4 word softer action (e.g., 'Learn More', 'View Pricing')"
  },
  "about": {
    "headline": "Why Choose ${input.businessName}?",
    "paragraphs": [
      "First paragraph: Their story/mission in 2-3 sentences",
      "Second paragraph: What makes them different in 2-3 sentences"
    ]
  },
  "services": [
    {
      "title": "${input.services[0]}",
      "description": "Benefit-focused description, 15-20 words"
    }
    // ... for each service
  ],
  "cta": {
    "headline": "Compelling call-to-action headline with urgency",
    "subheadline": "Supporting text that overcomes last objection",
    "buttonText": "Action verb"
  }
}

IMPORTANT: Do NOT include testimonials - they will be provided separately.

Make it SPECIFIC to this business. Use their name. Reference their actual services.
NO placeholders. NO generic content.`;
  }

  /**
   * Validate AI output and clean up
   */
  private validateAndClean(
    content: any,
    input: ContentGenerationInput
  ): GeneratedContent {
    // Ensure all required fields exist
    return {
      hero: {
        headline: content.hero?.headline || `${input.businessName} - ${input.tagline}`,
        subheadline: content.hero?.subheadline || input.about.slice(0, 100),
        ctaPrimary: content.hero?.ctaPrimary || 'Get Started',
        ctaSecondary: content.hero?.ctaSecondary || 'Learn More',
      },
      about: {
        headline: content.about?.headline || `About ${input.businessName}`,
        paragraphs: content.about?.paragraphs || [input.about],
      },
      services: content.services || input.services.map(s => ({
        title: s,
        description: `Professional ${s.toLowerCase()} services tailored to your needs.`,
      })),
      // Empty testimonials - will only be shown if provided in form
      testimonials: [],
      cta: {
        headline: content.cta?.headline || `Ready to work with ${input.businessName}?`,
        subheadline: content.cta?.subheadline || 'Get in touch today to get started.',
        buttonText: content.cta?.buttonText || 'Contact Us',
      },
    };
  }

  /**
   * Fallback content (when AI unavailable)
   */
  private generateFallbackContent(
    input: ContentGenerationInput
  ): GeneratedContent {
    return {
      hero: {
        headline: `${input.businessName} - ${input.tagline || 'Quality Service You Can Trust'}`,
        subheadline: input.about.slice(0, 120),
        ctaPrimary: 'Get Started',
        ctaSecondary: 'Learn More',
      },
      about: {
        headline: `Why Choose ${input.businessName}?`,
        paragraphs: [
          input.about,
          `We're committed to delivering exceptional results and outstanding customer service.`,
        ],
      },
      services: input.services.map(service => ({
        title: service,
        description: `Professional ${service.toLowerCase()} services designed to meet your specific needs.`,
      })),
      // Empty testimonials - only shown if provided in form
      testimonials: [],
      cta: {
        headline: `Ready to Experience ${input.businessName}?`,
        subheadline: 'Contact us today to learn how we can help you achieve your goals.',
        buttonText: 'Get In Touch',
      },
    };
  }
}

export const aiContentService = new ImprovedAIContentService();
