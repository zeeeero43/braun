import { useEffect } from "react";
import { useAnalyticsConsent } from "@/components/cookies/CookieManager";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface GoogleAnalyticsProps {
  measurementId?: string;
}

export default function GoogleAnalytics({ 
  measurementId = "GA_MEASUREMENT_ID" // Will be replaced with real ID when needed
}: GoogleAnalyticsProps) {
  const { canUseAnalytics } = useAnalyticsConsent();

  useEffect(() => {
    if (!canUseAnalytics || !measurementId || measurementId === "GA_MEASUREMENT_ID") {
      return;
    }

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    // Configure Google Analytics with privacy settings
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      // DSGVO-compliant settings
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
      cookie_expires: 60 * 60 * 24 * 90, // 90 days instead of default 2 years
      allow_google_signals: false, // Disable advertising features
      allow_ad_personalization_signals: false,
      // Additional privacy settings
      client_storage: 'cookies',
      cookie_update: true,
      cookie_domain: 'auto',
      send_page_view: true
    });

    // Load Google Analytics script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    // Track initial page view
    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
    });

    return () => {
      // Cleanup if needed
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [canUseAnalytics, measurementId]);

  // Custom tracking functions for DSGVO compliance
  const trackEvent = (eventName: string, parameters?: any) => {
    if (canUseAnalytics && window.gtag) {
      window.gtag('event', eventName, {
        ...parameters,
        // Add privacy parameters
        anonymize_ip: true,
      });
    }
  };

  const trackPageView = (pageTitle?: string, pagePath?: string) => {
    if (canUseAnalytics && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: pageTitle || document.title,
        page_location: window.location.origin + (pagePath || window.location.pathname),
        anonymize_ip: true,
      });
    }
  };

  // Don't render anything if analytics not consented
  if (!canUseAnalytics) {
    return null;
  }

  return null; // This component only handles script loading
}

// Custom hook for tracking events
export function useGoogleAnalytics() {
  const { canUseAnalytics } = useAnalyticsConsent();

  const trackEvent = (eventName: string, parameters?: any) => {
    if (canUseAnalytics && window.gtag) {
      window.gtag('event', eventName, {
        ...parameters,
        anonymize_ip: true,
      });
    }
  };

  const trackPageView = (pageTitle?: string, pagePath?: string) => {
    if (canUseAnalytics && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: pageTitle || document.title,
        page_location: window.location.origin + (pagePath || window.location.pathname),
        anonymize_ip: true,
      });
    }
  };

  const trackContactForm = (formType: string) => {
    trackEvent('contact_form_submit', {
      form_type: formType,
      event_category: 'engagement',
    });
  };

  const trackServiceClick = (serviceName: string) => {
    trackEvent('service_click', {
      service_name: serviceName,
      event_category: 'engagement',
    });
  };

  const trackPhoneClick = () => {
    trackEvent('phone_click', {
      event_category: 'contact',
    });
  };

  const trackWhatsAppClick = () => {
    trackEvent('whatsapp_click', {
      event_category: 'contact',
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackContactForm,
    trackServiceClick,
    trackPhoneClick,
    trackWhatsAppClick,
    canUseAnalytics,
  };
}