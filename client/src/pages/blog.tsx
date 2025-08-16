import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import Navigation from "@/components/navigation";
import SEOHead from "@/components/seo/SEOHead";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  readTime: string;
  image: string;
  imageAlt: string;
  publishedAt: string;
  tags: string[];
}

interface BlogResponse {
  success: boolean;
  posts: BlogPost[];
}

interface CategoriesResponse {
  success: boolean;
  categories: string[];
}

export default function BlogPage() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  const { data: blogData, isLoading: postsLoading } = useQuery<BlogResponse>({
    queryKey: ["/api/blog", selectedCategory, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: postsPerPage.toString(),
        offset: ((currentPage - 1) * postsPerPage).toString(),
      });
      
      if (selectedCategory) {
        params.append("category", selectedCategory);
      }
      
      const res = await fetch(`/api/blog?${params}`);
      if (!res.ok) throw new Error("Failed to fetch blog posts");
      return res.json();
    }
  });

  const { data: categoriesData } = useQuery<CategoriesResponse>({
    queryKey: ["/api/blog/categories"],
    queryFn: async () => {
      const res = await fetch("/api/blog/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    }
  });

  const posts = blogData?.posts || [];
  const categories = categoriesData?.categories || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SEOHead 
        title="Blog & Ratgeber - Umzugstipps für München"
        description="Professionelle Umzugstipps und Ratgeber für München und Bayern. Packen, Organisieren, Umzugsrecht - Ihr Experte Walter Braun Umzüge."
        keywords={["Umzugstipps München", "Umzug Ratgeber", "Packen Organisieren", "Umzugsrecht Bayern", "Umzugsplanung", "München Umzug", "Umzugsfirma München"]}
        url="https://walterbraun-muenchen.de/blog"
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Walter Braun Umzüge Blog & Ratgeber",
          "description": "Professionelle Umzugstipps und Ratgeber für München und Bayern",
          "url": "https://walterbraun-muenchen.de/blog",
          "publisher": {
            "@type": "Organization",
            "name": "Walter Braun Umzüge"
          }
        }}
      />
      <Navigation />
      {/* Header Section */}
      <div className="bg-green-600 text-white py-16 pt-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Umzugstipps & Ratgeber
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Professionelle Tipps und Ratschläge für Ihren Umzug in München und Umgebung. 
              Von der Planung bis zur Durchführung - wir unterstützen Sie mit wertvollen Informationen.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { name: "Blog", url: "/blog" }
          ]}
          className="mb-6"
        />
        
        {/* Navigation */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            className="text-green-600 hover:text-green-700"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Zurück zur Startseite
          </Button>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Kategorien</h2>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={selectedCategory === "" ? "default" : "outline"}
                onClick={() => handleCategoryFilter("")}
                className={selectedCategory === "" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Alle Artikel
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => handleCategoryFilter(category)}
                  className={selectedCategory === category ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        {postsLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Keine Artikel gefunden
            </h3>
            <p className="text-gray-600">
              {selectedCategory 
                ? `Keine Artikel in der Kategorie "${selectedCategory}" verfügbar.`
                : "Zur Zeit sind keine Blog-Artikel verfügbar."
              }
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.imageAlt}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-green-600 hover:bg-green-700 text-white">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <CardDescription className="text-gray-600 line-clamp-3 mb-4">
                      {post.excerpt}
                    </CardDescription>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      
                      <Link href={`/blog/${post.slug}`}>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 group-hover:translate-x-1 transition-transform duration-300"
                        >
                          Lesen
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {posts.length === postsPerPage && (
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Vorherige
                </Button>
                
                <span className="flex items-center px-4 py-2 text-gray-600">
                  Seite {currentPage}
                </span>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={posts.length < postsPerPage}
                >
                  Nächste
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}
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
    </div>
  );
}