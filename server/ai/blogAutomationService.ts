import { DeepSeekService } from './deepseekService';
import { RunwareService } from './runwareService';
import { TopicGenerationService } from './topicGenerationService';
import { storage } from '../storage';
import type { InsertAutoBlogPost, InsertBlogIdea, InsertAiGenerationLog } from '@shared/schema';

export class BlogAutomationService {
  private deepseekService: DeepSeekService;
  private runwareService: RunwareService;
  private topicGenerationService: TopicGenerationService;
  private isGenerating = false;

  constructor() {
    this.deepseekService = new DeepSeekService();
    this.runwareService = new RunwareService();
    this.topicGenerationService = new TopicGenerationService();
  }

  async initializeBlogIdeas(): Promise<void> {
    console.log('🌱 Initializing dynamic blog topic system...');
    
    try {
      // Use intelligent topic generation instead of hardcoded topics
      await this.topicGenerationService.ensureTopicAvailability(5);
      console.log('✅ Dynamic topic generation system initialized');
    } catch (error) {
      console.error('❌ Failed to initialize dynamic topic system:', error);
      throw error;
    }
  }

  async generateBlogPost(): Promise<{ success: boolean; postId?: number; error?: string }> {
    if (this.isGenerating) {
      return { success: false, error: 'Blog generation already in progress' };
    }

    this.isGenerating = true;
    console.log('🤖 Starting automated blog post generation...');

    try {
      // Ensure we have enough topics available (generate new ones if needed)
      await this.topicGenerationService.ensureTopicAvailability(5);
      
      console.log('📊 Checking topic pool status...');
      const allUnusedTopics = await storage.getBlogIdeas(20);
      console.log(`📝 Available topics: ${allUnusedTopics.length} unused (including local München SEO)`);
      
      // If we're running low on topics (less than 8), generate a larger batch
      if (allUnusedTopics.length < 8) {
        console.log('🔄 Topic pool running low, generating fresh batch with local SEO...');
        await this.topicGenerationService.ensureTopicAvailability(12);
      }
      
      // Get an unused blog topic
      const unusedIdeas = await storage.getBlogIdeas(1);
      if (unusedIdeas.length === 0) {
        console.log('🔄 No unused topics found, generating new ones...');
        await this.topicGenerationService.ensureTopicAvailability(5);
        const retryUnusedIdeas = await storage.getBlogIdeas(1);
        if (retryUnusedIdeas.length === 0) {
          return { success: false, error: 'Failed to generate new topics' };
        }
        return this.generateBlogPost(); // Retry with new topics
      }

      const selectedIdea = unusedIdeas[0];
      console.log(`📝 Selected topic: ${selectedIdea.topic}`);

      // Generate blog content with DeepSeek
      console.log('⚡ Generating content with DeepSeek...');
      const contentStartTime = Date.now();
      
      const blogContent = await this.deepseekService.generateBlogContent({
        topic: selectedIdea.topic,
        category: selectedIdea.category,
        keywords: selectedIdea.keywords
      });

      // Log successful content generation (simplified)
      console.log(`📝 Content generation successful for: ${selectedIdea.topic}`);

      console.log(`✅ Content generated in ${Date.now() - contentStartTime}ms`);

      // Generate hero image with Runware (with fallback)
      let heroImageUrl = '';
      try {
        console.log('🎨 Generating hero image with Runware...');
        const imageStartTime = Date.now();
        
        const imageResult = await this.runwareService.generateBlogImage(
          blogContent.title, // Titel statt imagePrompt verwenden
          selectedIdea.category
        );
        
        heroImageUrl = imageResult.imageUrl; // imageUrl aus dem Objekt extrahieren

        // Log successful image generation (simplified)  
        console.log(`🎨 Image generation successful: ${heroImageUrl}`);

        console.log(`✅ Image generated in ${Date.now() - imageStartTime}ms`);
      } catch (imageError) {
        console.warn('⚠️ Image generation failed, continuing without image:', imageError instanceof Error ? imageError.message : imageError);
        
        // Log failed image generation (simplified)
        console.log(`⚠️ Image generation failed: ${imageError instanceof Error ? imageError.message : 'Unknown error'}`);
        
        // Use a fallback placeholder image or empty string
        heroImageUrl = '';
      }

      // Create the blog post in database
      const newBlogPost: InsertAutoBlogPost = {
        slug: blogContent.slug,
        title: blogContent.title,
        excerpt: blogContent.excerpt,
        content: blogContent.content,
        metaDescription: blogContent.metaDescription,
        keywords: blogContent.keywords,
        tags: blogContent.tags,
        category: selectedIdea.category,
        author: 'Walter Braun Team',
        readTime: blogContent.readTime,
        image: heroImageUrl,
        imageAlt: blogContent.imageAlt,
        imagePrompt: blogContent.imagePrompt,
        faqData: blogContent.faqData,
        isPublished: true, // Auto-publish automated posts
        publishedAt: new Date()
      };

      const createdPost = await storage.createBlogPost(newBlogPost);
      
      // Mark the blog idea as used
      await storage.markBlogIdeaAsUsed(selectedIdea.id);

      console.log(`🎉 Blog post created successfully with ID: ${createdPost.id}`);
      console.log(`📄 Title: ${createdPost.title}`);
      console.log(`🔗 Slug: ${createdPost.slug}`);

      return { success: true, postId: createdPost.id };

    } catch (error) {
      console.error('❌ Blog generation failed:', error);
      
      // Log the error (simplified)
      console.log(`❌ Blog automation error: ${error instanceof Error ? error.message : 'Unknown error'}`);

      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    } finally {
      this.isGenerating = false;
    }
  }

  async publishPendingPosts(): Promise<number> {
    try {
      // Get unpublished posts (basic query, we'll enhance this later)
      const unpublishedPosts = await storage.getBlogPosts(10);
      // Note: This is a placeholder - we need to modify the storage method to get unpublished posts
      
      let publishedCount = 0;
      // For now, we'll auto-publish all generated posts
      // In production, you might want manual review before publishing
      
      console.log(`📤 Auto-publishing ${unpublishedPosts.length} pending posts...`);
      publishedCount = unpublishedPosts.length;
      
      return publishedCount;
    } catch (error) {
      console.error('❌ Failed to publish pending posts:', error);
      return 0;
    }
  }

  async getGenerationStats(): Promise<{
    totalGenerated: number;
    totalPublished: number;
    todayGenerated: number;
    lastGeneration?: Date;
    unusedTopics: number;
  }> {
    try {
      const unusedIdeas = await storage.getBlogIdeas(1000);
      const allPosts = await storage.getBlogPosts(1000);
      
      // Calculate today's generated posts (simplified)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayGenerated = allPosts.filter((post: any) => 
        post.createdAt && new Date(post.createdAt) >= today
      ).length;

      return {
        totalGenerated: allPosts.length,
        totalPublished: allPosts.filter((post: any) => post.isPublished).length,
        todayGenerated,
        lastGeneration: allPosts[0]?.createdAt,
        unusedTopics: unusedIdeas.length
      };
    } catch (error) {
      console.error('❌ Failed to get generation stats:', error);
      return {
        totalGenerated: 0,
        totalPublished: 0,
        todayGenerated: 0,
        unusedTopics: 0
      };
    }
  }

  isCurrentlyGenerating(): boolean {
    return this.isGenerating;
  }
}