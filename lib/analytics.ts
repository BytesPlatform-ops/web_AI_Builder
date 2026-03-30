// Centralized Google Analytics utility

const GA_MEASUREMENT_ID = "G-LVL6QPRVRK";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Track a custom event in Google Analytics
 */
export const trackEvent = (
  eventName: string,
  eventData?: Record<string, unknown>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: eventData?.event_category || 'engagement',
      event_label: eventData?.event_label || eventName,
      ...eventData,
    });
    console.log(`📊 GA: ${eventName} event fired`, eventData);
  }
};

/**
 * Track a page view
 */
export const trackPageView = (
  pagePath: string,
  pageTitle: string,
  customData?: Record<string, unknown>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
      ...customData,
    });
    console.log(`📊 GA: page_view fired for ${pagePath}`);
  }
};

/**
 * Set user ID for authenticated users
 * Call this after user logs in or signs up
 */
export const setUserId = (userId: string, userProperties?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      user_id: userId,
      ...userProperties,
    });
    console.log(`📊 GA: User ID set to ${userId}`);
  }
};

/**
 * Track button/link clicks with consistent naming
 */
export const trackButtonClick = (
  buttonName: string,
  additionalData?: Record<string, unknown>
) => {
  trackEvent('button_click', {
    event_label: buttonName,
    button_name: buttonName,
    ...additionalData,
  });
};

/**
 * Track form interactions
 */
export const trackFormEvent = (
  formName: string,
  eventType: 'start' | 'submit' | 'error' | 'abandon',
  additionalData?: Record<string, unknown>
) => {
  trackEvent(`form_${eventType}`, {
    event_label: `${formName}_${eventType}`,
    form_name: formName,
    ...additionalData,
  });
};

/**
 * Track conversion events
 */
export const trackConversion = (
  conversionName: string,
  value?: number,
  additionalData?: Record<string, unknown>
) => {
  trackEvent('conversion', {
    event_label: conversionName,
    value: value || 1,
    event_category: 'conversion',
    ...additionalData,
  });
};
