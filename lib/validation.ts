/**
 * Input Validation Utilities
 * 
 * Validates input parameters to prevent security vulnerabilities
 * like path traversal, injection attacks, etc.
 */

import { validate as uuidValidate, version as uuidVersion } from 'uuid';

/**
 * Validate UUID v4 format
 * Prevents path traversal attacks by ensuring IDs are valid UUIDs
 */
export function isValidUUID(id: string | null | undefined): boolean {
  if (!id || typeof id !== 'string') return false;
  
  // Check if it's a valid UUID
  if (!uuidValidate(id)) return false;
  
  // Optionally check version (UUID v4 is most common)
  // We accept any valid UUID version for flexibility
  return true;
}

/**
 * Validate and sanitize submission ID
 * Returns sanitized ID or null if invalid
 */
export function validateSubmissionId(id: string | null | undefined): string | null {
  if (!id || typeof id !== 'string') return null;
  
  // Check UUID format
  if (!isValidUUID(id)) return null;
  
  // Additional safety: remove any path traversal characters
  // (should never happen with valid UUID, but defense in depth)
  const sanitized = id.replace(/[^a-zA-Z0-9-]/g, '');
  
  // Verify it still matches the original (no malicious chars were stripped)
  if (sanitized !== id) return null;
  
  return sanitized;
}

/**
 * Validate website ID
 */
export function validateWebsiteId(id: string | null | undefined): string | null {
  return validateSubmissionId(id); // Same validation as submission ID
}

/**
 * Check if running in production environment
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if debug/development features should be enabled
 */
export function isDebugEnabled(): boolean {
  // Only allow debug in development or if explicitly enabled
  return process.env.NODE_ENV === 'development' || process.env.ENABLE_DEBUG === 'true';
}
