import { DeepSeekService } from "./deepseekService";
import { RunwareService } from "./runwareService";
import { TopicGenerationService } from "./topicGenerationService";
import { storage } from "../storage";

export class BlogScheduler {
  private deepSeekService: DeepSeekService;
  private runwareService: RunwareService;
  private topicService: TopicGenerationService;
  private intervalId: NodeJS.Timeout | null = null;
  
  // 80 hours = 288,000,000 milliseconds
  private readonly GENERATION_INTERVAL = 80 * 60 * 60 * 1000; // 80 hours
  private readonly RANDOM_VARIATION = 4 * 60 * 60 * 1000; // ±4 hours

  constructor() {
    this.deepSeekService = new DeepSeekService();
    this.runwareService = new RunwareService();
    this.topicService = new TopicGenerationService();
  }

  async start(): Promise<void> {
    console.log("🚀 Starting Blog Scheduler...");
    
    try {
      // Initialize topic pool
      await this.topicService.initializeTopicPool();
      console.log("✅ Topic pool initialized");

      // Generate first blog post immediately
      console.log("📝 Generating initial blog post...");
      await this.generateBlogPost();

      // Schedule recurring generation
      this.scheduleNextGeneration();
      
      console.log(`⏰ Blog scheduler started. Next generation in ~${this.GENERATION_INTERVAL / (1000 * 60 * 60)} hours`);
    } catch (error) {
      console.error("❌ Failed to start blog scheduler:", error);
      throw error;
    }
  }

  stop(): void {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
      console.log("🛑 Blog scheduler stopped");
    }
  }

  private scheduleNextGeneration(): void {
    // Add random variation to interval (±4 hours)
    const randomVariation = Math.random() * this.RANDOM_VARIATION * 2 - this.RANDOM_VARIATION;
    const nextInterval = this.GENERATION_INTERVAL + randomVariation;
    
    this.intervalId = setTimeout(async () => {
      try {
        await this.generateBlogPost();
        this.scheduleNextGeneration(); // Schedule next iteration
      } catch (error) {
        console.error("❌ Error in scheduled blog generation:", error);
        // Retry in 30 minutes on error
        setTimeout(() => this.scheduleNextGeneration(), 30 * 60 * 1000);
      }
    }, nextInterval);

    const nextDate = new Date(Date.now() + nextInterval);
    console.log(`⏰ Next blog generation scheduled for: ${nextDate.toLocaleString('de-DE')}`);
  }

  async generateBlogPost(): Promise<void> {
    const startTime = Date.now();
    console.log("🔄 Starting blog post generation...");

    try {
      // Get next topic
      let topic = await this.topicService.getNextTopic();
      if (!topic) {
        console.log("No unused topics found, ensuring topic pool...");
        await this.topicService.ensureTopicPool();
        topic = await this.topicService.getNextTopic();
        
        if (!topic) {
          throw new Error("No topics available for generation even after generating new ones");
        }
      }

      console.log(`📋 Selected topic: ${topic.topic}`);

      // Generate content first, then image with custom description
      console.log("🤖 Generating content with DeepSeek...");
      const blogContent = await this.deepSeekService.generateBlogContent(topic.topic, topic.keywords, topic.category).catch(error => {
        console.error("❌ DeepSeek generation failed:", error);
        throw error;
      });
      
      console.log("🎨 Generating optimized image description...");
      const imageDescription = await this.deepSeekService.generateImageDescription(blogContent.title, topic.category);
      
      console.log("🖼️ Generating image with custom prompt...");
      const imageData = await this.runwareService.generateBlogImageWithDescription(imageDescription, blogContent.title, topic.category).catch(error => {
        console.error("❌ Image generation failed:", error);
        throw error;
      });
      
      console.log("✅ Content generated successfully");

      // Create slug from title
      const slug = this.createSlug(blogContent.title);

      // Save blog post to database
      console.log("💾 Saving blog post to database...");
      console.log(`   📝 Title: ${blogContent.title}`);
      console.log(`   🔗 Slug: ${slug}`);
      
      const newPost = await storage.createBlogPost({
        slug,
        title: blogContent.title,
        excerpt: blogContent.excerpt,
        content: blogContent.content,
        metaDescription: blogContent.metaDescription,
        keywords: blogContent.keywords,
        tags: blogContent.tags,
        category: topic.category,
        author: "Walter Braun Umzüge Team",
        readTime: blogContent.readTime,
        image: imageData.imageUrl,
        imageAlt: imageData.imageAlt,
        imagePrompt: imageData.imagePrompt,
        faqData: blogContent.faq,
        isPublished: true,
        publishedAt: new Date()
      });
      
      console.log(`✅ Blog post saved successfully with ID: ${newPost.id}`);

      const duration = (Date.now() - startTime) / 1000;
      console.log(`✅ Blog post generated successfully in ${duration}s:`);
      console.log(`   📰 Title: ${blogContent.title}`);
      console.log(`   🔗 Slug: ${slug}`);
      console.log(`   📂 Category: ${topic.category}`);
      console.log(`   📊 Words: ~${blogContent.content.split(' ').length}`);

    } catch (error) {
      const duration = (Date.now() - startTime) / 1000;
      console.error(`❌ Blog post generation failed after ${duration}s:`, error);
      throw error;
    }
  }

  private createSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
  }

  // Manual generation trigger (for API endpoint)
  async generateNow(): Promise<void> {
    console.log("🔄 Manual blog generation triggered");
    await this.generateBlogPost();
  }

  // Get generation status
  async getStatus(): Promise<{
    isRunning: boolean;
    nextGenerationTime: string | null;
    topicPoolStatus: any;
  }> {
    const topicPoolStatus = await this.topicService.getTopicPoolStatus();
    
    return {
      isRunning: this.intervalId !== null,
      nextGenerationTime: this.intervalId ? "Running" : null,
      topicPoolStatus
    };
  }
}

// Global scheduler instance
let globalScheduler: BlogScheduler | null = null;

export function startBlogScheduler(): BlogScheduler {
  if (!globalScheduler) {
    globalScheduler = new BlogScheduler();
    globalScheduler.start().catch(error => {
      console.error("Failed to start blog scheduler:", error);
    });
  }
  return globalScheduler;
}

export function getBlogScheduler(): BlogScheduler | null {
  return globalScheduler;
}