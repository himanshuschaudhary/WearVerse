export interface TShirtAssetMetadata {
  id: string;
  name: string;
  slug: string;
  mockupUrl: string;
  graphicUrl: string;
  defaultGarmentColor: string;
  availableColors: string[];
  price: number;
  originalPrice: number;
  fit: string;
  gsm: number;
  
  // 1. Rich Searchable Metadata
  mainSubject: string;
  theme: string;
  style: string;
  artStyle: string;
  colorPalette: string[];
  typographyStyle: string;
  targetAudience: string;
  niche: string;
  mood: string;
  visualElements: string[];
  objectsAndCharacters: string[];
  keywords: string[];
  promptPhrases: string[];
  tags: string[];
}

export const TSHIRT_ASSET_LIBRARY: TShirtAssetMetadata[] = [
  // 0.00 DUAL-SIDED MASTERPIECE: DESI HITTERS STADIUM CRICKET HOODIE
  {
    id: 'asset-desi-hitters-hoodie',
    name: 'Desi Hitters Stadium Edition Dual-Sided Hoodie',
    slug: 'desi-hitters-stadium-edition-hoodie',
    mockupUrl: '/assets/desi_hitters_hoodie_front.jpg',
    graphicUrl: '/assets/desi_hitters_hoodie_front.jpg',
    defaultGarmentColor: '#0a0b10',
    availableColors: ['#0a0b10', '#18181b', '#1e293b'],
    price: 2799,
    originalPrice: 3999,
    fit: 'Oversized Boxy Dropped-Shoulder Hoodie',
    gsm: 450,
    mainSubject: 'Dual-View: Desi Hitters Batter Entering Stadium on Front & Batsman Celebration on Back',
    theme: 'Cricket Streetwear & Galli to Global Heritage',
    style: 'Graffiti Streetwear Inks with Royal Blue & Monochrome Accents',
    artStyle: 'Two-Sided Ultra-HD Direct-To-Garment with Sleeve Prints',
    colorPalette: ['#0a0b10', '#2563eb', '#3b82f6', '#ffffff'],
    typographyStyle: 'Distressed Brush Graffiti (DESI HITTERS • GALLI TO GLOBAL • SAME GAME DIFFERENT BREED)',
    targetAudience: 'Cricket fans, streetwear connoisseurs, athletes, urban culture enthusiasts',
    niche: 'Dual-Sided Cricket & Sports Streetwear Fleece',
    mood: 'Triumphant, fearless, energetic, cultural, legendary',
    visualElements: [
      'cricket', 'desi hitters', 'batsman', 'batter', 'bat', 'stadium', 'floodlights', 
      'galli to global', 'same game different breed', 'cricket people culture forever', 
      'built on galli grounds not just stadiums', 'good players inspire great hitters', 
      'crown', 'back view', 'front view', 'sleeve prints'
    ],
    objectsAndCharacters: ['cricket batsman', 'cricket bat', 'stadium crowd', 'floodlights'],
    keywords: [
      'cricket', 'desi hitters', 'desi', 'hitters', 'bat', 'batsman', 'batter', 
      'stadium', 'galli', 'galli to global', 'hoodie', 'dual sided', 'front and back', 
      'back view', 'front view', '450gsm', 'streetwear', 'sports', 'fleece'
    ],
    promptPhrases: [
      'desi hitters cricket streetwear hoodie with front and back design',
      'cricket batter in stadium dual sided hoodie',
      'galli to global cricket hoodie with front and back view',
      'desi hitters graffiti hoodie with batsman and floodlit stadium'
    ],
    tags: ['#desihitters', '#cricket', '#streetwear', '#hoodie', '#dualsided', '#gallitoglobal', '#450gsm']
  },

  // 0.01 DUAL-SIDED MASTERPIECE: TOKYO KITSUNE & BLOOD MOON RONIN HOODIE
  {
    id: 'asset-kitsune-ronin-dualsided',
    name: 'Tokyo Kitsune & Blood Moon Ronin Dual-Sided Hoodie',
    slug: 'tokyo-kitsune-ronin-dualsided-hoodie',
    mockupUrl: '/assets/kitsune_ronin_hoodie_front.jpg',
    graphicUrl: '/assets/kitsune_ronin_hoodie_front.jpg',
    defaultGarmentColor: '#0a0b10',
    availableColors: ['#0a0b10', '#18181b', '#1e1b4b'],
    price: 2799,
    originalPrice: 3899,
    fit: 'Oversized Boxy Dropped-Shoulder Hoodie',
    gsm: 450,
    mainSubject: 'Dual-View: Kitsune Fox Mask on Front & Lone Mountain Ronin on Back',
    theme: 'Dual-Sided Traditional Japanese Mythology & Streetwear',
    style: 'Sumi-e Ink Wash & Vibrant Crimson Graphic with Front and Back View',
    artStyle: 'Two-Sided Ultra-HD Direct-To-Garment with Sleeve Prints',
    colorPalette: ['#0a0b10', '#dc2626', '#ef4444', '#ffffff'],
    typographyStyle: 'Kanji Brush (東京・夢を追え・過去に囚われず 未来を創る)',
    targetAudience: 'Streetwear connoisseurs, anime enthusiasts, Japanese folklore fans',
    niche: 'Dual-Sided Japanese Anime & Techwear Fleece',
    mood: 'Mythical, dualistic, dramatic, iconic, transcendent',
    visualElements: [
      'kitsune', 'fox mask', 'shrine path', 'lanterns', 'torii gate', 'cherry blossoms', 
      'sakura', 'blood moon', 'red moon', 'ronin', 'samurai', 'kasa hat', 'katana', 
      'pagoda', 'waterfall', 'mountains', 'sleeve prints', 'back view', 'front view'
    ],
    objectsAndCharacters: ['kitsune mask', 'ronin samurai', 'torii gate', 'pagoda', 'waterfall'],
    keywords: [
      'kitsune', 'fox mask', 'reversible', 'dual sided', 'two sided', 'front and back', 
      'back view', 'front view', 'ronin', 'samurai', 'blood moon', 'red moon', 'torii', 
      'hoodie', '450gsm', 'heavyweight', 'tokyo', 'streetwear', 'fleece'
    ],
    promptPhrases: [
      'dual sided black hoodie with kitsune mask on front and ronin samurai on back',
      'two sided japanese hoodie with front and back view',
      'kitsune fox mask front and red moon ronin back hoodie',
      'dual print japanese streetwear hoodie with front and back designs'
    ],
    tags: ['#kitsune', '#ronin', '#dualsided', '#hoodie', '#bloodmoon', '#450gsm', '#tokyo']
  },

  // 0.01 USER MASTERPIECE: BLOOD MOON RONIN BUSHIDO TEE
  {
    id: 'asset-ronin-blood-moon',
    name: 'Blood Moon Ronin Bushido',
    slug: 'blood-moon-ronin-bushido',
    mockupUrl: '/assets/ronin_blood_moon_tee.jpg',
    graphicUrl: '/assets/ronin_blood_moon_tee.jpg',
    defaultGarmentColor: '#0b0c10',
    availableColors: ['#0b0c10', '#1a1d24', '#ffffff'],
    price: 1699,
    originalPrice: 2499,
    fit: 'Oversized Boxy Drop-Shoulder',
    gsm: 240,
    mainSubject: 'Solitary Ronin Samurai atop Mountain with Giant Blood Red Moon',
    theme: 'Traditional Japanese Bushido & Ukiyo-e Streetwear',
    style: 'Sumi-e Ink Wash & Vibrant Crimson Graphic',
    artStyle: 'High-Density Screenprint with Distressed Kanji Brushwork',
    colorPalette: ['#0b0c10', '#dc2626', '#ef4444', '#ffffff'],
    typographyStyle: 'Distressed Japanese Kanji (浪人・東京・道はまだ終わらない)',
    targetAudience: 'Streetwear collectors, anime fans, Japanese culture enthusiasts',
    niche: 'Japanese Anime & Bushido Streetwear',
    mood: 'Epic, solitary, stoic, mythical, high-contrast',
    visualElements: ['ronin', 'samurai', 'kasa hat', 'katana', 'blood moon', 'red moon', 'torii gate', 'waterfall', 'pagoda', 'sakura', 'cherry blossom', 'kanji', 'clouds'],
    objectsAndCharacters: ['ronin', 'samurai warrior', 'torii', 'shrine', 'pagoda'],
    keywords: [
      'ronin', 'samurai', 'blood moon', 'red moon', 'katana', 'sword', 'kasa', 'straw hat', 
      'pagoda', 'waterfall', 'torii', 'shrine', 'sakura', 'cherry blossom', 'kanji', 'japanese', 
      'tokyo', 'bushido', 'warrior', '240gsm', 'streetwear', 'oversized'
    ],
    promptPhrases: [
      'black oversized t-shirt with japanese ronin under blood red moon',
      'ronin with katana and red moon waterfall torii gate',
      'japanese kanji ronin bushido streetwear tee',
      'blood moon samurai with cherry blossoms'
    ],
    tags: ['#ronin', '#bushido', '#bloodmoon', '#sakura', '#kanji', '#streetwear']
  },

  // 0.02 USER MASTERPIECE: TENSHI TOKYO LOST SOULS HOODIE
  {
    id: 'asset-tenshi-lost-souls',
    name: 'Tenshi Tokyo Lost Souls Heavyweight Hoodie',
    slug: 'tenshi-tokyo-lost-souls-hoodie',
    mockupUrl: '/assets/tenshi_lost_souls_hoodie.jpg',
    graphicUrl: '/assets/tenshi_lost_souls_hoodie.jpg',
    defaultGarmentColor: '#0a0b10',
    availableColors: ['#0a0b10', '#111625', '#18181b'],
    price: 2699,
    originalPrice: 3799,
    fit: 'Oversized Boxy Dropped-Shoulder Hoodie',
    gsm: 450,
    mainSubject: 'Winged Fallen Angel with Radiant Halo, Mount Fuji, and Crimson Moon',
    theme: 'Tenshi Dark Fantasy & Neo-Tokyo Streetwear',
    style: 'Detailed Manga Noir with Crimson Glow & Floral Sleeves',
    artStyle: 'All-over Premium DTG with Sleeve Prints and Torii Reflections',
    colorPalette: ['#0a0b10', '#dc2626', '#f87171', '#ffffff', '#e2e8f0'],
    typographyStyle: 'Japanese Calligraphy (天使・失われた魂・東京) with English Gothic Typography',
    targetAudience: 'Streetwear fashion lovers, anime & manga fans, dark aesthetic enthusiasts',
    niche: 'Dark Tenshi Anime Fleece',
    mood: 'Emotional, poetic, dramatic, nocturnal, ethereal',
    visualElements: ['angel', 'winged boy', 'halo', 'mount fuji', 'fuji-san', 'blood moon', 'river town', 'lanterns', 'torii', 'sakura branches', 'sleeve print', 'moon phases'],
    objectsAndCharacters: ['fallen angel', 'tenshi', 'mount fuji', 'torii gate', 'river'],
    keywords: [
      'tenshi', 'angel', 'fallen angel', 'wings', 'halo', 'mount fuji', 'fuji', 'blood moon', 
      'red moon', 'tokyo', 'lost souls', 'sakura', 'cherry blossoms', 'hoodie', '450gsm', 
      'heavyweight', 'streetwear', 'fleece', 'torii', 'lanterns'
    ],
    promptPhrases: [
      'heavyweight black hoodie with winged fallen angel and mount fuji blood moon',
      'tenshi angel hoodie with red cherry blossoms and japanese text',
      'dark anime angel streetwear hoodie with fuji and crimson moon',
      'japanese lost souls tenshi hoodie'
    ],
    tags: ['#tenshi', '#angel', '#hoodie', '#fujisan', '#bloodmoon', '#tokyo', '#450gsm']
  },

  // 0.03 USER MASTERPIECE: TENKAI CELESTIAL REALM RENAISSANCE SWEATSHIRT
  {
    id: 'asset-tenkai-celestial',
    name: 'Tenkai Celestial Realm Renaissance Sweatshirt',
    slug: 'tenkai-celestial-renaissance-sweatshirt',
    mockupUrl: '/assets/tenkai_celestial_sweatshirt.jpg',
    graphicUrl: '/assets/tenkai_celestial_sweatshirt.jpg',
    defaultGarmentColor: '#121316',
    availableColors: ['#121316', '#1e2024', '#1f162b'],
    price: 2499,
    originalPrice: 3499,
    fit: 'Relaxed Drop-Shoulder Boxy Crewneck',
    gsm: 400,
    mainSubject: 'Classical Renaissance Marble Winged Angel Gazing at Purple Cosmic Moon',
    theme: 'Renaissance Sculpture & Celestial Purple Aesthetics',
    style: 'Classical Statuary with Ethereal Violet Hues & Cathedral Ruins',
    artStyle: 'High-Fidelity Photorealistic Graphic with Sleeve Details',
    colorPalette: ['#121316', '#a855f7', '#c084fc', '#e9d5ff', '#ffffff'],
    typographyStyle: 'Kanji Brush (天界・まだ終わっていない) & Modernist English Typography',
    targetAudience: 'Dark academia, fine art streetwear fans, vintage sweatshirt collectors',
    niche: 'Renaissance Statuary & Celestial Streetwear',
    mood: 'Transcendent, majestic, celestial, introspective, divine',
    visualElements: ['marble angel', 'sculpture', 'statue', 'purple moon', 'cathedral ruins', 'waterfall', 'clouds', 'purple sakura', 'fuji polaroid', 'moon phases', 'kanji'],
    objectsAndCharacters: ['marble angel', 'cathedral arch', 'moon', 'stars'],
    keywords: [
      'celestial', 'tenkai', 'marble angel', 'statue', 'sculpture', 'purple moon', 'violet', 
      'cathedral', 'ruins', 'waterfall', 'sweatshirt', 'crewneck', '400gsm', 'renaissance', 
      'sakura', 'fuji', 'dark academia', 'streetwear', 'french terry'
    ],
    promptPhrases: [
      'washed black crewneck sweatshirt with renaissance marble angel and purple moon',
      'tenkai celestial realm angel sweatshirt with cathedral ruins',
      'purple celestial angel statue streetwear sweatshirt',
      'classical sculpture winged angel crewneck with purple moon'
    ],
    tags: ['#celestial', '#tenkai', '#renaissance', '#sweatshirt', '#purplemoon', '#angel']
  },

  // 0. PRO CREATION: 2077 MECHA GENESIS CYBER SAMURAI
  {
    id: 'asset-pro-mecha-samurai',
    name: '2077 Mecha Genesis Cyber Samurai',
    slug: '2077-mecha-cyber-samurai',
    mockupUrl: '/assets/pro_mecha_samurai.jpg',
    graphicUrl: '/assets/pro_mecha_samurai.jpg',
    defaultGarmentColor: '#0f0f11',
    availableColors: ['#0f0f11', '#18181b', '#282c37', '#ffffff'],
    price: 1699,
    originalPrice: 2499,
    fit: 'Oversized Boxy Drop-Shoulder',
    gsm: 240,
    mainSubject: 'Robotic Mecha Samurai with Dual Crimson Energy Katanas',
    theme: 'Neo-Tokyo 2077 Cyber Mecha',
    style: 'Masterpiece Pro AI Mecha Illustration',
    artStyle: 'Ultra-HD Mecha Concept Art with Kanji Calligraphy',
    colorPalette: ['#0f0f11', '#dc2626', '#ef4444', '#f87171', '#ffffff'],
    typographyStyle: 'Distressed Japanese Kanji & Techwear Cyber Stencil',
    targetAudience: 'Streetwear collectors, anime fans, gamers, cyber aesthetics',
    niche: 'Cyber Mecha Streetwear',
    mood: 'Lethal, futuristic, iconic, sharp, high-octane',
    visualElements: ['samurai', 'mecha warrior', 'crimson katana', 'katana blades', 'energy sword', 'kanji', 'japanese calligraphy', 'armor plating', 'robot helm'],
    objectsAndCharacters: ['mecha samurai', 'cyborg ronin', 'robot warrior', 'cyber blade'],
    keywords: [
      'samurai', 'mecha', 'robot', 'katana', 'sword', 'cyberpunk', '2077', 'japanese', 'kanji', 
      'crimson', 'red energy', 'warrior', 'armor', 'pro', 'masterpiece', 'streetwear', 'oversized', 'blade'
    ],
    promptPhrases: [
      'black oversized t-shirt with 2077 mecha samurai holding crimson katanas',
      'futuristic robot samurai with japanese kanji',
      'mecha cyber samurai streetwear tee',
      'cyberpunk samurai with red glowing swords'
    ],
    tags: ['#samurai', '#mecha', '#2077', '#katana', '#cyberpunk', '#procreation']
  },

  // 0.1 PRO CREATION: QUANTUM MATRIX TECHWEAR HOODIE
  {
    id: 'asset-pro-quantum-hoodie',
    name: 'Quantum Matrix Cyber Techwear Hoodie',
    slug: 'quantum-matrix-techwear-hoodie',
    mockupUrl: '/assets/pro_quantum_hoodie.jpg',
    graphicUrl: '/assets/pro_quantum_hoodie.jpg',
    defaultGarmentColor: '#0a0b10',
    availableColors: ['#0a0b10', '#18181b', '#1e1b4b'],
    price: 2799,
    originalPrice: 3999,
    fit: 'Oversized Boxy Dropped-Shoulder Hoodie',
    gsm: 450,
    mainSubject: 'Holographic Quantum Circuit & Matrix Neural Nodes',
    theme: 'Quantum Computing & Cyber Techwear',
    style: 'Iridescent Holographic Matrix DTG',
    artStyle: 'Vector Precision Integrated Circuitry with Bioluminescent Cyan Glow',
    colorPalette: ['#0a0b10', '#06b6d4', '#3b82f6', '#8b5cf6', '#ffffff'],
    typographyStyle: 'Hexadecimal & Quantum Matrix Stencil',
    targetAudience: 'Techwear aficionados, hackers, cyberpunk fans, luxury streetwear',
    niche: 'Cyber Techwear Fleece',
    mood: 'Mysterious, sophisticated, hyper-advanced, sleek',
    visualElements: ['quantum circuit', 'matrix nodes', 'binary code', 'iridescent neon', 'cyan traces', 'hoodie', 'techwear', 'heavyweight fleece'],
    objectsAndCharacters: ['quantum processor', 'cybernetic matrix', 'neural core'],
    keywords: [
      'quantum', 'circuit', 'matrix', 'hoodie', 'techwear', 'cyberpunk', 'cyber', 'cyan', 
      'blue glow', 'holographic', '450gsm', 'fleece', 'pro', 'iridescent', 'binary', 'neural'
    ],
    promptPhrases: [
      'heavyweight black hoodie with glowing cyan quantum circuits',
      'quantum matrix techwear hoodie',
      'cyberpunk circuit board hoodie',
      'iridescent techwear fleece'
    ],
    tags: ['#hoodie', '#quantum', '#circuit', '#techwear', '#cyberpunk', '#450gsm']
  },

  // 1. CYBERPUNK DRAGON & KANJI
  {
    id: 'asset-cyber-dragon',
    name: 'Cyberpunk Dragon Legacy',
    slug: 'cyberpunk-dragon',
    mockupUrl: '/assets/dragon_legacy.jpg',
    graphicUrl: '/assets/dragon_legacy.jpg',
    defaultGarmentColor: '#0f0f11',
    availableColors: ['#0f0f11', '#18181b', '#7f1d1d', '#ffffff'],
    price: 1499,
    originalPrice: 2299,
    fit: 'Oversized Drop-Shoulder',
    gsm: 240,
    mainSubject: 'Mecha Cyber Dragon with Kanji',
    theme: 'Cyberpunk & Japanese Neo-Traditional',
    style: 'Neo-Tokyo Mecha Graphic',
    artStyle: 'High-Density Vector Screenprint with Neon Accents',
    colorPalette: ['#0f0f11', '#dc2626', '#f87171', '#06b6d4', '#ffffff'],
    typographyStyle: 'Futuristic Cyber Kanji & Techwear Stencil Typography',
    targetAudience: 'Streetwear enthusiasts, anime fans, gamers, techwear lovers',
    niche: 'Cyberpunk & Japanese Streetwear',
    mood: 'Fierce, futuristic, high-octane, mythical',
    visualElements: ['dragon', 'oriental dragon', 'mechanical scales', 'cyber wires', 'kanji', 'japanese calligraphy', 'neon red glow', 'circuits', 'mecha horns'],
    objectsAndCharacters: ['dragon', 'mecha beast', 'cyborg serpent'],
    keywords: [
      'dragon', 'cyberpunk', 'cyber', 'red dragon', 'mecha', 'robot', 'japanese', 'kanji', 'tokyo', 
      'neo tokyo', 'scales', 'neon red', 'futuristic', 'techwear', 'asian mythology', 'ryu', 'oriental', 
      'glowing', 'beast', 'serpent', 'oversized', 'anime', 'manga', 'dystopian', 'mechanical'
    ],
    promptPhrases: [
      'black oversized t-shirt with a glowing red cyberpunk dragon',
      'cyberpunk dragon with intricate mechanical scales and kanji',
      'red dragon t-shirt with japanese lettering',
      'futuristic mecha dragon streetwear',
      'cyber dragon tee with glowing red accents',
      'neo tokyo dragon graphic tee'
    ],
    tags: ['#dragon', '#cyberpunk', '#japanese', '#mecha', '#kanji', '#streetwear']
  },

  // 3. TOKYO DRIFT JDM SPORTS CAR
  {
    id: 'asset-tokyo-drift',
    name: 'Tokyo Drift JDM',
    slug: 'tokyo-drift-jdm',
    mockupUrl: '/assets/tokyo_drift.jpg',
    graphicUrl: '/assets/tokyo_drift.jpg',
    defaultGarmentColor: '#282c37',
    availableColors: ['#282c37', '#0f0f11', '#1e293b', '#ffffff'],
    price: 1599,
    originalPrice: 2499,
    fit: 'Relaxed Streetwear Fit',
    gsm: 240,
    mainSubject: 'Midnight JDM Sports Car Drifting',
    theme: 'JDM Automotive & Synthwave',
    style: '90s Midnight Tuner Racing',
    artStyle: 'Neon Cyan & Magenta Synthwave Vector',
    colorPalette: ['#282c37', '#06b6d4', '#ec4899', '#3b82f6', '#0f0f11'],
    typographyStyle: 'Bold Japanese Racing Kanji & 90s Speedometer Decals',
    targetAudience: 'Car lovers, JDM tuners, initial D fans, night drift culture',
    niche: 'Automotive & JDM Anime Racing',
    mood: 'Fast, electric, nostalgic, midnight thrills',
    visualElements: ['sports car', 'jdm car', 'drift smoke', 'neon cyan lighting', 'highway', 'shuto expressway', 'kanji signs', 'headlight beams', 'asphalt reflections'],
    objectsAndCharacters: ['sports car', 'supra', 'rx7', 'skyline', 'tuner car'],
    keywords: [
      'tokyo drift', 'jdm', 'drift', 'sports car', 'race car', 'racing', 'car', 'supercar', 'speed', 
      'neon', 'cyan', 'magenta', 'synthwave', '90s car', 'japanese car', 'initial d', 'midnight runner', 
      'tuner', 'automotive', 'fast', 'kanji', 'retro racing', 'speedway', 'turbo'
    ],
    promptPhrases: [
      'tokyo drift sports car with neon cyan lighting and kanji',
      'vintage 90s jdm sports car midnight drifting scene',
      'japanese racing car t-shirt with neon lights',
      'jdm drift car tee on dark charcoal cotton',
      'synthwave sports car graphic t-shirt',
      'tokyo midnight highway racing shirt'
    ],
    tags: ['#tokyodrift', '#jdm', '#sportscar', '#synthwave', '#racing', '#neon']
  },

  // 4. SAMURAI SUMI-E INK BUSHIDO
  {
    id: 'asset-samurai-brushwork',
    name: 'Samurai Bushido Brushwork',
    slug: 'samurai-bushido',
    mockupUrl: '/assets/samurai.jpg',
    graphicUrl: '/assets/samurai.jpg',
    defaultGarmentColor: '#4b5563',
    availableColors: ['#4b5563', '#0f0f11', '#1f2937', '#f5f2eb'],
    price: 1499,
    originalPrice: 2199,
    fit: 'Heavyweight Oversized Fit',
    gsm: 250,
    mainSubject: 'Japanese Samurai Warrior with Katana',
    theme: 'Traditional Japanese Heritage & Bushido',
    style: 'Monochrome Sumi-e Ink Wash & Splatter',
    artStyle: 'Traditional East Asian Calligraphic Ink Brush',
    colorPalette: ['#0f0f11', '#4b5563', '#9ca3af', '#ffffff', '#e11d48'],
    typographyStyle: 'Authentic Brush Calligraphy Kanji (Courage & Honor)',
    targetAudience: 'Martial artists, anime fans, Japanese culture enthusiasts, darkwear lovers',
    niche: 'Japanese Historical & Anime Art',
    mood: 'Disciplined, heroic, stoic, deadly, honorable',
    visualElements: ['samurai', 'katana sword', 'kabuto helmet', 'armor', 'ink splatter', 'sumi-e brushwork', 'kanji', 'rising sun circle', 'warrior stance'],
    objectsAndCharacters: ['samurai warrior', 'ronin', 'katana', 'sword', 'armor'],
    keywords: [
      'samurai', 'warrior', 'katana', 'sword', 'bushido', 'japanese', 'japan', 'sumi-e', 'ink', 
      'brushwork', 'splatter', 'monochrome', 'black and white', 'ronin', 'ninja', 'shogun', 
      'calligraphy', 'kanji', 'honor', 'courage', 'martial arts', 'traditional ink', 'zen warrior'
    ],
    promptPhrases: [
      'monochrome japanese samurai warrior sumi-e ink brush splatter',
      'japanese samurai with katana sword and kanji calligraphy',
      'traditional ink brush samurai warrior t-shirt',
      'ronin samurai martial art graphic tee',
      'samurai battle stance on dark slate oversized tee',
      'bushido warrior ink splatter streetwear'
    ],
    tags: ['#samurai', '#bushido', '#katana', '#sumie', '#japanese', '#inkart']
  },

  // 5. ALPINE SUNRISE & MINIMAL MOUNTAINS
  {
    id: 'asset-alpine-sunrise',
    name: 'Alpine Sunrise Minimalist',
    slug: 'alpine-sunrise-minimal',
    mockupUrl: '/assets/mountain_vibes.jpg',
    graphicUrl: '/assets/mountain_vibes.jpg',
    defaultGarmentColor: '#f5f2eb',
    availableColors: ['#f5f2eb', '#ffffff', '#e2e8f0', '#0f0f11', '#788f78'],
    price: 1399,
    originalPrice: 1999,
    fit: 'Regular Boxy Fit',
    gsm: 220,
    mainSubject: 'Geometric Alpine Mountains at Sunrise',
    theme: 'Minimalist Outdoors & Nature',
    style: 'Clean Geometric Line Art & Gradient',
    artStyle: 'Architectural Minimalist Vector Art',
    colorPalette: ['#f5f2eb', '#f59e0b', '#0284c7', '#0f172a', '#e2e8f0'],
    typographyStyle: 'Modern Swiss Clean Sans-Serif Coordinates',
    targetAudience: 'Hikers, campers, minimalists, travelers, Scandinavian aesthetic lovers',
    niche: 'Outdoors & Minimalist Adventure',
    mood: 'Serene, fresh, elevated, tranquil, clean',
    visualElements: ['mountains', 'alpine peaks', 'sunrise', 'sun', 'gradient', 'geometric lines', 'contour elevation lines', 'compass coordinates'],
    objectsAndCharacters: ['mountain peaks', 'sun', 'trees', 'hills'],
    keywords: [
      'mountain', 'mountains', 'alpine', 'sunrise', 'sunset', 'minimal', 'minimalist', 'geometric', 
      'line art', 'nature', 'outdoors', 'hiking', 'climbing', 'everest', 'alps', 'cream t-shirt', 
      'gradient', 'clean lines', 'scandinavian', 'aesthetic', 'calm', 'adventure', 'wanderlust'
    ],
    promptPhrases: [
      'minimal geometric alpine mountain sunrise gradient line art',
      'clean minimalist mountain tee on unbleached cream cotton',
      'geometric mountain sunrise with sharp line cuts',
      'outdoor hiking mountain silhouette t-shirt',
      'minimal alpine landscape gradient tee',
      'simple nature mountain vector shirt'
    ],
    tags: ['#minimal', '#mountains', '#alpine', '#nature', '#outdoors', '#sunrise']
  },

  // 6. BROKEN REALITY VAPORWAVE GREEK BUST
  {
    id: 'asset-broken-reality',
    name: 'Broken Reality Greek Bust',
    slug: 'broken-reality-greek',
    mockupUrl: '/assets/broken_reality.jpg',
    graphicUrl: '/assets/broken_reality.jpg',
    defaultGarmentColor: '#ffffff',
    availableColors: ['#ffffff', '#0f0f11', '#1e1b4b', '#f5f2eb'],
    price: 1549,
    originalPrice: 2299,
    fit: 'Oversized Boxy Cut',
    gsm: 240,
    mainSubject: 'Glitch Apollo Greek Statue',
    theme: 'Vaporwave & Cyber Glitch Aesthetics',
    style: 'Digital Distortion & Classical Remix',
    artStyle: 'Chromatic Aberration & 3D Wireframe Overlay',
    colorPalette: ['#ffffff', '#9333ea', '#06b6d4', '#ec4899', '#0f172a'],
    typographyStyle: 'Digital Glitch Roman Capital Serifs',
    targetAudience: 'Digital artists, vaporwave community, aesthetic streetwear fans, tech creators',
    niche: 'Vaporwave & Y2K Cyber Aesthetics',
    mood: 'Surreal, cerebral, aesthetic, nostalgic yet futuristic',
    visualElements: ['greek statue', 'apollo bust', 'glitch distortion', 'pixel decay', 'wireframe grid', 'chromatic aberration', 'neon purple and cyan', 'floating geometry'],
    objectsAndCharacters: ['apollo bust', 'classical marble statue', 'wireframe sphere'],
    keywords: [
      'vaporwave', 'glitch', 'greek statue', 'bust', 'statue', 'apollo', 'sculpture', 'marble', 
      'purple', 'neon cyan', 'aesthetic', 'y2k', 'cyber', 'retro digital', 'broken reality', 
      'pixel', 'wireframe', 'surreal', 'white t-shirt', 'classical art', 'chromatic aberration'
    ],
    promptPhrases: [
      'glitch aesthetic classical greek statue with wireframe 3d grid',
      'vaporwave purple and cyan greek bust on pure white tee',
      'broken reality glitch sculpture streetwear shirt',
      'cyber glitch classical apollo marble bust',
      'retro digital vaporwave aesthetic t-shirt',
      'greek mythology statue with modern glitch effects'
    ],
    tags: ['#vaporwave', '#glitch', '#greekstatue', '#aesthetic', '#surreal', '#y2k']
  },

  // 8. MINIMAL WAVE (HOKUSAI ART)
  {
    id: 'asset-minimal-wave',
    name: 'Minimal Great Wave',
    slug: 'minimal-great-wave',
    mockupUrl: '/assets/minimal_wave.jpg',
    graphicUrl: '/assets/minimal_wave.jpg',
    defaultGarmentColor: '#d7c4ab',
    availableColors: ['#d7c4ab', '#ffffff', '#0f0f11', '#e2e8f0'],
    price: 1399,
    originalPrice: 1999,
    fit: 'Boxy Casual Drop-Shoulder',
    gsm: 230,
    mainSubject: 'Circular Hokusai Ocean Wave',
    theme: 'Minimalist Japanese Traditional Art',
    style: 'Single Uninterrupted Circular Vector Line',
    artStyle: 'Refined Contemporary Ink Line Art',
    colorPalette: ['#d7c4ab', '#0f0f11', '#0284c7', '#ffffff', '#78350f'],
    typographyStyle: 'Subtle Micro-Print Japanese Coordinates',
    targetAudience: 'Surfers, ocean lovers, Japanese art admirers, refined minimalists',
    niche: 'Japanese Culture & Coastal Minimal',
    mood: 'Calm, organic, rhythmic, timeless, zen',
    visualElements: ['ocean wave', 'great wave', 'hokusai', 'circle frame', 'mount fuji', 'foam spray', 'delicate black ink lines', 'sand wash texture'],
    objectsAndCharacters: ['ocean wave', 'water', 'mount fuji'],
    keywords: [
      'wave', 'great wave', 'ocean', 'sea', 'water', 'surf', 'surfer', 'hokusai', 'kanagawa', 
      'japanese', 'japan', 'minimal', 'minimalist', 'circle', 'line art', 'beige', 'sand', 
      'zen', 'clean', 'simple', 'coastal', 'zen circle', 'enso'
    ],
    promptPhrases: [
      'ultra minimal circular great wave of kanagawa vector line art',
      'minimalist ocean wave t-shirt on sand beige cotton',
      'clean single line great wave japanese graphic tee',
      'hokusai wave minimal circle streetwear shirt',
      'subtle japanese surf wave aesthetic tee',
      'modern zen ocean wave line art'
    ],
    tags: ['#wave', '#hokusai', '#minimal', '#japanese', '#ocean', '#clean']
  },

  // 9. MUMBAI NIGHTS & DESI STREETWEAR
  {
    id: 'asset-mumbai-nights',
    name: 'Mumbai Nights Maya Nagri',
    slug: 'mumbai-nights',
    mockupUrl: '/assets/mumbai_nights.jpg',
    graphicUrl: '/assets/mumbai_nights.jpg',
    defaultGarmentColor: '#1e293b',
    availableColors: ['#1e293b', '#0f172a', '#020617', '#0f0f11'],
    price: 1499,
    originalPrice: 2199,
    fit: 'Oversized Boxy Streetwear',
    gsm: 240,
    mainSubject: 'Mumbai Skyline & Sea Link in Neon',
    theme: 'Neo-Indian Heritage & Urban Streetwear',
    style: 'Neon Cyber Cityscape',
    artStyle: 'Geometric Vector Line Art with Hindi Lettering',
    colorPalette: ['#1e293b', '#06b6d4', '#ec4899', '#f59e0b', '#ffffff'],
    typographyStyle: 'Futuristic Stylized Devanagari Hindi Typography (माया नगरी)',
    targetAudience: 'Desi streetwear enthusiasts, Indian diaspora, urban lifestyle, Mumbai city lovers',
    niche: 'Indian Urban & Regional Streetwear',
    mood: 'Vibrant, sleepless, energetic, proud, cinematic',
    visualElements: ['mumbai skyline', 'bandra worli sea link', 'gateway of india', 'local train', 'neon lines', 'devanagari hindi script', 'electric magenta and cyan'],
    objectsAndCharacters: ['sea link bridge', 'gateway of india', 'skyscrapers', 'trains'],
    keywords: [
      'mumbai', 'india', 'indian', 'desi', 'skyline', 'sea link', 'gateway of india', 'hindi', 
      'devanagari', 'neon', 'city of dreams', 'maya nagri', 'bombay', 'urban indian', 'cyber city', 
      'night city', 'magenta', 'cyan', 'navy blue', 'desi streetwear', 'delhi', 'bangalore'
    ],
    promptPhrases: [
      'mumbai city skyline neon geometric line art with hindi typography',
      'indian urban streetwear t-shirt with sea link and gateway of india',
      'neon cyber mumbai nights graphic tee on deep navy cotton',
      'maya nagri devanagari hindi script streetwear t-shirt',
      'desi futuristic city graphic t-shirt',
      'indian city nightscape streetwear apparel'
    ],
    tags: ['#mumbai', '#indian', '#desi', '#neon', '#skyline', '#streetwear']
  },

  // 10. NATURE FLOW & SAGE BOTANICALS
  {
    id: 'asset-nature-flow',
    name: 'Nature Flow Botanicals',
    slug: 'nature-flow-botanicals',
    mockupUrl: '/assets/nature_flow.jpg',
    graphicUrl: '/assets/nature_flow.jpg',
    defaultGarmentColor: '#788f78',
    availableColors: ['#788f78', '#f5f2eb', '#ffffff', '#18181b'],
    price: 1349,
    originalPrice: 1899,
    fit: 'Relaxed Unisex Fit',
    gsm: 220,
    mainSubject: 'Continuous Line Wild Ferns and Leaves',
    theme: 'Organic Botanical Minimalist',
    style: 'Single Line Contour Botanical Art',
    artStyle: 'Organic Minimal Silhouettes',
    colorPalette: ['#788f78', '#f5f2eb', '#2d3748', '#a0aec0'],
    typographyStyle: 'Earthy Serif Monogram & Plant Species Tag',
    targetAudience: 'Eco-conscious creators, plant lovers, neutral tone lovers, calm aesthetic',
    niche: 'Botanical & Organic Lifestyle',
    mood: 'Peaceful, grounding, earthy, organic luxury',
    visualElements: ['wild ferns', 'eucalyptus leaves', 'monstera', 'botanical fronds', 'single continuous line', 'sage green tone', 'organic curves'],
    objectsAndCharacters: ['fern leaves', 'botanical sprigs', 'eucalyptus branch'],
    keywords: [
      'nature', 'botanical', 'leaves', 'plant', 'plants', 'ferns', 'eucalyptus', 'sage green', 
      'earthy', 'green t-shirt', 'minimal', 'minimalist', 'line art', 'organic', 'eco', 
      'florals', 'foliage', 'calm', 'peaceful', 'boho', 'clean'
    ],
    promptPhrases: [
      'continuous minimalist line art of wild ferns and eucalyptus leaves',
      'botanical leaf silhouette t-shirt on dusty sage green cotton',
      'minimal organic plant line drawing streetwear tee',
      'sage green nature lover graphic t-shirt',
      'delicate eucalyptus botanical line art shirt'
    ],
    tags: ['#nature', '#botanical', '#sagegreen', '#minimal', '#lineart', '#plants']
  },

  // 11. COSMIC VOID & SACRED GEOMETRY
  {
    id: 'asset-cosmic-void',
    name: 'Cosmic Void Event Horizon',
    slug: 'cosmic-void-geometry',
    mockupUrl: '/assets/void.jpg',
    graphicUrl: '/assets/void.jpg',
    defaultGarmentColor: '#1f242e',
    availableColors: ['#1f242e', '#0f0f11', '#111827', '#ffffff'],
    price: 1699,
    originalPrice: 2599,
    fit: 'Extreme Oversized Boxy',
    gsm: 260,
    mainSubject: 'Infinite Spiral Vortex & Sacred Geometry',
    theme: 'Dark Techwear & Astronomy',
    style: 'Deep Space Event Horizon & Constellation Rings',
    artStyle: 'Intricate Vector Geometric Stippling',
    colorPalette: ['#1f242e', '#818cf8', '#c084fc', '#ffffff', '#0f172a'],
    typographyStyle: 'Astral Sci-Fi Sans with Roman Numerals',
    targetAudience: 'Techwear fans, space lovers, electronic music producers, sacred geometry enthusiasts',
    niche: 'Space & Sacred Geometry Techwear',
    mood: 'Infinite, mysterious, hypnotic, cosmic, transcendental',
    visualElements: ['spiral vortex', 'black hole', 'sacred geometry', 'mandala rings', 'stars', 'constellations', 'event horizon', 'acid wash texture'],
    objectsAndCharacters: ['black hole', 'galaxy', 'celestial rings', 'stars'],
    keywords: [
      'void', 'space', 'galaxy', 'cosmic', 'universe', 'black hole', 'sacred geometry', 'geometry', 
      'stars', 'constellation', 'mandala', 'vortex', 'astronomy', 'astrology', 'celestial', 
      'dark techwear', 'psychedelic', 'infinite', 'acid wash', 'spiritual', 'portal'
    ],
    promptPhrases: [
      'infinite cosmic void spiral vortex with sacred geometric mandala rings',
      'deep space black hole event horizon graphic t-shirt',
      'celestial sacred geometry techwear tee on acid washed black',
      'cosmic portal galaxy t-shirt with astronomy charts',
      'dark sci-fi space vortex oversized streetwear'
    ],
    tags: ['#void', '#space', '#sacredgeometry', '#cosmic', '#galaxy', '#techwear']
  },

  // 10. MONDAY TO FRIDAY BEER EVOLUTION
  {
    id: 'asset-beer-evolution',
    name: 'Monday to Friday Beer Evolution',
    slug: 'monday-to-friday-beer-evolution',
    mockupUrl: '/assets/evolution_beer.jpg',
    graphicUrl: '/assets/evolution_beer.jpg',
    defaultGarmentColor: '#0f0f11',
    availableColors: ['#0f0f11', '#18181b', '#27272a', '#ffffff'],
    price: 1399,
    originalPrice: 2199,
    fit: 'Boxy Heavyweight Casual',
    gsm: 240,
    mainSubject: 'Evolution of Man into Friday Beer Dive',
    theme: 'Weekend Humor, Beer & Working Culture',
    style: 'Funny Line Art Silhouette with Frothy Amber Beer Mug',
    artStyle: 'Minimalist Vector Silhouette with Realistic Glass',
    colorPalette: ['#0f0f11', '#f59e0b', '#fef3c7', '#ffffff'],
    typographyStyle: 'Clean Minimalist All-Caps Weekday Lettering',
    targetAudience: 'Beer lovers, weekend party goers, office workers, humor enthusiasts',
    niche: 'Humor & Beverage Lifestyle',
    mood: 'Hilarious, weekend anticipation, celebratory, relaxed',
    visualElements: ['crawling silhouette monday', 'tired worker tuesday', 'walking silhouette wednesday', 'leaning thursday', 'diving into beer friday', 'frothy beer mug', 'golden beer'],
    objectsAndCharacters: ['evolving man silhouette', 'beer mug', 'beer foam'],
    keywords: [
      'beer', 'monday', 'friday', 'weekend', 'evolution', 'drunk', 'party', 'working', 
      'office humor', 'pub', 'cheers', 'drink', 'alcohol', 'dive', 'glass', 'mug', 
      'amber', 'foam', 'funny', 'weekday', 'tuesday', 'wednesday', 'thursday', 'weekend vibe'
    ],
    promptPhrases: [
      'monday to friday evolution diving into a beer',
      'funny beer evolution t-shirt',
      'monday tuesday wednesday thursday friday beer mug graphic tee',
      'weekend party beer diving shirt',
      'humorous beer lover graphic black tee',
      'evolution of man into friday cold beer'
    ],
    tags: ['#beer', '#weekend', '#evolution', '#humor', '#funny', '#party']
  },

  // 18. NEED MY SPACE ASTRONAUT COFFEE
  {
    id: 'asset-need-my-space',
    name: 'Need My Space Astronaut Coffee',
    slug: 'need-my-space-astronaut',
    mockupUrl: '/assets/need_my_space.jpg',
    graphicUrl: '/assets/need_my_space.jpg',
    defaultGarmentColor: '#0f0f11',
    availableColors: ['#0f0f11', '#18181b', '#ffffff'],
    price: 1499,
    originalPrice: 2299,
    fit: 'Oversized Streetwear Fit',
    gsm: 240,
    mainSubject: 'Floating Astronaut holding Steaming Coffee Mug with Need My Space slogan',
    theme: 'Space, Astronaut, Introvert & Coffee',
    style: 'Clean Monochrome Bold Line Art Streetwear',
    artStyle: 'High-Contrast White Vector Screenprint',
    colorPalette: ['#0f0f11', '#ffffff', '#e2e8f0'],
    typographyStyle: 'Bold Sans-Serif Slogan Typography (Need My Space)',
    targetAudience: 'Introverts, space lovers, coffee addicts, sci-fi nerds, minimal streetwear fans',
    niche: 'Space & Introvert Humor',
    mood: 'Peaceful, independent, cosmic chill, witty',
    visualElements: ['astronaut floating in zero-g', 'steaming coffee cup', 'saturn ring planet', 'twinkling stars', 'bold NEED MY SPACE text', 'spacesuit helmet'],
    objectsAndCharacters: ['astronaut', 'coffee mug', 'stars', 'saturn planet'],
    keywords: [
      'astronaut', 'space', 'coffee', 'need my space', 'introvert', 'cosmos', 'mug', 
      'stars', 'saturn', 'planets', 'galaxy', 'minimal', 'spacetravel', 'nasa', 
      'astronomy', 'caffeine', 'white on black', 'bold text', 'zero gravity'
    ],
    promptPhrases: [
      'astronaut holding a coffee cup saying need my space',
      'need my space astronaut t-shirt with coffee',
      'minimal white astronaut floating with coffee mug and planets',
      'funny space introvert coffee graphic tee',
      'cute astronaut space coffee streetwear on black tee'
    ],
    tags: ['#astronaut', '#space', '#coffee', '#needmyspace', '#introvert', '#streetwear']
  },

  // 19. EVENT HORIZON COSMIC PORTAL
  {
    id: 'asset-cosmic-portal',
    name: 'Event Horizon Cosmic Portal',
    slug: 'event-horizon-cosmic-portal',
    mockupUrl: '/assets/cosmic_portal.jpg',
    graphicUrl: '/assets/cosmic_portal.jpg',
    defaultGarmentColor: '#0f0f11',
    availableColors: ['#0f0f11', '#09090b', '#18181b'],
    price: 1599,
    originalPrice: 2499,
    fit: 'Heavyweight Boxy Drop-Shoulder',
    gsm: 240,
    mainSubject: 'Lone Traveler Standing in Front of Massive Glowing Multiverse Portal',
    theme: 'Sci-Fi, Cyberpunk, Cosmic Event Horizon & Wormhole',
    style: 'Vibrant Cinematic Hyper-Realism DTG Art',
    artStyle: 'Luminescent Cosmic Energy Burst with Dimensional Shards',
    colorPalette: ['#0f0f11', '#ea580c', '#38bdf8', '#fbbf24', '#ffffff'],
    typographyStyle: 'Pure Cinematic Artwork (Zero Text Distraction)',
    targetAudience: 'Sci-fi fans, interstellar lovers, cinematic art collectors, cyberpunk streetwear',
    niche: 'Cinematic Sci-Fi & Cosmic Art',
    mood: 'Awe-inspiring, epic, mysterious, interstellar, boundless',
    visualElements: ['lone human silhouette in coat', 'massive circular cosmic portal', 'fiery orange energy sphere', 'shattering digital reality shards', 'neon cyan hyperdrive light rays'],
    objectsAndCharacters: ['traveler silhouette', 'wormhole stargate', 'glowing celestial sphere'],
    keywords: [
      'portal', 'cosmic', 'space', 'wormhole', 'event horizon', 'multiverse', 
      'dimension', 'stargate', 'traveler', 'lone voyager', 'nebula', 'interstellar', 
      'hyperdrive', 'solar flare', 'sun', 'sci-fi', 'glowing sphere', 'light burst', 'silhouette'
    ],
    promptPhrases: [
      'lone figure standing in front of a glowing cosmic portal wormhole',
      'cinematic sci-fi event horizon portal t-shirt',
      'multiverse dimension stargate with glowing sphere and light shards',
      'cosmic hyperdrive wormhole space traveler graphic tee',
      'lone traveler facing a glowing alien sun portal on black cotton'
    ],
    tags: ['#portal', '#cosmic', '#scifi', '#wormhole', '#multiverse', '#interstellar']
  },

  // 20. NEO-TOKYO CYBERNETIC TIGER
  {
    id: 'asset-cyber-tiger',
    name: 'Neo-Tokyo Cybernetic Tiger',
    slug: 'neo-tokyo-cybernetic-tiger',
    mockupUrl: '/assets/cyber_tiger.jpg',
    graphicUrl: '/assets/cyber_tiger.jpg',
    defaultGarmentColor: '#0f0f11',
    availableColors: ['#0f0f11', '#18181b', '#ffffff'],
    price: 1599,
    originalPrice: 2499,
    fit: 'Oversized Boxy Heavyweight',
    gsm: 240,
    mainSubject: 'Robotic Cybernetic Bengal Tiger with Bioluminescent Glowing Stripes and Japanese Kanji',
    theme: 'Cyberpunk, Techwear & Japanese Futuristic Beast',
    style: 'High-Density Mecha Vector Art with Neon Glow',
    artStyle: 'Intricate Sci-Fi Robotic Armor with Electric Cyan and Amber Lights',
    colorPalette: ['#0f0f11', '#06b6d4', '#f97316', '#38bdf8', '#ffffff'],
    typographyStyle: 'Dual Japanese Kanji & Heavyweight Modernist Bold Typography',
    targetAudience: 'Streetwear enthusiasts, techwear lovers, anime cyberpunk collectors, gamers',
    niche: 'Cyberpunk & Japanese Animal Streetwear',
    mood: 'Fierce, predatory, futuristic, electrifying, cybernetic',
    visualElements: ['cybernetic tiger prowling', 'neon cyan bioluminescent stripes', 'orange energy conduits', 'mechanical shoulder armor', 'Japanese kanji title', 'techwear stencil typography'],
    objectsAndCharacters: ['cyber tiger', 'mecha beast', 'robotic claws'],
    keywords: [
      'tiger', 'cyber tiger', 'cyberpunk', 'mecha', 'robot', 'japanese', 'kanji', 'neon', 
      'cyan', 'orange', 'bioluminescent', 'beast', 'predator', 'techwear', 'futuristic', 
      'cybernetic', 'heavyweight', 'streetwear', 'oversized', 'neo tokyo'
    ],
    promptPhrases: [
      'neo-tokyo cybernetic tiger with glowing cyan stripes and kanji',
      'cyberpunk robotic tiger on black oversized heavyweight t-shirt',
      'futuristic mecha tiger with bioluminescent neon conduits',
      'japanese techwear cyber beast graphic tee',
      'cyber tiger graphic shirt with orange and cyan lights'
    ],
    tags: ['#tiger', '#cyberpunk', '#japanese', '#mecha', '#techwear', '#streetwear']
  },

  // 21. SPEED DEMON 1982 RACING CLUB
  {
    id: 'asset-speed-demon',
    name: 'Speed Demon 1982 Racing Club',
    slug: 'speed-demon-racing-club',
    mockupUrl: '/assets/speed_demon.jpg',
    graphicUrl: '/assets/speed_demon.jpg',
    defaultGarmentColor: '#282c37',
    availableColors: ['#282c37', '#0f0f11', '#1e293b'],
    price: 1499,
    originalPrice: 2299,
    fit: 'Washed Vintage Streetwear Fit',
    gsm: 240,
    mainSubject: '1980s Turbocharged Sports Car Drifting with Billowing Neon Tire Smoke and Chrome Typography',
    theme: 'Vintage Motorsport, 80s Turbo Racing & Retro Automotive',
    style: 'Distressed Vintage Screenprint on Acid-Wash Charcoal',
    artStyle: 'Retro Pop Comic Halftone with Chrome Bevel Typography',
    colorPalette: ['#282c37', '#f43f5e', '#38bdf8', '#fbbf24', '#ffffff'],
    typographyStyle: '80s Metallic Chrome Speed Demon Header & Distressed Racing Club Stencil',
    targetAudience: 'Car culture enthusiasts, vintage racing fans, 80s aesthetics lovers, streetwear collectors',
    niche: 'Vintage Automotive & JDM/Euro Motorsport',
    mood: 'High-octane, nostalgic, roaring turbo, retro speed',
    visualElements: ['vintage sports car drifting', 'neon pink and blue burnout smoke clouds', 'chrome metallic SPEED DEMON text', 'distressed vintage halftone texture', 'racing club subtext'],
    objectsAndCharacters: ['turbo sports car', 'drift smoke', 'chrome emblem'],
    keywords: [
      'speed demon', 'racing', 'car', 'sports car', 'turbo', 'drift', 'smoke', '80s', 
      'vintage', 'retro', 'acid wash', 'burnout', 'porsche', 'motorsport', 'chrome', 
      'distressed', 'racing club', '1982', 'automotive'
    ],
    promptPhrases: [
      'speed demon 1982 vintage racing car with colorful burnout smoke',
      'retro 80s sports car drift graphic on acid wash charcoal tee',
      'vintage racing club speed demon t-shirt with chrome lettering',
      '90s distressed car enthusiast streetwear tee',
      'turbo drift car with billowing neon smoke graphic shirt'
    ],
    tags: ['#racing', '#vintage', '#speeddemon', '#car', '#drift', '#80s', '#streetwear']
  },

  // 22. BLOOD MOON SAKURA RONIN
  {
    id: 'asset-sakura-ronin',
    name: 'Blood Moon Sakura Ronin',
    slug: 'blood-moon-sakura-ronin',
    mockupUrl: '/assets/sakura_ronin.jpg',
    graphicUrl: '/assets/sakura_ronin.jpg',
    defaultGarmentColor: '#0f0f11',
    availableColors: ['#0f0f11', '#18181b', '#ffffff'],
    price: 1599,
    originalPrice: 2499,
    fit: 'Boxy Drop-Shoulder Heavyweight',
    gsm: 240,
    mainSubject: 'Traditional Sumi-e Ink Brush Lone Ronin Samurai Under Blood Moon and Crimson Cherry Blossoms',
    theme: 'Bushido, Japanese Classical Art & Ukiyo-e Masterpiece',
    style: 'Authentic Japanese Calligraphic Sumi-e Ink Wash',
    artStyle: 'Fine Line Ink Splash with Crimson Gouache Accents',
    colorPalette: ['#0f0f11', '#991b1b', '#dc2626', '#f1f5f9', '#000000'],
    typographyStyle: 'Authentic Vertical Japanese Calligraphy (Shodo Kanji with Red Artist Hanko Stamp)',
    targetAudience: 'Martial arts fans, Japanese art lovers, anime/manga aesthetic collectors, luxury streetwear connoisseurs',
    niche: 'Japanese Traditional Art & Bushido Samurai',
    mood: 'Stoic, honor-bound, poetic, dramatic, masterful',
    visualElements: ['lone samurai ronin standing with dual katanas', 'luminous crimson blood moon', 'drifting sakura petals', 'dark sumi-e ink cloud wash', 'vertical kanji calligraphy', 'red hanko seal'],
    objectsAndCharacters: ['ronin warrior', 'katana swords', 'sakura cherry blossoms', 'blood moon'],
    keywords: [
      'samurai', 'ronin', 'sakura', 'cherry blossom', 'blood moon', 'japanese', 
      'sumi-e', 'ink wash', 'bushido', 'katana', 'sword', 'red moon', 'kanji', 
      'shodo', 'oriental', 'traditional art', 'black t-shirt', 'oversized'
    ],
    promptPhrases: [
      'japanese sumi-e ink brush samurai under blood moon and cherry blossoms',
      'lone ronin samurai with katana falling sakura petals on black tee',
      'blood moon samurai graphic t-shirt with japanese calligraphy',
      'traditional bushido ink wash warrior streetwear shirt',
      'sakura ronin samurai artwork on heavy 240 gsm cotton'
    ],
    tags: ['#samurai', '#ronin', '#sakura', '#bloodmoon', '#japanese', '#sumie', '#streetwear']
  }
];
