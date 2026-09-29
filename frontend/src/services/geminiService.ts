/**
 * Google Gemini Generative AI Service for WearVerse
 * Powered by Google Gemini 2.5 Flash
 */

interface GeminiChatResponse {
  text: string;
  enhancedPrompt?: string;
  recommendedColor?: string;
  recommendedStyle?: string;
}

export const geminiService = {
  isConfigured(): boolean {
    const key = import.meta.env.VITE_GEMINI_API_KEY || '';
    return Boolean(key && key.trim().length > 10 && !key.includes('YOUR_'));
  },

  getApiKey(): string {
    return import.meta.env.VITE_GEMINI_API_KEY || '';
  },

  /**
   * Generates a conversational streetwear fashion response using Gemini 2.5 Flash
   */
  async generateFashionResponse(
    userPrompt: string, 
    chatHistory: { role: 'user' | 'model'; text: string }[] = []
  ): Promise<GeminiChatResponse> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return {
        text: `⚡ Synthesized bespoke 240 GSM streetwear designs for "${userPrompt}".`,
      };
    }

    const systemInstruction = `You are "WearVerse AI", the premier Senior Fashion Director & Streetwear Stylist for WearVerse — a luxury generative streetwear atelier that produces 240 GSM heavy combed cotton graphic T-shirts with 1200 DPI direct-to-garment (DTG) print craftsmanship.

Your persona:
- High-fashion, knowledgeable in Japanese neo-traditional, vintage motorsport, cyber techwear, typography, sumi-e ink, minimalism, and desi culture.
- Excited, concise, and inspiring. Keep your answers under 3-4 sentences.
- Mention specific fabric details (e.g. 240 GSM heavy jersey, oversized boxy drape, vintage distress, pigment wash).
- At the end, state what graphic is being synthesized.`;

    try {
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

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 250,
          }
        })
      });

      if (!res.ok) {
        console.warn('Gemini API call returned status:', res.status);
        // Fallback to flash-latest or built-in response
        return {
          text: `⚡ Synthesized bespoke 240 GSM streetwear designs for "${userPrompt}".`,
        };
      }

      const data = await res.json();
      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText) {
        return {
          text: generatedText.trim(),
        };
      }
    } catch (err) {
      console.warn('Gemini API error, falling back to local engine:', err);
    }

    return {
      text: `⚡ Synthesized bespoke 240 GSM streetwear designs for "${userPrompt}".`,
    };
  },

  /**
   * Use Gemini to elevate any brief user phrase into a luxury streetwear graphic prompt
   */
  async enhanceStreetwearPrompt(rawPrompt: string): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) return rawPrompt;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Convert this brief streetwear idea into a concise 1-sentence prompt for a 240 GSM oversized graphic T-shirt: "${rawPrompt}". Output only the final prompt text, no quotes, no extra explanations.`
            }]
          }],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 100,
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 5) {
          return text.trim();
        }
      }
    } catch (err) {
      console.warn('Gemini prompt enhancement fallback:', err);
    }

    return rawPrompt;
  }
};
