import sharp from 'sharp';
import path from 'path';
import { uploadFile } from '@/lib/supabase';

export interface ProcessedImage {
  originalUrl: string;
  webpUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  size: number;
}

/**
 * ImageProcessingService
 * Handles image optimization, compression, and format conversion
 * CRITICAL: This must produce PREMIUM quality images (not pathetic like old system)
 */
class ImageProcessingService {
  private readonly MAX_WIDTH = 1920;
  private readonly MAX_HEIGHT = 1080;
  private readonly QUALITY = 85; // High quality
  private readonly THUMBNAIL_SIZE = 400;

  /**
   * Process and optimize an uploaded image
   * Creates: WebP version, thumbnail, optimized original
   */
  async processImage(
    buffer: Buffer,
    filename: string,
    folder: string = 'uploads'
  ): Promise<ProcessedImage> {
    try {
      const metadata = await sharp(buffer).metadata();
      
      // 1. Optimize original (resize if too large, keep quality high)
      const optimizedBuffer = await sharp(buffer)
        .resize(this.MAX_WIDTH, this.MAX_HEIGHT, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: this.QUALITY })
        .toBuffer();

      // 2. Generate WebP version (better compression, modern browsers)
      const webpBuffer = await sharp(buffer)
        .resize(this.MAX_WIDTH, this.MAX_HEIGHT, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: this.QUALITY })
        .toBuffer();

      // 3. Generate thumbnail
      const thumbnailBuffer = await sharp(buffer)
        .resize(this.THUMBNAIL_SIZE, this.THUMBNAIL_SIZE, {
          fit: 'cover',
          position: 'center',
        })
        .webp({ quality: 80 })
        .toBuffer();

      // Upload to Supabase Storage
      const timestamp = Date.now();
      const baseName = path.parse(filename).name;
      
      const originalPath = `${folder}/${timestamp}-${baseName}.jpg`;
      const webpPath = `${folder}/${timestamp}-${baseName}.webp`;
      const thumbnailPath = `${folder}/${timestamp}-${baseName}-thumb.webp`;

      // Upload all versions
      const [originalUrl, webpUrl, thumbnailUrl] = await Promise.all([
        uploadFile('website-assets', originalPath, optimizedBuffer, 'image/jpeg'),
        uploadFile('website-assets', webpPath, webpBuffer, 'image/webp'),
        uploadFile('website-assets', thumbnailPath, thumbnailBuffer, 'image/webp'),
      ]);

      return {
        originalUrl,
        webpUrl,
        thumbnailUrl,
        width: metadata.width || 0,
        height: metadata.height || 0,
        size: optimizedBuffer.length,
      };
    } catch (error) {
      console.error('❌ Image processing failed:', error);
      throw new Error('Failed to process image');
    }
  }

  /**
   * Process logo specifically (needs transparency, smaller size)
   */
  async processLogo(buffer: Buffer, filename: string): Promise<ProcessedImage> {
    try {
      const logoMetadata = await sharp(buffer).metadata();

      // Process logo (keep transparency if exists)
      const processedBuffer = await sharp(buffer)
        .resize(800, 800, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .png({ quality: 90 }) // PNG for transparency
        .toBuffer();

      const timestamp = Date.now();
      const baseName = path.parse(filename).name;
      const logoPath = `logos/${timestamp}-${baseName}.png`;

      const publicUrl = await uploadFile('website-assets', logoPath, processedBuffer, 'image/png');

      return {
        originalUrl: publicUrl,
        webpUrl: publicUrl, // Same for logo
        thumbnailUrl: publicUrl,
        width: logoMetadata.width || 0,
        height: logoMetadata.height || 0,
        size: processedBuffer.length,
      };
    } catch (error) {
      console.error('❌ Logo processing failed:', error);
      throw new Error('Failed to process logo');
    }
  }

  /**
   * Smart crop for hero images (focus on center/faces)
   */
  async cropForHero(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
      .resize(1920, 1080, {
        fit: 'cover',
        position: sharp.strategy.attention, // Smart crop - focuses on interesting areas
      })
      .jpeg({ quality: this.QUALITY })
      .toBuffer();
  }
}

export const imageProcessingService = new ImageProcessingService();
