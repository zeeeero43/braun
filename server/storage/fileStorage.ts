import { promises as fs } from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';
import type { User, InsertUser, ContactSubmission, InsertContactSubmission, AutoBlogPost, InsertAutoBlogPost, BlogIdea, InsertBlogIdea, AiGenerationLog, InsertAiGenerationLog } from "@shared/schema";
import type { IStorage } from '../storage';

// File-based storage implementation that persists data across restarts
export class FileStorage implements IStorage {
  private dataDir: string;

  constructor(dataDir: string = './data') {
    this.dataDir = dataDir;
    this.ensureDataDir();
  }

  private async ensureDataDir() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create data directory:', error);
    }
  }

  private getFilePath(collection: string): string {
    return path.join(this.dataDir, `${collection}.json`);
  }

  private async readCollection<T>(collection: string): Promise<T[]> {
    try {
      const filePath = this.getFilePath(collection);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // File doesn't exist or is empty - return empty array
      return [];
    }
  }

  private async writeCollection<T>(collection: string, data: T[]): Promise<void> {
    try {
      await this.ensureDataDir();
      const filePath = this.getFilePath(collection);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error(`Failed to write ${collection}:`, error);
      throw error;
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const users = await this.readCollection<User>('users');
    return users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await this.readCollection<User>('users');
    return users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const users = await this.readCollection<User>('users');
    const user: User = {
      ...insertUser,
      id: nanoid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(user);
    await this.writeCollection('users', users);
    return user;
  }

  // Contact submission methods
  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const submissions = await this.readCollection<ContactSubmission>('contact_submissions');
    const submission: ContactSubmission = {
      ...insertSubmission,
      id: nanoid(),
      createdAt: new Date(),
    };
    submissions.push(submission);
    await this.writeCollection('contact_submissions', submissions);
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return this.readCollection<ContactSubmission>('contact_submissions');
  }

  // Blog post methods
  async createBlogPost(postData: Omit<InsertAutoBlogPost, 'id'>): Promise<AutoBlogPost> {
    const posts = await this.readCollection<AutoBlogPost>('blog_posts');
    const post: AutoBlogPost = {
      ...postData,
      id: posts.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    posts.push(post);
    await this.writeCollection('blog_posts', posts);
    console.log(`📝 Blog post saved to file: ${post.title}`);
    return post;
  }

  async getBlogPosts(options?: { category?: string; limit?: number; offset?: number }): Promise<AutoBlogPost[]> {
    const posts = await this.readCollection<AutoBlogPost>('blog_posts');
    let filtered = [...posts];

    if (options?.category) {
      filtered = filtered.filter(post => post.category === options.category);
    }

    // Sort by creation date, newest first
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (options?.offset) {
      filtered = filtered.slice(options.offset);
    }

    if (options?.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered;
  }

  async getBlogPostBySlug(slug: string): Promise<AutoBlogPost | undefined> {
    const posts = await this.readCollection<AutoBlogPost>('blog_posts');
    return posts.find(post => post.slug === slug);
  }

  async getPublishedBlogPosts(options?: { category?: string; limit?: number; offset?: number }): Promise<AutoBlogPost[]> {
    const posts = await this.getBlogPosts(options);
    return posts.filter(post => post.isPublished);
  }

  async getBlogCategories(): Promise<string[]> {
    const posts = await this.readCollection<AutoBlogPost>('blog_posts');
    const categories = [...new Set(posts.map(post => post.category))];
    return categories;
  }

  // Blog idea methods
  async createBlogIdea(ideaData: Omit<InsertBlogIdea, 'id'>): Promise<BlogIdea> {
    const ideas = await this.readCollection<BlogIdea>('blog_ideas');
    const idea: BlogIdea = {
      ...ideaData,
      id: ideas.length + 1,
      createdAt: new Date(),
    };
    ideas.push(idea);
    await this.writeCollection('blog_ideas', ideas);
    return idea;
  }

  async getBlogIdeas(unused?: boolean): Promise<BlogIdea[]> {
    const ideas = await this.readCollection<BlogIdea>('blog_ideas');
    if (unused === undefined) {
      return ideas;
    }
    return ideas.filter(idea => idea.isUsed !== unused);
  }

  async markBlogIdeaAsUsed(id: number): Promise<void> {
    const ideas = await this.readCollection<BlogIdea>('blog_ideas');
    const idea = ideas.find(i => i.id === id);
    if (idea) {
      idea.isUsed = true;
      await this.writeCollection('blog_ideas', ideas);
    }
  }

  async getBlogIdeasCount(unused?: boolean): Promise<number> {
    const ideas = await this.getBlogIdeas(unused);
    return ideas.length;
  }

  // AI log methods
  async createAiLog(logData: Omit<InsertAiGenerationLog, 'id'>): Promise<AiGenerationLog> {
    const logs = await this.readCollection<AiGenerationLog>('ai_logs');
    const log: AiGenerationLog = {
      ...logData,
      id: nanoid(),
      createdAt: new Date(),
    };
    logs.push(log);
    await this.writeCollection('ai_logs', logs);
    return log;
  }
}