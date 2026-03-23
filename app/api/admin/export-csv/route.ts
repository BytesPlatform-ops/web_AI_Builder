/**
 * CSV Export API Endpoint
 * GET /api/admin/export-csv
 *
 * Sales team can open this URL in browser to download fresh CSV of all leads.
 * Fetches latest data from database every time.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fullExportToCSV } from '@/lib/csv-auto-export';

export async function GET(request: NextRequest) {
  try {
    // Optional: Add basic auth check via query param or header
    const authKey = request.nextUrl.searchParams.get('key');
    const expectedKey = process.env.ADMIN_EXPORT_KEY;

    if (expectedKey && authKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Unauthorized. Add ?key=YOUR_KEY to the URL.' },
        { status: 401 }
      );
    }

    // Full export from database
    const csvContent = await fullExportToCSV(prisma);

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `leads_export_${date}.csv`;

    // Return as downloadable CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('CSV export error:', error);
    return NextResponse.json(
      { error: 'Failed to export CSV' },
      { status: 500 }
    );
  }
}
