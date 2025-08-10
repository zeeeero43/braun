import { useState } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ServiceModal from "@/components/service-modal";
import ContactForm from "@/components/contact-form";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Button } from "@/components/ui/button";

const serviceData = {
  privatumzuege: {
    title: "Privatumzüge",
    content: {
      description: "Unser erfahrenes Team sorgt für einen reibungslosen Ablauf Ihres Privatumzugs in München und Umgebung.",
      details: [
        "Komplette Demontage und Montage Ihrer Möbel",
        "Professionelle Verpackung aller Gegenstände",
        "Transport mit modernen Fahrzeugen",
        "Aufbau in der neuen Wohnung",
        "Vollumfängliche Versicherung"
      ],
      conclusion: "Wir planen Ihren Umzug minutiös und sorgen dafür, dass Sie sich entspannt zurücklehnen können."
    }
  },
  seniorenumzuege: {
    title: "Seniorenumzüge",
    content: {
      description: "Seniorenumzüge erfordern besondere Aufmerksamkeit und Einfühlungsvermögen. Wir verstehen die besonderen Bedürfnisse älterer Menschen.",
      details: [
        "Geduldige und respektvolle Betreuung",
        "Hilfe beim Aussortieren und Einpacken",
        "Koordination mit Pflegediensten",
        "Flexible Terminplanung",
        "Unterstützung bei Behördengängen"
      ],
      conclusion: "Vertrauen Sie auf unsere jahrelange Erfahrung im Bereich Seniorenumzüge."
    }
  },
  auslandsumzuege: {
    title: "Auslandsumzüge",
    content: {
      description: "Internationale Umzüge erfordern spezielle Expertise. Wir organisieren Ihren Umzug weltweit.",
      details: [
        "Zollabwicklung und Dokumentation",
        "Seefracht und Luftfracht",
        "Zwischenlagerung wenn nötig",
        "Internationale Versicherung",
        "Beratung zu Einreisebestimmungen"
      ],
      conclusion: "Von der EU bis nach Übersee - wir bringen Sie sicher an Ihr Ziel."
    }
  },
  betriebsumzuege: {
    title: "Betriebsumzüge",
    content: {
      description: "Geschäftsumzüge erfordern präzise Planung und minimale Ausfallzeiten. Wir sorgen für einen reibungslosen Betriebsablauf.",
      details: [
        "Detaillierte Umzugsplanung",
        "IT-Equipment sicher transportieren",
        "Wochenend- und Nachtumzüge",
        "Minimale Betriebsunterbrechung",
        "Projektmanagement und Koordination"
      ],
      conclusion: "Ihr Geschäft läuft weiter, während wir den Umzug abwickeln."
    }
  },
  kuechenmontagen: {
    title: "Küchenmontagen",
    content: {
      description: "Küchen sind das Herzstück jeden Zuhauses. Unsere Experten sorgen für fachgerechte Montage und Anschlüsse.",
      details: [
        "Professionelle Demontage der alten Küche",
        "Fachgerechte Installation der neuen Küche",
        "Anschluss aller Elektrogeräte",
        "Wasser- und Gasanschlüsse",
        "Individuelle Anpassungen durch Schreiner"
      ],
      conclusion: "Von der ersten Schraube bis zum letzten Anschluss - alles aus einer Hand."
    }
  },
  packservice: {
    title: "Packservice",
    content: {
      description: "Professionelles Verpacken schützt Ihr Hab und Gut optimal während des Transports.",
      details: [
        "Hochwertiges Verpackungsmaterial",
        "Spezialverpackung für empfindliche Gegenstände",
        "Beschriftung aller Kartons",
        "Inventarlisten für bessere Übersicht",
        "Auspacken in der neuen Wohnung"
      ],
      conclusion: "Vom Porzellan bis zum Gemälde - alles kommt sicher an."
    }
  }
};

