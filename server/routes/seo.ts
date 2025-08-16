import { Router } from "express";
import { storage } from "../storage";

const router = Router();

// XML Sitemap Generator
router.get("/sitemap.xml", async (req, res) => {
  try {
    const domain = "https://walterbraun-muenchen.de";
    
    // Get all blog posts for sitemap
    const blogPosts = await storage.getBlogPosts();
    
    // Static pages
    const staticPages = [
      { url: "/", changefreq: "weekly", priority: "1.0" },
      { url: "/blog", changefreq: "daily", priority: "0.9" },
    ];
    
    // Generate sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
`;

    // Add static pages
    staticPages.forEach(page => {
      sitemap += `  <url>
    <loc>${domain}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    });

    // Add blog posts
    blogPosts.forEach((post: any) => {
      const postDate = new Date(post.publishedAt).toISOString().split('T')[0];
      sitemap += `  <url>
    <loc>${domain}/blog/${post.slug}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${post.image}</image:loc>
      <image:title>${post.title}</image:title>
      <image:caption>Umzugstipps von Walter Braun Umzüge München</image:caption>
    </image:image>
  </url>
`;
    });

    sitemap += `</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Robots.txt
router.get("/robots.txt", (req, res) => {
  const domain = "https://walterbraun-muenchen.de";
  
  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /*.json$

# Sitemaps
Sitemap: ${domain}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Allow all major search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

# Block bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /
`;

  res.set('Content-Type', 'text/plain');
  res.send(robots);
});

// JSON-LD Structured Data for Local Business
router.get("/api/structured-data/local-business", (req, res) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://walterbraun-muenchen.de/#localbusiness",
    "name": "Walter Braun Umzüge",
    "image": [
      "https://walterbraun-muenchen.de/logo.png",
      "https://walterbraun-muenchen.de/walter-braun-team.jpg"
    ],
    "url": "https://walterbraun-muenchen.de",
    "telephone": "+49-174-3861652",
    "email": "info@walterbraun-umzuege.de",
    "priceRange": "€€",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Landsberger Str. 302",
      "addressLocality": "München",
      "postalCode": "80687",
      "addressCountry": "DE",
      "addressRegion": "Bayern"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 48.1351,
      "longitude": 11.5820
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "München"
      },
      {
        "@type": "State", 
        "name": "Bayern"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Umzugsservices",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Privatumzug",
            "description": "Professioneller Umzug für Privatpersonen in München und Umgebung"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Geschäftsumzug",
            "description": "Büroumzug und Firmenumzug ohne Betriebsunterbrechung"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Entrümpelung",
            "description": "Professionelle Entrümpelung und Entsorgung"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Packservice",
            "description": "Fachgerechtes Verpacken und Einpacken Ihrer Gegenstände"
          }
        }
      ]
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification", 
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "16:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127",
      "bestRating": "5"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Maria Schmidt"
        },
        "reviewBody": "Hervorragender Service! Walter Braun und sein Team haben unseren Umzug professionell und stressfrei durchgeführt."
      }
    ],
    "sameAs": [
      "https://www.facebook.com/walterbraunumzuege",
      "https://www.instagram.com/walterbraunumzuege",
      "https://www.check24.de/profis/walter-braun-umzuege"
    ],
    "founder": {
      "@type": "Person", 
      "name": "Walter Braun"
    },
    "foundingDate": "2015",
    "slogan": "Ihr zuverlässiger Partner für stressfreie Umzüge in München",
    "knowsAbout": [
      "Umzug München",
      "Privatumzug",
      "Geschäftsumzug", 
      "Entrümpelung",
      "Packservice",
      "Möbeltransport"
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Zertifizierung",
        "name": "CHECK24 Top Profi 2025"
      },
      {
        "@type": "EducationalOccupationalCredential", 
        "credentialCategory": "Mitgliedschaft",
        "name": "BGL - Bundesverband Güterkraftverkehr"
      }
    ]
  };

  res.json(structuredData);
});

// Schema markup for blog articles list
router.get("/api/structured-data/blog", async (req, res) => {
  try {
    const blogPosts = await storage.getBlogPosts();
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Walter Braun Umzüge Blog & Ratgeber",
      "description": "Professionelle Umzugstipps und Ratgeber für München und Bayern",
      "url": "https://walterbraun-muenchen.de/blog",
      "publisher": {
        "@type": "Organization",
        "name": "Walter Braun Umzüge",
        "logo": {
          "@type": "ImageObject",
          "url": "https://walterbraun-muenchen.de/logo.png"
        }
      },
      "blogPost": blogPosts.slice(0, 10).map((post: any) => ({
        "@type": "BlogPosting",
        "headline": post.title,
        "url": `https://walterbraun-muenchen.de/blog/${post.slug}`,
        "datePublished": post.publishedAt,
        "author": {
          "@type": "Organization",
          "name": post.author
        },
        "image": post.image,
        "description": post.metaDescription
      }))
    };

    res.json(structuredData);
  } catch (error) {
    console.error('Blog structured data error:', error);
    res.status(500).json({ error: 'Error generating blog structured data' });
  }
});

export default router;