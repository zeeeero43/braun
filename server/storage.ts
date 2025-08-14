import { type User, type InsertUser, type ContactSubmission, type InsertContactSubmission, type AutoBlogPost, type InsertAutoBlogPost, type BlogIdea, type InsertBlogIdea, type AiGenerationLog, type InsertAiGenerationLog } from "@shared/schema";
import { users, contactSubmissions, autoBlogPosts, blogIdeas, aiGenerationLogs } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  
  // Blog functionality
  createBlogPost(post: Omit<InsertAutoBlogPost, 'id'>): Promise<AutoBlogPost>;
  getBlogPosts(options?: { category?: string; limit?: number; offset?: number }): Promise<AutoBlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<AutoBlogPost | undefined>;
  getPublishedBlogPosts(options?: { category?: string; limit?: number; offset?: number }): Promise<AutoBlogPost[]>;
  getBlogCategories(): Promise<string[]>;
  
  // Blog ideas
  createBlogIdea(idea: Omit<InsertBlogIdea, 'id'>): Promise<BlogIdea>;
  getBlogIdeas(unused?: boolean): Promise<BlogIdea[]>;
  markBlogIdeaAsUsed(id: number): Promise<void>;
  getBlogIdeasCount(unused?: boolean): Promise<number>;
  
  // AI logs
  createAiLog(log: Omit<InsertAiGenerationLog, 'id'>): Promise<AiGenerationLog>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contactSubmissions: Map<string, ContactSubmission>;
  private blogPosts: Map<number, AutoBlogPost>;
  private blogIdeas: Map<number, BlogIdea>;
  private aiLogs: Map<number, AiGenerationLog>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.contactSubmissions = new Map();
    this.blogPosts = new Map();
    this.blogIdeas = new Map();
    this.aiLogs = new Map();
    this.currentId = 1;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = randomUUID();
    const submission: ContactSubmission = { 
      ...insertSubmission, 
      id,
      createdAt: new Date()
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  // Blog functionality
  async createBlogPost(postData: Omit<InsertAutoBlogPost, 'id'>): Promise<AutoBlogPost> {
    const id = this.currentId++;
    const now = new Date();
    const post: AutoBlogPost = {
      id,
      ...postData,
      keywords: Array.isArray(postData.keywords) ? postData.keywords as string[] : (typeof postData.keywords === 'string' ? [postData.keywords] : []),
      tags: Array.isArray(postData.tags) ? postData.tags as string[] : (typeof postData.tags === 'string' ? [postData.tags] : []),
      createdAt: now,
      updatedAt: now,
      publishedAt: postData.isPublished ? (postData.publishedAt || now) : null
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async getBlogPosts(options?: { category?: string; limit?: number; offset?: number }): Promise<AutoBlogPost[]> {
    let posts = Array.from(this.blogPosts.values());
    
    if (options?.category) {
      posts = posts.filter(post => post.category === options.category);
    }
    
    posts.sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0));
    
    if (options?.offset) {
      posts = posts.slice(options.offset);
    }
    
    if (options?.limit) {
      posts = posts.slice(0, options.limit);
    }
    
    return posts;
  }

  async getBlogPostBySlug(slug: string): Promise<AutoBlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async getPublishedBlogPosts(options?: { category?: string; limit?: number; offset?: number }): Promise<AutoBlogPost[]> {
    let posts = Array.from(this.blogPosts.values()).filter(post => post.isPublished);
    
    if (options?.category) {
      posts = posts.filter(post => post.category === options.category);
    }
    
    posts.sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0));
    
    if (options?.offset) {
      posts = posts.slice(options.offset);
    }
    
    if (options?.limit) {
      posts = posts.slice(0, options.limit);
    }
    
    return posts;
  }

  async getBlogCategories(): Promise<string[]> {
    const categories = new Set<string>();
    Array.from(this.blogPosts.values())
      .filter(post => post.isPublished)
      .forEach(post => categories.add(post.category));
    return Array.from(categories);
  }

  // Blog ideas
  async createBlogIdea(ideaData: Omit<InsertBlogIdea, 'id'>): Promise<BlogIdea> {
    const id = this.currentId++;
    const idea: BlogIdea = {
      id,
      ...ideaData,
      keywords: Array.isArray(ideaData.keywords) ? ideaData.keywords as string[] : (typeof ideaData.keywords === 'string' ? [ideaData.keywords] : []),
      createdAt: new Date()
    };
    this.blogIdeas.set(id, idea);
    return idea;
  }

  async getBlogIdeas(unused?: boolean): Promise<BlogIdea[]> {
    let ideas = Array.from(this.blogIdeas.values());
    if (unused !== undefined) {
      ideas = ideas.filter(idea => idea.isUsed !== unused);
    }
    return ideas.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async markBlogIdeaAsUsed(id: number): Promise<void> {
    const idea = this.blogIdeas.get(id);
    if (idea) {
      this.blogIdeas.set(id, { ...idea, isUsed: true });
    }
  }

  async getBlogIdeasCount(unused?: boolean): Promise<number> {
    if (unused === undefined) {
      return this.blogIdeas.size;
    }
    return Array.from(this.blogIdeas.values()).filter(idea => idea.isUsed !== unused).length;
  }

  // AI logs
  async createAiLog(logData: Omit<InsertAiGenerationLog, 'id'>): Promise<AiGenerationLog> {
    const id = this.currentId++;
    const log: AiGenerationLog = {
      id,
      ...logData,
      error: logData.error || null,
      createdAt: new Date()
    };
    this.aiLogs.set(id, log);
    return log;
  }
}

