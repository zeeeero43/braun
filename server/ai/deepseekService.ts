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
✓ MINDESTENS 2000 Wörter! (Zähle selbst - kurze Artikel werden abgelehnt)
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

STRUKTUR (PFLICHT):
# H1-Titel mit Hauptkeyword
## Einleitung (Problem + Lösung, 200-250 Wörter)
## 3-4 Hauptabschnitte (je 400-500 Wörter mit H2/H3)
## Praktische Checkliste/Tabelle 
## München-Spezifische Tipps
## Expertenrat von Walter Braun Umzüge
## Fazit + Handlungsaufforderung

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
- 6-8 ausführliche Fragen (Fokus auf Qualität statt Quantität!)
- Jede Antwort 60-100 Wörter (detailliert und wertvoll)
- W-Fragen verwenden (Wie, Was, Warum, Wann, Wo)
- Hauptkeyword in 2-3 FAQ-Fragen
- Lokale München-Fragen zu Stadtteilen einbauen
- Verschiedene Schwierigkeitsgrade abdecken
- Praktische Tipps und konkrete Zahlen in jeder Antwort

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
- LANGE, AUSFÜHRLICHE ARTIKEL (min. 2000 Wörter!)
- Detaillierte Erklärungen statt oberflächlicher Tipps

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
        max_tokens: 8000
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
      // Extract JSON from response (in case there's additional text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      if (!parsed.title || !parsed.content || !parsed.excerpt) {
        throw new Error("Missing required fields in generated content");
      }

      return {
        title: parsed.title,
        excerpt: parsed.excerpt,
        content: parsed.content,
        metaDescription: parsed.metaDescription || parsed.excerpt,
        keywords: parsed.keywords || [],
        tags: parsed.tags || [],
        readTime: parsed.readTime || "5 Min. Lesezeit",
        faq: parsed.faq || []
      };
    } catch (error) {
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