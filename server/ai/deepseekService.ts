import { storage } from "../storage";

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface BlogContentStructure {
  title: string;
  excerpt: string;
  content: string;
  metaDescription: string;
  keywords: string[];
  tags: string[];
  readTime: string;
  faq: Array<{ question: string; answer: string }>;
}

export class DeepSeekService {
  private apiKey: string;
  private baseUrl = "https://api.deepseek.com/v1/chat/completions";

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || "";
    if (!this.apiKey) {
      throw new Error("DEEPSEEK_API_KEY environment variable is required");
    }
  }

  async generateBlogContent(topic: string, keywords: string[], category: string): Promise<BlogContentStructure> {
    const prompt = this.createContentPrompt(topic, keywords, category);
    
    try {
      const response = await this.callDeepSeek(prompt);
      const content = this.parseContentResponse(response);
      
      // Log successful generation
      await this.logGeneration(prompt, JSON.stringify(content), true);
      
      return content;
    } catch (error) {
      // Log failed generation
      await this.logGeneration(prompt, "", false, error instanceof Error ? error.message : "Unknown error");
      throw error;
    }
  }

  private createContentPrompt(topic: string, keywords: string[], category: string): string {
    return `Du bist ein Experte für SEO-Content und schreibst für Walter Braun Umzüge, ein professionelles Umzugsunternehmen in München. 

AUFGABE: Erstelle einen umfassenden, 10/10 SEO-optimierten Blog-Artikel über "${topic}" in der Kategorie "${category}".

HAUPT-KEYWORDS: ${keywords.join(", ")}
LOKALE KEYWORDS: München, Schwabing, Maxvorstadt, Sendling, Bogenhausen, Lehel, Isarvorstadt, Haidhausen

KRITISCHE SEO-ANFORDERUNGEN (NICHT VERHANDELBAR!):
✓ EXAKT MINDESTENS 3000 Wörter! (Zähle Wörter am Ende - unter 2500 Wörtern = AUTOMATISCHE ABLEHNUNG!)
✓ JEDER Hauptabschnitt muss EXAKT 700-900 Wörter enthalten (nicht weniger!)
✓ PFLICHT: 6 umfangreiche Hauptabschnitte (niemals nur 3-4!)
✓ Einleitung muss EXAKT 350+ Wörter haben
✓ WORTREICH schreiben - jede Erklärung ausführlich und detailliert!
✓ Hauptkeyword in ersten 100 Wörtern + H1-Titel
✓ Keywords natürlich verteilt (1-2% Keyword-Dichte)
✓ Lokale München-Bezüge in jedem Hauptabschnitt
✓ Interne Verlinkung zu anderen Themen (Format: [Text](/blog/umzugstipps-muenchen))
✓ Praktische, umsetzbare Ratschläge mit Checklisten
✓ Expertise und Vertrauen vermitteln durch Fachkompetenz
✓ ALLE Tabellen müssen als HTML-Tabellen erstellt werden (NIEMALS Markdown!)
✓ MEHR INHALT STATT FAQ-FOKUS! Priorität: 2500+ Wörter Content, 6-8 FAQ
✓ KEINE Download-Links, Platzhalter oder generische Phrasen
✓ FAQ ABSOLUT NICHT im Content erwähnen - NIEMALS "FAQ", "Häufige Fragen" etc. im Artikel!
✓ FAQ nur in separater JSON-Sektion am Ende!

STRUKTUR (PFLICHT - MINDESTENS 3000 WÖRTER ABSOLUT ERFORDERLICH!):
# H1-Titel mit Hauptkeyword (KEINE Wortanzahl-Hinweise!)
## Einleitung (EXAKT 400+ Wörter - detaillierte Problemstellung!)
## 1. Hauptabschnitt (EXAKT 600+ Wörter mit 3-4 H3-Unterüberschriften)
## 2. Hauptabschnitt (EXAKT 600+ Wörter mit 3-4 H3-Unterüberschriften)
## 3. Hauptabschnitt (EXAKT 500+ Wörter mit 2-3 H3-Unterüberschriften)
## 4. Hauptabschnitt (EXAKT 500+ Wörter mit 2-3 H3-Unterüberschriften)
## 5. Praktische Checkliste/Tabelle (EXAKT 300+ Wörter mit ausführlicher Tabelle)
## 6. München-Spezifische Tipps (EXAKT 400+ Wörter mit lokalen Details)
## 7. Expertenrat von Walter Braun Umzüge (EXAKT 350+ Wörter mit Fallbeispielen)
## 8. Fazit + Handlungsaufforderung (EXAKT 250+ Wörter mit Call-to-Action)

KRITISCHE ANWEISUNG:
- Schreibe JEDEN Abschnitt VOLLSTÄNDIG aus!
- KEINE Abkürzungen oder Platzhalter!
- JEDEN H3-Unterabschnitt mit mindestens 150+ Wörtern!
- Verwende konkrete Beispiele, Zahlen, Adressen, Preise!
- ZÄHLE die Wörter während dem Schreiben!

LÄNGEN-KONTROLLE:
- Schreibe in JEDEM Abschnitt detaillierte Erklärungen
- Verwende konkrete Beispiele und Zahlen
- Füge praktische Tipps und Checklisten hinzu
- Erkläre lokale München-Besonderheiten ausführlich

WICHTIG - ÜBERSCHRIFTEN:
- Schreibe NIEMALS "(XXX Wörter)" oder ähnliche Hinweise in Überschriften!
- Alle Überschriften müssen professionell und vollständig ausformuliert sein
- Beispiel FALSCH: "## 2. IT-Umzug: Datenverlust vermeiden (400 Wörter)"  
- Beispiel RICHTIG: "## 2. IT-Umzug: So vermeiden Sie Datenverlust beim Büroumzug"

TABELLEN-FORMAT (KRITISCH!):
- NIEMALS Markdown-Tabellen (| Syntax)!
- ALLE Tabellen müssen HTML-Format haben:
<table class="w-full border-collapse border border-gray-300 text-sm">
  <thead>
    <tr class="bg-green-50">
      <th class="border border-gray-300 px-4 py-2 text-left">Spalte 1</th>
      <th class="border border-gray-300 px-4 py-2 text-left">Spalte 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-300 px-4 py-2">Inhalt 1</td>
      <td class="border border-gray-300 px-4 py-2">Inhalt 2</td>
    </tr>
  </tbody>
</table>

FAQ-OPTIMIERUNG für Featured Snippets:
- GENAU 8 ausführliche Fragen (nicht weniger!)
- Jede Antwort 80-120 Wörter (sehr detailliert und wertvoll)
- W-Fragen verwenden (Wie, Was, Warum, Wann, Wo, Welche)
- Hauptkeyword in 3-4 FAQ-Fragen einbauen
- Lokale München-Fragen zu verschiedenen Stadtteilen
- Verschiedene Schwierigkeitsgrade (Anfänger bis Experte)
- Konkrete Zahlen, Preise und Termine in jeder Antwort
- Pro-Tipps und Insider-Wissen von Walter Braun Umzüge

AUSGABE-FORMAT (JSON):
{
  "title": "Keyword-optimierter Titel 50-60 Zeichen",
  "excerpt": "Überzeugende Meta-Description 150-160 Zeichen mit Hauptkeyword",
  "content": "Vollständiger 2000-2500 Wort Markdown-Artikel",
  "metaDescription": "Separate Meta-Description mit Call-to-Action",
  "keywords": ["haupt-keyword", "synonym1", "longtail-keyword", "lokal-muenchen"],
  "tags": ["Haupttag", "Kategorietag", "Lokaltag"],
  "readTime": "X Min. Lesezeit",
  "faq": [
    {
      "question": "Wie/Was/Warum-Frage mit Keyword?",
      "answer": "Detaillierte 60-100 Wörter Antwort mit München-spezifischen Details, konkreten Zahlen und Expertenwissen."
    }
  ]
}

WICHTIG: 
- Keine generischen Floskeln oder Füllwörter
- Jeder Satz muss Mehrwert bieten  
- Lokale München-Expertise durchgehend zeigen
- Walter Braun Umzüge als Experte positionieren
- Konkrete Zahlen, Fakten, Beispiele verwenden
- SEHR LANGE, AUSFÜHRLICHE ARTIKEL (min. 3000 Wörter - ZÄHLE WÄHREND DEM SCHREIBEN!)
- Jeder Abschnitt muss MINDESTENS die angegebene Wortanzahl haben
- Detaillierte Erklärungen mit konkreten Beispielen, Zahlen, Preisen
- NIEMALS oberflächliche oder kurze Antworten
- Schreibe wie ein Experten-Ratgeber, nicht wie ein Blog-Überblick

BEISPIELE für professionelle Überschriften:
- FALSCH: "## Schulwechsel in Bayern organisieren (500 Wörter)"
- RICHTIG: "## Schulwechsel in Bayern: So gelingt die Anmeldung an Münchner Schulen"
- FALSCH: "## 2. IT-Umzug: Datenverlust vermeiden (400 Wörter)"  
- RICHTIG: "## IT-Umzug ohne Datenverlust: Professionelle Server-Migration"

BEISPIEL für ausführlichen Content:
Statt "Kartons richtig packen" → "Schwere Gegenstände wie Bücher gehören in kleine Kartons (max. 30x40cm), da ein großer Karton mit Büchern schnell 25-30kg wiegt und selbst für trainierte Umzugshelfer zu schwer wird. In München sind enge Treppenhäuser in Altbauten wie in Schwabing oder der Maxvorstadt besonders herausfordernd..."

Erstelle jetzt den ausführlichen, hochwertigen SEO-Artikel:`;
  }

  private async callDeepSeek(prompt: string): Promise<string> {
    console.log("🔄 Calling DeepSeek API...");
    
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 12000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ DeepSeek API error: ${response.status} ${response.statusText} - ${errorText}`);
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }

    const data: DeepSeekResponse = await response.json();
    console.log("✅ DeepSeek API response received");
    
    if (!data.choices || data.choices.length === 0) {
      console.error("❌ No choices in DeepSeek response:", data);
      throw new Error("No content generated by DeepSeek");
    }

    const content = data.choices[0].message.content;
    console.log(`📝 Generated content length: ${content.length} characters`);
    
    return content;
  }

  private parseContentResponse(response: string): BlogContentStructure {
    try {
      console.log("🔍 Parsing DeepSeek response...");
      
      // Extract JSON from response (in case there's additional text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error("❌ No JSON found in response:", response.substring(0, 500));
        throw new Error("No valid JSON found in response");
      }

      const parsed = JSON.parse(jsonMatch[0]);
      console.log("✅ JSON parsed successfully");
      
      // Validate required fields
      if (!parsed.title || !parsed.content || !parsed.excerpt) {
        console.error("❌ Missing required fields:", { 
          hasTitle: !!parsed.title, 
          hasContent: !!parsed.content, 
          hasExcerpt: !!parsed.excerpt 
        });
        throw new Error("Missing required fields in generated content");
      }

      console.log("✅ All required fields present");
      
      const result = {
        title: parsed.title,
        excerpt: parsed.excerpt,
        content: parsed.content,
        metaDescription: parsed.metaDescription || parsed.excerpt,
        keywords: parsed.keywords || [],
        tags: parsed.tags || [],
        readTime: parsed.readTime || "5 Min. Lesezeit",
        faq: parsed.faq || []
      };
      
      console.log(`📊 Content stats: Title length: ${result.title.length}, Content length: ${result.content.length}`);
      return result;
      
    } catch (error) {
      console.error("❌ Failed to parse response:", error);
      throw new Error(`Failed to parse DeepSeek response: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  private async logGeneration(prompt: string, response: string, success: boolean, error?: string): Promise<void> {
    try {
      await storage.createAiLog({
        type: "content",
        prompt: prompt.substring(0, 1000), // Limit prompt length
        response: response.substring(0, 2000), // Limit response length
        model: "deepseek",
        success,
        error: error || null
      });
    } catch (logError) {
      console.error("Failed to log DeepSeek generation:", logError);
    }
  }

  // Generate optimized image description for Runware API
  async generateImageDescription(title: string, category: string): Promise<string> {
    const prompt = `Du bist Experte für AI-Bildgenerierung. Erstelle eine detaillierte, professionelle Bildbeschreibung für Runware AI für folgenden Blog-Artikel:

TITEL: "${title}"
KATEGORIE: "${category}"

ANFORDERUNGEN:
- Fotorealistischer Stil, professionell
- München/Bayern-Bezug wo passend
- Umzugs-/Business-Kontext
- Hochwertig, vertrauenswürdig
- 16:9 Format
- Tageslicht, moderne Optik

BEISPIELE:
Umzugstipps: "Professional moving team wearing branded uniforms loading a modern truck in Munich, Bavarian architecture in background, organized moving boxes, sunny day, high-end residential area, professional photography, bright natural lighting, trustworthy atmosphere, 16:9 aspect ratio"

Geschäftsumzug: "Business relocation scene in Munich office district, professional movers in suits handling office equipment, modern glass buildings, corporate environment, systematic organization, daylight through windows, premium business atmosphere, photorealistic, 16:9"

Erstelle jetzt eine ähnlich detaillierte Beschreibung für den gegebenen Titel:`;

    try {
      const response = await this.callDeepSeek(prompt);
      // Extract just the description, remove any additional text
      const cleanDescription = response.trim().replace(/^["']|["']$/g, '');
      console.log(`🎨 Generated image description: ${cleanDescription.substring(0, 100)}...`);
      return cleanDescription;
    } catch (error) {
      console.error("❌ Failed to generate image description:", error);
      // Fallback to category-based description
      const fallbackPrompts = {
        "Umzugstipps": "Professional moving team in Munich, modern moving truck, organized boxes, sunny day, German cityscape background",
        "Geschäftsumzüge": "Business office relocation, professional team, modern office equipment, corporate environment",
        "München & Umgebung": "Munich cityscape, Bavarian architecture, professional moving services, trustworthy atmosphere"
      };
      return fallbackPrompts[category as keyof typeof fallbackPrompts] || fallbackPrompts["Umzugstipps"];
    }
  }

  // Generate topic ideas for the blog ideas pool
  async generateTopicIdeas(count: number = 20): Promise<Array<{ topic: string; category: string; keywords: string[] }>> {
    const prompt = `Du bist Content-Strategist für Walter Braun Umzüge in München. 

Erstelle ${count} Blog-Themen für ein Umzugsunternehmen mit den Kategorien:
- Umzugstipps
- Packen & Organisieren  
- München & Umgebung
- Geschäftsumzüge
- Umzugsrecht & Versicherung
- Haushalt & Wohnen

ANFORDERUNGEN:
- Relevante Keywords für SEO
- München/Bayern-Bezug wo möglich
- Praktischer Nutzen für Leser
- Verschiedene Schwierigkeitsgrade

AUSGABE-FORMAT (JSON):
{
  "ideas": [
    {
      "topic": "Konkretes Thema",
      "category": "Kategorie",
      "keywords": ["keyword1", "keyword2", "keyword3"]
    }
  ]
}`;

    try {
      const response = await this.callDeepSeek(prompt);
      const parsed = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || "{}");
      
      return parsed.ideas || [];
    } catch (error) {
      console.error("Failed to generate topic ideas:", error);
      return [];
    }
  }
}