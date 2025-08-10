import { useState } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ServiceModal from "@/components/service-modal";
import ContactForm from "@/components/contact-form";
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
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Wir sind Walter Braun Umzüge aus München
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Ihr Umzugs-Experte für einen schnellen, sicheren und stressfreien Umzug im Großraum München und Umgebung – mit jahrelanger Erfahrung und einem Team, auf das Sie sich verlassen können.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:089123456789"
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors"
                >
                  <i className="fas fa-phone mr-2"></i>089 123 456 789
                </a>
                <a
                  href="tel:0176724883"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold text-center transition-colors"
                >
                  <i className="fas fa-mobile-alt mr-2"></i>0176 724 883 32
                </a>
              </div>
            </div>
            <div className="relative animate-slide-in">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Professional moving team"
                className="rounded-xl shadow-lg w-full h-auto"
              />
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
      <section id="leistungen" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Unsere Leistungen</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Vielfältige Services für Ihren stressfreien Umzug – Entdecken Sie, wie wir Ihnen mit maßgeschneiderten Lösungen in jeder Phase des Umzugsprozesses zur Seite stehen!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow animate-fade-in"
              onClick={() => openServiceModal('privatumzuege')}
            >
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-home text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Privatumzüge</h3>
              <p className="text-gray-600 mb-4">
                Wir bringen Sie sicher und stressfrei in Ihr neues Zuhause – mit Erfahrung und Sorgfalt.
              </p>
              <span className="text-primary font-medium">Mehr erfahren →</span>
            </div>

            <div
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow animate-fade-in"
              onClick={() => openServiceModal('seniorenumzuege')}
            >
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-heart text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Seniorenumzüge</h3>
              <p className="text-gray-600 mb-4">
                Einfühlsame Unterstützung für Senioren – zuverlässig, geduldig und individuell angepasst.
              </p>
              <span className="text-primary font-medium">Mehr erfahren →</span>
            </div>

            <div
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow animate-fade-in"
              onClick={() => openServiceModal('auslandsumzuege')}
            >
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-globe text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Auslandsumzüge</h3>
              <p className="text-gray-600 mb-4">
                Ob Europa oder weltweit – wir organisieren Ihren Umzug ins Ausland professionell und sicher.
              </p>
              <span className="text-primary font-medium">Mehr erfahren →</span>
            </div>

            <div
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow animate-fade-in"
              onClick={() => openServiceModal('betriebsumzuege')}
            >
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-building text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Betriebsumzüge</h3>
              <p className="text-gray-600 mb-4">
                Effizienter Standortwechsel für Ihr Unternehmen – schnell, geplant und mit minimalem Stillstand.
              </p>
              <span className="text-primary font-medium">Mehr erfahren →</span>
            </div>

            <div
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow animate-fade-in"
              onClick={() => openServiceModal('kuechenmontagen')}
            >
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-utensils text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Küchenmontagen</h3>
              <p className="text-gray-600 mb-4">
                Ihre Küche in besten Händen – präziser Aufbau inklusive aller Anschlüsse und Anpassungen.
              </p>
              <span className="text-primary font-medium">Mehr erfahren →</span>
            </div>

            <div
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow animate-fade-in"
              onClick={() => openServiceModal('packservice')}
            >
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-box text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Packservice</h3>
              <p className="text-gray-600 mb-4">
                Unser Team verpackt alles sorgfältig – von Glas bis Kleidung, für optimalen Schutz beim Transport.
              </p>
              <span className="text-primary font-medium">Mehr erfahren →</span>
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
      <section id="bewertungen" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Was unsere Kunden sagen</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Erfahrungen, die überzeugen – Unsere Kunden berichten von reibungslosen Umzügen und exzellentem Service!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Der Umzug hat perfekt geklappt. Die erste Beratung vor Ort verlief sehr professionell und das Angebot kam auch prompt. Sogar kleine Änderungen wurden sofort umgesetzt. Die Mitarbeiter waren sehr schnell und nett. Danke nochmals für Alles. Ich werde euch nochmals beauftragen und weiterempfehlen."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold">T</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Tatjana</div>
                  <div className="text-gray-500 text-sm">Zufriedene Kundin</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Wir hatten einen kurzfristigen Termin für einen Umzug benötigt. Wir bekamen innerhalb von nicht einmal 24 Stunden ein Angebot und eine Terminzusage von Herrn Bakhat. Das Umzugsteam kam am angegebenen Tag auf die Minute pünktlich. Alle waren freundlich und haben sehr sorgfältig und gewissenhaft gearbeitet."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold">S</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Shazeb</div>
                  <div className="text-gray-500 text-sm">Zufriedener Kunde</div>
                </div>
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
              className="rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer animate-fade-in"
            />
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
              alt="Moving team"
              className="rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer animate-fade-in"
            />
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
              alt="Packed boxes"
              className="rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer animate-fade-in"
            />
            <img
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
              alt="Truck loading"
              className="rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer animate-fade-in"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontakt" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Wir freuen uns auf Sie!</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kontaktieren Sie uns noch heute – Wir freuen und darauf, Ihren Umzug gemeinsam zu gestalten!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <ContactForm />

            <div className="space-y-8 animate-slide-in">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Kontaktinformationen</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <i className="fas fa-map-marker-alt text-primary text-xl mr-4"></i>
                    <div>
                      <div className="font-semibold">Walter Braun Umzüge</div>
                      <div className="text-gray-600">Friedrichstraße 15</div>
                      <div className="text-gray-600">80801 München</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-phone text-primary text-xl mr-4"></i>
                    <div>
                      <div className="font-semibold">089 123 456 789</div>
                      <div className="text-gray-600">Festnetz</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-mobile-alt text-primary text-xl mr-4"></i>
                    <div>
                      <div className="font-semibold">0176 724 883 32</div>
                      <div className="text-gray-600">Mobil</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-envelope text-primary text-xl mr-4"></i>
                    <div>
                      <div className="font-semibold">info@walterbraun-umzuege.de</div>
                      <div className="text-gray-600">E-Mail</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-accent rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-3">Mit uns kann Ihr Umzug starten!</h4>
                <p className="text-gray-700 mb-4">Jetzt kostenlose Beratung sichern</p>
                <div className="flex space-x-3">
                  <a
                    href="tel:089123456789"
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                  >
                    Jetzt anrufen
                  </a>
                  <Button 
                    onClick={scrollToContact}
                    variant="outline"
                    className="px-4 py-2 rounded-lg font-medium text-sm"
                  >
                    Kontaktieren
                  </Button>
                </div>
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
    </div>
  );
}
