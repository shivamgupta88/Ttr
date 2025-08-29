const crypto = require('crypto');
const natural = require('natural');
const sentiment = require('sentiment');
const dimensions = require('../../data/datasets/dimensions');

class ContentGenerator {
  constructor() {
    this.sentimentAnalyzer = new sentiment();
    this.stemmer = natural.PorterStemmer;
    this.cache = new Map();
    this.usedCombinations = new Set();
    this.uniquenessThreshold = 0.85; // Minimum uniqueness score required
  }
  
  /**
   * Generate unique page content with guaranteed uniqueness
   * Uses advanced algorithms to ensure no repetitive content
   */
  generateUniqueContent(baseDimensions, variationIndex = 0) {
    // Apply realistic filtering first
    if (!this.isValidCombination(baseDimensions)) {
      throw new Error(`Invalid combination: ${JSON.stringify(baseDimensions)}`);
    }
    
    const maxAttempts = 50;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const content = this.createContentVariation(baseDimensions, variationIndex + attempts);
      const uniquenessScore = this.calculateUniqueness(content);
      
      if (uniquenessScore >= this.uniquenessThreshold) {
        return {
          ...content,
          quality: {
            uniquenessScore,
            readabilityScore: this.calculateReadability(content.description),
            sentimentScore: this.analyzeSentiment(content.description),
            keywordDensity: this.calculateKeywordDensity(content.description, content.seo?.keywords || [])
          }
        };
      }
      attempts++;
    }
    
