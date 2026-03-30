'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

/**
 * Hook to automatically track page views on route changes
 * Usage: Place in root layout or top-level component
 */
export const useGA = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Map pathname to readable page titles
    const pageTitle = getPageTitle(pathname);
    
    trackPageView(pathname, pageTitle, {
      funnel_step: getFunnelStep(pathname),
    });
  }, [pathname]);
};

/**
 * Get human-readable page title from pathname
 */
function getPageTitle(pathname: string): string {
  const titleMap: Record<string, string> = {
    '/': 'Homepage',
    '/get-started': 'Get Started',
    '/login': 'Login',
    '/dashboard': 'Dashboard',
    '/my-website': 'My Websites',
    '/generate': 'Generate Website',
    '/admin': 'Admin Panel',
    '/payment-success': 'Payment Success',
    '/success': 'Success Page',
  };

  // Check exact match first
  if (titleMap[pathname]) return titleMap[pathname];

  // Check dynamic routes
  if (pathname.startsWith('/dashboard/')) return 'Dashboard - Detail';
  if (pathname.startsWith('/my-website/')) return 'Website Editor';
  if (pathname.startsWith('/admin/')) return 'Admin - Detail';

  return pathname || 'Unknown';
}

/**
 * Get funnel step for tracking user journey
 */
function getFunnelStep(pathname: string): string {
  const funnelMap: Record<string, string> = {
    '/': 'step_1_homepage',
    '/get-started': 'step_2_get_started',
    '/login': 'step_2_login',
    '/dashboard': 'step_3_dashboard',
    '/my-website': 'step_3_my_websites',
    '/generate': 'step_4_generate',
    '/payment-success': 'step_5_success',
    '/success': 'step_5_success',
  };

  if (funnelMap[pathname]) return funnelMap[pathname];
  if (pathname.startsWith('/dashboard/')) return 'step_3_dashboard';
  if (pathname.startsWith('/my-website/')) return 'step_3_website_editor';
  
  return 'other';
}
