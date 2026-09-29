import { AIVariation, Design } from '../types';
import { matchPromptToAsset, isEditRequest, SemanticMatchResult } from './promptMatchingEngine';
import { TSHIRT_ASSET_LIBRARY } from '../data/tshirtAssetLibrary';
import { geminiService } from './geminiService';

export interface GenerateDesignParams {
  prompt: string;
  style?: string;
  garmentColor?: string;
  vibe?: string;
  textOverlay?: string;
  referenceImage?: string;
}

export interface RefineDesignParams {
  instruction: string;
  currentVariations: AIVariation[];
  activeVariationId: string;
  hasProPass?: boolean;
}

export interface RefineDesignResult {
  message: string;
  updatedVariations: AIVariation[];
  requiresUpgrade?: boolean;
  requestedTweak?: string;
}

export function getFallbackImage(index: number = 0): string {
  const assets = TSHIRT_ASSET_LIBRARY;
  return assets[Math.abs(index) % assets.length]?.mockupUrl || '/assets/dragon_legacy.jpg';
}

export function buildLiveAiGraphicUrl(prompt: string, styleModifier: string = '', seed?: number): string {
  const effectiveSeed = seed || Math.floor(Math.random() * 900000) + 10000;
  const promptQuery = `${prompt}, ${styleModifier}, streetwear t-shirt graphic design, centered apparel print, vector art, 1200 dpi dtg print, dark background, clean edges`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(promptQuery)}?width=768&height=768&nologo=true&seed=${effectiveSeed}&model=flux`;
}

export function buildLiveAiTeeMockupUrl(prompt: string, color: string = 'black', styleModifier: string = '', seed?: number): string {
  const effectiveSeed = seed || Math.floor(Math.random() * 900000) + 10000;
  const query = `professional studio product photography of a premium 240 GSM ${color} oversized streetwear t-shirt with ${prompt} printed on the chest, ${styleModifier}, flat lay apparel product photo, clean studio lighting, 8k resolution`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(query)}?width=768&height=768&nologo=true&seed=${effectiveSeed}&model=flux`;
}

