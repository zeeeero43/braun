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
    // Only load Google Ads if marketing cookies are accepted
    if (!consent?.marketing) {
      return;
    }

    // Load Google Ads script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-16893834151';
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(...args: any[]) {
      window.dataLayer.push(args);
    };
    
    window.gtag('js', new Date());
    window.gtag('config', 'AW-16893834151');

    // Add conversion tracking function
    window.gtag_report_conversion = function(url?: string) {
      const callback = function() {
        if (typeof url !== 'undefined') {
          window.location.href = url;
        }
      };
      
      window.gtag('event', 'conversion', {
        'send_to': 'AW-16893834151/n54CCJuWoIwbEKfnzfc-',
        'event_callback': callback
      });
      
      return false;
    };

    console.log('✅ Google Ads tracking initialized');

    // Cleanup function
    return () => {
      const existingScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      // Clean up global functions
      delete window.gtag_report_conversion;
    };
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