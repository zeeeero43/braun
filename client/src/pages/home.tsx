import { useState } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ServiceModal from "@/components/service-modal";
import ContactForm from "@/components/contact-form";
import { WhatsAppButton } from "@/components/whatsapp-button";
import SEOHead from "@/components/seo/SEOHead";
import { useLocalBusinessData, generateServiceData } from "@/hooks/useSEOData";
import CookieSettingsButton from "@/components/cookies/CookieSettingsButton";
import GoogleAnalytics from "@/components/tracking/GoogleAnalytics";
import { GoogleAdsTracking } from "@/components/tracking/GoogleAdsTracking";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import teamImage from "@assets/thumbnail_e11700c1-5142-4f7b-8f62-807fe02e071b_1755077031397.jpg";
import privatumzugImage from "@assets/2023-07-27_1755077342023.jpg";
import seniorenumzugImage from "@assets/unnamed-1_1755077356462.jpg";
import auslandsumzugImage from "@assets/2021-06-23_1755077360027.jpg";
import betriebsumzugImage from "@assets/2021-08-13_1755077362163.png";
import kuechenmontageImage from "@assets/unnamed_1755077371522.jpg";
import packserviceImage from "@assets/2022-03-28_1755077399829.jpg";
import aussenliftImage from "@assets/aefaf4fa-369d-4c3b-9ba1-0a3b0f6144f6_1755077509608.jpg";
import reinigungsserviceImage from "@assets/2024-08-31_1755077523161.jpg";
import fernumzugImage from "@assets/59583961_321381941866855_1669204933255102464_n_1755077524189.jpg";

// Gallery images
import galleryImage1 from "@assets/8_1755077937605.jpg";
import galleryImage2 from "@assets/ae4614aa-b3c2-4b72-8a26-7d2528c28e83_1755077937606.jpg";
import galleryImage3 from "@assets/27459102_147389329266118_607708021338560030_n_1755077937606.jpg";
import galleryImage4 from "@assets/28276564_153167118688339_1068416866353772404_n-768x576_1755077937606.jpg";
import galleryImage5 from "@assets/41189652_235929070412143_3304318215705853952_n-768x576_1755077937606.jpg";
import galleryImage6 from "@assets/125871041_656268951711484_3371757372491177057_n-768x512_1755077937607.jpg";
import galleryImage7 from "@assets/99110162_535785393759841_2524991202936225792_n_1755077937607.jpg";
import galleryImage8 from "@assets/95261886_525075114830869_4587058946535063552_n_1755077937607.jpg";
import galleryImage9 from "@assets/68633255_369632753708440_3752478429337878528_n-1_1755077937607.jpg";
import galleryImage10 from "@assets/41151240_235929160412134_7878053271745593344_n_1755077937607.jpg";
import galleryImage11 from "@assets/36389662_188401921831525_4590750110148722688_n-768x576_1755077937608.jpg";
import galleryImage12 from "@assets/26112442_140449393293445_3251922422130636002_n_1755077937608.jpg";
import galleryImage13 from "@assets/26904309_143902312948153_7314531890056851375_n_1755077937608.jpg";
import galleryImage14 from "@assets/5_1755077937608.jpg";
import galleryImage15 from "@assets/2_1755077937608.jpg";
import galleryImage16 from "@assets/4_1755077937608.jpg";

