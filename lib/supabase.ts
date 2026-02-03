import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Server-side client with service role (for admin operations)
export const supabaseAdmin = supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY ? createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY
) : null

/**
 * Upload a file to Supabase Storage
 * @param bucket - The storage bucket name (e.g., 'website-assets')
 * @param filePath - The path within the bucket (e.g., 'logos/business-name.jpg')
 * @param fileBuffer - The file data as a Buffer
 * @param contentType - MIME type (e.g., 'image/jpeg')
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(
  bucket: string,
  filePath: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<string> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client is not configured');
  }

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filePath, fileBuffer, {
      contentType,
      upsert: true, // Replace if exists
    });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  return getPublicUrl(bucket, data.path);
}

/**
 * Get the public URL for a file in Supabase Storage
 * @param bucket - The storage bucket name
 * @param filePath - The path within the bucket
 * @returns The public URL
 */
export function getPublicUrl(bucket: string, filePath: string): string {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client is not configured');
  }

  const { data } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
