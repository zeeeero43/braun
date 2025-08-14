import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import munichImage1 from "@assets/anastasiya-dalenka-WJsGUDk-x74-unsplash-min_1755076767513.jpg";
import munichImage2 from "@assets/jan-antonin-kolar-O3OIWMYbGQU-unsplash-min_1755076768392.jpg";
import munichImage3 from "@assets/ian-kelsall-MEUvVqkU3QI-unsplash-min_1755076769428.jpg";

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [munichImage1, munichImage2, munichImage3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const scrollToContact = () => {
    const element = document.getElementById("kontakt");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToAbout = () => {
    const element = document.getElementById("about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-16 md:pt-0"
    >
      {/* Munich cityscape background carousel */}
      <div className="absolute inset-0 overflow-hidden">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image})`
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Carousel indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-white' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Zu Bild ${index + 1} wechseln`}
          />
        ))}
      </div>
      
      {/* Floating geometric elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-xl floating-element" />
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-lg floating-element" style={{animationDelay: '2s'}} />
      <div className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-primary/5 rounded-full blur-2xl floating-element" style={{animationDelay: '4s'}} />
      
      <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-shadow-strong animate-fade-in" style={{animationDelay: '0.2s'}}>
          <span className="block mb-2">Walter Braun Umzüge</span>
          <span className="block text-primary text-3xl sm:text-4xl md:text-6xl font-medium">München</span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 font-medium text-shadow-strong animate-fade-in" style={{animationDelay: '0.4s'}}>
          Ihr zuverlässiger Partner für den Umzug in der bayerischen Landeshauptstadt
        </p>
        <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-12 text-gray-200 max-w-4xl mx-auto animate-fade-in" style={{animationDelay: '0.6s'}}>
          Über 10 Jahre Erfahrung • Münchner Traditionsunternehmen • Vollversichert
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 animate-slide-up" style={{animationDelay: '0.8s'}}>
          <Button 
            onClick={scrollToContact}
            className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <i className="fas fa-phone mr-2 sm:mr-3"></i>Kostenlose Beratung
          </Button>
          <Button 
            onClick={scrollToAbout}
            variant="outline"
            className="border-white/60 text-gray-900 bg-white/90 hover:bg-white hover:text-gray-900 hover:border-white px-6 sm:px-8 py-3 rounded-lg font-semibold text-base sm:text-lg backdrop-blur-sm hover:scale-105 transition-all duration-300"
          >
            <i className="fas fa-arrow-down mr-2 sm:mr-3"></i>Mehr erfahren
          </Button>
        </div>
        
        {/* Professional stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">10+</div>
            <div className="text-xs sm:text-sm font-medium text-gray-200">Jahre in München</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">30+</div>
            <div className="text-xs sm:text-sm font-medium text-gray-200">Mitarbeiter</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">100%</div>
            <div className="text-xs sm:text-sm font-medium text-gray-200">Versichert</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center">
            <div className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">Persönlicher</div>
            <div className="text-xs sm:text-sm font-medium text-gray-200">Ansprechpartner</div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-200">
          <div className="flex items-center">
            <i className="fas fa-certificate text-white mr-2"></i>Münchner Traditionsunternehmen
          </div>
          <div className="flex items-center">
            <i className="fas fa-handshake text-white mr-2"></i>Persönliche Beratung
          </div>
          <div className="flex items-center">
            <i className="fas fa-star text-white mr-2"></i>4.9/5 Google Bewertung
          </div>
        </div>
      </div>
    </section>
  );
}
