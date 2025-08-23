import { BlogAutomationService } from './blogAutomationService';

export class BlogScheduler {
  private automationService: BlogAutomationService;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  // Schedule: Every 80 hours (~3.3 days) with slight random variation
  private readonly BASE_INTERVAL = 80 * 60 * 60 * 1000; // 80 hours in milliseconds
  private readonly RANDOM_VARIATION = 4 * 60 * 60 * 1000; // ±4 hours random variation
  
  constructor() {
    this.automationService = new BlogAutomationService();
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️ Blog scheduler is already running');
      return;
    }

    console.log('🚀 Starting automated blog scheduler...');
    console.log(`⏰ Will generate blog posts every ~${this.BASE_INTERVAL / (60 * 60 * 1000)} hours (with random variation)`);

    // Initialize blog topics on startup
    try {
      await this.automationService.initializeBlogIdeas();
      console.log('✅ Blog topic database initialized');
    } catch (error) {
      console.error('❌ Failed to initialize blog topics:', error);
    }

    // Generate first post immediately (optional - remove if you don't want immediate generation)
    this.generatePostSafely();

    // Set up recurring generation with random interval
    this.scheduleNextGeneration();

    this.isRunning = true;
    console.log('✅ Blog scheduler started successfully');
  }

  stop(): void {
    if (!this.isRunning) {
      console.log('⚠️ Blog scheduler is not running');
      return;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    console.log('🛑 Blog scheduler stopped');
  }

  private getRandomInterval(): number {
    // Generate random variation: BASE_INTERVAL ± RANDOM_VARIATION
    const variation = (Math.random() - 0.5) * 2 * this.RANDOM_VARIATION;
    const interval = this.BASE_INTERVAL + variation;
    console.log(`🎯 Next blog generation in ${(interval / (60 * 60 * 1000)).toFixed(1)} hours`);
    return interval;
  }

  private scheduleNextGeneration(): void {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
    }
    
    const interval = this.getRandomInterval();
    this.intervalId = setTimeout(() => {
      this.generatePostSafely();
      // Schedule the next one after this completes
      this.scheduleNextGeneration();
    }, interval) as NodeJS.Timeout;
  }

  private async generatePostSafely(): Promise<void> {
    try {
      console.log('🔄 Scheduled blog generation starting...');
      const result = await this.automationService.generateBlogPost();
      
      if (result.success) {
        console.log(`✅ Scheduled generation successful - Post ID: ${result.postId}`);
        
        // Get and log current stats
        const stats = await this.automationService.getGenerationStats();
        console.log(`📊 Generation Stats:`);
        console.log(`   Total Generated: ${stats.totalGenerated}`);
        console.log(`   Total Published: ${stats.totalPublished}`);
        console.log(`   Today Generated: ${stats.todayGenerated}`);
        console.log(`   Unused Topics: ${stats.unusedTopics}`);
      } else {
        console.error(`❌ Scheduled generation failed: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Critical error in scheduled generation:', error);
    }
  }

  async getStatus(): Promise<{
    isRunning: boolean;
    nextGeneration?: Date;
    stats: any;
  }> {
    const stats = await this.automationService.getGenerationStats();
    
    let nextGeneration: Date | undefined;
    if (this.isRunning && this.intervalId) {
      // Calculate next generation time (approximate)
      nextGeneration = new Date(Date.now() + this.getRandomInterval());
    }

    return {
      isRunning: this.isRunning,
      nextGeneration,
      stats
    };
  }

  async triggerManualGeneration(): Promise<{ success: boolean; postId?: number; error?: string }> {
    console.log('🎯 Manual blog generation triggered...');
    return await this.automationService.generateBlogPost();
  }
}

// Global scheduler instance
export const blogScheduler = new BlogScheduler();