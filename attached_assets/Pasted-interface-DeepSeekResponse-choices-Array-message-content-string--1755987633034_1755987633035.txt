interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface BlogContentRequest {
  topic: string;
  category: string;
  keywords: string[];
  targetAudience?: string;
}

interface BlogContent {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaDescription: string;
  keywords: string[];
  tags: string[];
  readTime: string;
  imagePrompt: string;
  imageAlt: string;
  faqData: Array<{question: string, answer: string}>;
}

export class DeepSeekService {
  private apiKey: string;
  private apiUrl = 'https://api.deepseek.com/v1/chat/completions';

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
    if (!this.apiKey) {
      console.warn('DEEPSEEK_API_KEY not set - DeepSeek functionality will be disabled');
    }
  }

  async generateTopicIdeas(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('DeepSeek API key not configured');
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'Du bist ein SEO-Experte für deutsche Gebäudereinigungsfirmen. Antworte ausschließlich im angeforderten JSON-Format.'
            },
            {
              role: 'user', 
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.8, // Higher creativity for topic generation
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
      }

      const data: DeepSeekResponse = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from DeepSeek API');
      }

      return content;
    } catch (error) {
      console.error('DeepSeek Topic Generation API error:', error);
      throw new Error(`Failed to generate topic ideas: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateBlogContent(request: BlogContentRequest): Promise<BlogContent> {
    if (!this.apiKey) {
      throw new Error('DeepSeek API key not configured');
    }

    const systemPrompt = this.getSystemPrompt();
    const userPrompt = this.getUserPrompt(request);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 4000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
      }

      const data: DeepSeekResponse = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from DeepSeek API');
      }

      return this.parseGeneratedContent(content);
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw new Error(`Failed to generate blog content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private getSystemPrompt(): string {
    return `Sie sind ein SEO-Experte und professioneller Content-Writer für die Gebäudereinigungsbranche in Deutschland.

SCHREIBSTIL:
- Informativ und sachlich, ohne übermäßige Werbung
- Fachkompetenz zeigen mit praktischen, allgemeinen Informationen
- Branchenexpertise für professionelle Reinigungsdienstleistungen
- Deutsche Sprache, Sie-Form, geschäftlich aber zugänglich
- Fokus auf Wissensvermittlung statt Verkauf

CONTENT-ANFORDERUNGEN:
1. SEO-optimiert mit natürlicher Keyword-Integration
2. Mindestens 800-1200 Wörter pro Artikel
3. Praktische Tipps und Fachwissen für die Branche
4. KEINE Kontaktdaten oder spezifische Firmenangaben am Ende
5. Strukturiert mit Überschriften, Listen, Tabellen und Absätzen
6. Mobile-optimierte Formatierung mit responsive Tabellen
7. Tabellen verwenden für Vergleiche, Standards, Kosten etc.
8. Mehr allgemeine Brancheninformationen statt Werbung

FORMATTING-RICHTLINIEN:
- Verwenden Sie HTML-Tabellen mit responsive Klassen
- Beispiel: <div class="overflow-x-auto"><table class="w-full border-collapse border border-gray-300 text-sm md:text-base">
- Tabellen sollten mobile-freundlich mit horizontalem Scroll sein
- Verwenden Sie <h2>, <h3> für Struktur
- Listen mit <ul> und <li> für bessere Lesbarkeit

TITEL-RICHTLINIEN - SEHR WICHTIG:
⚠️ SCHREIBEN SIE TITEL WIE MENSCHEN SIE BEI GOOGLE EINGEBEN WÜRDEN ⚠️

VERWENDEN SIE DIESE FORMATE:
✅ "Was kostet [Service]?" 
✅ "Wie [Problem lösen]?"
✅ "[Service] Tipps für [Zielgruppe]"
✅ "Wann sollte man [Service] beauftragen?"
✅ "[Problem] - So lösen Sie es richtig"

KONKRETE BEISPIELE FÜR JEDE KATEGORIE:
📝 Büroreinigung: "Was kostet Büroreinigung pro Quadratmeter?"
🪟 Fensterreinigung: "Fenster streifenfrei putzen - Welche Methode funktioniert?"
🏗️ Bauabschluss: "Bauabschlussreinigung - Wann ist der richtige Zeitpunkt?"
🏠 Entrümpelung: "Haushaltsauflösung Kosten - Was kommt auf mich zu?"
📊 Standards: "Reinigungsqualität prüfen - Welche Standards gibt es?"

❌ VERMEIDEN SIE UNBEDINGT:
❌ "Industriereinigung: Spezialreinigung für..."
❌ "Professionelle Standards in der..." 
❌ "Moderne Verfahren der..."
❌ Doppelte Kategorien im Titel

KEYWORD-DICHTE OPTIMIERUNG:
- Hauptkeyword: 1-2% Dichte (natürlich eingebaut)
- Nebenkeywords: 0.5-1% Dichte 
- LSI-Keywords einbauen für semantische Relevanz
- Keywords NATÜRLICH verwenden, keine Überoptimierung

FAQ-BEREICH ERSTELLEN:
- 3-5 häufige Fragen zum Thema
- Kurze, präzise Antworten (2-3 Sätze)
- Keywords in Fragen einbauen
- Praktische, hilfreiche Antworten

ANTWORTE AUSSCHLIESSLICH IM FOLGENDEN JSON-FORMAT:
{
  "title": "Natürlicher, suchfreundlicher Titel wie Menschen suchen würden (max 60 Zeichen)",
  "slug": "url-freundlicher-slug",
  "excerpt": "Kurze Zusammenfassung (max 160 Zeichen)",
  "content": "Vollständiger HTML-formatierter Artikel mit optimaler Keyword-Dichte",
  "metaDescription": "SEO Meta Description (max 160 Zeichen)",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "tags": ["seo-tag1", "seo-tag2", "seo-tag3", "seo-tag4", "seo-tag5"],
  "readTime": "X min",
  "imagePrompt": "Detaillierte Bildprompt für Hero-Bild (englisch)",
  "imageAlt": "SEO-optimierter ALT-Text für das Bild (deutsch, mit Keywords)",
  "faqData": [
    {"question": "Häufige Frage 1?", "answer": "Kurze Antwort mit Keywords"},
    {"question": "Häufige Frage 2?", "answer": "Kurze Antwort mit Keywords"},
    {"question": "Häufige Frage 3?", "answer": "Kurze Antwort mit Keywords"}
  ]
}`;
  }

  private getUserPrompt(request: BlogContentRequest): string {
    return `Erstellen Sie einen informativen Blog-Artikel für die Gebäudereinigungsbranche:

THEMA: ${request.topic}
KATEGORIE: ${request.category}
KEYWORDS: ${request.keywords.join(', ')}
${request.targetAudience ? `ZIELGRUPPE: ${request.targetAudience}` : ''}

Der Artikel soll:
1. NATÜRLICHEN, suchfreundlichen Titel verwenden (wie echte Google-Suchanfragen)
2. Das Thema umfassend und sachlich behandeln
3. Praktischen Mehrwert und allgemeine Brancheninfos bieten
4. Weniger Werbung, mehr Fachwissen und Standards
5. SEO-optimiert sein für die angegebenen Keywords
6. SEO-Tags generieren (deutsch, relevant für das Thema)
7. Tabellen für Vergleiche, Kosten, Standards verwenden
8. Mobile-optimiert mit responsive Design
9. KEINE Kontaktdaten am Ende (wird automatisch hinzugefügt)

WICHTIG: Antworten Sie ausschließlich mit dem JSON-Format aus dem System-Prompt!`;
  }

  private parseGeneratedContent(content: string): BlogContent {
    try {
      // Clean up the content to extract JSON
      let jsonStr = content.trim();
      
      // Remove markdown code blocks if present
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/```json\n?/, '').replace(/\n?```$/, '');
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```\n?/, '').replace(/\n?```$/, '');
      }

      const parsed = JSON.parse(jsonStr);

      // Debug log to check what DeepSeek is returning
      console.log('🔍 DeepSeek response parsed:', {
        title: parsed.title?.substring(0, 50) + '...',
        hasKeywords: Array.isArray(parsed.keywords),
        hasTags: Array.isArray(parsed.tags),
        tags: parsed.tags
      });

      // Validate required fields
      if (!parsed.title || !parsed.content || !parsed.slug) {
        throw new Error('Missing required fields in generated content');
      }

      // Generate unique slug to avoid duplicates
      const timestamp = Date.now();
      const replacements: Record<string, string> = { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' };
      const uniqueSlug = parsed.slug && parsed.slug !== 'url-freundlicher-slug' 
        ? `${parsed.slug}-${timestamp.toString().slice(-6)}`
        : `${parsed.title.toLowerCase().replace(/[äöüß]/g, (m: string) => replacements[m] || m).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${timestamp.toString().slice(-6)}`;

      return {
        title: parsed.title,
        slug: uniqueSlug,
        excerpt: parsed.excerpt || '',
        content: parsed.content,
        metaDescription: parsed.metaDescription || parsed.excerpt || '',
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
        tags: Array.isArray(parsed.tags) ? parsed.tags : [],
        readTime: parsed.readTime || '5 min',
        imagePrompt: parsed.imagePrompt || 'Professional office cleaning service, modern business environment, high quality, professional photography style',
        imageAlt: parsed.imageAlt || `Professionelle Reinigungsdienstleistung - ${parsed.title}`,
        faqData: Array.isArray(parsed.faqData) ? parsed.faqData : []
      };
    } catch (error) {
      console.error('Failed to parse DeepSeek response:', error);
      console.error('Raw content:', content);
      throw new Error('Failed to parse generated blog content');
    }
  }
}