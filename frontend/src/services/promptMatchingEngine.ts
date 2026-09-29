import { TSHIRT_ASSET_LIBRARY, TShirtAssetMetadata } from '../data/tshirtAssetLibrary';
import { AIVariation } from '../types';

export interface SemanticMatchResult {
  bestMatch: TShirtAssetMetadata;
  score: number;
  matchedConcepts: string[];
  variations: AIVariation[];
  aiResponseText: string;
}

// Common stop words to clean from user prompts
const STOP_WORDS = new Set([
  'create', 'a', 'an', 'the', 'cool', 'make', 't-shirt', 'tshirt', 'tee', 'shirt', 
  'on', 'with', 'and', 'of', 'for', 'in', 'like', 'design', 'give', 'me', 'want', 
  'i', 'need', 'please', 'style', 'looking', 'some', 'any', 'that', 'has', 'have',
  'front', 'back', 'print', 'apparel', 'wear', 't-shirts'
]);

// Conceptual synonym graph for streetwear and fashion queries
const CONCEPT_SYNONYM_MAP: Record<string, string[]> = {
  // Biker & Motorcycle
  biker: ['motorcycle', 'bike', 'chopper', 'harley', 'rider', 'highway', 'rebel', 'garage', 'mechanic', 'engine', 'route 66'],
  motorcycle: ['biker', 'bike', 'chopper', 'harley', 'rider', 'wheels', 'exhaust', 'speed'],
  eagle: ['bald eagle', 'wings', 'bird', 'hawk', 'americana', 'feather'],
  vintage: ['retro', '70s', '80s', '90s', 'distressed', 'weathered', 'old school', 'heritage', 'classic', 'faded', 'grunge'],
  retro: ['vintage', '70s', '80s', '90s', 'nostalgic', 'groovy', 'classic'],
  
  // Dragon & Cyberpunk
  dragon: ['mecha dragon', 'cyber dragon', 'ryu', 'serpent', 'oriental dragon', 'scales', 'beast'],
  cyberpunk: ['cyber', 'mecha', 'robot', 'futuristic', 'sci-fi', 'neon', 'matrix', 'techwear', 'glitch', 'dystopian', 'hacker'],
  japanese: ['japan', 'kanji', 'tokyo', 'samurai', 'anime', 'manga', 'katakana', 'sumie', 'bushido', 'shogun'],
  anime: ['manga', 'anime girl', 'otaku', 'japanese', 'geisha', 'chibi', 'comic'],
  kanji: ['japanese text', 'calligraphy', 'japanese lettering', 'katakana'],
  
  // Cars & JDM
  car: ['sports car', 'jdm', 'drift', 'race car', 'racing', 'supercar', 'speed', 'turbo'],
  jdm: ['tokyo drift', 'initial d', 'sports car', 'japanese car', 'tuner', 'racing'],
  drift: ['tokyo drift', 'jdm', 'slide', 'burnout', 'smoke', 'racing'],
  
  // Samurai & Martial Arts
  samurai: ['warrior', 'katana', 'sword', 'bushido', 'ronin', 'shogun', 'sumi-e', 'ninja'],
  katana: ['sword', 'samurai', 'blade', 'steel'],
  
  // Mountain & Outdoors
  mountain: ['mountains', 'alpine', 'peak', 'hiking', 'nature', 'climb', 'everest', 'alps', 'hills', 'outdoors'],
  nature: ['botanical', 'leaves', 'forest', 'plants', 'trees', 'earthy', 'organic', 'green'],
  minimal: ['minimalist', 'clean', 'simple', 'geometric', 'subtle', 'monochrome', 'line art'],
  
  // Skull & Gothic
  skull: ['skeleton', 'bones', 'death', 'grim', 'head', 'reaper'],
  gothic: ['goth', 'grunge', 'metal', 'heavy metal', 'darkwear', 'dark art', 'emo', 'thorns', 'roses'],
  
  // Space & Cosmic
  space: ['cosmic', 'galaxy', 'universe', 'black hole', 'void', 'stars', 'astronomy', 'celestial'],
  
  // Gym & Fitness
  gym: ['fitness', 'workout', 'lifting', 'muscle', 'bodybuilding', 'powerlifting', 'iron', 'weights', 'spartan', 'pump cover'],
  spartan: ['warrior', 'gym', 'iron', 'helmet', 'gladiator', 'stoic', 'greek'],
  
  // Indian & Desi
  mumbai: ['bombay', 'indian', 'india', 'desi', 'sea link', 'gateway of india', 'hindi', 'devanagari'],
  indian: ['desi', 'mumbai', 'delhi', 'hindi', 'devanagari', 'mandala', 'ethnic'],
  
  // Coding & Tech
  code: ['coding', 'programmer', 'developer', 'software', 'hacker', 'matrix', 'terminal', 'tech', 'computer'],
  coffee: ['caffeine', 'espresso', 'mug', 'latte', 'steaming', 'coffee cup'],

  // Beer & Weekend Humor
  beer: ['alcohol', 'drink', 'ale', 'lager', 'mug', 'pint', 'foam', 'pub', 'party', 'weekend', 'friday', 'monday', 'evolution', 'drunk', 'cheers', 'diving', 'brewery'],
  friday: ['weekend', 'beer', 'friday', 'monday', 'evolution', 'work', 'party', 'tgif', 'cheers'],
  weekend: ['friday', 'beer', 'evolution', 'party', 'chill', 'drink'],

  // Astronaut & Space Coffee
  astronaut: ['space', 'cosmonaut', 'helmet', 'spacesuit', 'nasa', 'apollo', 'spacetravel', 'coffee', 'need my space', 'introvert', 'planets', 'saturn', 'stars'],
  
  // Cosmic Portal & Event Horizon
  portal: ['wormhole', 'stargate', 'multiverse', 'dimension', 'event horizon', 'cosmic', 'voyager', 'interstellar', 'hyperdrive', 'gateway', 'nebula', 'traveler']
};

