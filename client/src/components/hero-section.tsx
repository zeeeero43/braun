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
      className="relative h-screen flex items-center justify-center"
    >
      {/* Munich cityscape background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1595855759920-86582396756a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')"
        }}
      />
      <div className="absolute inset-0 hero-gradient" />
      
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Willkommen bei<br />
          <span className="text-primary">Walter Braun Umzüge!</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          Ihr starker Partner im Raum München und Umgebung
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            onClick={scrollToContact}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
          >
            <i className="fas fa-phone mr-2"></i>Kostenlose Beratung
          </Button>
          <Button 
            onClick={scrollToAbout}
            variant="outline"
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Mehr erfahren
          </Button>
        </div>
        
        {/* Quick stats */}
        <div className="flex justify-center space-x-4 sm:space-x-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center animate-slide-in">
            <div className="text-2xl font-bold text-primary">10+</div>
            <div className="text-sm">Jahre Erfahrung</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center animate-slide-in">
            <div className="text-2xl font-bold text-primary">30+</div>
            <div className="text-sm">Mitarbeiter</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center animate-slide-in">
            <div className="text-2xl font-bold text-primary">100%</div>
            <div className="text-sm">Versichert</div>
          </div>
        </div>
      </div>
    </section>
  );
}
