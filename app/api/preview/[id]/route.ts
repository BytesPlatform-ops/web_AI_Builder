import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubmissionId } from '@/lib/validation';
import fs from 'fs';
import path from 'path';

// Allowed file extensions for preview
const ALLOWED_FILES = ['index.html', 'styles.css', 'script.js'];

/**
 * Preview API - Serves generated website files for preview
 * Before deployment, users can preview their website through this endpoint
 * 
 * GET /api/preview/[id] - Serves index.html
 * GET /api/preview/[id]?file=styles.css - Serves specific file
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const file = searchParams.get('file') || 'index.html';
    
    // SECURITY: Validate submission ID to prevent path traversal
    const validatedId = validateSubmissionId(id);
    if (!validatedId) {
      return new NextResponse('Invalid ID format', { status: 400 });
    }
    
    // SECURITY: Only allow specific files to prevent directory traversal
    if (!ALLOWED_FILES.includes(file)) {
      return new NextResponse('File not allowed', { status: 403 });
    }
    
    // Find the generated website using validated ID
    const website = await prisma.generatedWebsite.findFirst({
      where: { formSubmissionId: validatedId }
    });
    
    if (!website) {
      return new NextResponse('Website not found', { status: 404 });
    }
    
    // Get the files path - use validated ID
    const filesPath = website.filesPath || path.join(process.cwd(), 'generated-sites', validatedId);
    const filePath = path.join(filesPath, file);
    
    // SECURITY: Ensure the resolved path is within the expected directory
    const resolvedPath = path.resolve(filePath);
    const expectedBase = path.resolve(process.cwd(), 'generated-sites');
    if (!resolvedPath.startsWith(expectedBase)) {
      console.warn(`Path traversal attempt blocked: ${filePath}`);
      return new NextResponse('Access denied', { status: 403 });
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return new NextResponse(`File ${file} not found`, { status: 404 });
    }
    
    // Read the file
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Determine content type
    let contentType = 'text/html';
    if (file.endsWith('.css')) contentType = 'text/css';
    if (file.endsWith('.js')) contentType = 'application/javascript';
    
    // For HTML files, inject base URL for relative resources + live edit listener
    let responseContent = content;
    if (file === 'index.html') {
      // Update relative paths to point to this preview API
      const baseUrl = `/api/preview/${id}?file=`;
      
      // Inject live-edit listener script before </body>
      const liveEditScript = `
<script>
// Live edit listener for real-time preview updates
window.addEventListener('message', function(event) {
  if (!event.data || event.data.type !== 'live-edit') return;
  var payload = event.data.payload;
  
  // Update CSS variables for colors
  if (payload.colors) {
    var root = document.documentElement;
    if (payload.colors.primary) {
      root.style.setProperty('--primary', payload.colors.primary);
      var hex = payload.colors.primary.replace('#', '');
      var r = parseInt(hex.substring(0,2), 16);
      var g = parseInt(hex.substring(2,4), 16);
      var b = parseInt(hex.substring(4,6), 16);
      root.style.setProperty('--primary-rgb', r + ', ' + g + ', ' + b);
    }
    if (payload.colors.secondary) {
      root.style.setProperty('--secondary', payload.colors.secondary);
      var hex2 = payload.colors.secondary.replace('#', '');
      var r2 = parseInt(hex2.substring(0,2), 16);
      var g2 = parseInt(hex2.substring(2,4), 16);
      var b2 = parseInt(hex2.substring(4,6), 16);
      root.style.setProperty('--secondary-rgb', r2 + ', ' + g2 + ', ' + b2);
    }
    if (payload.colors.accent) {
      root.style.setProperty('--accent', payload.colors.accent);
      var hex3 = payload.colors.accent.replace('#', '');
      var r3 = parseInt(hex3.substring(0,2), 16);
      var g3 = parseInt(hex3.substring(2,4), 16);
      var b3 = parseInt(hex3.substring(4,6), 16);
      root.style.setProperty('--accent-rgb', r3 + ', ' + g3 + ', ' + b3);
    }
  }
  
  // Update text content
  if (payload.content) {
    var map = {
      headline: '.hero-title .title-line, .hero-title',
      subheadline: '.hero-desc, .hero-subtitle',
      ctaPrimary: '.btn-primary span, .hero-actions .btn-primary .btn-text',
      ctaSecondary: '.btn-ghost span, .hero-actions .btn-outline .btn-text',
      aboutHeadline: '#about .section-title, #about h2',
      aboutText: '#about .section-desc, #about .about-text',
      ctaHeadline: '#contact .section-title, .cta-section h2, .cta h2',
      ctaSubheadline: '#contact .section-desc, .cta-section p, .cta p'
    };
    for (var key in payload.content) {
      if (payload.content[key] && map[key]) {
        var selectors = map[key].split(', ');
        for (var i = 0; i < selectors.length; i++) {
          var el = document.querySelector(selectors[i]);
          if (el) { el.textContent = payload.content[key]; break; }
        }
      }
    }
  }
});
</script>`;

      responseContent = content
        .replace('href="styles.css"', `href="${baseUrl}styles.css"`)
        .replace('src="script.js"', `src="${baseUrl}script.js"`)
        .replace('</body>', liveEditScript + '\n</body>');
    }
    
    return new NextResponse(responseContent, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
      }
    });
  } catch (error) {
    console.error('Preview error:', error);
    return NextResponse.json({ error: 'Failed to load preview' }, { status: 500 });
  }
}
