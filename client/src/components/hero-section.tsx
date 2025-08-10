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
      
      <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-shadow-strong">
          <span className="block mb-2">Walter Braun Umzüge</span>
          <span className="block text-primary text-3xl md:text-5xl font-medium">München & Umgebung</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-4 font-medium text-shadow-strong">
          Ihr zuverlässiger Partner für den Umzug in der bayerischen Landeshauptstadt
        </p>
        <p className="text-lg md:text-xl mb-12 text-gray-200 max-w-4xl mx-auto">
          Über 10 Jahre Erfahrung • Münchner Traditionsunternehmen • Vollversichert
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
        
        {/* Professional stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">10+</div>
            <div className="text-sm font-medium text-gray-200">Jahre in München</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">30+</div>
            <div className="text-sm font-medium text-gray-200">Mitarbeiter</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">100%</div>
            <div className="text-sm font-medium text-gray-200">Versichert</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">24h</div>
            <div className="text-sm font-medium text-gray-200">Erreichbar</div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-200">
          <div className="flex items-center">
            <i className="fas fa-certificate text-primary mr-2"></i>Münchner Traditionsunternehmen
          </div>
          <div className="flex items-center">
            <i className="fas fa-handshake text-primary mr-2"></i>Persönliche Beratung
          </div>
          <div className="flex items-center">
            <i className="fas fa-star text-primary mr-2"></i>4.9/5 Google Bewertung
          </div>
        </div>
      </div>
    </section>
  );
}
