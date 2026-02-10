/**
 * Rate Limiter for API Routes
 * 
 * Prevents abuse by limiting requests per IP address.
 * Uses in-memory store (for production, use Redis)
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (use Redis in production for multi-instance)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  maxRequests: number;      // Maximum requests allowed
  windowMs: number;         // Time window in milliseconds
  identifier?: string;      // Optional identifier prefix (e.g., 'form-submit', 'login')
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number;          // Seconds until reset
  limit: number;
}

/**
 * Check rate limit for a given IP address
 */
export function checkRateLimit(
  ip: string,
  config: RateLimitConfig
): RateLimitResult {
  const { maxRequests, windowMs, identifier = 'default' } = config;
  const key = `${identifier}:${ip}`;
  const now = Date.now();

  let entry = rateLimitStore.get(key);

  // If no entry or window has expired, create new entry
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, entry);

    return {
      success: true,
      remaining: maxRequests - 1,
      resetIn: Math.ceil(windowMs / 1000),
      limit: maxRequests,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);

  const remaining = Math.max(0, maxRequests - entry.count);
  const resetIn = Math.ceil((entry.resetTime - now) / 1000);

  // Check if over limit
  if (entry.count > maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetIn,
      limit: maxRequests,
    };
  }

  return {
    success: true,
    remaining,
    resetIn,
    limit: maxRequests,
  };
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  // Check various headers for proxied requests
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback for development
  return '127.0.0.1';
}

/**
 * Pre-configured rate limiters for different use cases
 */
export const RateLimiters = {
  // Form submission: 5 per hour per IP
  formSubmission: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
    identifier: 'form-submit',
  },

  // Login attempts: 10 per 15 minutes per IP
  login: {
    maxRequests: 10,
    windowMs: 15 * 60 * 1000, // 15 minutes
    identifier: 'login',
  },

  // API general: 100 per minute per IP
  api: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
    identifier: 'api',
  },

  // Password reset: 3 per hour per IP
  passwordReset: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    identifier: 'password-reset',
  },

  // Website regeneration: 10 per hour per IP
  regenerate: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
    identifier: 'regenerate',
  },
};

/**
 * Create a rate limit error response
 */
export function rateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      message: `Rate limit exceeded. Please try again in ${result.resetIn} seconds.`,
      retryAfter: result.resetIn,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.resetIn.toString(),
        'Retry-After': result.resetIn.toString(),
      },
    }
  );
}