export default function Home() {
  const [selectedService, setSelectedService] = useState<keyof typeof serviceData | null>(null);

  const openServiceModal = (serviceId: keyof typeof serviceData) => {
    setSelectedService(serviceId);
  };

  const closeServiceModal = () => {
    setSelectedService(null);
  };

  const scrollToContact = () => {
    const element = document.getElementById("kontakt");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentServiceData = selectedService ? serviceData[selectedService] : null;

  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />

      {/* About Section */}
      <section id="about" className="py-24 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">
                Walter Braun Umzüge – Ihr Münchner Umzugsspezialist
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Als echtes Münchner Familienunternehmen kennen wir die Stadt wie unsere Westentasche. 
                Seit über 10 Jahren helfen wir Münchnern und Neubürgern beim Umzug – von Schwabing bis Sendling, 
                von der Maxvorstadt bis nach Bogenhausen. Unser Team von über 30 erfahrenen Umzugshelfern 
                sorgt dafür, dass Ihr Umzug in der bayerischen Landeshauptstadt reibungslos verläuft.
              </p>

              {/* Key advantages */}
              <div className="grid sm:grid-cols-2 gap-6 mb-10">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-medal text-primary text-lg"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">München-Experten</h4>
                    <p className="text-gray-600 text-sm">Wir kennen jeden Stadtteil</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-clock text-primary text-lg"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">24h Erreichbarkeit</h4>
                    <p className="text-gray-600 text-sm">Auch am Wochenende für Sie da</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-shield-alt text-primary text-lg"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Vollversicherung</h4>
                    <p className="text-gray-600 text-sm">Umfassender Schutz Ihres Hab und Guts</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-handshake text-primary text-lg"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Faire Preise</h4>
                    <p className="text-gray-600 text-sm">Transparente Kosten, keine Überraschungen</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:089123456789"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold text-lg text-center transition-all transform hover:scale-105 premium-shadow"
                >
                  <i className="fas fa-phone mr-3"></i>089 123 456 789
                </a>
                <a
                  href="tel:0176724883"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-4 rounded-xl font-bold text-lg text-center transition-all hover:scale-105"
                >
                  <i className="fas fa-mobile-alt mr-3"></i>0176 724 883 32
                </a>
              </div>
            </div>
            
            <div className="relative">
              {/* Floating elements around image */}
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-primary/10 rounded-full floating-element" />
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/5 rounded-full floating-element" style={{animationDelay: '2s'}} />
              
              <div className="relative premium-shadow rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Walter Braun Umzüge Team"
                  className="w-full h-auto"
                />
                {/* Overlay with company info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
                  <div className="text-white">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400 mr-3">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                      <span className="font-bold">4.9/5</span>
                    </div>
                    <p className="text-sm opacity-90">Über 500 zufriedene Kunden in München</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promise Section */}
      <section id="versprechen" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Unser Versprechen</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Verlässlichkeit, Kompetenz und Professionalität – Wir garantieren Ihnen einen sicheren, schnellen und stressfreien Umzug!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-accent rounded-xl animate-fade-in">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Zuverlässig</h3>
              <p className="text-gray-600">
                Zuverlässigkeit steht bei uns an erster Stelle – Ihr Umzug wird sicher und termingerecht durchgeführt.
              </p>
            </div>

            <div className="text-center p-6 bg-accent rounded-xl animate-fade-in">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-graduation-cap text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Kompetent</h3>
              <p className="text-gray-600">
                Durch jahrelange Erfahrung und Fachwissen garantieren wir Ihnen einen reibungslosen Umzug.
              </p>
            </div>

            <div className="text-center p-6 bg-accent rounded-xl animate-fade-in">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-star text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Professionell</h3>
              <p className="text-gray-600">
                Unser Team arbeitet präzise und mit höchster Sorgfalt, um Ihren Umzug effizient und stressfrei zu gestalten.
              </p>
            </div>

            <div className="text-center p-6 bg-accent rounded-xl animate-fade-in">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-umbrella text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Versichert</h3>
              <p className="text-gray-600">
                Ihre Sicherheit ist unser Anliegen – selbstverständlich sind Ihr Hab und Gut bei uns rundum versichert.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="leistungen" className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Unsere Leistungen in München</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Ob Privatumzug in Schwabing oder Firmenumzug in der Maxvorstadt – wir kennen München und 
              bieten Ihnen den passenden Service für jeden Stadtteil
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              className="group bg-white rounded-2xl premium-shadow p-8 cursor-pointer hover-lift transition-all duration-500 border border-gray-100"
              onClick={() => openServiceModal('privatumzuege')}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                  <i className="fas fa-home text-white text-2xl"></i>
                </div>
                <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-arrow-right text-xl"></i>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Privatumzüge</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Professionelle Privatumzüge mit Rundumservice – von der Planung bis zur Einrichtung in Ihrem neuen Zuhause.
              </p>
              <div className="flex items-center text-primary font-bold group-hover:text-primary/80 transition-colors">
                <span>Mehr erfahren</span>
                <i className="fas fa-chevron-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>

            <div
              className="group bg-white rounded-2xl premium-shadow p-8 cursor-pointer hover-lift transition-all duration-500 border border-gray-100"
              onClick={() => openServiceModal('seniorenumzuege')}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                  <i className="fas fa-heart text-white text-2xl"></i>
                </div>
                <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-arrow-right text-xl"></i>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Seniorenumzüge</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Einfühlsamer Service für Senioren mit besonderer Aufmerksamkeit und individueller Betreuung.
              </p>
              <div className="flex items-center text-primary font-bold group-hover:text-primary/80 transition-colors">
                <span>Mehr erfahren</span>
                <i className="fas fa-chevron-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>

            <div
              className="group bg-white rounded-2xl premium-shadow p-8 cursor-pointer hover-lift transition-all duration-500 border border-gray-100"
              onClick={() => openServiceModal('auslandsumzuege')}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                  <i className="fas fa-globe text-white text-2xl"></i>
                </div>
                <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-arrow-right text-xl"></i>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Auslandsumzüge</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Internationale Umzüge weltweit mit kompletter Abwicklung aller Formalitäten und Zollbestimmungen.
              </p>
              <div className="flex items-center text-primary font-bold group-hover:text-primary/80 transition-colors">
                <span>Mehr erfahren</span>
                <i className="fas fa-chevron-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>

            <div
              className="group bg-white rounded-2xl premium-shadow p-8 cursor-pointer hover-lift transition-all duration-500 border border-gray-100"
              onClick={() => openServiceModal('betriebsumzuege')}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                  <i className="fas fa-building text-white text-2xl"></i>
                </div>
                <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-arrow-right text-xl"></i>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Betriebsumzüge</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Geschäftsumzüge mit minimaler Ausfallzeit und professionellem Projektmanagement für Ihr Unternehmen.
              </p>
              <div className="flex items-center text-primary font-bold group-hover:text-primary/80 transition-colors">
                <span>Mehr erfahren</span>
                <i className="fas fa-chevron-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>

            <div
              className="group bg-white rounded-2xl premium-shadow p-8 cursor-pointer hover-lift transition-all duration-500 border border-gray-100"
              onClick={() => openServiceModal('kuechenmontagen')}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                  <i className="fas fa-utensils text-white text-2xl"></i>
                </div>
                <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-arrow-right text-xl"></i>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Küchenmontagen</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Fachgerechte Küchenmontage mit allen Anschlüssen und individuellen Anpassungen durch Experten.
              </p>
              <div className="flex items-center text-primary font-bold group-hover:text-primary/80 transition-colors">
                <span>Mehr erfahren</span>
                <i className="fas fa-chevron-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>

            <div
              className="group bg-white rounded-2xl premium-shadow p-8 cursor-pointer hover-lift transition-all duration-500 border border-gray-100"
              onClick={() => openServiceModal('packservice')}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                  <i className="fas fa-box text-white text-2xl"></i>
                </div>
                <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-arrow-right text-xl"></i>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Packservice</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Professionelles Verpacken mit hochwertigen Materialien für optimalen Schutz aller Gegenstände.
              </p>
              <div className="flex items-center text-primary font-bold group-hover:text-primary/80 transition-colors">
                <span>Mehr erfahren</span>
                <i className="fas fa-chevron-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Zusatzleistungen</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Mit unserem umfangreichen Zusatzleistungen stellen wir sicher, dass Ihr Umzug nicht nur schnell, sondern auch komfortabel und ganz nach Ihren Wünschen verläuft!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg animate-fade-in">
              <i className="fas fa-ban text-primary text-2xl mr-4"></i>
              <span className="font-medium text-gray-900">Einrichtung von Halteverbotszonen</span>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg animate-fade-in">
              <i className="fas fa-tools text-primary text-2xl mr-4"></i>
              <span className="font-medium text-gray-900">Küchenmontage inkl. Anpassung</span>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg animate-fade-in">
              <i className="fas fa-clipboard-list text-primary text-2xl mr-4"></i>
              <span className="font-medium text-gray-900">Ummeldeservice bei Behörden</span>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg animate-fade-in">
              <i className="fas fa-boxes text-primary text-2xl mr-4"></i>
              <span className="font-medium text-gray-900">Bereitstellung von Packmaterial</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="bewertungen" className="py-24 bg-gradient-to-br from-primary/5 to-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary rounded-full blur-2xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Was unsere Münchner Kunden sagen</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Über 500 zufriedene Kunden aus München und Umgebung vertrauen bereits auf Walter Braun Umzüge. 
              Lesen Sie echte Bewertungen von Ihren Nachbarn aus Schwabing, Maxvorstadt, Sendling und ganz München.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-16">
            <div className="premium-card rounded-2xl p-8 hover-lift">
              <div className="flex items-center justify-between mb-6">
                <div className="flex text-yellow-400 text-lg">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <div className="text-sm text-gray-500 font-medium">Google Bewertung</div>
              </div>
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "Als Münchnerin war mir wichtig, dass die Umzugsfirma unsere Stadt kennt. Walter Braun Umzüge hat das perfekt gemacht - vom Englischen Garten bis zu unserer neuen Wohnung in Schwabing. Einfach top!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">Tatjana Müller</div>
                  <div className="text-gray-600 text-sm">Privatumzug von Maxvorstadt nach Schwabing</div>
                </div>
              </div>
            </div>

            <div className="premium-card rounded-2xl p-8 hover-lift">
              <div className="flex items-center justify-between mb-6">
                <div className="flex text-yellow-400 text-lg">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <div className="text-sm text-gray-500 font-medium">Google Bewertung</div>
              </div>
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "Unser Büroumzug von der Maxvorstadt nach Bogenhausen war dank Walter Braun problemlos. Die kennen sich in München richtig gut aus und wussten sofort, wo sie parken können. Sehr zu empfehlen!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">Stefan Huber</div>
                  <div className="text-gray-600 text-sm">Büroumzug von Maxvorstadt nach Bogenhausen</div>
                </div>
              </div>
            </div>

            <div className="premium-card rounded-2xl p-8 hover-lift">
              <div className="flex items-center justify-between mb-6">
                <div className="flex text-yellow-400 text-lg">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <div className="text-sm text-gray-500 font-medium">Google Bewertung</div>
              </div>
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "Nach 40 Jahren in Sendling sind wir ins Lehel gezogen. Walter Braun hat uns dabei geholfen - sehr respektvoll und geduldig. So stellt man sich einen Münchner Familienbetrieb vor!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">Maria Wegner</div>
                  <div className="text-gray-600 text-sm">Seniorenumzug von Sendling ins Lehel</div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="bg-white rounded-2xl premium-shadow p-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-black text-primary mb-2">4.9/5</div>
                <div className="text-gray-600">Google Bewertung</div>
                <div className="flex justify-center text-yellow-400 mt-1">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
              </div>
              <div>
                <div className="text-4xl font-black text-primary mb-2">500+</div>
                <div className="text-gray-600">Zufriedene Kunden</div>
              </div>
              <div>
                <div className="text-4xl font-black text-primary mb-2">98%</div>
                <div className="text-gray-600">Weiterempfehlungen</div>
              </div>
              <div>
                <div className="text-4xl font-black text-primary mb-2">10+</div>
                <div className="text-gray-600">Jahre Erfahrung</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing/Offers */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Unsere Angebote</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Attraktive Angebote für jeden Umzug – Profitieren Sie von fairen Preisen und auf Sie maßgeschneiderte Lösungen!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-accent rounded-xl p-8 text-center animate-fade-in">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Kostenlose Beratung</h3>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <i className="fas fa-check text-primary mr-3"></i>
                  <span>Unverbindliches Angebot</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-primary mr-3"></i>
                  <span>Festpreis-Garantie</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-primary mr-3"></i>
                  <span>Angebot innerhalb von 24 Stunden</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-primary mr-3"></i>
                  <span>Ersteinschätzung vor Ort</span>
                </li>
              </ul>
              <Button 
                onClick={scrollToContact}
                className="w-full bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Jetzt anfragen
              </Button>
            </div>

            <div className="bg-gray-900 text-white rounded-xl p-8 text-center relative overflow-hidden animate-fade-in">
              <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                Jetzt neu
              </div>
              <h3 className="text-2xl font-bold mb-4">Finanzierung</h3>
              <div className="text-4xl font-bold text-primary mb-2">ab 3,99%</div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <i className="fas fa-check text-primary mr-3"></i>
                  <span>Bequem später bezahlen</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-primary mr-3"></i>
                  <span>Wir organisieren die Finanzierung</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-primary mr-3"></i>
                  <span>Mehr Budget für Ihren Neuanfang</span>
                </li>
              </ul>
              <Button 
                onClick={scrollToContact}
                className="w-full bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Jetzt anfragen
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Unsere Galerie</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Einblicke in unsere Arbeit – zuverlässig, sorgfältig und engagiert.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
              alt="Moving truck"
              className="rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer animate-fade-in"
            />
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
              alt="Moving team"
              className="rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer animate-fade-in"
            />
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
              alt="Packed boxes"
              className="rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer animate-fade-in"
            />
            <img
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
              alt="Truck loading"
              className="rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer animate-fade-in"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontakt" className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Kontakt zu Ihrem Münchner Umzugspartner</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Rufen Sie uns an für eine kostenlose Beratung. Als Münchner Unternehmen kennen wir jeden Stadtteil 
              und helfen Ihnen gerne bei der Planung Ihres Umzugs.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Sofort erreichbar</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mr-6 flex-shrink-0">
                      <i className="fas fa-phone text-white text-xl"></i>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 mb-2">Telefon (24/7 Hotline)</div>
                      <a 
                        href="tel:089123456789" 
                        className="text-2xl font-black text-primary hover:text-primary/80 transition-colors block mb-1"
                      >
                        089 123 456 789
                      </a>
                      <div className="text-gray-600 text-sm">Kostenlose Beratung & Notfall-Hotline</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mr-6 flex-shrink-0">
                      <i className="fas fa-mobile-alt text-white text-xl"></i>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 mb-2">Mobil</div>
                      <a 
                        href="tel:0176724883" 
                        className="text-xl font-bold text-primary hover:text-primary/80 transition-colors block mb-1"
                      >
                        0176 724 883 32
                      </a>
                      <div className="text-gray-600 text-sm">WhatsApp & SMS möglich</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mr-6 flex-shrink-0">
                      <i className="fas fa-envelope text-white text-xl"></i>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 mb-2">E-Mail</div>
                      <a 
                        href="mailto:info@walterbraun-umzuege.de" 
                        className="text-primary hover:text-primary/80 transition-colors font-semibold"
                      >
                        info@walterbraun-umzuege.de
                      </a>
                      <div className="text-gray-600 text-sm">Antwort binnen 2 Stunden</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mr-6 flex-shrink-0">
                      <i className="fas fa-map-marker-alt text-white text-xl"></i>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 mb-2">Standort München</div>
                      <div className="text-gray-700 font-medium">
                        Maximilianstraße 35<br />
                        80539 München (Lehel)
                      </div>
                      <div className="text-gray-600 text-sm mt-1">Kostenlose Vor-Ort-Termine in ganz München</div>
                    </div>
                  </div>
                </div>

                {/* Service times */}
                <div className="bg-primary/10 rounded-xl p-6 mt-8">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                    <i className="fas fa-clock text-primary mr-2"></i>
                    Servicezeiten
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <div className="font-medium">Mo-Fr:</div>
                      <div>07:00 - 20:00 Uhr</div>
                    </div>
                    <div>
                      <div className="font-medium">Sa-So:</div>
                      <div>08:00 - 18:00 Uhr</div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="font-medium text-primary">24/7 Notfall-Hotline verfügbar</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="premium-card p-8">
              <ContactForm />
            </div>
          </div>

          {/* Quick action CTA */}
          <div className="text-center mt-20">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sofortiger Rückruf gewünscht?</h3>
              <p className="text-gray-600 mb-6">
                Hinterlassen Sie uns Ihre Nummer und wir rufen Sie innerhalb von 15 Minuten zurück!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:089123456789"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 premium-shadow"
                >
                  <i className="fas fa-phone mr-3"></i>089 123 456 789
                </a>
                <button
                  onClick={scrollToContact}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
                >
                  <i className="fas fa-envelope mr-3"></i>Nachricht senden
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Walter Braun Umzüge</h3>
              <p className="text-gray-400 mb-4">
                Ihr zuverlässiger Partner für professionelle Umzüge in München und Umgebung.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-white transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => document.getElementById('leistungen')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-white transition-colors"
                  >
                    Leistungen
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => document.getElementById('versprechen')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-white transition-colors"
                  >
                    Unser Versprechen
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => document.getElementById('bewertungen')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-white transition-colors"
                  >
                    Bewertungen
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-white transition-colors"
                  >
                    Kontakt
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Rechtliches</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Impressum
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Datenschutz
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie-Richtlinie (EU)
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Walter Braun Umzüge. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>

      {/* Service Modal */}
      <ServiceModal
        isOpen={selectedService !== null}
        onClose={closeServiceModal}
        serviceData={currentServiceData}
      />
      
      <WhatsAppButton />
    </div>
  );
}
