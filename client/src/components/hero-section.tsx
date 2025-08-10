import { Button } from "@/components/ui/button";

export default function HeroSection() {
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Munich cityscape background with parallax effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1595855759920-86582396756a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
        }}
      />
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Floating geometric elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-xl floating-element" />
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-lg floating-element" style={{animationDelay: '2s'}} />
      <div className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-primary/5 rounded-full blur-2xl floating-element" style={{animationDelay: '4s'}} />
      
      <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4">
        {/* Premium badge */}
        <div className="inline-flex items-center px-6 py-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full text-sm font-medium text-primary-foreground mb-8 animate-fade-in">
          <i className="fas fa-star mr-2"></i>
          Premium Umzugsservice in München
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight text-shadow-strong">
          <span className="block mb-2">WALTER BRAUN</span>
          <span className="block text-primary text-5xl md:text-7xl">UMZÜGE</span>
        </h1>
        
        <p className="text-2xl md:text-3xl mb-4 font-light text-shadow-strong">
          Ihr Premium-Partner für maßgeschneiderte Umzugslösungen
        </p>
        <p className="text-lg md:text-xl mb-12 text-gray-200 max-w-3xl mx-auto">
          Professionell • Zuverlässig • Versichert – Seit über 10 Jahren Ihr Experte im Raum München
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Button 
            onClick={scrollToContact}
            className="bg-primary hover:bg-primary-foreground hover:text-primary text-white px-10 py-5 rounded-xl font-bold text-xl transition-all transform hover:scale-105 premium-shadow"
          >
            <i className="fas fa-phone mr-3"></i>Kostenlose Beratung
          </Button>
          <Button 
            onClick={scrollToAbout}
            variant="outline"
            className="glass-morphism hover:bg-white/20 text-white border-white/40 px-10 py-5 rounded-xl font-bold text-xl transition-all hover:scale-105"
          >
            <i className="fas fa-arrow-down mr-3"></i>Mehr erfahren
          </Button>
        </div>
        
        {/* Premium stats with gold accents */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="premium-card rounded-2xl p-6 text-center hover-lift">
            <div className="text-4xl font-black text-primary mb-2">10+</div>
            <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Jahre Erfahrung</div>
          </div>
          <div className="premium-card rounded-2xl p-6 text-center hover-lift">
            <div className="text-4xl font-black text-primary mb-2">30+</div>
            <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Fachkräfte</div>
          </div>
          <div className="premium-card rounded-2xl p-6 text-center hover-lift">
            <div className="text-4xl font-black text-primary mb-2">100%</div>
            <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Versichert</div>
          </div>
          <div className="premium-card rounded-2xl p-6 text-center hover-lift">
            <div className="text-4xl font-black text-primary mb-2">24h</div>
            <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Service</div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex justify-center items-center space-x-8 opacity-80">
          <div className="flex items-center text-sm">
            <i className="fas fa-shield-alt text-primary mr-2"></i>TÜV Zertifiziert
          </div>
          <div className="flex items-center text-sm">
            <i className="fas fa-award text-primary mr-2"></i>Testsieger 2024
          </div>
          <div className="flex items-center text-sm">
            <i className="fas fa-star text-primary mr-2"></i>4.9/5 Bewertung
          </div>
        </div>
      </div>
    </section>
  );
}