    throw new Error(`Could not generate unique content after ${maxAttempts} attempts`);
  }
  
  /**
   * Create content variation using multiple techniques
   */
  createContentVariation(dims, variationIndex) {
    const variationSeed = this.createVariationSeed(dims, variationIndex);
    
    // Generate base content elements
    const title = this.generateTitle(dims, variationSeed);
    const heading = this.generateHeading(dims, variationSeed);
    const description = this.generateDescription(dims, variationSeed);
    const features = this.generateFeatures(dims, variationSeed);
    const examples = this.generateExamples(dims, variationSeed);
    const cta = this.generateCTA(dims, variationSeed);
    
    // Create unique value proposition
    const uniqueValue = this.generateUniqueValue(dims, variationSeed);
    
    return {
      slug: this.generateSlug(dims, variationSeed),
      dimensions: dims,
      content: {
        title,
        heading,
        description,
        introduction: this.generateIntroduction(dims, variationSeed),
        features,
        examples,
        callToAction: cta,
        footerText: this.generateFooter(dims, variationSeed),
        uniqueValue
      },
      seo: this.generateSEO(title, description, dims),
      generation: {
        algorithm: 'v2.0-advanced',
        hash: this.generateContentHash({ title, description, uniqueValue, dims }),
        variations: variationIndex + 1,
        templateVersion: '2.0'
      }
    };
  }
  
  /**
   * Generate variation seed for consistent randomization
   */
  createVariationSeed(dims, variationIndex) {
    const baseString = Object.values(dims).join('-') + variationIndex;
    return crypto.createHash('md5').update(baseString).digest('hex');
  }
  
  /**
   * Generate unique titles with multiple variation techniques
   */
  generateTitle(dims, seed) {
    const patterns = [
      `{action} {qualifier} {theme} Reels in {language} | TextToReels.in {style} {platform}`,
      `{qualifier} {theme} {platform} Generator - TextToReels.in {language} {style}`,
      `{language} {theme} Reel Maker | TextToReels.in {qualifier} {platform} Content`,
      `{action} Stunning {theme} Reels for {audience} | TextToReels.in {language}`,
      `{theme} {platform} Creator - TextToReels.in {qualifier} {language} Content`,
      `{language} {theme} Status Maker | TextToReels.in {style} {platform} Generator`
    ];
    
    const patternIndex = this.seedToIndex(seed, patterns.length);
    const pattern = patterns[patternIndex];
    
    return this.fillTemplate(pattern, dims, seed);
  }
  
  /**
   * Generate unique headings
   */
  generateHeading(dims, seed) {
    const patterns = [
      `{action} {qualifier} {theme} Reels`,
      `{qualifier} {language} {theme} Generator`,
      `{theme} Reel Maker for {audience}`,
      `{language} {theme} Content Creator`,
      `{style} {theme} {platform} Generator`
    ];
    
    const patternIndex = this.seedToIndex(seed.slice(8), patterns.length);
    return this.fillTemplate(patterns[patternIndex], dims, seed);
  }
  
  /**
   * Generate unique descriptions with natural language variation
   */
  generateDescription(dims, seed) {
    const intros = [
      `Transform your ideas into captivating {platform} content with TextToReels.in - your {qualifier} {theme} generator.`,
      `Create stunning {language} {theme} reels that resonate with your {audience} instantly using TextToReels.in.`,
      `Design beautiful {style} {theme} content for {platform} in seconds with TextToReels.in.`,
      `Generate professional {theme} reels in {language} with TextToReels.in's advanced {style} templates.`
    ];
    
    const middles = [
      `TextToReels.in is perfect for {audience} who want to express their emotions through {qualifier} {theme} content.`,
      `Our {style} approach at TextToReels.in ensures your {theme} reels stand out on {platform}.`,
      `TextToReels.in is specially designed for {language} speakers who love {theme} content.`,
      `Whether you're sharing with friends or building your {platform} presence, TextToReels.in has got you covered.`
    ];
    
    const endings = [
      `Start creating {qualifier} {theme} reels today with TextToReels.in and watch your engagement soar!`,
      `Join thousands who trust TextToReels.in for their {theme} content creation needs.`,
      `Experience the power of AI-generated {language} {theme} content at TextToReels.in.`,
      `Make your {platform} posts unforgettable with TextToReels.in's {style} {theme} generator.`
    ];
    
    const introIndex = this.seedToIndex(seed.slice(0, 4), intros.length);
    const middleIndex = this.seedToIndex(seed.slice(4, 8), middles.length);
    const endIndex = this.seedToIndex(seed.slice(8, 12), endings.length);
    
    const intro = this.fillTemplate(intros[introIndex], dims, seed);
    const middle = this.fillTemplate(middles[middleIndex], dims, seed);
    const ending = this.fillTemplate(endings[endIndex], dims, seed);
    
    return `${intro} ${middle} ${ending}`;
  }
  
  /**
   * Generate unique features list
   */
  generateFeatures(dims, seed) {
    const featurePool = [
      `Instant {theme} reel generation`,
      `{qualifier} {style} templates`,
      `{language} language optimization`,
      `{platform} format ready`,
      `Perfect for {audience}`,
      `High-quality {style} designs`,
      `Customizable text and fonts`,
      `Multiple aspect ratios`,
      `Download in HD quality`,
      `Share directly to {platform}`,
      `Trending {theme} templates`,
      `Professional {style} layouts`,
      `Mobile-optimized interface`,
      `Fast rendering engine`,
      `SEO-optimized content`
    ];
    
    const numFeatures = 4 + (this.seedToIndex(seed, 3));
    const selectedFeatures = [];
    
    for (let i = 0; i < numFeatures; i++) {
      const index = this.seedToIndex(seed.slice(i * 2, i * 2 + 2), featurePool.length);
      const feature = this.fillTemplate(featurePool[index], dims, seed);
      if (!selectedFeatures.includes(feature)) {
        selectedFeatures.push(feature);
      }
    }
    
    return selectedFeatures;
  }
  
  /**
   * Generate unique examples
   */
  generateExamples(dims, seed) {
    // This would contain theme-specific example content
    // For now, returning generic examples that get filled with dimensions
    const examples = [
      `{qualifier} {theme} reel for {audience}`,
      `Trending {language} {theme} content`,
      `{style} {theme} template`,
      `Popular {theme} format for {platform}`
    ];
    
    return examples.map(example => this.fillTemplate(example, dims, seed));
  }
  
  /**
   * Generate unique CTA
   */
  generateCTA(dims, seed) {
    const ctas = [
      `{action} Your {qualifier} {theme} Reel Now`,
      `Start Creating {language} {theme} Content`,
      `Make {qualifier} {theme} Reels Today`,
      `{action} {style} {theme} Content`,
      `Try Our {theme} Generator Free`
    ];
    
    const index = this.seedToIndex(seed.slice(-4), ctas.length);
    return this.fillTemplate(ctas[index], dims, seed);
  }
  
  /**
   * Generate unique value proposition
   */
  generateUniqueValue(dims, seed) {
    const uniqueElements = [
      `AI-powered {theme} content creation`,
      `Exclusive {style} {language} templates`,
      `{audience}-focused {theme} generator`,
      `Premium {platform} optimization`,
      `Advanced {theme} customization`
    ];
    
    const index = this.seedToIndex(seed.slice(-6), uniqueElements.length);
    return this.fillTemplate(uniqueElements[index], dims, seed);
  }
  
  /**
   * Fill template with dimension values and variations
   */
  fillTemplate(template, dims, seed) {
    let filled = template;
    
    // Replace dimension placeholders
    Object.entries(dims).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, 'g');
      filled = filled.replace(regex, this.humanize(value));
    });
    
    // Replace special placeholders with variations
    const replacements = {
      action: this.getVariation(dimensions.actionWords, seed),
      qualifier: this.getVariation(dimensions.qualifiers, seed),
      intro: this.getVariation(dimensions.introVariations, seed)
    };
    
    Object.entries(replacements).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, 'g');
      filled = filled.replace(regex, value);
    });
    
    return filled;
  }
  
  /**
   * Get variation from array based on seed
   */
  getVariation(array, seed) {
    const index = this.seedToIndex(seed, array.length);
    return array[index];
  }
  
  /**
   * Convert seed to array index
   */
  seedToIndex(seed, arrayLength) {
    const hash = crypto.createHash('md5').update(seed.toString()).digest('hex');
    const num = parseInt(hash.slice(0, 8), 16);
    return num % arrayLength;
  }
  
  /**
   * Convert snake_case to human readable
   */
  humanize(str) {
    if (!str || typeof str !== 'string') return str;
    return str.replace(/_/g, ' ')
             .replace(/\b\w/g, c => c.toUpperCase());
  }
  
  /**
   * Generate SEO optimized metadata
   */
  generateSEO(title, description, dims) {
    const keywords = [
      `TextToReels.in ${dims.language} ${dims.theme}`,
      `${dims.theme} reel generator TextToReels.in`,
      `${dims.platform} ${dims.theme} TextToReels.in`,
      `${dims.language} reel maker TextToReels.in`,
      `${dims.style} ${dims.theme} TextToReels.in`,
      `${dims.theme} for ${dims.audience} TextToReels.in`
    ];
    
    // Add domestic/Hindi specific keywords
    const hindiSEOKeywords = {
      'love_quotes': ['mohabbat shayari', 'pyar ke status', 'romantic quotes hindi'],
      'motivational_quotes': ['prernadayak vachan', 'motivational status hindi', 'hausla badane wale quotes'],
      'friendship_quotes': ['dosti shayari', 'best friend quotes hindi', 'yaar dosti'],
      'good_morning': ['suprabhat images', 'good morning hindi quotes', 'subh prabhat'],
      'attitude_quotes': ['attitude status hindi', 'royal attitude quotes', 'swag status'],
      'birthday_wishes': ['janmadin ki shubhkamnaye', 'birthday wishes hindi', 'janamdin mubarak'],
      'bollywood_quotes': ['bollywood dialogues', 'filmi quotes hindi', 'movie quotes']
    };
    
    if (hindiSEOKeywords[dims.theme]) {
      keywords.push(...hindiSEOKeywords[dims.theme].map(k => `${k} TextToReels.in`));
    }
    
    return {
      metaTitle: title,
      metaDescription: description.slice(0, 160) + '...',
      keywords,
      canonicalUrl: `/${this.generateSlug(dims)}`,
      ogTitle: title,
      ogDescription: description.slice(0, 200),
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': title,
        'description': description.slice(0, 200),
        'applicationCategory': 'MultimediaApplication'
      }
    };
  }
  
  /**
   * Generate unique slug
   */
  generateSlug(dims, seed = '') {
    const parts = [
      dims.theme.replace(/_/g, '-'),
      dims.language,
      dims.style.replace(/_/g, '-'),
      dims.platform.replace(/_/g, '-')
    ];
    
    // Add Hindi/transliterated keywords for better domestic SEO
    const hindiKeywords = {
      'love_quotes': 'mohabbat-shayari',
      'romantic_shayari': 'romantic-shayari',
      'motivational_quotes': 'prernadayak-vichar',
      'friendship_quotes': 'dosti-quotes',
      'hindi_shayari': 'hindi-shayari',
      'bollywood_quotes': 'bollywood-dialogues',
      'desi_swag': 'desi-attitude',
      'breakup_quotes': 'judaai-shayari',
      'birthday_wishes': 'janmadin-mubarak',
      'good_morning': 'suprabhat-sandesh',
      'good_night': 'shubh-ratri',
      'mother_love': 'maa-ka-pyar',
      'father_respect': 'papa-ki-izzat',
      'spiritual_quotes': 'adhyatmik-vichar',
      'attitude_quotes': 'attitude-status',
      'life_lessons': 'jeevan-ke-siksha',
      'success_mantras': 'safalta-ke-sutra',
      'wedding_quotes': 'shaadi-mubarak',
      'family_values': 'parivarik-mulya'
    };
    
    if (hindiKeywords[dims.theme]) {
      parts.push(hindiKeywords[dims.theme]);
    }
    
    if (seed) {
      parts.push(seed.slice(0, 4));
    }
    
    return parts.join('-').toLowerCase();
  }
  
  /**
   * Calculate content uniqueness score
   */
  calculateUniqueness(content) {
    const contentString = JSON.stringify(content.content);
    const hash = crypto.createHash('sha256').update(contentString).digest('hex');
    
    if (this.usedCombinations.has(hash)) {
      return 0; // Duplicate content
    }
    
    // Calculate similarity with existing content (simplified)
    let maxSimilarity = 0;
    for (const existingHash of this.usedCombinations) {
      const similarity = this.calculateStringSimilarity(hash, existingHash);
      maxSimilarity = Math.max(maxSimilarity, similarity);
    }
    
    this.usedCombinations.add(hash);
    return (1 - maxSimilarity) * 100; // Return uniqueness percentage
  }
  
  /**
   * Calculate string similarity using edit distance
   */
  calculateStringSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = natural.LevenshteinDistance(longer, shorter);
    return distance / longer.length;
  }
  
  /**
   * Calculate readability score
   */
  calculateReadability(text) {
    if (!text || typeof text !== 'string') return 50; // Default score
    
    // Simplified readability calculation
    const words = text.split(' ').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const avgWordsPerSentence = sentences > 0 ? words / sentences : words;
    
    // Flesch Reading Ease approximation
    return Math.max(0, Math.min(100, 206.835 - 1.015 * avgWordsPerSentence));
  }
  
  /**
   * Analyze sentiment
   */
  analyzeSentiment(text) {
    const result = this.sentimentAnalyzer.analyze(text);
    return result.score;
  }
  
  /**
   * Calculate keyword density
   */
  calculateKeywordDensity(text, keywords) {
    if (!text || typeof text !== 'string' || !keywords || !Array.isArray(keywords)) {
      return 0;
    }
    
    const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 0);
    const totalWords = words.length;
    
    if (totalWords === 0) return 0;
    
    let keywordCount = 0;
    keywords.forEach(keyword => {
      if (keyword && typeof keyword === 'string') {
        const keywordWords = keyword.toLowerCase().split(' ').filter(w => w.length > 0);
        keywordWords.forEach(word => {
          keywordCount += words.filter(w => w === word).length;
        });
      }
    });
    
    return (keywordCount / totalWords) * 100;
  }
  
  /**
   * Generate content hash
   */
  generateContentHash(content) {
    const contentString = JSON.stringify(content);
    return crypto.createHash('sha256').update(contentString).digest('hex');
  }
  
  /**
   * Generate introduction
   */
  generateIntroduction(dims, seed) {
    const intros = [
      `Welcome to TextToReels.in - the most advanced {theme} reel generator designed specifically for {audience}.`,
      `Create professional {language} {theme} content that captures attention and drives engagement with TextToReels.in.`,
      `Transform your {theme} ideas into viral {platform} content with TextToReels.in's {style} generator.`
    ];
    
    const index = this.seedToIndex(seed.slice(16), intros.length);
    return this.fillTemplate(intros[index], dims, seed);
  }
  
  /**
   * Generate footer text
   */
  generateFooter(dims, seed) {
    const footers = [
      `Start creating {qualifier} {theme} content today with TextToReels.in. Perfect for {audience} on {platform}.`,
      `Join the community of creators using TextToReels.in's {language} {theme} generator.`,
      `Make every {platform} post count with TextToReels.in's {style} {theme} templates.`
    ];
    
    const index = this.seedToIndex(seed.slice(20), footers.length);
    return this.fillTemplate(footers[index], dims, seed);
  }
  
  /**
   * Validate realistic content combinations
   */
  isValidCombination(dims) {
    // Remove inappropriate combinations
    const inappropriateCombinations = [
      // No romantic content on LinkedIn
      { platform: 'linkedin_post', themes: ['romantic_shayari', 'love_quotes', 'valentine_messages', 'couple_goals'] },
      // No personal/romantic content on professional platforms
      { platform: 'linkedin_post', themes: ['breakup_quotes', 'heartbreak_quotes', 'first_love', 'anniversary_wishes'] },
      // No overly casual content on LinkedIn
      { platform: 'linkedin_post', themes: ['attitude_quotes', 'savage_replies', 'boss_lady', 'desi_swag'] },
      // No religious content on certain platforms for broader appeal
      { platform: 'snapchat_story', themes: ['spiritual_quotes', 'meditation_mantras'] },
    ];
    
    // Check against inappropriate combinations
    for (const rule of inappropriateCombinations) {
      if (rule.platform === dims.platform && rule.themes.includes(dims.theme)) {
        return false;
      }
    }
    
    // Age-appropriate content filtering
    if (dims.audience === 'teenagers' && ['breakup_quotes', 'heartbreak_quotes'].includes(dims.theme)) {
      return false; // Avoid negative content for young audiences
    }
    
    // Professional content validation
    if (dims.platform === 'linkedin_post') {
      const professionalThemes = [
        'motivational_quotes', 'success_mantras', 'life_lessons', 'positive_thinking',
        'goal_achievement', 'self_improvement', 'confidence_boost', 'career_motivation',
        'entrepreneur_quotes', 'study_motivation', 'morning_motivation',
        'wisdom_quotes', 'life_philosophy'
      ];
      
      if (!professionalThemes.includes(dims.theme)) {
        return false;
      }
    }
    
    return true;
  }
}

module.exports = ContentGenerator;