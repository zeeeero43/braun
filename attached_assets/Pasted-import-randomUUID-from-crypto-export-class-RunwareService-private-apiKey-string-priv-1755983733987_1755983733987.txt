import { randomUUID } from 'crypto';

export class RunwareService {
  private apiKey: string;
  private apiUrl = 'https://api.runware.ai/v1';

  constructor() {
    const apiKey = process.env.RUNWARE_API_KEY;
    if (apiKey) {
      this.apiKey = apiKey;
    } else {
      throw new Error('RUNWARE_API_KEY not set - Runware functionality will be disabled');
    }
  }

  async generateImage(prompt: string): Promise<string> {
    console.log('🎨 Runware API Key check:', {
      exists: !!this.apiKey,
      length: this.apiKey?.length || 0,
      prefix: this.apiKey?.substring(0, 6) || 'none'
    });

    try {
      // Enhance the prompt for better professional results
      const enhancedPrompt = this.enhancePrompt(prompt);
      const taskUUID = randomUUID();

      console.log('🚀 Generating image with Runware...');
      console.log('📝 Enhanced prompt:', enhancedPrompt.substring(0, 100) + '...');

      // Use Runware API with task-based architecture
      const requestBody = [
        {
          taskType: "imageInference",
          taskUUID: taskUUID,
          positivePrompt: enhancedPrompt,
          model: "runware:101@1", // FLUX.1 Dev - fast and high quality
          width: 1024,
          height: 1024,
          steps: 20, // Good balance of quality and speed
          numberResults: 1
        }
      ];

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Runware API error: ${response.status} ${errorData}`);
      }

      const data = await response.json();
      
      // Check for errors in response
      if (data.errors && data.errors.length > 0) {
        const error = data.errors[0];
        throw new Error(`Runware API error: ${error.message}`);
      }

      // Get the image URL from successful response
      const result = data.data?.[0];
      if (!result || !result.imageURL) {
        throw new Error('No image URL received from Runware');
      }

      console.log('✅ Image generated successfully:', result.imageURL);
      return result.imageURL;

    } catch (error) {
      console.error('Runware API error:', error);
      throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private enhancePrompt(originalPrompt: string): string {
    // Add professional styling and quality modifiers
    const enhancements = [
      'professional photography style',
      'high quality',
      'clean and modern',
      'business environment',
      'bright lighting',
      'corporate setting'
    ];

    // Check if prompt already contains professional terms
    const hasEnhancements = enhancements.some(enhancement => 
      originalPrompt.toLowerCase().includes(enhancement.toLowerCase())
    );

    if (hasEnhancements) {
      return originalPrompt;
    }

    return `${originalPrompt}, professional photography style, high quality, clean and modern business environment, bright lighting`;
  }

  async generateBlogHeroImage(imagePrompt: string, category: string): Promise<string> {
    // Create category-specific enhancements
    const categoryEnhancements: Record<string, string> = {
      'unterhaltsreinigung': 'modern office space being cleaned, professional cleaning equipment',
      'fensterreinigung': 'glass windows being cleaned, crystal clear results, professional squeegee work',
      'bauabschlussreinigung': 'construction site cleanup, renovation cleaning, before and after',
      'entrümpelung': 'organized space clearing, professional disposal service, clean empty rooms',
      'tipps': 'professional cleaning demonstration, educational setting, expert showing techniques',
      'standards': 'quality control in cleaning, ISO certification symbols, professional standards'
    };

    const categoryPrompt = categoryEnhancements[category] || 'professional cleaning service';
    
    const fullPrompt = `${imagePrompt}, ${categoryPrompt}, representing Grema Gebäudeservice GmbH professional cleaning company`;

    return this.generateImage(fullPrompt);
  }
}