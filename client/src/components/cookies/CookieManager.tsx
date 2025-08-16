import { useCookieConsent } from "@/hooks/useCookieConsent";
import CookieBanner from "./CookieBanner";
import CookieSettings from "./CookieSettings";

// This component handles all cookie-related UI
export default function CookieManager() {
  return (
    <>
      <CookieBanner />
      <CookieSettings />
    </>
  );
}

// Utility function to check if analytics/tracking can be loaded
export function useAnalyticsConsent() {
  const { isConsentGiven } = useCookieConsent();
  
  return {
    canUseAnalytics: isConsentGiven('analytics'),
    canUseMarketing: isConsentGiven('marketing'),
    canUseFunctional: isConsentGiven('functional'),
  };
}

// HOC for components that need cookie consent
export function withCookieConsent<T extends object>(
  Component: React.ComponentType<T>,
  requiredConsent: 'analytics' | 'marketing' | 'functional'
) {
  return function CookieConsentWrapper(props: T) {
    const { isConsentGiven } = useCookieConsent();
    
    if (!isConsentGiven(requiredConsent)) {
      return null;
    }
    
    return <Component {...props} />;
  };
}