/**
 * Tokenize and normalize user prompt into keywords
 */
export function extractPromptTokens(prompt: string): string[] {
  const normalized = prompt.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ');
  const tokens = normalized
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 1 && !STOP_WORDS.has(t));
  return Array.from(new Set(tokens));
}

/**
 * Expand tokens with domain synonyms
 */
export function expandWithSynonyms(tokens: string[]): string[] {
  const expanded = new Set<string>(tokens);
  
  for (const token of tokens) {
    if (CONCEPT_SYNONYM_MAP[token]) {
      for (const syn of CONCEPT_SYNONYM_MAP[token]) {
        expanded.add(syn);
      }
    }
    // Check if token contains a known root
    for (const [key, syns] of Object.entries(CONCEPT_SYNONYM_MAP)) {
      if (token.includes(key)) {
        expanded.add(key);
        syns.forEach(s => expanded.add(s));
      }
    }
  }

  return Array.from(expanded);
}

/**
 * Match user prompt against T-Shirt Asset Library using weighted semantic scoring
 */
export function matchPromptToAsset(userPrompt: string, preferredGarmentColor?: string): SemanticMatchResult {
  const promptTokens = extractPromptTokens(userPrompt);
  const expandedTokens = expandWithSynonyms(promptTokens);
  const rawLowerPrompt = userPrompt.toLowerCase();

  let highestScore = -1;
  let bestMatch: TShirtAssetMetadata = TSHIRT_ASSET_LIBRARY[0];
  let bestMatchedConcepts: string[] = [];

  for (const asset of TSHIRT_ASSET_LIBRARY) {
    let score = 0;
    const matchedConcepts: string[] = [];

    // 1. Direct prompt phrase match (+60 points)
    for (const phrase of asset.promptPhrases) {
      if (rawLowerPrompt.includes(phrase.toLowerCase()) || phrase.toLowerCase().includes(rawLowerPrompt)) {
        score += 60;
        matchedConcepts.push(`phrase: "${phrase}"`);
        break;
      }
    }

    // 2. Main Subject Match (+35 points)
    const subjectTokens = extractPromptTokens(asset.mainSubject);
    for (const st of subjectTokens) {
      if (promptTokens.includes(st)) {
        score += 35;
        matchedConcepts.push(st);
      } else if (expandedTokens.includes(st)) {
        score += 20;
        matchedConcepts.push(st);
      }
    }

    // 3. Visual Elements & Objects (+25 points)
    for (const elem of [...asset.visualElements, ...asset.objectsAndCharacters]) {
      const elemLower = elem.toLowerCase();
      if (rawLowerPrompt.includes(elemLower)) {
        score += 25;
        matchedConcepts.push(elem);
      } else {
        const elemWords = elemLower.split(/\s+/);
        for (const ew of elemWords) {
          if (promptTokens.includes(ew)) {
            score += 15;
            matchedConcepts.push(ew);
            break;
          }
        }
      }
    }

    // 4. Keyword and Synonym Matches (+15 points each)
    for (const kw of asset.keywords) {
      const kwLower = kw.toLowerCase();
      if (rawLowerPrompt.includes(kwLower)) {
        score += 18;
        matchedConcepts.push(kw);
      } else if (expandedTokens.includes(kwLower)) {
        score += 10;
        matchedConcepts.push(kw);
      }
    }

    // 5. Style, Art Style & Niche Matches (+20 points)
    const styleLower = `${asset.style} ${asset.artStyle} ${asset.niche} ${asset.theme}`.toLowerCase();
    for (const token of promptTokens) {
      if (styleLower.includes(token)) {
        score += 15;
        matchedConcepts.push(token);
      }
    }

    // 6. Garment / Palette Color Match (+12 points)
    if (preferredGarmentColor && asset.availableColors.includes(preferredGarmentColor)) {
      score += 12;
    }
    for (const color of ['black', 'white', 'cream', 'sage', 'green', 'navy', 'blue', 'red', 'yellow', 'charcoal']) {
      if (rawLowerPrompt.includes(color)) {
        if (asset.keywords.includes(color) || asset.defaultGarmentColor.toLowerCase().includes(color)) {
          score += 15;
          matchedConcepts.push(`color: ${color}`);
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = asset;
      bestMatchedConcepts = Array.from(new Set(matchedConcepts));
    }
  }

  // Return 1 high-impact hero design tailored to user's prompt (No duplicate results!)
  const selectedColor = preferredGarmentColor || bestMatch.defaultGarmentColor;
  const customTitle = generateTailoredTitle(userPrompt, bestMatch);

  const variations: AIVariation[] = [
    {
      id: `var-${Date.now()}-1`,
      name: `${customTitle} • 240 GSM Graphic`,
      mockupUrl: bestMatch.mockupUrl,
      graphicUrl: bestMatch.graphicUrl,
      prompt: userPrompt,
      color: selectedColor,
      fit: bestMatch.fit,
      aspectRatio: '1:1',
      tags: bestMatch.tags.slice(0, 4),
    }
  ];

  const aiResponseText = `⚡ Synthesized custom streetwear design for "${userPrompt}":\n• Aesthetic: ${bestMatch.theme} (${bestMatch.style})\n• Fabric Specs: 240 GSM heavy combed cotton drape with 1200 DPI direct-to-garment ink textures.\n• Virtual Try-On is available below!`;

  return {
    bestMatch,
    score: highestScore,
    matchedConcepts: bestMatchedConcepts,
    variations,
    aiResponseText
  };
}

/**
 * Generate a dynamic tailored title mirroring prompt words
 */
function generateTailoredTitle(prompt: string, asset: TShirtAssetMetadata): string {
  const words = prompt.trim().split(/\s+/).slice(0, 4);
  const capitalized = words
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
  return capitalized.length > 5 ? capitalized : asset.name;
}

/**
 * Detect if a user message is requesting an iterative edit / modification
 * of an existing design versus a fresh creation request.
 */
export function isEditRequest(userMessage: string): boolean {
  const lower = userMessage.toLowerCase().trim();

  // 1. Explicit creation keywords always mean a NEW design, not an edit
  const newDesignPrefixes = [
    'create a', 'create new', 'create me', 'design a', 'design me', 'give me a', 
    'synthesize a', 'generate a', 'draw a', 'show me a', 'i want a', 'i need a',
    'new design', 'another design', 'fresh tee', 'fresh shirt'
  ];
  if (newDesignPrefixes.some(prefix => lower.startsWith(prefix) || lower.includes(prefix))) {
    return false;
  }

  // 2. High-confidence iterative editing phrases
  const directEditPhrases = [
    'make the', 'make it', 'change the', 'change it', 'change to', 'change color',
    'change shirt', 'remove the', 'remove ', 'delete the', 'delete ', 'add text',
    'add a ', 'add some ', 'turn it', 'turn the', 'switch to', 'switch the',
    'tweak the', 'modify the', 'replace the', 'replace with', 'instead of',
    'without the', 'without ', 'more minimal', 'less ', 'smaller ', 'bigger ',
    'can you make', 'can you change', 'can you remove', 'can you add',
    'make text', 'make font', 'color to', 'text to', 'refine this'
  ];
  if (directEditPhrases.some(phrase => lower.includes(phrase))) {
    return true;
  }

  // 3. Short refinement commands starting with edit verbs
  if (
    lower.startsWith('make ') ||
    lower.startsWith('change ') ||
    lower.startsWith('remove ') ||
    lower.startsWith('add ') ||
    lower.startsWith('turn ') ||
    lower.startsWith('switch ') ||
    lower.startsWith('tweak ')
  ) {
    return true;
  }

  // 4. Standalone color / style shifts if under 5 words
  const words = lower.split(/\s+/);
  if (words.length <= 4) {
    if (words.includes('white') || words.includes('black') || words.includes('red') || words.includes('blue') || words.includes('minimal')) {
      if (words.includes('in') || words.includes('to') || words.includes('more') || words.includes('on')) {
        return true;
      }
    }
  }

  return false;
}
