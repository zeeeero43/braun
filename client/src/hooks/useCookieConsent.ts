import { useState, useEffect, useCallback } from "react";

export interface CookieConsent {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface CookieConsentState {
  consent: CookieConsent | null;
  isLoading: boolean;
  showBanner: boolean;
  showSettings: boolean;
}

const DEFAULT_CONSENT: CookieConsent = {
  necessary: true, // Always true, cannot be disabled
  functional: false,
  analytics: false,
  marketing: false,
};

const CONSENT_STORAGE_KEY = "walter-braun-cookie-consent";
const CONSENT_DATE_KEY = "walter-braun-cookie-consent-date";
const CONSENT_VERSION = "1.0";

// DSGVO-compliant cookie categories
export const COOKIE_CATEGORIES = {
  necessary: {
    name: "Notwendige Cookies",
    description: "Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.",
    cookies: ["session", "csrf-token", "language-preference"],
    required: true
  },
  functional: {
    name: "Funktionale Cookies", 
    description: "Diese Cookies ermöglichen erweiterte Funktionen und Personalisierung der Website.",
    cookies: ["user-preferences", "theme-settings", "form-data"],
    required: false
  },
  analytics: {
    name: "Analyse Cookies",
    description: "Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren.",
    cookies: ["google-analytics", "performance-monitoring"],
    required: false
  },
  marketing: {
    name: "Marketing Cookies",
    description: "Diese Cookies werden verwendet, um relevante Werbung anzuzeigen und Marketing-Kampagnen zu verfolgen.",
    cookies: ["google-ads", "facebook-pixel", "conversion-tracking"],
    required: false
  }
};

export function useCookieConsent(): CookieConsentState & {
  setConsent: (consent: CookieConsent) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  showConsentBanner: () => void;
  showConsentSettings: () => void;
  hideConsent: () => void;
  clearAllCookies: () => void;
  isConsentGiven: (category: keyof CookieConsent) => boolean;
} {
  const [state, setState] = useState<CookieConsentState>({
    consent: null,
    isLoading: true,
    showBanner: false,
    showSettings: false,
  });

  // Load consent from localStorage on mount
  useEffect(() => {
    loadConsent();
  }, []);

  const loadConsent = useCallback(() => {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      const storedDate = localStorage.getItem(CONSENT_DATE_KEY);
      
      if (stored && storedDate) {
        const consent = JSON.parse(stored);
        const consentDate = new Date(storedDate);
        const now = new Date();
        const daysSinceConsent = (now.getTime() - consentDate.getTime()) / (1000 * 60 * 60 * 24);
        
        // DSGVO: Consent expires after 13 months (397 days)
        if (daysSinceConsent < 397 && consent.version === CONSENT_VERSION) {
          setState(prev => ({
            ...prev,
            consent: consent.data,
            isLoading: false,
            showBanner: false,
          }));
          return;
        }
      }
      
      // No valid consent found, show banner
      setState(prev => ({
        ...prev,
        consent: null,
        isLoading: false,
        showBanner: true,
      }));
    } catch (error) {
      console.error("Error loading cookie consent:", error);
      setState(prev => ({
        ...prev,
        consent: null,
        isLoading: false,
        showBanner: true,
      }));
    }
  }, []);

  const saveConsent = useCallback((consent: CookieConsent) => {
    try {
      const consentData = {
        data: consent,
        version: CONSENT_VERSION,
        timestamp: new Date().toISOString(),
      };
      
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
      localStorage.setItem(CONSENT_DATE_KEY, new Date().toISOString());
      
      setState(prev => ({
        ...prev,
        consent,
        showBanner: false,
        showSettings: false,
      }));
      
      // Clean up cookies based on consent
      cleanupCookies(consent);
      
    } catch (error) {
      console.error("Error saving cookie consent:", error);
    }
  }, []);

  const cleanupCookies = useCallback((consent: CookieConsent) => {
    // Get all cookies
    const cookies = document.cookie.split(";");
    
    // Define cookie patterns for each category
    const cookiePatterns = {
      functional: ["user-pref", "theme", "lang", "settings"],
      analytics: ["_ga", "_gid", "_gat", "gtag", "analytics"],
      marketing: ["_fbp", "_fbc", "ads", "marketing", "campaign", "utm"]
    };
    
    // Remove cookies for non-consented categories
    Object.entries(cookiePatterns).forEach(([category, patterns]) => {
      if (!consent[category as keyof CookieConsent]) {
        cookies.forEach(cookie => {
          const cookieName = cookie.split("=")[0].trim();
          
          // Check if cookie matches any pattern for this category
          const shouldDelete = patterns.some(pattern => 
            cookieName.toLowerCase().includes(pattern.toLowerCase())
          );
          
          if (shouldDelete) {
            // Delete cookie for all possible domains and paths
            const domains = ["", "." + window.location.hostname, "." + window.location.hostname.split('.').slice(-2).join('.')];
            const paths = ["/", "/blog", "/admin"];
            
            domains.forEach(domain => {
              paths.forEach(path => {
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domain}`;
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
              });
            });
          }
        });
      }
    });
    
    // Clear localStorage and sessionStorage for non-consented categories
    if (!consent.functional) {
      Object.keys(localStorage).forEach(key => {
        if (key.includes("theme") || key.includes("pref") || key.includes("settings")) {
          localStorage.removeItem(key);
        }
      });
    }
    
    if (!consent.analytics) {
      Object.keys(localStorage).forEach(key => {
        if (key.includes("analytics") || key.includes("ga") || key.includes("gtag")) {
          localStorage.removeItem(key);
        }
      });
    }
  }, []);

  const setConsent = useCallback((consent: CookieConsent) => {
    saveConsent(consent);
  }, [saveConsent]);

  const acceptAll = useCallback(() => {
    const fullConsent: CookieConsent = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    saveConsent(fullConsent);
  }, [saveConsent]);

  const rejectAll = useCallback(() => {
    const minimalConsent: CookieConsent = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    saveConsent(minimalConsent);
  }, [saveConsent]);

  const showConsentBanner = useCallback(() => {
    setState(prev => ({ ...prev, showBanner: true, showSettings: false }));
  }, []);

  const showConsentSettings = useCallback(() => {
    setState(prev => ({ ...prev, showSettings: true, showBanner: false }));
  }, []);

  const hideConsent = useCallback(() => {
    setState(prev => ({ ...prev, showBanner: false, showSettings: false }));
  }, []);

  const clearAllCookies = useCallback(() => {
    // Clear all cookies
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
    });
    
    // Clear localStorage (except consent data)
    Object.keys(localStorage).forEach(key => {
      if (key !== CONSENT_STORAGE_KEY && key !== CONSENT_DATE_KEY) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear sessionStorage
    sessionStorage.clear();
  }, []);

  const isConsentGiven = useCallback((category: keyof CookieConsent): boolean => {
    return state.consent?.[category] ?? false;
  }, [state.consent]);

  return {
    ...state,
    setConsent,
    acceptAll,
    rejectAll,
    showConsentBanner,
    showConsentSettings,
    hideConsent,
    clearAllCookies,
    isConsentGiven,
  };
}