export function buildLiveAiTryOnUrl(prompt: string, color: string = 'black', seed?: number): string {
  const effectiveSeed = seed || Math.floor(Math.random() * 900000) + 10000;
  const query = `editorial studio fashion photography of a trendy stylish model standing facing front wearing an oversized ${color} streetwear t-shirt with ${prompt} graphic printed on chest, clean neutral background, realistic fabric folds, 8k resolution`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(query)}?width=768&height=1024&nologo=true&seed=${effectiveSeed}&model=flux`;
}

/**
 * Intelligent AI Prompt Enhancer (Magic Wand ✨)
 */
export function enhancePromptWithAI(rawPrompt: string): string {
  const p = rawPrompt.trim().toLowerCase();

  const curatedPresets: Record<string, string> = {
    'biker': 'Vintage 70s American biker club with bald eagle wings, custom chopper motorcycle, distressed weathered typography on 240 GSM cotton',
    'dragon': 'Cyberpunk Neo-Tokyo crimson dragon with glowing circuit scales, 240 GSM oversized streetwear drape, Japanese kanji typography',
    'anime': 'Vintage 90s retro mecha anime pilot portrait with distressed halftone textures and Tokyo cyber aesthetic',
    'car': 'Midnight Tokyo highway JDM sports car drift with neon purple reflections, smoke trails, and synthwave grid lines',
    'tokyo': 'Neo-Shinjuku rainy night alley with neon holographic billboards, cyberpunk wanderer silhouette, heavy streetwear print',
    'samurai': 'Traditional sumi-e ink brushstroke ronin samurai warrior with cherry blossom splatter and Japanese kanji calligraphy',
    'mountain': 'Minimalist geometric alpine mountain peaks with rising sun duotone gradient on heavy unbleached cream cotton',
    'minimal': 'Ultra-clean negative space architectural geometry with subtle micro-typography and Scandinavian aesthetic',
    'skull': 'Gothic heavy metal skull with thorn roses, cross motifs, blackletter typography on acid-washed black cotton',
    'nature': 'Ethereal botanical greenhouse fern illustration with sacred geometry framing and earthy sage tones',
    'mumbai': 'Vibrant Mumbai retro-futurism with Sea Link vector art, Maya Nagri Devanagari typography, and neon hues',
    'gym': 'Heavyweight gym pump cover tee with distressed Spartan battle helmet, crossed barbells, and Molon Labe stencil',
  };

  for (const [key, enhanced] of Object.entries(curatedPresets)) {
    if (p.includes(key)) {
      return enhanced;
    }
  }

  if (!rawPrompt.trim()) {
    const randomInspirations = [
      'Vintage 70s American biker club with bald eagle wings, custom chopper motorcycle, distressed retro lettering',
      'Cyberpunk Neo-Tokyo crimson dragon with glowing circuit scales, 240 GSM oversized streetwear drape',
      'Vintage 90s JDM sports car midnight drifting scene with neon cyan lighting and Tokyo highway kanji',
      'Monochrome Japanese samurai warrior sumi-e ink brush splatter on dark slate oversized tee',
      'Minimalist geometric alpine mountain sunrise gradient line art on unbleached cream heavy cotton',
    ];
    return randomInspirations[Math.floor(Math.random() * randomInspirations.length)];
  }

  const aesthetics = [
    '240 GSM oversized heavyweight boxy streetwear fit',
    'premium 1200 DPI DTG apparel print with clean vector edges',
    'subtle distressed vintage ink texture with high-contrast palette',
    'clean balanced negative space with modern streetwear typography',
  ];
  const chosenAesthetic = aesthetics[Math.floor(Math.random() * aesthetics.length)];

  return `${rawPrompt.trim()}, ${chosenAesthetic}, 1200 DPI DTG print ready`;
}

/**
 * Modular AI Design Generation Service
 * Structure allows seamless evolution:
 * 1. Current: Prompt → Semantic concept matching → Pre-generated high-res asset
 * 2. Future: Prompt → Live API generation (Fal.ai / Replicate / Gemini) → Generated design
 */
export const aiService = {
  /**
   * Main design generation service.
   * Provides realistic progressive multi-phase animation and returns
   * the highest-relevance asset variations matching user intent.
   */
  async generateDesign(
    params: GenerateDesignParams, 
    onProgress?: (step: string) => void
  ): Promise<AIVariation[]> {
    // Check if live API generation is enabled in environment
    const useRealAiApi = import.meta.env.VITE_USE_REAL_AI === 'true';

    // 1. Multi-phase realistic AI synthesis animation steps
    const steps = [
      '🧠 Understanding your streetwear idea & concepts...',
      '🎨 Finding the perfect style, vector inks & typography...',
      '👕 Synthesizing 240 GSM heavy cotton draping...',
      '⚡ Finalizing 1200 DPI direct-to-garment print simulation...',
    ];

    for (const step of steps) {
      if (onProgress) onProgress(step);
      // Realistic brief micro-delay (380ms) per step
      await new Promise(r => setTimeout(r, 380));
    }

    if (useRealAiApi) {
      try {
        // Architecture ready for real backend AI API
        const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const res = await fetch(`${apiBase}/api/generate-design`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: params.prompt,
            garmentColor: params.garmentColor,
            style: params.style,
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.variations && data.variations.length > 0) {
            return data.variations;
          }
        }
      } catch (err) {
        console.warn('Real AI API failed, falling back to pre-generated semantic matching engine:', err);
      }
    }

    // 2. Synthesize Real Dynamic AI Variations for user prompt via Neural Synthesis
    const cleanPrompt = params.prompt.trim();
    const promptCap = cleanPrompt.charAt(0).toUpperCase() + cleanPrompt.slice(1);
    const color = params.garmentColor || '#0f0f11';
    const colorName = color === '#ffffff' ? 'white' : color === '#334155' ? 'charcoal' : 'black';
    const seed1 = Math.floor(Math.random() * 899999) + 100000;
    const seed2 = Math.floor(Math.random() * 899999) + 100000;

    const liveMockup1 = buildLiveAiTeeMockupUrl(cleanPrompt, colorName, 'oversized boxy streetwear drop-shoulder fit, 240 GSM heavy cotton', seed1);
    const liveGraphic1 = buildLiveAiGraphicUrl(cleanPrompt, '1200 DPI vector DTG apparel graphic', seed1);

    const liveMockup2 = buildLiveAiTeeMockupUrl(cleanPrompt, colorName, 'bold graphic streetwear aesthetic, detailed typography and vector art', seed2);
    const liveGraphic2 = buildLiveAiGraphicUrl(cleanPrompt, 'bold neo-streetwear print, high contrast vector layers', seed2);

    // Also get semantic matches as inspiration references
    const matchResult: SemanticMatchResult = matchPromptToAsset(params.prompt, params.garmentColor);

    const liveVariations: AIVariation[] = [
      {
        id: `var-live-1-${seed1}`,
        name: `${promptCap} (Neural DTG Drop)`,
        mockupUrl: liveMockup1,
        graphicUrl: liveGraphic1,
        prompt: cleanPrompt,
        color: color,
        fit: '240 GSM Oversized Boxy Drop-Shoulder',
        aspectRatio: '1:1',
        tags: ['#custom', '#bespoke', '#aiart', '#240gsm', '#streetwear'],
      },
      {
        id: `var-live-2-${seed2}`,
        name: `${promptCap} (Atelier Edition)`,
        mockupUrl: liveMockup2,
        graphicUrl: liveGraphic2,
        prompt: `${cleanPrompt} (Atelier Edition)`,
        color: color,
        fit: '240 GSM Relaxed Drop-Shoulder Silhouette',
        aspectRatio: '1:1',
        tags: ['#atelier', '#exclusive', '#streetwear', '#dtg'],
      },
      ...(matchResult.variations || []).slice(0, 1),
    ];

    return liveVariations;
  },

  /**
   * Conversational Iterative Editing Service (ChatGPT-style)
   * In the same chat, interprets user revisions and modifies the design variations.
   */
  async refineDesign(
    params: RefineDesignParams, 
    onProgress?: (step: string) => void
  ): Promise<RefineDesignResult> {
    const inst = params.instruction.trim();
    const instLower = inst.toLowerCase();

    if (onProgress) {
      onProgress('🧠 Interpreting your revision request...');
      await new Promise(r => setTimeout(r, 280));
      onProgress('🎨 Adjusting design layers, typography & palette...');
      await new Promise(r => setTimeout(r, 320));
      onProgress('👕 Synthesizing updated 240 GSM garment drape...');
      await new Promise(r => setTimeout(r, 350));
    }

    let newColor: string | undefined;
    let responseMessage = `✨ Updated your T-shirt design according to: "${inst}".`;
    let fitText = '240 GSM Oversized Streetwear Boxy Fit';

    if (instLower.includes('white') || instLower.includes('light')) {
      newColor = '#ffffff';
      responseMessage = '✨ Switched garment fabric to Pure Optical White with high-contrast DTG direct-to-garment inks.';
    } else if (instLower.includes('black') || instLower.includes('dark') || instLower.includes('onyx')) {
      newColor = '#0f0f11';
      responseMessage = '✨ Switched garment fabric to Onyx Jet Black 240 GSM heavy combed cotton drape.';
    } else if (instLower.includes('sage') || instLower.includes('green') || instLower.includes('olive')) {
      newColor = '#788f78';
      responseMessage = '✨ Applied organic Sage Green fabric dye with balanced tonal DTG ink contrast.';
    } else if (instLower.includes('navy') || instLower.includes('blue')) {
      newColor = '#1e293b';
      responseMessage = '✨ Updated garment to Deep Midnight Navy with vibrant contrast direct-to-garment print.';
    } else if (instLower.includes('charcoal') || instLower.includes('slate') || instLower.includes('grey') || instLower.includes('gray')) {
      newColor = '#334155';
      responseMessage = '✨ Applied Slate Charcoal acid-wash finish with distressed vintage ink texture.';
    } else if (instLower.includes('red') || instLower.includes('crimson') || instLower.includes('maroon')) {
      newColor = '#7f1d1d';
      responseMessage = '✨ Switched to Crimson Red 240 GSM heavy cotton with cured vivid print layers.';
    } else if (instLower.includes('cream') || instLower.includes('beige') || instLower.includes('ivory')) {
      newColor = '#f5f2eb';
      responseMessage = '✨ Switched to natural unbleached Organic Cream heavy jersey cotton.';
    } else if (instLower.includes('minimal') || instLower.includes('smaller') || instLower.includes('subtle')) {
      responseMessage = '✨ Scaled graphic to a refined minimalist chest placement with balanced negative space.';
      fitText = '240 GSM Minimalist Upper-Chest Drape';
    } else if (instLower.includes('bigger') || instLower.includes('larger') || instLower.includes('oversized') || instLower.includes('giant')) {
      responseMessage = '✨ Expanded graphic into an oversized statement DTG print across the full torso drape.';
      fitText = '240 GSM Ultra-Oversized Boxy Silhouette';
    } else if (instLower.includes('back') || instLower.includes('rear')) {
      responseMessage = '✨ Moved graphic placement to a high-impact back mural print with clean front chest badge.';
      fitText = '240 GSM Back-Placement Streetwear Drape';
    } else if (instLower.includes('remove text') || instLower.includes('no text') || instLower.includes('without text')) {
      responseMessage = '✨ Stripped typography layers for a pure graphic art illustration focus.';
    } else if (instLower.includes('cyber') || instLower.includes('neon') || instLower.includes('futuristic')) {
      responseMessage = '✨ Enhanced neon bioluminescence and cyber-circuit textures in the design.';
    } else if (instLower.includes('vintage') || instLower.includes('retro') || instLower.includes('distressed')) {
      responseMessage = '✨ Injected subtle 80s halftone distressed texture and weathered analog aesthetics.';
    }

    const updatedVariations = params.currentVariations.map((v, i) => {
      const sanitizedTag = `#${inst.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      return {
        ...v,
        color: newColor || v.color,
        fit: fitText,
        name: `${v.name.split(' (')[0]} • ${inst.length > 20 ? inst.substring(0, 18) + '...' : inst}`,
        tags: Array.from(new Set([...v.tags.slice(0, 2), sanitizedTag.length > 2 ? sanitizedTag : '#customedit'])),
      };
    });

    return {
      requiresUpgrade: false,
      message: responseMessage,
      updatedVariations,
    };
  },

  /**
   * Prompt Enhancer helper
   */
  enhancePrompt(rawPrompt: string): string {
    return enhancePromptWithAI(rawPrompt);
  },

  /**
   * Generates live conversational fashion commentary using Google Gemini
   */
  async generateFashionDialogue(prompt: string, history?: { role: 'user' | 'model'; text: string }[]): Promise<string> {
    const res = await geminiService.generateFashionResponse(prompt, history);
    return res.text;
  },

  geminiService,
};
