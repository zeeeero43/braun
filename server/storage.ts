import { type User, type InsertUser, type ContactSubmission, type InsertContactSubmission, type AutoBlogPost, type InsertAutoBlogPost, type BlogIdea, type InsertBlogIdea, type AiGenerationLog, type InsertAiGenerationLog } from "@shared/schema";
import { randomUUID } from "crypto";

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
      keywords: Array.isArray(postData.keywords) ? postData.keywords : (typeof postData.keywords === 'string' ? [postData.keywords] : []),
      tags: Array.isArray(postData.tags) ? postData.tags : (typeof postData.tags === 'string' ? [postData.tags] : []),
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
      keywords: Array.isArray(ideaData.keywords) ? ideaData.keywords : (typeof ideaData.keywords === 'string' ? [ideaData.keywords] : []),
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

export const storage = new MemStorage();
