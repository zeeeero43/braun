import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const isBlogPage = location.startsWith('/blog');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (isBlogPage) {
      // Navigate to home page with section
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navigationItems = [
    { id: "home", label: "Home" },
    { id: "leistungen", label: "Leistungen" },
    { id: "versprechen", label: "Unser Versprechen" },
    { id: "bewertungen", label: "Bewertungen" },
    { id: "kontakt", label: "Kontakt" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled || isBlogPage
        ? "bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-100" 
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className={`flex items-center space-x-3 transition-all duration-300 ${
              isScrolled ? "scale-90" : "scale-100"
            }`}>
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-truck text-white font-bold"></i>
              </div>
              <div>
                <Link href="/">
                  <h1 className={`text-xl font-black transition-colors cursor-pointer hover:text-primary ${
                    isScrolled || isBlogPage ? "text-gray-900" : "text-white"
                  }`}>
                    WALTER BRAUN
                  </h1>
                  <div className={`text-xs font-semibold transition-colors ${
                    isScrolled || isBlogPage ? "text-primary" : "text-primary"
                  }`}>
                    UMZÜGE MÜNCHEN
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:bg-primary/10 cursor-pointer ${
                  isScrolled || isBlogPage
                    ? "text-gray-700 hover:text-primary" 
                    : "text-white hover:text-primary hover:bg-white/10"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="tel:089123456789"
              className={`hidden sm:flex items-center px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                isScrolled || isBlogPage
                  ? "bg-primary text-white hover:bg-primary/90" 
                  : "bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
              }`}
            >
              <i className="fas fa-phone mr-2"></i>089 123 456 789
            </a>

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`lg:hidden p-3 rounded-lg transition-all ${
                    isScrolled || isBlogPage
                      ? "text-gray-700 hover:bg-gray-100" 
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  <i className="fas fa-bars text-lg"></i>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-8">
                  <div className="flex items-center space-x-3 pb-6 border-b">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <i className="fas fa-truck text-white text-lg"></i>
                    </div>
                    <div>
                      <div className="font-black text-gray-900">WALTER BRAUN</div>
                      <div className="text-sm font-semibold text-primary">UMZÜGE MÜNCHEN</div>
                    </div>
                  </div>
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="text-left text-gray-700 hover:text-primary transition-colors p-4 rounded-lg hover:bg-gray-50 font-semibold"
                    >
                      {item.label}
                    </button>
                  ))}
                  <a
                    href="tel:089123456789"
                    className="bg-primary text-white font-bold py-4 px-6 rounded-xl text-center transition-colors hover:bg-primary/90 mt-6"
                  >
                    <i className="fas fa-phone mr-2"></i>089 123 456 789
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
