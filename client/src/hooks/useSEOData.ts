import { useQuery } from "@tanstack/react-query";

// Hook for Local Business Structured Data
export function useLocalBusinessData() {
  return useQuery({
    queryKey: ["/api/structured-data/local-business"],
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

// Hook for Blog Structured Data
export function useBlogStructuredData() {
  return useQuery({
    queryKey: ["/api/structured-data/blog"],
    staleTime: 1000 * 60 * 60 * 2, // 2 hours
  });
}

// Generate breadcrumb structured data
export function generateBreadcrumbData(breadcrumbs: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `https://walterbraun-muenchen.de${crumb.url}`
    }))
  };
}

// Generate FAQ structured data for blog posts
export function generateFAQData(faqs: Array<{question: string, answer: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// Generate Service structured data
export function generateServiceData() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Umzugsservice München",
    "description": "Professionelle Umzugsdienstleistungen in München und Bayern",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Walter Braun Umzüge",
      "telephone": "+49-174-3861652",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "München",
        "addressRegion": "Bayern",
        "addressCountry": "DE"
      }
    },
    "areaServed": {
      "@type": "State",
      "name": "Bayern"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Umzugsservices",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Privatumzug",
            "description": "Komplettservice für Privatumzüge"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Geschäftsumzug",
            "description": "Professioneller Büro- und Firmenumzug"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Packservice",
            "description": "Fachgerechtes Ein- und Auspacken"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Entrümpelung",
            "description": "Professionelle Entrümpelung und Entsorgung"
          }
        }
      ]
    }
  };
}