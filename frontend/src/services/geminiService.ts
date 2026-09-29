/**
 * Google Gemini Generative AI Service for WearVerse
 * Powered by Google Gemini 2.5 Flash / 3.5 Flash
 */

interface GeminiChatResponse {
  text: string;
  enhancedPrompt?: string;
  recommendedColor?: string;
  recommendedStyle?: string;
}

function generateIntelligentFashionCritique(prompt: string): string {
  const p = prompt.toLowerCase();
  let themeDetail = 'contemporary high-fashion streetwear with balanced negative space';
  let printTech = '1200 DPI Direct-to-Garment pigment infusion';
  let fabricSpec = '240 GSM heavy combed compact cotton in a boxy drop-shoulder cut';

  if (p.includes('cyber') || p.includes('tech') || p.includes('neon') || p.includes('mech')) {
    themeDetail = 'neo-Tokyo cyberpunk circuitry and high-voltage neon gradients';
    printTech = 'high-density vector DTG with electric pigment saturation';
  } else if (p.includes('samurai') || p.includes('ronin') || p.includes('kanji') || p.includes('japan')) {
    themeDetail = 'traditional Japanese sumi-e monochrome ink-brush strokes and crimson kanji calligraphy';
    printTech = 'distressed water-based discharge ink for authentic vintage texture';
  } else if (p.includes('dragon') || p.includes('beast') || p.includes('tiger')) {
    themeDetail = 'coiling mythical beast anatomy with intricate scales and dynamic linework';
    printTech = 'multi-layer CMYK+W direct-to-garment print';
  } else if (p.includes('car') || p.includes('drift') || p.includes('racing') || p.includes('jdm')) {
    themeDetail = '90s midnight JDM motorsport culture with turbo burnout smoke and chrome typography';
    printTech = 'mineral acid-wash compatible screenprint DTG';
  } else if (p.includes('minimal') || p.includes('simple') || p.includes('zen') || p.includes('geo')) {
    themeDetail = 'refined sacred geometry and minimalist negative-space line art';
    printTech = 'fine-line single-pass precision vector print';
    fabricSpec = '240 GSM organic unbleached cream cotton with enzyme pre-shrunk wash';
  } else if (p.includes('code') || p.includes('dev') || p.includes('prog') || p.includes('hacker') || p.includes('git')) {
    themeDetail = 'monochrome terminal syntax, matrix glyphs, and brutalist developer typography';
    printTech = 'high-contrast vector silk print';
  }

  return `🔥 Synthesizing bespoke aesthetic for "${prompt}". Formulating ${themeDetail} onto ${fabricSpec}. Fabric treated with pre-shrunk bio-wash and ${printTech}.`;
}

// Available active Gemini models in order of preference
const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-3.5-flash'];

export const geminiService = {
  isConfigured(): boolean {
    const key = localStorage.getItem('wearverse_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
    return Boolean(key && key.trim().length > 10 && !key.includes('YOUR_'));
  },

  getApiKey(): string {
    return localStorage.getItem('wearverse_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
  },

  /**
   * Helper to execute Gemini generation with fallback across models
   */
  async executeGemini(bodyPayload: any): Promise<string | null> {
    const apiKey = this.getApiKey();
    if (!apiKey) return null;

    for (const model of GEMINI_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text.trim();
        } else {
          console.warn(`Gemini model ${model} returned status: ${res.status}`);
        }
      } catch (err) {
        console.warn(`Gemini error on model ${model}:`, err);
      }
    }
    return null;
  },

  /**
   * Generates a conversational streetwear fashion response using Gemini 2.5 Flash / 3.5 Flash
   */
  async generateFashionResponse(
    userPrompt: string, 
    chatHistory: { role: 'user' | 'model'; text: string }[] = []
  ): Promise<GeminiChatResponse> {
    const systemInstruction = `You are "WearVerse AI", the Senior Fashion Director & Streetwear Stylist for WearVerse — a luxury generative streetwear atelier producing 240 GSM heavy combed cotton graphic T-shirts with 1200 DPI direct-to-garment (DTG) print craftsmanship.

Your persona:
- Elite streetwear director knowledgeable in Japanese neo-traditional, vintage motorsport, cyber techwear, typography, sumi-e ink, minimalism, and coder culture.
- Excited, concise, direct, and inspiring. Keep answers between 2 to 3 sentences maximum.
- Mention specific fabric details (e.g. 240 GSM heavy jersey, boxy drop-shoulder silhouette, bio-silicon pre-shrunk wash).
- Specifically praise, critique, and provide a stylistic direction for the user's idea: "${userPrompt}".`;

    const contents = [
      ...chatHistory.slice(-4).map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      })),
      {
        role: 'user',
        parts: [{ text: userPrompt }]
      }
    ];

    const bodyPayload = {
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 250,
      }
    };

    const text = await this.executeGemini(bodyPayload);
    if (text) {
      return { text };
    }

    return {
      text: generateIntelligentFashionCritique(userPrompt),
    };
  },

  /**
   * Use Gemini to elevate any brief user phrase into a luxury streetwear graphic prompt
   */
  async enhanceStreetwearPrompt(rawPrompt: string): Promise<string> {
    const bodyPayload = {
      contents: [{
        parts: [{
          text: `Convert this brief streetwear idea into a concise 1-sentence prompt for a 240 GSM oversized graphic T-shirt: "${rawPrompt}". Output only the final prompt text, no quotes, no extra explanations.`
        }]
      }],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 100,
      }
    };

    const enhanced = await this.executeGemini(bodyPayload);
    if (enhanced && enhanced.length > 5) {
      return enhanced;
    }

    return rawPrompt;
  }
};

