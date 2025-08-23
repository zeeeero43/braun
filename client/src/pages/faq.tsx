import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
}

export function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  // Sample FAQ data - in real app this would come from API
  const faqData: FAQ[] = [
    {
      id: 1,
      category: "Allgemein",
      question: "Wie weit im Voraus sollte ich meinen Umzug in München planen?",
      answer: "In München empfehlen wir eine Vorlaufzeit von mindestens 6-8 Wochen, besonders in beliebten Stadtteilen wie Schwabing oder der Maxvorstadt. Gute Umzugsfirmen sind schnell ausgebucht, und Sie benötigen Zeit für Parkgenehmigungen und behördliche Anmeldungen."
    },
    {
      id: 2,
      category: "Kosten",
      question: "Was kostet ein Umzug in München durchschnittlich?",
      answer: "Die Kosten variieren je nach Umfang und Stadtteil. Eine 2-Zimmer-Wohnung kostet durchschnittlich 800-1.200€, eine 3-Zimmer-Wohnung 1.500-2.200€. Innenstadtumzüge sind meist 15-20% teurer aufgrund der schwierigen Parksituation."
    },
    {
      id: 3,
      category: "Genehmigungen",
      question: "Brauche ich eine Parkgenehmigung für meinen Umzug?",
      answer: "In den meisten Münchner Stadtteilen ja. Halteverbotszonen müssen 3-5 Tage im Voraus bei der Stadt München beantragt werden. In der Innenstadt und beliebten Vierteln ist dies besonders wichtig, da Parkplätze sehr rar sind."
    },
    {
      id: 4,
      category: "Services",
      question: "Bieten Sie auch Verpackungsservice an?",
      answer: "Ja, wir bieten kompletten Verpackungsservice mit professionellem Material. Besonders für empfindliche Gegenstände, Kunstwerke oder bei Zeitmangel ist dies sehr sinnvoll. So sparen Sie Zeit und Ihre Gegenstände sind optimal geschützt."
    },
    {
      id: 5,
      category: "München",
      question: "Was sind die Besonderheiten beim Umzug in Münchner Altbauten?",
      answer: "Altbauten in München haben oft enge Treppenhäuser, kleine oder keine Aufzüge und historische Türbreiten. Wir bringen spezielles Equipment mit und planen mehr Zeit ein. Manchmal ist auch eine Außenbeförderung über Fenster nötig."
    },
    {
      id: 6,
      category: "Kosten",
      question: "Kann ich bei der Umzugskostenschätzung sparen?",
      answer: "Ja! Eigenverpackung spart 20-30%, flexible Termine (werktags) sind günstiger, und bei guter Vorbereitung (gepackte Kartons, freie Wege) reduziert sich die Arbeitszeit erheblich."
    },
    {
      id: 7,
      category: "Versicherung",
      question: "Sind meine Sachen während des Umzugs versichert?",
      answer: "Grundsätzlich sind wir nach Umzugsverordnung versichert. Für wertvolle Gegenstände empfehlen wir eine zusätzliche Transportversicherung. Ihre Hausratversicherung greift meist auch während des Umzugs - prüfen Sie dies vorab."
    },
    {
      id: 8,
      category: "München",
      question: "Welche Stadtteile in München sind besonders umzugsfreundlich?",
      answer: "Stadtteile wie Bogenhausen, Trudering oder Ramersdorf haben meist bessere Parkmöglichkeiten. Die Innenstadt, Schwabing und Maxvorstadt sind anspruchsvoller wegen enger Straßen und Parkplatzmangel."
    }
  ];

  const categories = [...new Set(faqData.map(faq => faq.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <button className="flex items-center text-green-600 hover:text-green-700 mb-4 group">
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Zurück zur Startseite
            </button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Häufig gestellte Fragen
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Antworten auf die wichtigsten Fragen rund um Ihren Umzug in München
          </p>
        </div>

        {/* FAQ Categories */}
        {categories.map(category => {
          const categoryFaqs = faqData.filter(faq => faq.category === category);
          
          return (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-green-500 pl-4">
                {category}
              </h2>
              
              <div className="space-y-4">
                {categoryFaqs.map(faq => (
                  <Collapsible 
                    key={faq.id}
                    open={openItems.includes(faq.id)}
                    onOpenChange={() => toggleItem(faq.id)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 pr-4">
                            {faq.question}
                          </h3>
                          <ChevronDown 
                            className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                              openItems.includes(faq.id) ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="bg-green-50 border border-green-100 rounded-lg p-6 mt-2 ml-4">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>
          );
        })}

        {/* Contact CTA */}
        <div className="bg-green-600 text-white rounded-2xl p-8 mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Weitere Fragen?</h2>
          <p className="text-green-100 mb-6">
            Wir beraten Sie gerne persönlich zu Ihrem Umzug in München
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#kontakt">
              <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Kostenlose Beratung
              </button>
            </Link>
            <a 
              href="https://wa.me/4989123456789" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
            >
              WhatsApp Chat
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}