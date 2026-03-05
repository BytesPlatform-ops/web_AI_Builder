import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { validateSubmissionId } from '@/lib/validation';
import fs from 'fs';
import path from 'path';

// Allowed file extensions for preview
const ALLOWED_FILES = ['index.html', 'styles.css', 'script.js'];

/**
 * Preview API - Serves generated website files for preview
 * PERSISTENT STORAGE: Files are stored in database, not filesystem
 * This ensures websites remain accessible even after server restarts
 * 
 * SECURITY: Only the owner (logged-in user) can view their preview
 * This prevents unauthorized sharing of preview links
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
    
    // SECURITY: Check if user is logged in and owns this website
    // Only owner can preview their unpublished website
    if (website.status !== 'PUBLISHED') {
      const session = await getServerSession(authOptions);
      
      if (!session || !session.user) {
        // Return a styled access denied page
        const accessDeniedHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Access Denied - ByteSuite</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0a1628 0%, #1a1a2e 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      padding: 20px;
    }
    .container {
      text-align: center;
      max-width: 450px;
    }
    .icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      font-size: 40px;
    }
    h1 {
      font-size: 28px;
      margin-bottom: 12px;
      background: linear-gradient(90deg, #f87171, #fbbf24);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      color: #94a3b8;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .btn {
      display: inline-block;
      padding: 14px 28px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
    }
    .footer {
      margin-top: 32px;
      color: #64748b;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">🔒</div>
    <h1>Access Denied</h1>
    <p>This preview is protected. Please log in to your account to view your website preview.</p>
    <a href="/login" class="btn">Log In to Continue</a>
    <p class="footer">© ByteSuite - Professional Website Builder</p>
  </div>
</body>
</html>`;
        return new NextResponse(accessDeniedHtml, {
          status: 401,
          headers: { 'Content-Type': 'text/html' }
        });
      }
      
      // Check if logged-in user owns this website
      const userId = (session.user as { id?: string }).id;
      if (website.userId !== userId) {
        // Return a styled "not your website" page
        const notYoursHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Access Denied - ByteSuite</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0a1628 0%, #1a1a2e 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      padding: 20px;
    }
    .container {
      text-align: center;
      max-width: 450px;
    }
    .icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      font-size: 40px;
    }
    h1 {
      font-size: 28px;
      margin-bottom: 12px;
      background: linear-gradient(90deg, #fbbf24, #f59e0b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      color: #94a3b8;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .btn {
      display: inline-block;
      padding: 14px 28px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
    }
    .footer {
      margin-top: 32px;
      color: #64748b;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">⚠️</div>
    <h1>Not Your Website</h1>
    <p>This preview belongs to another user. You can only view previews of websites you own.</p>
    <a href="/my-website" class="btn">Go to My Website</a>
    <p class="footer">© ByteSuite - Professional Website Builder</p>
  </div>
</body>
</html>`;
        return new NextResponse(notYoursHtml, {
          status: 403,
          headers: { 'Content-Type': 'text/html' }
        });
      }
    }
    
    // Try to get content from database first (persistent storage)
    let content: string | null = null;
    
    if (file === 'index.html' && website.htmlContent) {
      content = website.htmlContent;
    } else if (file === 'styles.css' && website.cssContent) {
      content = website.cssContent;
    } else if (file === 'script.js' && website.jsContent) {
      content = website.jsContent;
    }
    
    // Fallback to filesystem if not in database (for backward compatibility)
    if (!content) {
      const filesPath = website.filesPath || path.join(process.cwd(), 'generated-sites', validatedId);
      const filePath = path.join(filesPath, file);
      
      // SECURITY: Ensure the resolved path is within the expected directory
      const resolvedPath = path.resolve(filePath);
      const expectedBase = path.resolve(process.cwd(), 'generated-sites');
      if (!resolvedPath.startsWith(expectedBase)) {
        console.warn(`Path traversal attempt blocked: ${filePath}`);
        return new NextResponse('Access denied', { status: 403 });
      }
      
      // Check if file exists on filesystem
      if (fs.existsSync(filePath)) {
        content = fs.readFileSync(filePath, 'utf-8');
      }
    }
    
    // If still no content, return 404
    if (!content) {
      return new NextResponse(`File ${file} not found. Website may need to be regenerated.`, { status: 404 });
    }
    
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
