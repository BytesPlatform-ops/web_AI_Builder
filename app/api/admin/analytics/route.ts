/**
 * Admin Analytics API Route
 * Fetches Google Analytics data and form submissions for sales dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { googleAnalyticsService } from '@/services/google-analytics.service';

// Admin secret MUST be set in environment - no fallback
const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function GET(request: NextRequest) {
  try {
    // SECURITY: Admin secret must be configured
    if (!ADMIN_SECRET) {
      console.error('ADMIN_SECRET environment variable is not set');
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Get query params
    const searchParams = request.nextUrl.searchParams;
    const adminSecret = searchParams.get('secret');

    // Verify admin access
    if (!adminSecret || adminSecret !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const startDate = searchParams.get('startDate') || '30daysAgo';
    const endDate = searchParams.get('endDate') || 'today';
    const dataType = searchParams.get('type') || 'all';

    // Fetch data based on type
    let data: Record<string, unknown> = {};

    if (dataType === 'all' || dataType === 'overview') {
      data.overview = await googleAnalyticsService.getOverview(startDate, endDate);
    }

    if (dataType === 'all' || dataType === 'countries') {
      data.countries = await googleAnalyticsService.getCountryData(startDate, endDate);
    }

    if (dataType === 'all' || dataType === 'events') {
      data.events = await googleAnalyticsService.getEventData(startDate, endDate);
    }

    if (dataType === 'all' || dataType === 'traffic') {
      data.trafficSources = await googleAnalyticsService.getTrafficSources(startDate, endDate);
    }

    if (dataType === 'all' || dataType === 'devices') {
      data.devices = await googleAnalyticsService.getDeviceData(startDate, endDate);
    }

    if (dataType === 'all' || dataType === 'daily') {
      data.dailyData = await googleAnalyticsService.getDailyData(startDate, endDate);
    }

    // Always include form submissions from database
    if (dataType === 'all' || dataType === 'submissions') {
      const submissions = await prisma.formSubmission.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
        select: {
          id: true,
          businessName: true,
          email: true,
          phone: true,
          createdAt: true,
          status: true,
          templateType: true,
          generatedWebsite: {
            select: {
              id: true,
              publishApproved: true,
              createdAt: true,
            },
          },
        },
      });

      // Get country from phone number prefix
      data.submissions = submissions.map(sub => ({
        ...sub,
        websiteType: sub.templateType,
        country: getCountryFromPhone(sub.phone || ''),
      }));

      // Submission stats
      data.submissionStats = {
        total: await prisma.formSubmission.count(),
        pending: await prisma.formSubmission.count({ where: { status: 'PENDING' } }),
        completed: await prisma.formSubmission.count({ where: { status: 'GENERATED' } }),
        published: await prisma.generatedWebsite.count({ where: { publishApproved: true } }),
        todaySubmissions: await prisma.formSubmission.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),
        thisWeekSubmissions: await prisma.formSubmission.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        }),
        thisMonthSubmissions: await prisma.formSubmission.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        }),
      };

      // Country breakdown from phone numbers
      const countryBreakdown: Record<string, number> = {};
      submissions.forEach(sub => {
        const country = getCountryFromPhone(sub.phone || '');
        countryBreakdown[country] = (countryBreakdown[country] || 0) + 1;
      });
      data.submissionCountries = Object.entries(countryBreakdown)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count);
    }

    return NextResponse.json({
      success: true,
      data,
      dateRange: { startDate, endDate },
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

// Helper function to get country from phone prefix
function getCountryFromPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  const prefixes: Record<string, string> = {
    '92': 'Pakistan',
    '1': 'United States',
    '44': 'United Kingdom',
    '971': 'United Arab Emirates',
    '91': 'India',
    '966': 'Saudi Arabia',
    '61': 'Australia',
    '49': 'Germany',
    '33': 'France',
    '81': 'Japan',
    '86': 'China',
    '880': 'Bangladesh',
    '27': 'South Africa',
    '234': 'Nigeria',
    '254': 'Kenya',
    '20': 'Egypt',
    '90': 'Turkey',
    '7': 'Russia',
    '55': 'Brazil',
    '52': 'Mexico',
    '82': 'South Korea',
    '65': 'Singapore',
    '60': 'Malaysia',
    '63': 'Philippines',
    '62': 'Indonesia',
    '66': 'Thailand',
    '84': 'Vietnam',
    '31': 'Netherlands',
    '34': 'Spain',
    '39': 'Italy',
    '46': 'Sweden',
    '47': 'Norway',
    '45': 'Denmark',
    '48': 'Poland',
    '41': 'Switzerland',
    '43': 'Austria',
    '32': 'Belgium',
    '353': 'Ireland',
    '351': 'Portugal',
    '30': 'Greece',
    '972': 'Israel',
    '974': 'Qatar',
    '965': 'Kuwait',
    '968': 'Oman',
    '973': 'Bahrain',
    '64': 'New Zealand',
  };

  // Check 3-digit prefixes first
  for (const [prefix, country] of Object.entries(prefixes)) {
    if (prefix.length === 3 && cleaned.startsWith(prefix)) {
      return country;
    }
  }

  // Then 2-digit prefixes
  for (const [prefix, country] of Object.entries(prefixes)) {
    if (prefix.length === 2 && cleaned.startsWith(prefix)) {
      return country;
    }
  }

  // Then 1-digit prefixes
  for (const [prefix, country] of Object.entries(prefixes)) {
    if (prefix.length === 1 && cleaned.startsWith(prefix)) {
      return country;
    }
  }

  return 'Unknown';
}
