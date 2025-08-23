// This file is deprecated - we now use dynamic AI-generated topics
// Legacy file kept for reference only

export interface BlogTopicIdea {
  topic: string;
  category: string;
  keywords: string[];
  targetAudience?: string;
}

// DEPRECATED: Hardcoded topics replaced by dynamic AI generation
export const blogTopicPool: BlogTopicIdea[] = [
  // Unterhaltsreinigung Topics
  {
    topic: "Checkliste für die professionelle Büroreinigung: Was Facility Manager beachten sollten",
    category: "unterhaltsreinigung",
    keywords: ["Büroreinigung", "Facility Management", "Checkliste Reinigung", "Gebäudereinigung", "Büro sauber"],
    targetAudience: "Facility Manager und Büroleitungen"
  },
  {
    topic: "Hygienische Praxisreinigung: Besondere Anforderungen in Arztpraxen und Kliniken",
    category: "unterhaltsreinigung", 
    keywords: ["Praxisreinigung", "Hygiene Arztpraxis", "medizinische Reinigung", "Desinfektion", "Klinik Reinigung"],
    targetAudience: "Arztpraxen und medizinische Einrichtungen"
  },
  {
    topic: "Nachhaltigkeit in der Gebäudereinigung: Umweltfreundliche Reinigungsmittel und Verfahren",
    category: "unterhaltsreinigung",
    keywords: ["nachhaltige Reinigung", "umweltfreundlich", "grüne Reinigungsmittel", "Ökologie", "Nachhaltigkeit"],
    targetAudience: "Umweltbewusste Unternehmen"
  },
  {
    topic: "Reinigungsfrequenz optimal planen: Wie oft sollten verschiedene Bereiche gereinigt werden?",
    category: "unterhaltsreinigung",
    keywords: ["Reinigungsfrequenz", "Reinigungsplan", "Büro Reinigung", "Gebäudemanagement", "Reinigungszyklen"],
    targetAudience: "Facility Manager und Gebäudeverwalter"
  },

  // Fensterreinigung Topics
  {
    topic: "Streifenfreie Fensterreinigung: Profi-Techniken für glasklare Ergebnisse",
    category: "fensterreinigung",
    keywords: ["Fensterreinigung", "streifenfrei", "Glasreinigung", "Fenster putzen", "professionell"],
    targetAudience: "Gebäudeverwalter und Hausmeister"
  },
  {
    topic: "Hochhaus-Fensterreinigung: Moderne Techniken und Sicherheitsstandards",
    category: "fensterreinigung",
    keywords: ["Hochhaus Fensterreinigung", "Fassadenreinigung", "Sicherheit", "Klettertechnik", "Arbeitssicherheit"],
    targetAudience: "Immobilienverwalter von Hochhäusern"
  },
  {
    topic: "Osmose-Technik in der Fensterreinigung: Vorteile des entmineralisierten Wassers",
    category: "fensterreinigung",
    keywords: ["Osmose Technik", "entmineralisiert Wasser", "Fensterreinigung", "Technologie", "Wasseraufbereitung"],
    targetAudience: "Technisch interessierte Facility Manager"
  },

  // Bauabschlussreinigung Topics
  {
    topic: "Bauabschlussreinigung richtig planen: Zeitpunkt und Umfang der Endreinigung",
    category: "bauabschlussreinigung",
    keywords: ["Bauabschlussreinigung", "Endreinigung", "Baustelle", "Rohbau", "Baufertigstellung"],
    targetAudience: "Bauunternehmer und Architekten"
  },
  {
    topic: "Von der Baustelle zum bezugsfertigen Objekt: Der Ablauf der professionellen Bauendreinigung",
    category: "bauabschlussreinigung",
    keywords: ["Bauendreinigung", "bezugsfertig", "Baustelle reinigen", "Handwerker", "Immobilie"],
    targetAudience: "Bauherren und Projektentwickler"
  },
  {
    topic: "Sicherheit bei der Baustellenreinigung: Vorschriften und Schutzmaßnahmen",
    category: "bauabschlussreinigung",
    keywords: ["Baustellenreinigung", "Arbeitssicherheit", "Vorschriften", "Schutzausrüstung", "Unfallverhütung"],
    targetAudience: "Bauleiter und Subunternehmer"
  },

  // Entrümpelung Topics
  {
    topic: "Professionelle Entrümpelung: Ablauf und Kosten einer Haushaltsauflösung",
    category: "entrümpelung",
    keywords: ["Entrümpelung", "Haushaltsauflösung", "Kosten", "Ablauf", "Wohnungsräumung"],
    targetAudience: "Privatpersonen und Verwalter"
  },
  {
    topic: "Umweltgerechte Entsorgung bei der Entrümpelung: Recycling und Wertstofftrennung",
    category: "entrümpelung", 
    keywords: ["umweltgerecht entsorgen", "Recycling", "Wertstofftrennung", "Entrümpelung", "Nachhaltigkeit"],
    targetAudience: "Umweltbewusste Kunden"
  },
  {
    topic: "Gewerbeimmobilien entrümpeln: Besonderheiten bei Büro- und Geschäftsräumen",
    category: "entrümpelung",
    keywords: ["Gewerbe entrümpeln", "Büroräumung", "Geschäftsräume", "Gewerbeimmobilien", "Inventar"],
    targetAudience: "Gewerbekunden und Immobilienverwalter"
  },

  // Allgemeine Tipps und Standards
  {
    topic: "ISO-Standards in der Gebäudereinigung: Qualitätssicherung und Zertifizierung",
    category: "standards",
    keywords: ["ISO Standards", "Qualitätssicherung", "Zertifizierung", "Gebäudereinigung", "DIN Normen"],
    targetAudience: "Qualitätsmanager und Einkäufer"
  },
  {
    topic: "Digitalisierung in der Gebäudereinigung: Apps und Tools für effizientes Facility Management",
    category: "tipps",
    keywords: ["Digitalisierung", "Apps", "Facility Management", "Tools", "Effizienz"],
    targetAudience: "Moderne Facility Manager"
  },
  {
    topic: "Kostenkalkulation für Reinigungsdienstleistungen: Transparente Preisgestaltung verstehen",
    category: "tipps",
    keywords: ["Kosten Reinigung", "Preiskalkulation", "Reinigungskosten", "Budget", "Kostenplanung"],
    targetAudience: "Einkäufer und Budgetverantwortliche"
  },
  {
    topic: "Hygienekonzepte nach Corona: Neue Standards in der Gebäudereinigung",
    category: "standards",
    keywords: ["Hygienekonzept", "Corona", "Desinfektion", "Pandemie", "Gesundheitsschutz"],
    targetAudience: "Gesundheitsverantwortliche in Unternehmen"
  },
  {
    topic: "Winterdienst und Verkehrssicherungspflicht: Was Immobilieneigentümer wissen müssen",
    category: "tipps",
    keywords: ["Winterdienst", "Verkehrssicherung", "Räumpflicht", "Streupflicht", "Haftung"],
    targetAudience: "Immobilieneigentümer und Hausverwaltungen"
  },
  
  // Seasonal and Trending Topics
  {
    topic: "Frühjahrsreinigung in Bürogebäuden: Tipps für den perfekten Start ins neue Geschäftsjahr",
    category: "unterhaltsreinigung",
    keywords: ["Frühjahrsreinigung", "Bürogebäude", "Geschäftsjahr", "Grundreinigung", "Büro"],
    targetAudience: "Büroleiter und Facility Manager"
  },
  {
    topic: "Allergiker-freundliche Reinigung: Spezielle Verfahren für sensible Arbeitsplätze",
    category: "unterhaltsreinigung",
    keywords: ["Allergiker", "allergikerfreundlich", "Arbeitsplatz", "Gesundheit", "HEPA Filter"],
    targetAudience: "HR-Abteilungen und Gesundheitsbeauftragte"
  },
  {
    topic: "Energy-Efficiency in der Gebäudereinigung: Stromsparen mit modernen Reinigungsgeräten",
    category: "tipps",
    keywords: ["Energieeffizienz", "Stromsparen", "moderne Geräte", "Nachhaltigkeit", "Kosten senken"],
    targetAudience: "Nachhaltigkeitsbeauftragte und Kostenkontrolleure"
  },
  
  // Advanced and Technical Topics
  {
    topic: "Reinigungsroboter im Facility Management: Automatisierung vs. menschliche Arbeitskraft",
    category: "tipps",
    keywords: ["Reinigungsroboter", "Automatisierung", "KI", "Facility Management", "Zukunft"],
    targetAudience: "Innovationsinteressierte Facility Manager"
  },
  {
    topic: "Spezialreinigung für Produktionsbetriebe: Industriereinigung nach Branchenstandards",
    category: "unterhaltsreinigung",
    keywords: ["Industriereinigung", "Produktion", "Branchenstandards", "Spezialreinigung", "Fertigung"],
    targetAudience: "Produktions- und Werksleiter"
  }
];

export function getRandomBlogTopic(): BlogTopicIdea {
  const randomIndex = Math.floor(Math.random() * blogTopicPool.length);
  return blogTopicPool[randomIndex];
}

export function getBlogTopicsByCategory(category: string): BlogTopicIdea[] {
  return blogTopicPool.filter(topic => topic.category === category);
}

export function getUnusedTopics(usedTopics: string[]): BlogTopicIdea[] {
  return blogTopicPool.filter(topic => !usedTopics.includes(topic.topic));
}