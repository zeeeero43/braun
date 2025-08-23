import { useEffect } from 'react';
import { useCookieConsent } from "@/hooks/useCookieConsent";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    gtag_report_conversion?: (url?: string) => boolean;
  }
}

export function GoogleAdsTracking() {
  const { consent } = useCookieConsent();

  useEffect(() => {
    // Google Ads is now loaded directly in index.html
    // This component only logs that tracking is available
    if (consent?.marketing) {
      console.log('✅ Google Ads tracking initialized (direct integration)');
    }
  }, [consent?.marketing]);

  return null;
}

// Hook to trigger conversion tracking
export function useGoogleAdsConversion() {
  const { consent } = useCookieConsent();

  const reportConversion = (url?: string) => {
    // Only track conversions if marketing cookies are accepted
    if (!consent?.marketing) {
      console.log('🚫 Google Ads conversion tracking skipped - no marketing consent');
      return false;
    }

    if (typeof window.gtag_report_conversion === 'function') {
      console.log('📊 Google Ads conversion tracked');
      return window.gtag_report_conversion(url);
    } else {
      console.warn('⚠️ Google Ads conversion tracking not initialized');
      return false;
    }
  };

  return { reportConversion };
}