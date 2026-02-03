import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import { Vibrant } from 'node-vibrant/node';

export interface ExtractedColors {
  primary: string;
  secondary: string;
  accent: string;
}

/**
 * ColorExtractionService
 * Extracts brand colors from logo images
 * This is SAFE to reuse - it's just a utility, doesn't affect design quality
 */
class ColorExtractionService {
  private readonly allowedExtensions = new Set([
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.gif',
    '.svg',
  ]);

  private readonly fallback: ExtractedColors = {
    primary: '#3B82F6', // Modern blue
    secondary: '#10B981', // Modern green
    accent: '#F59E0B', // Warm amber
  };

  /**
   * Extract primary, secondary, and accent colors from logo
   */
  async extractFromLogo(filePath: string): Promise<ExtractedColors> {
    if (!filePath) {
      console.warn('No logo path provided, using fallback colors');
      return this.fallback;
    }

    try {
      let paletteSource = filePath;
      let tempFilePath: string | null = null;

      if (this.isRemoteUrl(filePath)) {
        tempFilePath = await this.downloadToTempFile(filePath);
        paletteSource = tempFilePath;
      } else {
        await this.validateFile(filePath);
      }

      const palette = await Vibrant.from(paletteSource).getPalette();

      const primary = this.normalizeHex(palette?.Vibrant?.hex) ||
        this.normalizeHex(palette?.DarkVibrant?.hex);

      const secondary = this.normalizeHex(palette?.Muted?.hex) ||
        this.normalizeHex(palette?.DarkMuted?.hex) ||
        this.normalizeHex(palette?.LightVibrant?.hex);

      const accent = this.normalizeHex(palette?.LightVibrant?.hex) ||
        this.normalizeHex(palette?.Vibrant?.hex) ||
        this.normalizeHex(palette?.DarkVibrant?.hex);

      const result: ExtractedColors = {
        primary: primary || this.fallback.primary,
        secondary: secondary || this.fallback.secondary,
        accent: accent || this.fallback.accent,
      };

      console.log('✅ Extracted colors from logo:', result);
      if (tempFilePath) {
        await fs.unlink(tempFilePath).catch(() => undefined);
      }
      return result;
    } catch (error) {
      console.error('❌ Color extraction failed:', error);
      console.log('Using fallback colors');
      return this.fallback;
    }
  }

  /**
   * Validate file exists and is correct type
   */
  private async validateFile(filePath: string): Promise<void> {
    const stats = await fs.stat(filePath);
    
    if (!stats.isFile()) {
      throw new Error('Provided path is not a file');
    }

    const ext = path.extname(filePath).toLowerCase();
    if (!this.allowedExtensions.has(ext)) {
      throw new Error(
        `Invalid file type: ${ext}. Allowed: JPEG, PNG, WEBP, GIF, SVG`
      );
    }
  }

  /**
   * Normalize hex string to #RRGGBB format
   */
  private normalizeHex(hex?: string | null): string | undefined {
    if (!hex) return undefined;
    const clean = hex.trim().replace('#', '');
    const isValid = /^[0-9a-fA-F]{6}$/.test(clean);
    return isValid ? `#${clean.toUpperCase()}` : undefined;
  }

  private isRemoteUrl(filePath: string): boolean {
    return /^https?:\/\//i.test(filePath);
  }

  private async downloadToTempFile(fileUrl: string): Promise<string> {
    const url = new URL(fileUrl);
    const ext = path.extname(url.pathname).toLowerCase() || '.png';

    if (!this.allowedExtensions.has(ext)) {
      throw new Error(
        `Invalid file type: ${ext}. Allowed: JPEG, PNG, WEBP, GIF, SVG`
      );
    }

    const filename = `logo-${crypto.randomUUID()}${ext}`;
    const tempPath = path.join(os.tmpdir(), filename);

    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to download logo: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    await fs.writeFile(tempPath, Buffer.from(arrayBuffer));
    return tempPath;
  }

  /**
   * Generate complementary colors from a base color
   * Useful for creating color schemes
   */
  generateColorScheme(baseColor: string): ExtractedColors {
    // This is a simple implementation
    // In production, you might use a library like chroma-js
    return {
      primary: baseColor,
      secondary: this.adjustBrightness(baseColor, -20),
      accent: this.adjustHue(baseColor, 180),
    };
  }

  private adjustBrightness(hex: string, percent: number): string {
    // Simple brightness adjustment
    // TODO: Implement proper HSL conversion for better results
    return hex; // Placeholder
  }

  private adjustHue(hex: string, degrees: number): string {
    // Simple hue rotation
    // TODO: Implement proper HSL conversion for better results
    return hex; // Placeholder
  }
}

export const colorExtractionService = new ColorExtractionService();
