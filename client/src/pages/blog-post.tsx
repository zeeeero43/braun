import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, Calendar, User, ChevronLeft, Share2, Tag } from "lucide-react";
import { Helmet } from "react-helmet";
import Navigation from "@/components/navigation";

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
      .replace(/\n\n/gim, '</p><p class="text-gray-700 leading-relaxed mb-4">')
      .replace(/^(?!<[h|l|p])(.+)$/gim, '<p class="text-gray-700 leading-relaxed mb-4">$1</p>');
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | Walter Braun Umzüge</title>
        <meta name="description" content={post.metaDescription} />
        <meta name="keywords" content={post.keywords.join(", ")} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.image} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 pt-32">
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
              <img
                src={post.image}
                alt={post.imageAlt}
                className="w-full h-64 md:h-80 object-cover"
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
    </>
  );
}