// PostgreSQL Storage Implementation
export class PostgreSQLStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    const sql = neon(process.env.DATABASE_URL!);
    this.db = drizzle(sql);
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const result = await this.db.insert(contactSubmissions).values(insertSubmission).returning();
    return result[0];
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await this.db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }

  // Blog functionality with PostgreSQL
  async createBlogPost(postData: Omit<InsertAutoBlogPost, 'id'>): Promise<AutoBlogPost> {
    const insertData = {
      slug: postData.slug,
      title: postData.title,
      excerpt: postData.excerpt,
      content: postData.content,
      metaDescription: postData.metaDescription,
      keywords: Array.isArray(postData.keywords) ? postData.keywords as string[] : [],
      tags: Array.isArray(postData.tags) ? postData.tags as string[] : [],
      category: postData.category,
      author: postData.author || "Walter Braun Umzüge Team",
      readTime: postData.readTime,
      image: postData.image,
      imageAlt: postData.imageAlt,
      imagePrompt: postData.imagePrompt,
      faqData: Array.isArray(postData.faqData) ? postData.faqData as Array<{question: string, answer: string}> : [],
      isPublished: postData.isPublished || true,
      publishedAt: postData.publishedAt
    };
    
    const result = await this.db.insert(autoBlogPosts).values(insertData).returning();
    return result[0];
  }

  async getBlogPosts(options?: { category?: string; limit?: number; offset?: number }): Promise<AutoBlogPost[]> {
    let baseQuery = this.db.select().from(autoBlogPosts);
    
    if (options?.category) {
      baseQuery = baseQuery.where(eq(autoBlogPosts.category, options.category));
    }
    
    let finalQuery = baseQuery.orderBy(desc(autoBlogPosts.createdAt));
    
    if (options?.limit) {
      finalQuery = finalQuery.limit(options.limit);
    }
    
    if (options?.offset) {
      finalQuery = finalQuery.offset(options.offset);
    }
    
    return await finalQuery;
  }

  async getBlogPostBySlug(slug: string): Promise<AutoBlogPost | undefined> {
    const result = await this.db.select().from(autoBlogPosts).where(eq(autoBlogPosts.slug, slug));
    return result[0];
  }

  async getPublishedBlogPosts(options?: { category?: string; limit?: number; offset?: number }): Promise<AutoBlogPost[]> {
    let baseQuery = this.db.select().from(autoBlogPosts).where(eq(autoBlogPosts.isPublished, true));
    
    if (options?.category) {
      baseQuery = baseQuery.where(eq(autoBlogPosts.category, options.category));
    }
    
    let finalQuery = baseQuery.orderBy(desc(autoBlogPosts.publishedAt));
    
    if (options?.limit) {
      finalQuery = finalQuery.limit(options.limit);
    }
    
    if (options?.offset) {
      finalQuery = finalQuery.offset(options.offset);
    }
    
    return await finalQuery;
  }

  async getBlogCategories(): Promise<string[]> {
    const result = await this.db.selectDistinct({ category: autoBlogPosts.category }).from(autoBlogPosts);
    return result.map(r => r.category);
  }

  // Blog ideas
  async createBlogIdea(ideaData: Omit<InsertBlogIdea, 'id'>): Promise<BlogIdea> {
    const insertData = {
      topic: ideaData.topic,
      category: ideaData.category,
      keywords: Array.isArray(ideaData.keywords) ? ideaData.keywords as string[] : [],
      isUsed: ideaData.isUsed || false
    };
    
    const result = await this.db.insert(blogIdeas).values(insertData).returning();
    return result[0];
  }

  async getBlogIdeas(unused?: boolean): Promise<BlogIdea[]> {
    let baseQuery = this.db.select().from(blogIdeas);
    
    if (unused !== undefined) {
      baseQuery = baseQuery.where(eq(blogIdeas.isUsed, !unused));
    }
    
    return await baseQuery.orderBy(blogIdeas.createdAt);
  }

  async markBlogIdeaAsUsed(id: number): Promise<void> {
    await this.db.update(blogIdeas).set({ isUsed: true }).where(eq(blogIdeas.id, id));
  }

  async getBlogIdeasCount(unused?: boolean): Promise<number> {
    let baseQuery = this.db.select().from(blogIdeas);
    
    if (unused !== undefined) {
      baseQuery = baseQuery.where(eq(blogIdeas.isUsed, !unused));
    }
    
    const result = await baseQuery;
    return result.length;
  }

  // AI logs
  async createAiLog(logData: Omit<InsertAiGenerationLog, 'id'>): Promise<AiGenerationLog> {
    const result = await this.db.insert(aiGenerationLogs).values(logData).returning();
    return result[0];
  }
}

