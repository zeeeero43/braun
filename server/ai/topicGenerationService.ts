import { storage } from "../storage";
import { DeepSeekService } from "./deepseekService";

export class TopicGenerationService {
  private deepSeekService: DeepSeekService;
  private readonly MINIMUM_TOPICS = 12;

  constructor() {
    this.deepSeekService = new DeepSeekService();
  }

  async ensureTopicPool(): Promise<void> {
    try {
      // Check current topic count
      const unusedCount = await storage.getBlogIdeasCount(false);

      console.log(`Current unused topics: ${unusedCount}`);

      if (unusedCount < this.MINIMUM_TOPICS) {
        const topicsNeeded = this.MINIMUM_TOPICS - unusedCount + 10; // Generate extra buffer
        console.log(`Generating ${topicsNeeded} new topics...`);
        
        await this.generateNewTopics(topicsNeeded);
      }
    } catch (error) {
      console.error("Failed to ensure topic pool:", error);
      throw error;
    }
  }

  private async generateNewTopics(count: number): Promise<void> {
    const maxRetries = 2;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Topic generation attempt ${attempt}/${maxRetries}...`);
        const newIdeas = await this.deepSeekService.generateTopicIdeas(count);
        
        let successCount = 0;
        for (const idea of newIdeas) {
          try {
            await storage.createBlogIdea({
              topic: idea.topic,
              category: idea.category,
              keywords: idea.keywords,
              isUsed: false
            });
            successCount++;
          } catch (insertError) {
            // Skip if topic already exists
            console.warn(`⚠️ Topic already exists: ${idea.topic}`);
          }
        }
        
        console.log(`✅ Successfully generated ${successCount} new topics`);
        
        if (successCount > 0) {
          return; // Success - exit retry loop
        }
        
      } catch (error: any) {
        console.error(`❌ Topic generation attempt ${attempt} failed:`, error.message || String(error));
        
        if (attempt === maxRetries) {
          console.error("All topic generation attempts failed - blog system will continue with existing topics");
          return; // Don't throw - allow system to continue
        }
        
        // Wait before retry
        const waitTime = attempt * 3000;
        console.log(`⏳ Retrying topic generation in ${waitTime/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  async getNextTopic(): Promise<{ id: number; topic: string; category: string; keywords: string[] } | null> {
    try {
      // Ensure we have enough topics
      await this.ensureTopicPool();

      // Get unused topics
      const topics = await storage.getBlogIdeas(true);

      if (topics.length === 0) {
        console.error("No unused topics available");
        return null;
      }

      // Select random topic
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];

      // Mark as used
      await storage.markBlogIdeaAsUsed(randomTopic.id);

      console.log(`Selected topic: ${randomTopic.topic}`);
      
      return {
        id: randomTopic.id,
        topic: randomTopic.topic,
        category: randomTopic.category,
        keywords: randomTopic.keywords as string[]
      };
    } catch (error) {
      console.error("Failed to get next topic:", error);
      return null;
    }
  }

  async initializeTopicPool(): Promise<void> {
    try {
      const totalCount = await storage.getBlogIdeasCount();

      if (totalCount === 0) {
        console.log("Initializing topic pool with default topics...");
        await this.generateDefaultTopics();
      }

      await this.ensureTopicPool();
    } catch (error) {
      console.error("Failed to initialize topic pool:", error);
      throw error;
    }
  }

  private async generateDefaultTopics(): Promise<void> {
    const defaultTopics = [
      {
        topic: "Umzug in München: Der ultimative Leitfaden für einen stressfreien Wohnungswechsel",
        category: "München & Umgebung",
        keywords: ["Umzug München", "Wohnungswechsel", "Umzugsunternehmen München", "Umzugstipps"]
      },
      {
        topic: "Professionelles Packen: So schützen Sie Ihre Gegenstände beim Umzug",
        category: "Packen & Organisieren",
        keywords: ["Umzug packen", "Packtipps", "Umzugskartons", "Gegenstände schützen"]
      },
      {
        topic: "Geschäftsumzug in München: Planung und Durchführung ohne Betriebsunterbrechung",
        category: "Geschäftsumzüge",
        keywords: ["Geschäftsumzug", "Büroumzug München", "Betriebsumzug", "Firmenumzug"]
      },
      {
        topic: "Umzugskosten kalkulieren: Was kostet ein Umzug in München wirklich?",
        category: "Umzugstipps",
        keywords: ["Umzugskosten", "Umzug Preise", "Kostenvoranschlag", "Umzugsbudget"]
      },
      {
        topic: "Checkliste für den Umzug: Nichts vergessen in 8 Wochen",
        category: "Umzugstipps",
        keywords: ["Umzugscheckliste", "Umzugsplanung", "Umzug organisieren", "Umzugsvorbereitung"]
      }
    ];

    for (const topic of defaultTopics) {
      try {
        await storage.createBlogIdea({
          topic: topic.topic,
          category: topic.category,
          keywords: topic.keywords,
          isUsed: false
        });
      } catch (error) {
        // Skip if already exists
        console.warn(`Default topic already exists: ${topic.topic}`);
      }
    }
  }

  async getTopicPoolStatus(): Promise<{ total: number; unused: number; used: number }> {
    try {
      const total = await storage.getBlogIdeasCount();
      const unused = await storage.getBlogIdeasCount(false);

      return {
        total,
        unused,
        used: total - unused
      };
    } catch (error) {
      console.error("Failed to get topic pool status:", error);
      return { total: 0, unused: 0, used: 0 };
    }
  }
}