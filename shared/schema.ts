import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, serial, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  phone: true,
  email: true,
  message: true,
});

// Automatische Blog-Posts
export const autoBlogPosts = pgTable("auto_blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(), 
  content: text("content").notNull(),
  metaDescription: text("meta_description").notNull(),
  keywords: jsonb("keywords").$type<string[]>().notNull(),
  tags: jsonb("tags").$type<string[]>().default([]).notNull(),
  category: text("category").notNull(),
  author: text("author").default("Team").notNull(),
  readTime: text("read_time").notNull(),
  image: text("image").notNull(),
  imageAlt: text("image_alt").notNull(),
  imagePrompt: text("image_prompt").notNull(),
  faqData: jsonb("faq_data").$type<Array<{question: string, answer: string}>>().default([]).notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Blog-Topic Pool
export const blogIdeas = pgTable("blog_ideas", {
  id: serial("id").primaryKey(),
  topic: text("topic").notNull(),
  category: text("category").notNull(), 
  keywords: jsonb("keywords").$type<string[]>().notNull(),
  isUsed: boolean("is_used").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// AI Generation Logs
export const aiGenerationLogs = pgTable("ai_generation_logs", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'content' or 'image'
  prompt: text("prompt").notNull(),
  response: text("response").notNull(), 
  model: text("model").notNull(), // 'deepseek' or 'runware'
  success: boolean("success").notNull(),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAutoBlogPostSchema = createInsertSchema(autoBlogPosts);
export const insertBlogIdeaSchema = createInsertSchema(blogIdeas);
export const insertAiGenerationLogSchema = createInsertSchema(aiGenerationLogs);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

export type InsertAutoBlogPost = z.infer<typeof insertAutoBlogPostSchema>;
export type AutoBlogPost = typeof autoBlogPosts.$inferSelect;
export type InsertBlogIdea = z.infer<typeof insertBlogIdeaSchema>;
export type BlogIdea = typeof blogIdeas.$inferSelect;
export type InsertAiGenerationLog = z.infer<typeof insertAiGenerationLogSchema>;
export type AiGenerationLog = typeof aiGenerationLogs.$inferSelect;