// Robust storage with automatic fallback for VPS deployment
class RobustStorage implements IStorage {
  private actualStorage: IStorage | null = null;
  private initialized = false;
  
  private async initializeStorage(): Promise<IStorage> {
    if (this.initialized && this.actualStorage) {
      return this.actualStorage;
    }
    
    // Try PostgreSQL if DATABASE_URL exists
    if (process.env.DATABASE_URL) {
      try {
        console.log("🔄 Testing PostgreSQL connection...");
        const pgStorage = new PostgreSQLStorage();
        
        // Simple connection test
        await pgStorage.getBlogIdeasCount();
        console.log("✅ PostgreSQL connection successful");
        
        this.actualStorage = pgStorage;
        this.initialized = true;
        return pgStorage;
        
      } catch (error: any) {
        console.warn("⚠️ PostgreSQL connection failed, falling back to MemStorage");
        console.warn("Error:", error?.message || String(error));
      }
    } else {
      console.log("🔄 No DATABASE_URL found - using MemStorage");
    }
    
    // Fallback to MemStorage
    console.log("✅ Using MemStorage for blog system");
    this.actualStorage = new MemStorage();
    this.initialized = true;
    return this.actualStorage;
  }
  
  async getUser(id: string): Promise<User | undefined> {
    const storage = await this.initializeStorage();
    return storage.getUser(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const storage = await this.initializeStorage();
    return storage.getUserByUsername(username);
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const storage = await this.initializeStorage();
    return storage.createUser(insertUser);
  }
  
  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const storage = await this.initializeStorage();
    return storage.createContactSubmission(insertSubmission);
  }
  
  async getContactSubmissions(): Promise<ContactSubmission[]> {
    const storage = await this.initializeStorage();
    return storage.getContactSubmissions();
  }
  
  async createBlogPost(postData: Omit<InsertAutoBlogPost, 'id'>): Promise<AutoBlogPost> {
    const storage = await this.initializeStorage();
    return storage.createBlogPost(postData);
  }
  
  async getBlogPosts(options?: { category?: string; limit?: number; offset?: number }): Promise<AutoBlogPost[]> {
    const storage = await this.initializeStorage();
    return storage.getBlogPosts(options);
  }
  
  async getBlogPostBySlug(slug: string): Promise<AutoBlogPost | undefined> {
    const storage = await this.initializeStorage();
    return storage.getBlogPostBySlug(slug);
  }
  
  async getPublishedBlogPosts(options?: { category?: string; limit?: number; offset?: number }): Promise<AutoBlogPost[]> {
    const storage = await this.initializeStorage();
    return storage.getPublishedBlogPosts(options);
  }
  
  async getBlogCategories(): Promise<string[]> {
    const storage = await this.initializeStorage();
    return storage.getBlogCategories();
  }
  
  async createBlogIdea(ideaData: Omit<InsertBlogIdea, 'id'>): Promise<BlogIdea> {
    const storage = await this.initializeStorage();
    return storage.createBlogIdea(ideaData);
  }
  
  async getBlogIdeas(unused?: boolean): Promise<BlogIdea[]> {
    const storage = await this.initializeStorage();
    return storage.getBlogIdeas(unused);
  }
  
  async markBlogIdeaAsUsed(id: number): Promise<void> {
    const storage = await this.initializeStorage();
    return storage.markBlogIdeaAsUsed(id);
  }
  
  async getBlogIdeasCount(unused?: boolean): Promise<number> {
    const storage = await this.initializeStorage();
    return storage.getBlogIdeasCount(unused);
  }
  
  async createAiLog(logData: Omit<InsertAiGenerationLog, 'id'>): Promise<AiGenerationLog> {
    const storage = await this.initializeStorage();
    return storage.createAiLog(logData);
  }
}

export const storage = new RobustStorage();
