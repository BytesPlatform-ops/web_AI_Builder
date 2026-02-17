/**
 * Google Analytics Data API Service
 * Fetches analytics data for the sales dashboard
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { google } from 'googleapis';

const GA_PROPERTY_ID = process.env.GA_PROPERTY_ID;
const GA_CLIENT_ID = process.env.GA_CLIENT_ID;
const GA_CLIENT_SECRET = process.env.GA_CLIENT_SECRET;

// Analytics data types
export interface AnalyticsOverview {
  totalUsers: number;
  activeUsers: number;
  sessions: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: string;
}

export interface CountryData {
  country: string;
  countryCode: string;
  users: number;
  sessions: number;
}

export interface EventData {
  eventName: string;
  eventCount: number;
}

export interface TrafficSource {
  source: string;
  medium: string;
  users: number;
  sessions: number;
}

export interface DeviceData {
  deviceCategory: string;
  users: number;
  percentage: number;
}

export interface DailyData {
  date: string;
  users: number;
  sessions: number;
  pageViews: number;
}

class GoogleAnalyticsService {
  private analyticsClient: BetaAnalyticsDataClient | null = null;
  private propertyId: string;

  constructor() {
    this.propertyId = `properties/${GA_PROPERTY_ID}`;
    this.initializeClient();
  }

  private initializeClient() {
    if (!GA_PROPERTY_ID) {
      console.warn('GA_PROPERTY_ID not configured');
      return;
    }

    try {
      // For OAuth2, we'll use a different approach
      // Since we can't use service account, we'll use the REST API directly
      this.analyticsClient = new BetaAnalyticsDataClient({
        // Will be configured with OAuth tokens when available
      });
    } catch (error) {
      console.error('Failed to initialize Google Analytics client:', error);
    }
  }

  /**
   * Get overview metrics for the dashboard
   */
  async getOverview(startDate: string = '30daysAgo', endDate: string = 'today'): Promise<AnalyticsOverview | null> {
    // Return null if client not configured
    if (!this.analyticsClient || !GA_PROPERTY_ID) {
      return this.getEmptyOverview();
    }

    try {
      const [response] = await this.analyticsClient.runReport({
        property: this.propertyId,
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'totalUsers' },
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' },
        ],
      });

      const row = response.rows?.[0];
      if (!row?.metricValues) {
        return null;
      }

      const avgSeconds = parseFloat(row.metricValues[5]?.value || '0');
      const minutes = Math.floor(avgSeconds / 60);
      const seconds = Math.round(avgSeconds % 60);

      return {
        totalUsers: parseInt(row.metricValues[0]?.value || '0'),
        activeUsers: parseInt(row.metricValues[1]?.value || '0'),
        sessions: parseInt(row.metricValues[2]?.value || '0'),
        pageViews: parseInt(row.metricValues[3]?.value || '0'),
        bounceRate: parseFloat(row.metricValues[4]?.value || '0'),
        avgSessionDuration: `${minutes}m ${seconds}s`,
      };
    } catch (error) {
      console.error('Error fetching overview:', error);
      return null;
    }
  }

  /**
   * Get users by country
   */
  async getCountryData(startDate: string = '30daysAgo', endDate: string = 'today'): Promise<CountryData[] | null> {
    if (!this.analyticsClient || !GA_PROPERTY_ID) {
      return this.getEmptyCountryData();
    }

    try {
      const [response] = await this.analyticsClient.runReport({
        property: this.propertyId,
        dateRanges: [{ startDate, endDate }],
        dimensions: [
          { name: 'country' },
          { name: 'countryId' },
        ],
        metrics: [
          { name: 'totalUsers' },
          { name: 'sessions' },
        ],
        orderBys: [
          { metric: { metricName: 'totalUsers' }, desc: true },
        ],
        limit: 10,
      });

      return (response.rows || []).map(row => ({
        country: row.dimensionValues?.[0]?.value || 'Unknown',
        countryCode: row.dimensionValues?.[1]?.value || 'XX',
        users: parseInt(row.metricValues?.[0]?.value || '0'),
        sessions: parseInt(row.metricValues?.[1]?.value || '0'),
      }));
    } catch (error) {
      console.error('Error fetching country data:', error);
      return null;
    }
  }

  /**
   * Get event counts
   */
  async getEventData(startDate: string = '30daysAgo', endDate: string = 'today'): Promise<EventData[] | null> {
    if (!this.analyticsClient || !GA_PROPERTY_ID) {
      return this.getEmptyEventData();
    }

    try {
      const [response] = await this.analyticsClient.runReport({
        property: this.propertyId,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
        orderBys: [
          { metric: { metricName: 'eventCount' }, desc: true },
        ],
        limit: 20,
      });

      return (response.rows || []).map(row => ({
        eventName: row.dimensionValues?.[0]?.value || 'Unknown',
        eventCount: parseInt(row.metricValues?.[0]?.value || '0'),
      }));
    } catch (error) {
      console.error('Error fetching event data:', error);
      return null;
    }
  }

  /**
   * Get traffic sources
   */
  async getTrafficSources(startDate: string = '30daysAgo', endDate: string = 'today'): Promise<TrafficSource[] | null> {
    if (!this.analyticsClient || !GA_PROPERTY_ID) {
      return this.getEmptyTrafficSources();
    }

    try {
      const [response] = await this.analyticsClient.runReport({
        property: this.propertyId,
        dateRanges: [{ startDate, endDate }],
        dimensions: [
          { name: 'sessionSource' },
          { name: 'sessionMedium' },
        ],
        metrics: [
          { name: 'totalUsers' },
          { name: 'sessions' },
        ],
        orderBys: [
          { metric: { metricName: 'sessions' }, desc: true },
        ],
        limit: 10,
      });

      return (response.rows || []).map(row => ({
        source: row.dimensionValues?.[0]?.value || 'Unknown',
        medium: row.dimensionValues?.[1]?.value || 'Unknown',
        users: parseInt(row.metricValues?.[0]?.value || '0'),
        sessions: parseInt(row.metricValues?.[1]?.value || '0'),
      }));
    } catch (error) {
      console.error('Error fetching traffic sources:', error);
      return null;
    }
  }

  /**
   * Get device breakdown
   */
  async getDeviceData(startDate: string = '30daysAgo', endDate: string = 'today'): Promise<DeviceData[] | null> {
    if (!this.analyticsClient || !GA_PROPERTY_ID) {
      return this.getEmptyDeviceData();
    }

    try {
      const [response] = await this.analyticsClient.runReport({
        property: this.propertyId,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'totalUsers' }],
        orderBys: [
          { metric: { metricName: 'totalUsers' }, desc: true },
        ],
      });

      const totalUsers = (response.rows || []).reduce(
        (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0'),
        0
      );

      return (response.rows || []).map(row => {
        const users = parseInt(row.metricValues?.[0]?.value || '0');
        return {
          deviceCategory: row.dimensionValues?.[0]?.value || 'Unknown',
          users,
          percentage: totalUsers > 0 ? Math.round((users / totalUsers) * 100) : 0,
        };
      });
    } catch (error) {
      console.error('Error fetching device data:', error);
      return null;
    }
  }

  /**
   * Get daily trends
   */
  async getDailyData(startDate: string = '30daysAgo', endDate: string = 'today'): Promise<DailyData[] | null> {
    if (!this.analyticsClient || !GA_PROPERTY_ID) {
      return this.getEmptyDailyData();
    }

    try {
      const [response] = await this.analyticsClient.runReport({
        property: this.propertyId,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'date' }],
        metrics: [
          { name: 'totalUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
        ],
        orderBys: [
          { dimension: { dimensionName: 'date' } },
        ],
      });

      return (response.rows || []).map(row => ({
        date: this.formatDate(row.dimensionValues?.[0]?.value || ''),
        users: parseInt(row.metricValues?.[0]?.value || '0'),
        sessions: parseInt(row.metricValues?.[1]?.value || '0'),
        pageViews: parseInt(row.metricValues?.[2]?.value || '0'),
      }));
    } catch (error) {
      console.error('Error fetching daily data:', error);
      return null;
    }
  }

  private formatDate(dateStr: string): string {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    // Format YYYYMMDD to YYYY-MM-DD
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
  }

  // Return null when GA not configured (no mock data)
  private getEmptyOverview(): null {
    return null;
  }

  private getEmptyCountryData(): null {
    return null;
  }

  private getEmptyEventData(): null {
    return null;
  }

  private getEmptyTrafficSources(): null {
    return null;
  }

  private getEmptyDeviceData(): null {
    return null;
  }

  private getEmptyDailyData(): null {
    return null;
  }

  // Check if GA is configured
  isConfigured(): boolean {
    return !!(this.analyticsClient && GA_PROPERTY_ID);
  }
}

export const googleAnalyticsService = new GoogleAnalyticsService();
