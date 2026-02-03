import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

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
    
    // Find the generated website
    const website = await prisma.generatedWebsite.findFirst({
      where: { formSubmissionId: id }
    });
    
    if (!website) {
      return new NextResponse('Website not found', { status: 404 });
    }
    
    // Get the files path
    const filesPath = website.filesPath || path.join(process.cwd(), 'generated-sites', id);
    const filePath = path.join(filesPath, file);
    
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
    
    // For HTML files, inject base URL for relative resources
    let responseContent = content;
    if (file === 'index.html') {
      // Update relative paths to point to this preview API
      const baseUrl = `/api/preview/${id}?file=`;
      responseContent = content
        .replace('href="styles.css"', `href="${baseUrl}styles.css"`)
        .replace('src="script.js"', `src="${baseUrl}script.js"`);
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
