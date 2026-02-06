import sharp from 'sharp';
import path from 'path';
import { uploadFile } from '@/lib/supabase';

// Limit Sharp concurrency to reduce peak memory on low-RAM servers (Render)
sharp.concurrency(1);

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
 * Memory-safe: resizes large input ONCE, then derives variants sequentially
 */
class ImageProcessingService {
  private readonly MAX_WIDTH = 1920;
  private readonly MAX_HEIGHT = 1080;
  private readonly QUALITY = 85;
  private readonly THUMBNAIL_SIZE = 400;
  // Files larger than 3MB get pre-resized to limit memory usage
  private readonly PRE_RESIZE_THRESHOLD = 3 * 1024 * 1024;

  /**
   * Process and optimize an uploaded image
   * Memory-safe: pre-resizes large files, processes sequentially (not in parallel)
   */
  async processImage(
    buffer: Buffer,
    filename: string,
    folder: string = 'uploads'
  ): Promise<ProcessedImage> {
    try {
      console.log(`[IMG] Processing ${filename} (${(buffer.length / 1024 / 1024).toFixed(1)}MB)`);

      // Step 1: Pre-resize large images to limit peak memory
      let workingBuffer = buffer;
      if (buffer.length > this.PRE_RESIZE_THRESHOLD) {
        console.log(`[IMG]   Large file, pre-resizing to limit memory...`);
        workingBuffer = await sharp(buffer, { limitInputPixels: 100_000_000 })
          .resize(this.MAX_WIDTH, this.MAX_HEIGHT, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({ quality: 90 })
          .toBuffer();
        console.log(`[IMG]   Pre-resized: ${(workingBuffer.length / 1024 / 1024).toFixed(1)}MB`);
      }

      const metadata = await sharp(workingBuffer).metadata();

      // Step 2: Create optimized JPEG
      const optimizedBuffer = await sharp(workingBuffer)
        .resize(this.MAX_WIDTH, this.MAX_HEIGHT, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: this.QUALITY })
        .toBuffer();

      // Step 3: Create WebP from the already-optimized buffer (much smaller)
      const webpBuffer = await sharp(optimizedBuffer)
        .webp({ quality: this.QUALITY })
        .toBuffer();

      // Step 4: Create thumbnail from the optimized buffer
      const thumbnailBuffer = await sharp(optimizedBuffer)
        .resize(this.THUMBNAIL_SIZE, this.THUMBNAIL_SIZE, {
          fit: 'cover',
          position: 'center',
        })
        .webp({ quality: 80 })
        .toBuffer();

      // Upload sequentially to limit concurrent memory
      const timestamp = Date.now();
      const baseName = path.parse(filename).name;

      const originalPath = `${folder}/${timestamp}-${baseName}.jpg`;
      const originalUrl = await uploadFile('website-assets', originalPath, optimizedBuffer, 'image/jpeg');
      console.log(`[IMG]   JPEG uploaded`);

      const webpPath = `${folder}/${timestamp}-${baseName}.webp`;
      const webpUrl = await uploadFile('website-assets', webpPath, webpBuffer, 'image/webp');
      console.log(`[IMG]   WebP uploaded`);

      const thumbnailPath = `${folder}/${timestamp}-${baseName}-thumb.webp`;
      const thumbnailUrl = await uploadFile('website-assets', thumbnailPath, thumbnailBuffer, 'image/webp');
      console.log(`[IMG]   Thumbnail uploaded`);

      return {
        originalUrl,
        webpUrl,
        thumbnailUrl,
        width: metadata.width || 0,
        height: metadata.height || 0,
        size: optimizedBuffer.length,
      };
    } catch (error) {
      console.error(`[IMG] Processing failed for ${filename}:`, error);
      throw new Error(`Failed to process image: ${(error as Error).message}`);
    }
  }

  /**
   * Process logo specifically (needs transparency, smaller size)
   */
  async processLogo(buffer: Buffer, filename: string): Promise<ProcessedImage> {
    try {
      console.log(`[IMG] Processing logo: ${filename} (${(buffer.length / 1024 / 1024).toFixed(1)}MB)`);
      const logoMetadata = await sharp(buffer, { limitInputPixels: 50_000_000 }).metadata();

      const processedBuffer = await sharp(buffer, { limitInputPixels: 50_000_000 })
        .resize(800, 800, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .png({ quality: 90 })
        .toBuffer();

      const timestamp = Date.now();
      const baseName = path.parse(filename).name;
      const logoPath = `logos/${timestamp}-${baseName}.png`;

      const publicUrl = await uploadFile('website-assets', logoPath, processedBuffer, 'image/png');
      console.log(`[IMG]   Logo uploaded: ${publicUrl}`);

      return {
        originalUrl: publicUrl,
        webpUrl: publicUrl,
        thumbnailUrl: publicUrl,
        width: logoMetadata.width || 0,
        height: logoMetadata.height || 0,
        size: processedBuffer.length,
      };
    } catch (error) {
      console.error(`[IMG] Logo processing failed for ${filename}:`, error);
      throw new Error(`Failed to process logo: ${(error as Error).message}`);
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