// Partner logos and certifications
import check24Badge from "@assets/55ac899c-0579-4f91-b6fb-cebed1f32ac3_1755078266605.jpg";
import immoScout24Cert from "@assets/immo24-687x1024_1755078266606.jpg";
import immoScout24Logo from "@assets/IMMO-300x149_1755078266606.png";
import bglLogo from "@assets/Bundesverband-300x150_1755078266606.png";
import amoLogo from "@assets/AMO_1755078266606.png";

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
    title: "Küchen- / Möbelmontagen",
    content: {
      description: "Küchen und Möbel sind das Herzstück jeden Zuhauses. Unsere Experten sorgen für fachgerechte Montage und Anschlüsse.",
      details: [
        "Professionelle Demontage der alten Küche und Möbel",
        "Fachgerechte Installation und Montage",
        "Anschluss aller Elektrogeräte und Beleuchtung",
        "Wasser- und Gasanschlüsse für Küchen",
        "Individuelle Anpassungen durch Schreiner"
      ],
      conclusion: "Von der ersten Schraube bis zum letzten Anschluss - Küchen und Möbel aus einer Hand."
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
  },
  aussenlift: {
    title: "Außenlift",
    content: {
      description: "Professioneller Außenlift-Service für mühelose Umzüge in höhere Stockwerke ohne Treppenhaus.",
      details: [
        "Moderne Außenlift-Fahrzeuge mit bis zu 30m Reichweite",
        "Sicherer Transport schwerer Möbel und Geräte",
        "Schnelle Abwicklung ohne Treppenhaus-Transport",
        "Schutz der Hausfassade und Umgebung",
        "Koordination mit Hausverwaltung und Behörden"
      ],
      conclusion: "Schwere Lasten sicher und effizient in jedes Stockwerk - ohne Stress für Mensch und Mobiliar."
    }
  },
  reinigungsservice: {
    title: "Reinigungsservice",
    content: {
      description: "Komplette Reinigung der alten und neuen Wohnung für eine stressfreie Wohnungsübergabe.",
      details: [
        "Grundreinigung der alten Wohnung nach Auszug",
        "Endreinigung für Kaution-Rückgabe",
        "Renovierungsreinigung nach Handwerkerarbeiten",
        "Fensterreinigung innen und außen",
        "Teppich- und Polsterreinigung"
      ],
      conclusion: "Übergeben Sie makellos saubere Wohnungen und erhalten garantiert Ihre Kaution zurück."
    }
  },
  fernumzuege: {
    title: "Fernumzüge",
    content: {
      description: "Deutschlandweite Fernumzüge mit sicherem Transport und termingerechter Lieferung.",
      details: [
        "Umzüge in ganz Deutschland und Europa",
        "Zwischenlagerung bei Bedarf möglich",
        "GPS-Tracking für transparenten Transport",
        "Festpreise ohne versteckte Kosten",
        "Koordination von Übergabe- und Abholterminen"
      ],
      conclusion: "Ob Hamburg, Berlin oder Stuttgart - wir bringen Sie sicher überall hin."
    }
  }
};

