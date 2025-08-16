import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, Calendar, User, ChevronLeft, Share2, Tag } from "lucide-react";
import { Helmet } from "react-helmet";
import Navigation from "@/components/navigation";
import SEOHead from "@/components/seo/SEOHead";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import LazyImage from "@/components/seo/LazyImage";
import { generateFAQData } from "@/hooks/useSEOData";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  metaDescription: string;
  keywords: string[];
  tags: string[];
  category: string;
  author: string;
  readTime: string;
  image: string;
  imageAlt: string;
  faqData: Array<{
    question: string;
    answer: string;
  }>;
  publishedAt: string;
}

interface BlogPostResponse {
  success: boolean;
  post: BlogPost;
}

export default function BlogPostPage() {
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  const { data: blogData, isLoading, error } = useQuery<BlogPostResponse>({
    queryKey: ["/api/blog", slug],
    queryFn: async () => {
      if (!slug) throw new Error("No slug provided");
      const res = await fetch(`/api/blog/${slug}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Blog post not found");
        throw new Error("Failed to fetch blog post");
      }
      return res.json();
    },
    enabled: !!slug
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="h-64 bg-gray-200 rounded-xl mb-8"></div>
              <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blogData?.success || !blogData?.post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Blog-Artikel nicht gefunden</p>
          <Link href="/blog">
            <Button className="bg-green-600 hover:bg-green-700">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Zurück zum Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const post = blogData.post;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Convert markdown content to HTML (simple implementation) 
  const markdownToHtml = (markdown: string) => {
    return markdown
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-800 mb-6 mt-8">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-gray-800 mb-4 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium text-gray-800 mb-3 mt-5">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-4">$2</li>')
      // Mobile-optimized tables with Tailwind CSS
      .replace(/\|(.*?)\|/g, (match, content) => {
        const cells = content.split('|').map((cell: string) => cell.trim());
        return `<tr class="border-b">${cells.map((cell: string) => 
          `<td class="px-4 py-2 text-sm md:text-base">${cell}</td>`
        ).join('')}</tr>`;
      })
      .replace(/<tr class="border-b">.*?<\/tr>/g, (match) => {
        return `<div class="overflow-x-auto mb-6"><table class="min-w-full bg-white border border-gray-200 rounded-lg">${match}</table></div>`;
      })
      .replace(/\n\n/gim, '</p><p class="text-gray-700 leading-relaxed mb-4">')
      .replace(/^(?!<[h|l|p|d|t])(.+)$/gim, '<p class="text-gray-700 leading-relaxed mb-4">$1</p>');
  };

  return (
    <>
      <SEOHead 
        title={post.title}
        description={post.metaDescription}
        keywords={post.keywords}
        url={`https://walterbraun-muenchen.de/blog/${post.slug}`}
        image={post.image}
        type="article"
        author={post.author}
        publishedTime={post.publishedAt}
        modifiedTime={post.publishedAt}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.metaDescription,
            "image": post.image,
            "author": {
              "@type": "Organization",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "Walter Braun Umzüge",
              "logo": {
                "@type": "ImageObject",
                "url": "https://walterbraun-muenchen.de/logo.png"
              }
            },
            "datePublished": post.publishedAt,
            "dateModified": post.publishedAt,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://walterbraun-muenchen.de/blog/${post.slug}`
            }
          },
          generateFAQData(post.faqData || [])
        ].filter(Boolean)}
      />

      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 pt-32">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { name: "Blog", url: "/blog" },
              { name: post.title, url: `/blog/${post.slug}` }
            ]}
            className="mb-6"
          />
          
          {/* Navigation */}
          <div className="mb-8">
            <Link href="/blog">
              <Button variant="ghost" className="text-green-600 hover:text-green-700">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Zurück zum Blog
              </Button>
            </Link>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Hero Image */}
            <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl">
              <LazyImage
                src={post.image}
                alt={post.imageAlt}
                className="w-full h-64 md:h-80 object-cover"
                width={800}
                height={400}
              />
              <div className="absolute top-6 left-6">
                <Badge className="bg-green-600 text-white text-sm px-3 py-1">
                  {post.category}
                </Badge>
              </div>
            </div>

            {/* Article Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{post.readTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{post.author}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="ml-auto"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Teilen
                </Button>
              </div>

              <p className="text-xl text-gray-600 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            {/* Article Content */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
              />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-gray-600" />
                  <span className="text-lg font-medium text-gray-800">Tags</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Section */}
            {post.faqData && post.faqData.length > 0 && (
              <Card className="mb-12 shadow-xl border-0">
                <CardHeader className="bg-green-50">
                  <CardTitle className="text-2xl text-green-700">
                    Häufig gestellte Fragen
                  </CardTitle>
                  <CardDescription>
                    Die wichtigsten Fragen und Antworten zu diesem Thema
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {post.faqData.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className="px-6">
                        <AccordionTrigger className="text-left hover:text-green-600 transition-colors">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-2xl border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">
                  Benötigen Sie professionelle Umzugshilfe?
                </h3>
                <p className="text-lg opacity-90 mb-6">
                  Kontaktieren Sie Walter Braun Umzüge für ein kostenloses Angebot. 
                  Wir stehen Ihnen mit über 20 Jahren Erfahrung zur Seite.
                </p>
                <Link href="/#contact">
                  <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                    Jetzt kostenlos anfragen
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <i className="fas fa-truck text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">WALTER BRAUN</h3>
                  <div className="text-primary font-bold">UMZÜGE MÜNCHEN</div>
                </div>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Ihr zuverlässiger Partner für stressfreie Umzüge in München und Umgebung. 
                Über 20 Jahre Erfahrung und höchste Qualitätsstandards.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <i className="fab fa-google text-xl"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Leistungen</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/#leistungen" className="hover:text-primary transition-colors">Privatumzüge</a></li>
                <li><a href="/#leistungen" className="hover:text-primary transition-colors">Büroumzüge</a></li>
                <li><a href="/#leistungen" className="hover:text-primary transition-colors">Fernumzüge</a></li>
                <li><a href="/#leistungen" className="hover:text-primary transition-colors">Möbellager</a></li>
                <li><a href="/blog" className="hover:text-primary transition-colors">Blog & Ratgeber</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Kontakt</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <i className="fas fa-phone text-primary mr-3"></i>
                  <a href="tel:089123456789" className="hover:text-primary transition-colors">089 123 456 789</a>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-envelope text-primary mr-3"></i>
                  <a href="mailto:info@walterbraun-umzuege.de" className="hover:text-primary transition-colors">info@walterbraun-umzuege.de</a>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt text-primary mr-3 mt-1"></i>
                  <div>
                    <div>Musterstraße 123</div>
                    <div>80333 München</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 Walter Braun Umzüge. Alle Rechte vorbehalten.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">Impressum</a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">Datenschutz</a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm">AGB</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}