import { DeepSeekService } from './deepseekService';
import { storage } from '../storage';
import type { InsertBlogIdea } from '@shared/schema';

export class TopicGenerationService {
  private deepseekService: DeepSeekService;

  constructor() {
    this.deepseekService = new DeepSeekService();
  }

  /**
   * Generates new blog topic ideas based on company services and unused topics
   */
  async generateNewTopics(count: number = 5): Promise<InsertBlogIdea[]> {
    console.log(`🧠 Generating ${count} new blog topic ideas...`);

    try {
      // Get used topics to avoid duplicates
      const existingPosts = await storage.getAutoBlogPosts(200);
      const usedTopics = existingPosts.map(post => post.title.toLowerCase());
      const usedCategories = existingPosts.reduce((acc, post) => {
        acc[post.category] = (acc[post.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.log(`📊 Existing posts analysis: ${Object.entries(usedCategories).map(([cat, count]) => `${cat}: ${count}`).join(', ')}`);

      const prompt = this.buildTopicGenerationPrompt(usedTopics, usedCategories, count);
      
      const response = await this.deepseekService.generateTopicIdeas(prompt);
      
      // Parse and validate response
      const topics = this.parseTopicResponse(response);
      
      console.log(`✅ Generated ${topics.length} new topic ideas`);
      return topics;

    } catch (error) {
      console.error('❌ Failed to generate new topics:', error);
      throw error;
    }
  }

  private buildTopicGenerationPrompt(usedTopics: string[], usedCategories: Record<string, number>, count: number): string {
    const cities = ['Moers', 'Duisburg', 'Mülheim an der Ruhr', 'Krefeld', 'Essen', 'Düsseldorf'];
    const selectedCities = cities.slice(0, Math.min(3, cities.length)).join(', ');
    
    return `
Du bist ein lokaler SEO-Experte für eine deutsche Gebäudereinigungsfirma (Grema Gebäudeservice GmbH aus Moers).

🏢 FIRMEN-SERVICES:
1. Unterhaltsreinigung (Büro & Praxis)
2. Fensterreinigung (mit Osmose-Technik)
3. Bauabschlussreinigung 
4. Entrümpelung & Haushaltsauflösung

🌍 LOKALE SEO-GEBIETE (FÜR BESSERE RANKINGS):
${cities.join(', ')}

BEREITS VERWENDETE THEMEN (DIESE NICHT WIEDERHOLEN):
${usedTopics.slice(0, 20).map(topic => `- ${topic}`).join('\n')}

📊 KATEGORIEN-VERTEILUNG OPTIMIEREN:
${Object.entries(usedCategories).map(([cat, count]) => `${cat}: ${count} Artikel`).join(', ')}

🎯 AUFGABE: Generiere ${count} völlig neue Blog-Themen mit lokalem SEO-Fokus.

🔍 TITEL-ANFORDERUNGEN:
⚠️ SCHREIBE TITEL WIE MENSCHEN SIE BEI GOOGLE SUCHEN ⚠️

✅ VERWENDE DIESE SUCHFREUNDLICHEN FORMATE:
• "Was kostet [Service] in [Stadt]?" 
• "Wie [Problem lösen] in [Region]?"
• "[Service] [Stadt] - Tipps für [Zielgruppe]"
• "Wann sollte man [Service] in [Stadt] beauftragen?"
• "[Problem] [Stadt] - So geht's richtig"
• "[Service] Anbieter [Stadt] - Worauf achten?"

🏆 LOKALE SEO-BEISPIELE:
"Büroreinigung Moers - Was kostet professionelle Reinigung?"
"Fensterreinigung Duisburg - Welche Methode ist streifenfrei?"
"Bauabschlussreinigung Essen - Wann den Profi beauftragen?"
"Entrümpelung Krefeld - Kosten und Ablauf im Überblick"
"Praxisreinigung Düsseldorf - Hygiene-Standards einhalten"
"Haushaltsauflösung Mülheim - Was kostet der Service?"
"Baustaub entfernen nach Renovierung - Tipps vom Profi"
"Wohnung entrümpeln lassen - Ablauf und Kosten"
"Praxisreinigung - Wie oft ist Desinfektion nötig?"

❌ VERMEIDE:
- Formale Titel wie "Industriereinigung: Spezialreinigung..."
- Bereits verwendete Themen
- Doppelte Kategorien im Titel

ANTWORT IM JSON-FORMAT:
{
  "topics": [
    {
      "title": "Suchfreundlicher Titel",
      "category": "unterhaltsreinigung|fensterreinigung|bauabschlussreinigung|entrümpelung",
      "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
      "targetAudience": "Zielgruppe beschreibung"
    }
  ]
}

Generiere GENAU ${count} verschiedene Themen für unterschiedliche Kategorien.`;
  }

  private parseTopicResponse(response: string): InsertBlogIdea[] {
    try {
      // Clean response - remove markdown code blocks if present
      let cleanResponse = response.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      }
      if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Try to fix incomplete JSON by finding the last complete topic entry
      let jsonToParseOriginal = cleanResponse;
      
      // If JSON parsing fails, try to extract what we can
      try {
        const parsed = JSON.parse(cleanResponse);
        
        if (!parsed.topics || !Array.isArray(parsed.topics)) {
          throw new Error('Invalid response format: missing topics array');
        }

        return parsed.topics.map((topic: any) => ({
          topic: topic.title,
          category: topic.category,
          keywords: topic.keywords || [],
          isUsed: false
        }));
      } catch (parseError) {
        console.log('🔧 JSON incomplete, attempting to fix...');
        
        // Try to find the topics array start and truncate at incomplete entries
        const topicsIndex = cleanResponse.indexOf('"topics":');
        if (topicsIndex !== -1) {
          let jsonStr = cleanResponse.substring(0, topicsIndex) + '"topics":[]';
          // Try to close the JSON properly
          if (!jsonStr.endsWith('}')) {
            jsonStr += '}';
          }
          
          try {
            JSON.parse(jsonStr); // Test if it's valid now
            // If we get here, return fallback topics
            return this.getFallbackTopics();
          } catch {
            // Still broken, return fallback
            return this.getFallbackTopics();
          }
        }
        
        // If all else fails, return fallback topics
        return this.getFallbackTopics();
      }

    } catch (error) {
      console.error('Failed to parse topic response:', response.substring(0, 200) + '...');
      console.log('🔄 Using fallback topics due to parsing error');
      return this.getFallbackTopics();
    }
  }

  private getFallbackTopics(): InsertBlogIdea[] {
    const fallbackTopics = [
      {
        topic: "Professionelle Büroreinigung in Moers - Was Unternehmen wissen sollten",
        category: "unterhaltsreinigung",
        keywords: ["Büroreinigung", "Moers", "Unternehmen", "professionell"],
        isUsed: false
      },
      {
        topic: "Fensterreinigung mit Osmose-Technik - Vorteile für Gewerbebetriebe",
        category: "fensterreinigung", 
        keywords: ["Fensterreinigung", "Osmose", "Gewerbebetriebe", "streifenfrei"],
        isUsed: false
      },
      {
        topic: "Bauabschlussreinigung Kosten - Was kostet die professionelle Endreinigung?",
        category: "bauabschlussreinigung",
        keywords: ["Bauabschlussreinigung", "Kosten", "Endreinigung", "Preise"],
        isUsed: false
      }
    ];
    
    console.log(`📝 Generated ${fallbackTopics.length} fallback topics`);
    return fallbackTopics;
  }

  /**
   * Ensures we have enough unused topics available
   */
  async ensureTopicAvailability(minRequired: number = 3): Promise<void> {
    const unusedTopics = await storage.getUnusedBlogIdeas(minRequired);
    
    if (unusedTopics.length < minRequired) {
      const neededTopics = Math.max(5, minRequired * 2); // Generate some extra
      console.log(`📝 Need ${neededTopics} new topics (${unusedTopics.length} unused, ${minRequired} required)`);
      
      const newTopics = await this.generateNewTopics(neededTopics);
      
      // Save to database
      for (const topic of newTopics) {
        await storage.createBlogIdea(topic);
      }
      
      console.log(`✅ Added ${newTopics.length} new topics to database`);
    } else {
      console.log(`✅ Sufficient topics available: ${unusedTopics.length} unused`);
    }
  }
}