export default function Home() {
  const [selectedService, setSelectedService] = useState<keyof typeof serviceData | null>(null);
  const { data: localBusinessData } = useLocalBusinessData();

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

  const homeStructuredData = [
    localBusinessData,
    generateServiceData(),
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Walter Braun Umzüge",
      "url": "https://walterbraun-muenchen.de",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://walterbraun-muenchen.de/blog?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    }
  ].filter(Boolean);

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Walter Braun Umzüge München - Ihr Profi für stressfreie Umzüge"
        description="Professionelle Umzugsdienstleistungen in München & Bayern. ✓ Privatumzug ✓ Firmenumzug ✓ Packservice ✓ CHECK24 Top Profi 2025. Jetzt kostenlos anfragen!"
        keywords={[
          "Umzug München", "Umzugsfirma München", "Umzugsunternehmen Bayern", 
          "Privatumzug", "Firmenumzug", "Packservice München", "Entrümpelung München",
          "Umzugsservice", "CHECK24 Top Profi", "ImmoScout24 Partner"
        ]}
        url="https://walterbraun-muenchen.de"
        type="local_business"
        structuredData={homeStructuredData}
      />
      <Navigation />
      <HeroSection />

      {/* Certifications & Partners Section */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Zertifizierungen & Mitgliedschaften</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Geprüfte Qualität und professionelle Standards durch anerkannte Branchenverbände
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
            <div className="bg-white rounded-lg p-4 flex items-center justify-center hover:shadow-lg transition-shadow">
              <img
                src={check24Badge}
                alt="CHECK24 Top Profi 2025"
                className="max-h-20 w-auto"
              />
            </div>
            
            <div className="bg-white rounded-lg p-4 flex items-center justify-center hover:shadow-lg transition-shadow">
              <img
                src={immoScout24Cert}
                alt="ImmoScout24 Top Umzugsvermittler"
                className="max-h-24 w-auto"
              />
            </div>
            
            <div className="bg-white rounded-lg p-4 flex items-center justify-center hover:shadow-lg transition-shadow">
              <img
                src={immoScout24Logo}
                alt="ImmobilienScout24 Partner"
                className="max-h-16 w-auto"
              />
            </div>
            
            <div className="bg-white rounded-lg p-4 flex items-center justify-center hover:shadow-lg transition-shadow">
              <img
                src={bglLogo}
                alt="BGL - Bundesverband Güterkraftverkehr Logistik und Entsorgung"
                className="max-h-16 w-auto"
              />
            </div>
            
            <div className="bg-white rounded-lg p-4 flex items-center justify-center hover:shadow-lg transition-shadow">
              <img
                src={amoLogo}
                alt="AMÖ - Bundesverband Möbelspedition und Logistik"
                className="max-h-20 w-auto"
              />
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Qualität und Sicherheit durch geprüfte Branchenstandards
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 lg:mb-8 leading-tight">
                Walter Braun Umzüge – Ihr Münchner Umzugsspezialist
              </h2>
              
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 lg:mb-8 leading-relaxed">
                Als echtes Münchner Familienunternehmen kennen wir die Stadt wie unsere Westentasche. 
                Seit über 10 Jahren helfen wir Münchnern und Neubürgern beim Umzug – von Schwabing bis Sendling, 
                von der Maxvorstadt bis nach Bogenhausen. Unser Team von über 30 erfahrenen Umzugshelfern 
                sorgt dafür, dass Ihr Umzug in der bayerischen Landeshauptstadt reibungslos verläuft.
              </p>

              {/* Key advantages */}
              <div className="grid sm:grid-cols-2 gap-4 lg:gap-6 mb-8 lg:mb-10">
                <div className="flex items-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <i className="fas fa-medal text-primary text-sm sm:text-lg"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">München-Experten</h4>
                    <p className="text-gray-600 text-xs sm:text-sm">Wir kennen jeden Stadtteil</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <i className="fas fa-clock text-primary text-sm sm:text-lg"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Persönlicher Ansprechpartner</h4>
                    <p className="text-gray-600 text-xs sm:text-sm">Individuelle Beratung für Ihren Umzug</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <i className="fas fa-shield-alt text-primary text-sm sm:text-lg"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Vollversicherung</h4>
                    <p className="text-gray-600 text-xs sm:text-sm">Umfassender Schutz Ihres Hab und Guts</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <i className="fas fa-handshake text-primary text-sm sm:text-lg"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Faire Preise</h4>
                    <p className="text-gray-600 text-xs sm:text-sm">Transparente Kosten, keine Überraschungen</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                <a
                  href="tel:+4980067637558"
                  className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg text-center transition-all transform hover:scale-105 premium-shadow"
                >
                  <i className="fas fa-phone mr-2 sm:mr-3"></i>+49800 67 63 755
                </a>
                <a
                  href="tel:+491743861652"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg text-center transition-all hover:scale-105"
                >
                  <i className="fas fa-mobile-alt mr-2 sm:mr-3"></i>+49 174 3861652
                </a>
              </div>
              
              <div className="text-center">
                <Link href="/blog">
                  <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
                    <i className="fas fa-book mr-3"></i>
                    Umzugstipps & Ratgeber
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              {/* Floating elements around image */}
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-primary/10 rounded-full floating-element" />
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/5 rounded-full floating-element" style={{animationDelay: '2s'}} />
              
              <div className="relative premium-shadow rounded-2xl overflow-hidden">
                <img
                  src={teamImage}
                  alt="Walter Braun Umzüge Team - Professionelle Umzugshelfer"
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
      <section id="versprechen" className="py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Unser Versprechen</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Verlässlichkeit, Kompetenz und Professionalität – Wir garantieren Ihnen einen sicheren, schnellen und stressfreien Umzug!
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="text-center p-4 sm:p-6 bg-accent rounded-xl animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <i className="fas fa-shield-alt text-white text-lg sm:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Zuverlässig</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Zuverlässigkeit steht bei uns an erster Stelle – Ihr Umzug wird sicher und termingerecht durchgeführt.
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 bg-accent rounded-xl animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <i className="fas fa-graduation-cap text-white text-lg sm:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Kompetent</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Durch jahrelange Erfahrung und Fachwissen garantieren wir Ihnen einen reibungslosen Umzug.
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 bg-accent rounded-xl animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <i className="fas fa-star text-white text-lg sm:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Professionell</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Unser Team arbeitet präzise und mit höchster Sorgfalt, um Ihren Umzug effizient und stressfrei zu gestalten.
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 bg-accent rounded-xl animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <i className="fas fa-umbrella text-white text-lg sm:text-2xl"></i>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Versichert</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Ihre Sicherheit ist unser Anliegen – selbstverständlich sind Ihr Hab und Gut bei uns rundum versichert.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="leistungen" className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 lg:mb-6">Unsere Leistungen in München</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Ob Privatumzug in Schwabing oder Firmenumzug in der Maxvorstadt – wir kennen München und 
              bieten Ihnen den passenden Service für jeden Stadtteil
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div
              className="group bg-white rounded-2xl premium-shadow cursor-pointer hover-lift transition-all duration-500 border border-gray-100 overflow-hidden animate-slide-up"
              onClick={() => openServiceModal('privatumzuege')}
              style={{animationDelay: '0.1s'}}
            >
              {/* Service Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5">
                <img
                  src={privatumzugImage}
                  alt="Walter Braun Umzüge Team"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-arrow-right text-xl bg-white rounded-full p-2 shadow-lg"></i>
                </div>
              </div>
              
              <div className="p-6 lg:p-8">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">Privatumzüge</h3>
                <p className="text-sm lg:text-base text-gray-600 mb-4 lg:mb-6 leading-relaxed">
                  Professionelle Privatumzüge mit Rundumservice – von der Planung bis zur Einrichtung in Ihrem neuen Zuhause.
                </p>
                <div className="flex items-center text-primary font-bold group-hover:text-primary/80 transition-colors">
                  <span className="text-sm lg:text-base">Mehr erfahren</span>
                  <i className="fas fa-chevron-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            </div>

            <div
              className="group bg-white rounded-2xl premium-shadow cursor-pointer hover-lift transition-all duration-500 border border-gray-100 overflow-hidden animate-slide-up"
              onClick={() => openServiceModal('seniorenumzuege')}
              style={{animationDelay: '0.2s'}}
            >
              {/* Service Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5">
                <img
                  src={seniorenumzugImage}
                  alt="Möbelmontage München"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-arrow-right text-xl bg-white rounded-full p-2 shadow-lg"></i>
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Seniorenumzüge</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Einfühlsamer Service für Senioren mit besonderer Aufmerksamkeit und individueller Betreuung.
                </p>
                <div className="flex items-center text-primary font-bold group-hover:text-primary/80 transition-colors">
                  <span>Mehr erfahren</span>
                  <i className="fas fa-chevron-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            </div>

            <div
              className="group bg-white rounded-2xl premium-shadow cursor-pointer hover-lift transition-all duration-500 border border-gray-100 overflow-hidden animate-slide-up"
              onClick={() => openServiceModal('auslandsumzuege')}
              style={{animationDelay: '0.3s'}}
            >
              {/* Service Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5">
                <img
                  src={auslandsumzugImage}
                  alt="Auslandsumzug München LKW"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-arrow-right text-xl bg-white rounded-full p-2 shadow-lg"></i>
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Auslandsumzüge</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Internationale Umzüge weltweit mit kompletter Abwicklung aller Formalitäten und Zollbestimmungen.
                </p>
                <div className="flex items-center text-primary font-bold group-hover:text-primary/80 transition-colors">
                  <span>Mehr erfahren</span>
                  <i className="fas fa-chevron-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            </div>

            <div
              className="group bg-white rounded-2xl premium-shadow cursor-pointer hover-lift transition-all duration-500 border border-gray-100 overflow-hidden"
              onClick={() => openServiceModal('betriebsumzuege')}
            >
              {/* Service Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5">
                <img
                  src={betriebsumzugImage}
                  alt="Betriebsumzug München Büro"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-arrow-right text-xl bg-white rounded-full p-2 shadow-lg"></i>
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Betriebsumzüge</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Geschäftsumzüge mit minimaler Ausfallzeit und professionellem Projektmanagement für Ihr Unternehmen.
                </p>
                <div className="flex items-center text-primary font-bold group-hover:text-primary/80 transition-colors">
                  <span>Mehr erfahren</span>
                  <i className="fas fa-chevron-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            </div>

            <div
              className="group bg-white rounded-2xl premium-shadow cursor-pointer hover-lift transition-all duration-500 border border-gray-100 overflow-hidden"
              onClick={() => openServiceModal('kuechenmontagen')}
            >
              {/* Service Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5">
                <img
                  src={kuechenmontageImage}
                  alt="Küchenmontage München"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-arrow-right text-xl bg-white rounded-full p-2 shadow-lg"></i>
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Küchen- /<br />Möbelmontagen</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Fachgerechte Küchen- und Möbelmontage mit allen Anschlüssen und individuellen Anpassungen durch Experten.
                </p>
                <div className="flex items-center text-primary font-bold group-hover:text-primary/80 transition-colors">
                  <span>Mehr erfahren</span>
                  <i className="fas fa-chevron-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            </div>

            <div
              className="group bg-white rounded-2xl premium-shadow cursor-pointer hover-lift transition-all duration-500 border border-gray-100 overflow-hidden"
              onClick={() => openServiceModal('packservice')}
            >
              {/* Service Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5">
                <img
                  src={packserviceImage}
                  alt="Packservice München Klavier"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-arrow-right text-xl bg-white rounded-full p-2 shadow-lg"></i>
                </div>
              </div>
              
              <div className="p-8">
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

            {/* New Service 7: Außenlift */}
            <div
              className="group bg-white rounded-2xl premium-shadow cursor-pointer hover-lift transition-all duration-500 border border-gray-100 overflow-hidden"
              onClick={() => openServiceModal('aussenlift')}
            >
              {/* Service Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5">
                <img
                  src={aussenliftImage}
                  alt="Außenlift München Umzug"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-arrow-right text-xl bg-white rounded-full p-2 shadow-lg"></i>
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Außenlift</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Professioneller Außenlift-Service für problemlose Umzüge in höhere Stockwerke ohne Treppenhaus.
                </p>
                <div className="flex items-center text-primary font-bold group-hover:text-primary/80 transition-colors">
                  <span>Mehr erfahren</span>
                  <i className="fas fa-chevron-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            </div>

            {/* New Service 8: Reinigungsservice */}
            <div
              className="group bg-white rounded-2xl premium-shadow cursor-pointer hover-lift transition-all duration-500 border border-gray-100 overflow-hidden"
              onClick={() => openServiceModal('reinigungsservice')}
            >
              {/* Service Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5">
                <img
                  src={reinigungsserviceImage}
                  alt="Reinigungsservice München"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-arrow-right text-xl bg-white rounded-full p-2 shadow-lg"></i>
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Reinigungsservice</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Komplette Reinigung der alten und neuen Wohnung für eine stressfreie Wohnungsübergabe.
                </p>
                <div className="flex items-center text-primary font-bold group-hover:text-primary/80 transition-colors">
                  <span>Mehr erfahren</span>
                  <i className="fas fa-chevron-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            </div>

            {/* New Service 9: Fernumzüge */}
            <div
              className="group bg-white rounded-2xl premium-shadow cursor-pointer hover-lift transition-all duration-500 border border-gray-100 overflow-hidden"
              onClick={() => openServiceModal('fernumzuege')}
            >
              {/* Service Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5">
                <img
                  src={fernumzugImage}
                  alt="Fernumzug München Deutschland"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-arrow-right text-xl bg-white rounded-full p-2 shadow-lg"></i>
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Fernumzüge</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Deutschlandweite Fernumzüge mit sicherem Transport und termingerechter Lieferung.
                </p>
                <div className="flex items-center text-primary font-bold group-hover:text-primary/80 transition-colors">
                  <span>Mehr erfahren</span>
                  <i className="fas fa-chevron-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
                </div>
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
          <div className="bg-white rounded-2xl premium-shadow p-6 lg:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 text-center">
              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary mb-1 lg:mb-2">4.9/5</div>
                <div className="text-xs sm:text-sm lg:text-base text-gray-600">Google Bewertung</div>
                <div className="flex justify-center text-yellow-400 mt-1 text-xs sm:text-sm">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary mb-1 lg:mb-2">500+</div>
                <div className="text-xs sm:text-sm lg:text-base text-gray-600">Zufriedene Kunden</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary mb-1 lg:mb-2">98%</div>
                <div className="text-xs sm:text-sm lg:text-base text-gray-600">Weiterempfehlungen</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary mb-1 lg:mb-2">10+</div>
                <div className="text-xs sm:text-sm lg:text-base text-gray-600">Jahre Erfahrung</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing/Offers */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Unsere Angebote</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Attraktive Angebote für jeden Umzug – Profitieren Sie von fairen Preisen und auf Sie maßgeschneiderte Lösungen!
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-accent rounded-xl p-6 lg:p-8 text-center animate-fade-in">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">Kostenlose Beratung</h3>
              <ul className="text-left space-y-2 lg:space-y-3 mb-6 lg:mb-8">
                <li className="flex items-center">
                  <i className="fas fa-check text-primary mr-2 lg:mr-3"></i>
                  <span className="text-sm lg:text-base">Unverbindliches Angebot</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-primary mr-2 lg:mr-3"></i>
                  <span className="text-sm lg:text-base">Festpreis-Garantie</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-primary mr-2 lg:mr-3"></i>
                  <span className="text-sm lg:text-base">Angebot innerhalb von 24 Stunden</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-primary mr-2 lg:mr-3"></i>
                  <span className="text-sm lg:text-base">Ersteinschätzung vor Ort</span>
                </li>
              </ul>
              <Button 
                onClick={scrollToContact}
                className="w-full bg-primary hover:bg-primary/90 text-white px-6 lg:px-8 py-3 rounded-lg font-semibold transition-colors text-sm lg:text-base"
              >
                Jetzt anfragen
              </Button>
            </div>

            <div className="bg-gray-900 text-white rounded-xl p-6 lg:p-8 text-center relative overflow-hidden animate-fade-in">
              <div className="absolute top-3 lg:top-4 right-3 lg:right-4 bg-primary text-white px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold">
                Jetzt neu
              </div>
              <h3 className="text-xl lg:text-2xl font-bold mb-4">Finanzierung</h3>
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">ab 3,99%</div>
              <ul className="text-left space-y-2 lg:space-y-3 mb-6 lg:mb-8">
                <li className="flex items-center">
                  <i className="fas fa-check text-primary mr-2 lg:mr-3"></i>
                  <span className="text-sm lg:text-base">Bequem später bezahlen</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-primary mr-2 lg:mr-3"></i>
                  <span className="text-sm lg:text-base">Wir organisieren die Finanzierung</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-primary mr-2 lg:mr-3"></i>
                  <span className="text-sm lg:text-base">Mehr Budget für Ihren Neuanfang</span>
                </li>
              </ul>
              <Button 
                onClick={scrollToContact}
                className="w-full bg-primary hover:bg-primary/90 text-white px-6 lg:px-8 py-3 rounded-lg font-semibold transition-colors text-sm lg:text-base"
              >
                Jetzt anfragen
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Unsere Galerie</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Einblicke in unsere tägliche Arbeit – authentische Fotos unserer Umzugsprojekte in München und Umgebung.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            <img
              src={galleryImage1}
              alt="Walter Braun Umzüge Team mit Fahrzeugen"
              className="rounded-xl shadow-lg hover:shadow-xl transition-shadow w-full h-48 sm:h-56 lg:h-64 object-cover animate-fade-in"
            />
            <img
              src={galleryImage2}
              alt="Professionelle Möbelverpackung"
              className="rounded-xl shadow-lg hover:shadow-xl transition-shadow w-full h-48 sm:h-56 lg:h-64 object-cover animate-fade-in"
            />
            <img
              src={galleryImage3}
              alt="Außenlift in München"
              className="rounded-xl shadow-lg hover:shadow-xl transition-shadow w-full h-48 sm:h-56 lg:h-64 object-cover animate-fade-in"
            />
            <img
              src={galleryImage4}
              alt="Winterumzug München"
              className="rounded-xl shadow-lg hover:shadow-xl transition-shadow w-full h-48 sm:h-56 lg:h-64 object-cover animate-fade-in"
            />
            <img
              src={galleryImage5}
              alt="Büromöbel Montage"
              className="rounded-xl shadow-lg hover:shadow-xl transition-shadow w-full h-48 sm:h-56 lg:h-64 object-cover animate-fade-in"
            />
            <img
              src={galleryImage6}
              alt="Spezial-Equipment für schwere Lasten"
              className="rounded-xl shadow-lg hover:shadow-xl transition-shadow w-full h-48 sm:h-56 lg:h-64 object-cover animate-fade-in"
            />
            <img
              src={galleryImage7}
              alt="Umzug in München Altstadt"
              className="rounded-xl shadow-lg hover:shadow-xl transition-shadow w-full h-48 sm:h-56 lg:h-64 object-cover animate-fade-in"
            />
            <img
              src={galleryImage8}
              alt="Sorgfältiger Möbeltransport"
              className="rounded-xl shadow-lg hover:shadow-xl transition-shadow w-full h-48 sm:h-56 lg:h-64 object-cover animate-fade-in"
            />
            <img
              src={galleryImage9}
              alt="Klaviertransport mit Spezialschutz"
              className="rounded-xl shadow-lg hover:shadow-xl transition-shadow w-full h-48 sm:h-56 lg:h-64 object-cover animate-fade-in"
            />
            <img
              src={galleryImage10}
              alt="LKW Beladung professionell"
              className="rounded-xl shadow-lg hover:shadow-xl transition-shadow w-full h-48 sm:h-56 lg:h-64 object-cover animate-fade-in"
            />
            <img
              src={galleryImage11}
              alt="Umzugskartons und Verpackungsmaterial"
              className="rounded-xl shadow-lg hover:shadow-xl transition-shadow w-full h-48 sm:h-56 lg:h-64 object-cover animate-fade-in"
            />
            <img
              src={galleryImage12}
              alt="Vermessung und Vorbereitung"
              className="rounded-xl shadow-lg hover:shadow-xl transition-shadow w-full h-48 sm:h-56 lg:h-64 object-cover animate-fade-in"
            />
            <img
              src={galleryImage13}
              alt="Umzugsteam mit Fahrzeug"
              className="rounded-xl shadow-lg hover:shadow-xl transition-shadow w-full h-48 sm:h-56 lg:h-64 object-cover animate-fade-in"
            />
            <img
              src={galleryImage14}
              alt="Unser professionelles Team"
              className="rounded-xl shadow-lg hover:shadow-xl transition-shadow w-full h-48 sm:h-56 lg:h-64 object-cover animate-fade-in"
            />
            <img
              src={galleryImage15}
              alt="Walter Braun Umzüge Fahrzeugflotte"
              className="rounded-xl shadow-lg hover:shadow-xl transition-shadow w-full h-48 sm:h-56 lg:h-64 object-cover animate-fade-in"
            />
            <img
              src={galleryImage16}
              alt="Team und Ausrüstung bereit"
              className="rounded-xl shadow-lg hover:shadow-xl transition-shadow w-full h-48 sm:h-56 lg:h-64 object-cover animate-fade-in"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontakt" className="py-16 lg:py-24 bg-gray-50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 lg:mb-6">Kontakt zu Ihrem Münchner Umzugspartner</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Rufen Sie uns an für eine kostenlose Beratung. Als Münchner Unternehmen kennen wir jeden Stadtteil 
              und helfen Ihnen gerne bei der Planung Ihres Umzugs.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="space-y-6 lg:space-y-8">
              <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 lg:mb-8">Sofort erreichbar</h3>
                
                <div className="space-y-4 lg:space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mr-4 lg:mr-6 flex-shrink-0">
                      <i className="fas fa-phone text-white text-lg lg:text-xl"></i>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 mb-1 lg:mb-2 text-sm lg:text-base">Telefon</div>
                      <a 
                        href="tel:+4980067637558" 
                        className="text-lg lg:text-2xl font-black text-primary hover:text-primary/80 transition-colors block mb-1"
                      >
                        +49800 67 63 755
                      </a>
                      <div className="text-gray-600 text-xs lg:text-sm">Kostenlose Beratung + Hotline</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mr-4 lg:mr-6 flex-shrink-0">
                      <i className="fas fa-mobile-alt text-white text-lg lg:text-xl"></i>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 mb-1 lg:mb-2 text-sm lg:text-base">Mobil</div>
                      <a 
                        href="tel:+491743861652" 
                        className="text-base lg:text-xl font-bold text-primary hover:text-primary/80 transition-colors block mb-1"
                      >
                        +49 174 3861652
                      </a>
                      <div className="text-gray-600 text-xs lg:text-sm">WhatsApp & SMS möglich</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mr-4 lg:mr-6 flex-shrink-0">
                      <i className="fas fa-envelope text-white text-lg lg:text-xl"></i>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 mb-1 lg:mb-2 text-sm lg:text-base">E-Mail</div>
                      <a 
                        href="mailto:info@walterbraun-umzuege.de" 
                        className="text-primary hover:text-primary/80 transition-colors font-semibold text-sm lg:text-base"
                      >
                        info@walterbraun-umzuege.de
                        info@walterbraun-umzuege.de
                      </a>
                      <div className="text-gray-600 text-xs lg:text-sm">Antwort binnen 2 Stunden</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mr-4 lg:mr-6 flex-shrink-0">
                      <i className="fas fa-map-marker-alt text-white text-lg lg:text-xl"></i>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 mb-1 lg:mb-2 text-sm lg:text-base">Standort München</div>
                      <div className="text-gray-700 font-medium text-sm lg:text-base">
                        Maximilianstraße 35<br />
                        80539 München (Lehel)
                      </div>
                      <div className="text-gray-600 text-xs lg:text-sm mt-1">Kostenlose Vor-Ort-Termine in ganz München</div>
                    </div>
                  </div>
                </div>

                {/* Service times */}
                <div className="bg-primary/10 rounded-xl p-4 lg:p-6 mt-6 lg:mt-8">
                  <h4 className="font-bold text-gray-900 mb-3 lg:mb-4 flex items-center text-sm lg:text-base">
                    <i className="fas fa-clock text-primary mr-2"></i>
                    Servicezeiten
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 text-xs lg:text-sm text-gray-700">
                    <div>
                      <div className="font-medium">Mo-Fr:</div>
                      <div>07:00 - 20:00 Uhr</div>
                    </div>
                    <div>
                      <div className="font-medium">Sa-So:</div>
                      <div>08:00 - 18:00 Uhr</div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="font-medium text-primary">Auch außerhalb der Geschäftszeiten erreichbar</div>
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
          <div className="text-center mt-12 lg:mt-20">
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-lg max-w-4xl mx-auto">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">Sofortiger Rückruf gewünscht?</h3>
              <p className="text-sm lg:text-base text-gray-600 mb-4 lg:mb-6">
                Hinterlassen Sie uns Ihre Nummer und wir rufen Sie innerhalb von 15 Minuten zurück!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
                <a
                  href="tel:+4980067637558"
                  className="bg-primary hover:bg-primary/90 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-bold text-base lg:text-lg transition-all transform hover:scale-105 premium-shadow"
                >
                  <i className="fas fa-phone mr-2 lg:mr-3"></i>+49800 67 63 755
                </a>
                <button
                  onClick={scrollToContact}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-bold text-base lg:text-lg transition-all hover:scale-105"
                >
                  <i className="fas fa-envelope mr-2 lg:mr-3"></i>Nachricht senden
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 lg:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div>
              <h3 className="text-lg lg:text-xl font-bold mb-3 lg:mb-4">Walter Braun Umzüge</h3>
              <p className="text-gray-400 mb-3 lg:mb-4 text-sm lg:text-base">
                Ihr zuverlässiger Partner für professionelle Umzüge in München und Umgebung.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 lg:mb-4 text-base lg:text-lg">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm lg:text-base">
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
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog & Ratgeber
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 lg:mb-4 text-base lg:text-lg">Rechtliches</h4>
              <ul className="space-y-2 text-gray-400 text-sm lg:text-base">
                <li>
                  <Link href="/impressum" className="hover:text-white transition-colors">
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link href="/datenschutz" className="hover:text-white transition-colors">
                    Datenschutz
                  </Link>
                </li>

              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 lg:mt-8 pt-6 lg:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm lg:text-base text-gray-400">
                &copy; 2025 Walter Braun Umzüge. Alle Rechte vorbehalten.
              </p>
              <div className="flex items-center gap-4">
                <CookieSettingsButton 
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                />
                <span className="text-xs text-gray-500">DSGVO-konform</span>
              </div>
            </div>
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
      <GoogleAnalytics />
      <GoogleAdsTracking />
    </div>
  );
}
