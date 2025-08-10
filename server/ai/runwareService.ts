import { storage } from "../storage";

interface RunwareResponse {
  data: Array<{
    imageURL: string;
    imageName: string;
  }>;
}

export class RunwareService {
  private apiKey: string;
  private baseUrl = "https://api.runware.ai/v1";

  constructor() {
    this.apiKey = process.env.RUNWARE_API_KEY || "ze0oMKK1mkscXUoWaDjkJEYJ29BfqKj5";
    if (!this.apiKey) {
      throw new Error("RUNWARE_API_KEY environment variable is required");
    }
  }

  async generateBlogImage(title: string, category: string): Promise<{ imageUrl: string; imageAlt: string; imagePrompt: string }> {
    const prompt = this.createImagePrompt(title, category);
    const imageAlt = this.generateImageAlt(title, category);
    
    return this.generateImageWithPrompt(prompt, imageAlt);
  }

  async generateBlogImageWithDescription(customPrompt: string, title: string, category: string): Promise<{ imageUrl: string; imageAlt: string; imagePrompt: string }> {
    const imageAlt = this.generateImageAlt(title, category);
    const fullPrompt = `${customPrompt}, high quality, professional photography, bright lighting, modern style, German business environment, trustworthy atmosphere, 16:9 aspect ratio, photorealistic`;
    
    return this.generateImageWithPrompt(fullPrompt, imageAlt);
  }

  private async generateImageWithPrompt(prompt: string, imageAlt: string): Promise<{ imageUrl: string; imageAlt: string; imagePrompt: string }> {
    try {
      const response = await this.callRunware(prompt);
      
      // Log successful generation
      await this.logGeneration(prompt, response.imageURL, true);
      
      return {
        imageUrl: response.imageURL,
        imageAlt,
        imagePrompt: prompt
      };
    } catch (error) {
      // Log failed generation and use fallback image
      await this.logGeneration(prompt, "", false, error instanceof Error ? error.message : "Unknown error");
      
      console.log("🖼️ Using fallback image due to API error");
      
      // Use fallback image from Unsplash with moving/business theme
      const fallbackImages = [
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=800&fit=crop", // Moving truck
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&h=800&fit=crop", // Home interior
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=800&fit=crop", // Moving boxes
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop", // Business office
      ];
      
      const randomImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
      
      return {
        imageUrl: randomImage,
        imageAlt,
        imagePrompt: prompt
      };
    }
  }

  private createImagePrompt(title: string, category: string): string {
    const basePrompts = {
      "Umzugstipps": "Professional moving team in Munich, modern moving truck, organized boxes, sunny day, German cityscape background",
      "Packen & Organisieren": "Neatly organized moving boxes, professional packing materials, clean modern interior, systematic organization",
      "München & Umgebung": "Munich skyline, traditional Bavarian architecture, modern moving services, professional business environment",
      "Geschäftsumzüge": "Business office relocation, professional team in suits, modern office equipment, corporate environment",
      "Umzugsrecht & Versicherung": "Professional consultation, documents on desk, handshake, business meeting, trust and reliability",
      "Haushalt & Wohnen": "Beautiful modern home interior, family setting, comfortable living space, new home atmosphere"
    };

    const categoryPrompt = basePrompts[category as keyof typeof basePrompts] || basePrompts["Umzugstipps"];
    
    return `${categoryPrompt}, high quality, professional photography, bright lighting, modern style, German business environment, trustworthy atmosphere, 16:9 aspect ratio, photorealistic`;
  }

  private generateImageAlt(title: string, category: string): string {
    // SEO-optimierte Alt-Tags mit Keywords
    const keywordMap = {
      "Umzugstipps": "Umzug München Tipps",
      "Packen & Organisieren": "Umzugskartons packen München",
      "München & Umgebung": "Umzug München Umgebung",
      "Geschäftsumzüge": "Büroumzug München professionell",
      "Umzugsrecht & Versicherung": "Umzugsrecht München Beratung",
      "Haushalt & Wohnen": "Haushaltsumzug München Service"
    };

    const categoryKeyword = keywordMap[category as keyof typeof keywordMap] || "Umzug München";
    return `${categoryKeyword} - ${title.substring(0, 80)} | Walter Braun Umzüge`;
  }

  private async callRunware(prompt: string): Promise<{ imageURL: string; imageName: string }> {
    const taskUUID = this.generateUUID();
    
    console.log("🖼️ Calling Runware API with prompt:", prompt.substring(0, 100));
    console.log("🔑 API Key present:", !!this.apiKey);
    
    const payload = [{
      taskType: "imageInference",
      taskUUID: taskUUID,
      outputType: "URL",
      outputFormat: "JPG", 
      positivePrompt: prompt,
      model: "runware:101@1",
      numberResults: 1,
      height: 800,
      width: 1200,
      steps: 30,
      CFGScale: 7.5
    }];
    
    console.log("📤 Sending payload to Runware:", JSON.stringify(payload, null, 2));
    
    const response = await fetch(`${this.baseUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    console.log("📥 Runware response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Runware API error:", response.status, response.statusText, errorText);
      throw new Error(`Runware API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log("📊 Runware response data:", JSON.stringify(data, null, 2));
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error("❌ Invalid Runware response structure:", data);
      throw new Error("No image generated by Runware");
    }

    const imageData = data.find(item => item.taskType === "imageInference");
    if (!imageData || !imageData.imageURL) {
      console.error("❌ No image URL in Runware response:", data);
      throw new Error("No image URL in Runware response");
    }

    console.log("✅ Successfully generated image:", imageData.imageURL);
    
    return {
      imageURL: imageData.imageURL,
      imageName: imageData.imageName || "generated-image"
    };
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private async logGeneration(prompt: string, response: string, success: boolean, error?: string): Promise<void> {
    try {
      await storage.createAiLog({
        type: "image",
        prompt: prompt.substring(0, 1000),
        response: response.substring(0, 500),
        model: "runware",
        success,
        error: error || null
      });
    } catch (logError) {
      console.error("Failed to log Runware generation:", logError);
    }
  }
}