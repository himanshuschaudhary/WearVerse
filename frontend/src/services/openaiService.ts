/**
 * OpenAI Generative AI Service for WearVerse
 * Powered by OpenAI DALL-E 3 (Image Generation) and GPT-4o / GPT-4o-mini (Fashion Dialogue)
 */

export interface OpenAiImageGenerationResult {
  url: string;
  revisedPrompt?: string;
}

export interface OpenAiChatResponse {
  text: string;
}

const STORAGE_KEY = 'wearverse_openai_api_key';

export const openaiService = {
  /**
   * Check if OpenAI API key is configured in localStorage or Vite environment
   */
  isConfigured(): boolean {
    const key = this.getApiKey();
    return Boolean(key && key.trim().length > 15 && !key.includes('YOUR_'));
  },

  /**
   * Get current OpenAI API key
   */
  getApiKey(): string {
    const local = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    return (local || import.meta.env.VITE_OPENAI_API_KEY || '').trim();
  },

  /**
   * Set OpenAI API key in localStorage
   */
  setApiKey(key: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, key.trim());
    }
  },

  /**
   * Clear OpenAI API key from localStorage
   */
  clearApiKey(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  /**
   * Generates a photorealistic luxury streetwear design graphic using OpenAI DALL-E 3
   */
  async generateDesignImage(
    prompt: string,
    style?: string
  ): Promise<OpenAiImageGenerationResult | null> {
    const apiKey = this.getApiKey();
    if (!apiKey) return null;

    const refinedPrompt = `Ultra-premium streetwear graphic design: ${prompt}. Centered vector apparel artwork, high-density 1200 DPI direct-to-garment print, dark monochrome background, bold typography, intricate linework, luxury clothing brand merchandise, clean isolated design edges, no mockups or mannequins. ${style ? `Style: ${style}` : ''}`.slice(0, 1000);

    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: refinedPrompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn(`[OpenAI Service] DALL-E 3 request returned ${response.status}:`, errorData);
        return null;
      }

      const data = await response.json();
      const first = data?.data?.[0];
      if (first?.url) {
        return {
          url: first.url,
          revisedPrompt: first.revised_prompt,
        };
      }
    } catch (err) {
      console.warn('[OpenAI Service] DALL-E 3 network error:', err);
    }

    return null;
  },

  /**
   * Generates conversational streetwear fashion commentary using GPT-4o / GPT-4o-mini
   */
  async generateFashionDialogue(
    userPrompt: string,
    chatHistory: { role: 'user' | 'model' | 'assistant'; text: string }[] = []
  ): Promise<string | null> {
    const apiKey = this.getApiKey();
    if (!apiKey) return null;

    const systemPrompt = `You are "WearVerse AI", the Senior Fashion Director & Streetwear Stylist for WearVerse — a luxury generative streetwear atelier creating 240 GSM heavy combed cotton graphic T-shirts and 450 GSM dual-sided heavyweight hoodies with 1200 DPI direct-to-garment (DTG) print craftsmanship.

Your persona:
- Elite streetwear director knowledgeable in Japanese neo-traditional, cricket & sports streetwear, vintage motorsport, cyber techwear, typography, sumi-e ink, minimalism, and coder culture.
- Excited, concise, direct, and inspiring. Keep answers between 2 to 3 sentences maximum.
- Mention specific fabric & garment details (e.g. 240 GSM heavy jersey, 450 GSM French terry hoodie, boxy drop-shoulder silhouette, bio-silicon pre-shrunk wash).
- Specifically praise, critique, and provide a stylistic direction for the user's idea: "${userPrompt}".`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.slice(-4).map(h => ({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: h.text,
      })),
      { role: 'user', content: userPrompt },
    ];

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.7,
          max_tokens: 250,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn(`[OpenAI Service] Chat returned ${response.status}:`, errorData);
        return null;
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) {
        return content.trim();
      }
    } catch (err) {
      console.warn('[OpenAI Service] Chat completion network error:', err);
    }

    return null;
  },

  /**
   * Enhances raw user prompts into an elevated streetwear concept using GPT-4o-mini
   */
  async enhanceStreetwearPrompt(rawPrompt: string): Promise<string | null> {
    const apiKey = this.getApiKey();
    if (!apiKey) return null;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a master streetwear prompt engineer. Convert the user idea into a concise 1-sentence prompt for a 240 GSM oversized graphic T-shirt or 450 GSM dual-sided hoodie with 1200 DPI DTG print. Output ONLY the prompt text, no quotes, no extra explanations.',
            },
            {
              role: 'user',
              content: rawPrompt,
            },
          ],
          temperature: 0.6,
          max_tokens: 100,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content?.trim();
        if (text && text.length > 5) return text;
      }
    } catch (err) {
      console.warn('[OpenAI Service] Prompt enhancement error:', err);
    }

    return null;
  },
};
