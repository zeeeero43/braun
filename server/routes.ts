import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import { blogScheduler } from "./ai/blogScheduler";
import { emailService } from "./services/emailService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      
      // Send email notification
      try {
        await emailService.sendContactFormEmail(submission);
        console.log('📧 Email sent for contact submission:', submission.id);
      } catch (emailError) {
        console.error('❌ Failed to send email for submission:', submission.id, emailError);
        // Continue execution even if email fails - don't break the form submission
      }
      
      res.json({ success: true, id: submission.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        console.error("Contact form submission error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  // Get all contact submissions (for admin purposes)
  app.get("/api/contact-submissions", async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Blog API Routes
  
  // Get all published blog posts
  app.get("/api/blog", async (req, res) => {
    try {
      const { category, limit = 20, offset = 0 } = req.query;
      
      const posts = await storage.getPublishedBlogPosts({
        category: category as string | undefined,
        limit: Number(limit),
        offset: Number(offset)
      });

      console.log(`📊 Blog API: Found ${posts.length} published posts`);
      res.json({ success: true, posts });
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch blog posts" 
      });
    }
  });

  // Debug route to check storage state (must be before /:slug route)
  app.get("/api/blog/debug", async (req, res) => {
    try {
      const allPosts = await storage.getBlogPosts();
      const publishedPosts = await storage.getPublishedBlogPosts();
      
      res.json({ 
        success: true, 
        debug: {
          totalPosts: allPosts.length,
          publishedPosts: publishedPosts.length,
          posts: allPosts.map(p => ({ id: p.id, slug: p.slug, title: p.title, isPublished: p.isPublished }))
        }
      });
    } catch (error) {
      console.error("Debug error:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Get blog categories (must be before /:slug route)
  app.get("/api/blog/categories", async (req, res) => {
    try {
      const categories = await storage.getBlogCategories();
      res.json({ 
        success: true, 
        categories: categories.length > 0 ? categories : ["Umzugstipps", "Ratgeber", "Checklisten"]
      });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch categories" 
      });
    }
  });

  // Manual blog generation (admin endpoint)
  app.post("/api/blog/generate", async (req, res) => {
    try {
      const scheduler = getBlogScheduler();
      if (!scheduler) {
        return res.status(500).json({ 
          success: false, 
          error: "Blog scheduler not initialized" 
        });
      }

      await scheduler.generateNow();
      
      res.json({ success: true, message: "Blog post generated successfully" });
    } catch (error) {
      console.error("Failed to generate blog post:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to generate blog post" 
      });
    }
  });

  // Get topic pool status (admin endpoint)
  app.get("/api/blog/topics", async (req, res) => {
    try {
      const scheduler = getBlogScheduler();
      if (!scheduler) {
        return res.status(500).json({ 
          success: false, 
          error: "Blog scheduler not initialized" 
        });
      }

      const status = await scheduler.getStatus();
      
      res.json({ success: true, status });
    } catch (error) {
      console.error("Failed to get topic status:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to get topic status" 
      });
    }
  });

  // Get single blog post by slug (must be after specific routes)
  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      
      const post = await storage.getBlogPostBySlug(slug);

      if (!post || !post.isPublished) {
        return res.status(404).json({ 
          success: false, 
          error: "Blog post not found" 
        });
      }

      res.json({ success: true, post });
    } catch (error) {
      console.error("Failed to fetch blog post:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch blog post" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
