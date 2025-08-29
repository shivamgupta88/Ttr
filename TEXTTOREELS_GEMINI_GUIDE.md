# 🎬 TextToReels.in - Gemini AI Integration Guide

Complete guide for generating viral social media content using Gemini AI (gemma3-1b) for your TextToReels.in platform.

## 🎯 Perfect Prompt Format for TextToReels.in

### Single Content Generation Prompt:

```text
Generate 3 unique content entries for TextToReels.in - a platform that creates viral social media content templates.

CONTENT SPECIFICATIONS:
- Content Type: love_quotes
- Language: hindi
- Visual Theme: dark_theme
- Platform: twitter_post
- Target Audience: students

TEXTTOREELS.IN CONTEXT:
TextToReels.in is a premium AI-powered content generation platform that helps users create viral social media content. The platform specializes in:
- Quote templates and text overlays
- Social media post generators
- Reel and story templates  
- Multi-language content creation
- Trending content formats
- Platform-specific optimizations

OUTPUT FORMAT (JSON):
Generate an array of objects with this EXACT structure:

{
  "content_entries": [
    {
      "contentId": "ttr_love_quotes_1736358234_abc123xyz",
      "isActive": true,
      "slug": "hindi-love-quotes-dark-theme-twitter-post-students-romantic",
      "contentType": "love_quotes",
      "language": "hindi",
      "theme": "dark_theme",
      "platform": "twitter_post",
      "audience": "students",
      "metaTitle": [
        "Hindi Love Quotes for Students | Dark Theme Twitter Posts",
        "Romantic Hindi Quotes - Perfect for Student Social Media",
        "Trending Love Shayari for Twitter - Student Special"
      ],
      "shortDescription": "Beautiful Hindi love quotes perfect for students to share on Twitter with stunning dark theme visuals and engaging content.",
      "description": "Create viral Twitter posts with our curated collection of Hindi love quotes specifically designed for students. These romantic quotes capture the essence of young love, college romance, and heartfelt emotions that resonate with the student community. Each quote is crafted to be highly shareable, emotionally engaging, and perfect for Twitter's character limit. The dark theme design creates a sophisticated aesthetic that stands out in social media feeds. Whether you're expressing your feelings, sharing romantic thoughts, or creating content for your social media presence, these quotes provide the perfect blend of emotion and visual appeal. Students love sharing relatable content that reflects their experiences, and these love quotes tap into universal themes of romance, friendship, and emotional connection that drive high engagement rates.",
      "contentText": {
        "primary": "जब तुम्हारा इंतज़ार करते हैं, तो लगता है जैसे वक़्त भी रुक गया हो ❤️",
        "variations": [
          "तुम्हारी याद में खुद को खो देना, ये भी एक खुशी है 💫",
          "प्यार में पड़ना आसान है, पर सच्चा प्यार मिलना मुश्किल ✨",
          "तुम्हारी मुस्कान ही मेरी दुनिया की सबसे खूबसूरत बात है 😊"
        ],
        "hashtags": ["#HindiLoveQuotes", "#StudentLife", "#RomanticQuotes", "#PyarKeStatus", "#LoveShayari", "#CollegeRomance"],
        "callToAction": "Share if you can relate! ❤️ Tag someone special"
      },
      "designSpecs": {
        "colorScheme": ["#1a1a1a", "#ff6b6b", "#ffffff"],
        "fontStyle": "Bold Sans-serif with Hindi font support",
        "layout": "Centered text with subtle background pattern",
        "elements": ["Heart emoji", "Gradient overlay", "Stylized border", "Romantic icons"]
      },
      "seoData": {
        "keywords": [
          "hindi love quotes",
          "student romantic quotes",
          "dark theme social media",
          "twitter love posts",
          "hindi shayari students",
          "college romance quotes",
          "pyar ke status hindi"
        ],
        "canonicalUrl": "https://texttoreels.in/content/hindi-love-quotes-dark-theme-twitter-post-students-romantic",
        "ogImage": "Dark themed image with Hindi love quote in elegant typography with heart elements"
      },
      "usageStats": {
        "difficulty": "easy",
        "estimatedEngagement": "high",
        "bestTimeToPost": "evening",
        "platformOptimization": "Perfect for Twitter's character limit, includes engaging emojis, uses trending hashtags"
      },
      "relatedContent": [
        "Motivational quotes for students",
        "Friendship quotes in Hindi",
        "Success quotes for young adults"
      ],
      "creatorTips": [
        "Post during 7-9 PM for maximum student engagement",
        "Add personal story in comments to increase relatability",
        "Use this quote with couple photos or aesthetic backgrounds for Instagram stories"
      ]
    }
  ]
}

CONTENT GUIDELINES:
1. Make content highly engaging and shareable
2. Include emotional triggers relevant to students
3. Optimize for twitter_post best practices
4. Use trending hindi phrases and expressions
5. Ensure dark_theme visual appeal
6. Include call-to-action that drives engagement
7. Add relevant hashtags for discoverability
8. Consider viral potential and shareability
9. Make content relatable to students
10. Include personalization options

SPECIFIC INSTRUCTIONS FOR LOVE_QUOTES:
- Create authentic, emotionally resonant love content
- Use appropriate cultural references for hindi
- Include modern slang and trending expressions
- Make content Instagram/Twitter/TikTok friendly
- Ensure content works well with dark_theme visuals
- Add engagement hooks and conversation starters
- Include variations for different moods/contexts
- Make content screenshot-worthy and shareable

PLATFORM OPTIMIZATION FOR TWITTER_POST:
- Follow Twitter character limits and best practices
- Include Twitter-specific engagement tactics
- Optimize hashtag strategy for Twitter
- Consider Twitter algorithm preferences
- Add Twitter-appropriate call-to-actions
- Include timing recommendations for Twitter

TARGET AUDIENCE INSIGHTS FOR STUDENTS:
- Use language and references that resonate with students
- Address common pain points and interests of students
- Include motivational or inspirational elements
- Make content relatable to student lifestyle
- Add emotional appeal relevant to college-age group

RESPONSE FORMAT:
Return ONLY the JSON object with the "content_entries" array. No additional text or explanation.
```

## 🎨 Example Expected Response:

```json
{
  "content_entries": [
    {
      "contentId": "ttr_love_quotes_1736358234_abc123xyz",
      "isActive": true,
      "slug": "hindi-love-quotes-dark-theme-twitter-post-students-romantic",
      "contentType": "love_quotes",
      "language": "hindi", 
      "theme": "dark_theme",
      "platform": "twitter_post",
      "audience": "students",
      "metaTitle": [
        "Hindi Love Quotes for Students | Dark Theme Twitter Posts",
        "Romantic Hindi Quotes - Perfect for Student Social Media",
        "Trending Love Shayari for Twitter - Student Special"
      ],
      "shortDescription": "Beautiful Hindi love quotes perfect for students to share on Twitter with stunning dark theme visuals.",
      "description": "Create viral Twitter posts with our curated collection of Hindi love quotes specifically designed for students. These romantic quotes capture the essence of young love, college romance, and heartfelt emotions that resonate with the student community...",
      "contentText": {
        "primary": "जब तुम्हारा इंतज़ार करते हैं, तो लगता है जैसे वक़्त भी रुक गया हो ❤️",
        "variations": [
          "तुम्हारी याद में खुद को खो देना, ये भी एक खुशी है 💫",
          "प्यार में पड़ना आसान है, पर सच्चा प्यार मिलना मुश्किल ✨"
        ],
        "hashtags": ["#HindiLoveQuotes", "#StudentLife", "#RomanticQuotes"],
        "callToAction": "Share if you can relate! ❤️ Tag someone special"
      },
      "designSpecs": {
        "colorScheme": ["#1a1a1a", "#ff6b6b", "#ffffff"],
        "fontStyle": "Bold Sans-serif with Hindi font support",
        "layout": "Centered text with subtle background pattern",
        "elements": ["Heart emoji", "Gradient overlay", "Romantic icons"]
      },
      "seoData": {
        "keywords": [
          "hindi love quotes",
          "student romantic quotes", 
          "twitter love posts",
          "college romance quotes"
        ],
        "canonicalUrl": "https://texttoreels.in/content/hindi-love-quotes-dark-theme-twitter-post-students-romantic",
        "ogImage": "Dark themed image with Hindi love quote in elegant typography"
      },
      "usageStats": {
        "difficulty": "easy",
        "estimatedEngagement": "high",
        "bestTimeToPost": "evening",
        "platformOptimization": "Perfect for Twitter's character limit, includes engaging emojis"
      },
      "relatedContent": [
        "Motivational quotes for students",
        "Friendship quotes in Hindi"
      ],
      "creatorTips": [
        "Post during 7-9 PM for maximum student engagement",
        "Add personal story in comments to increase relatability"
      ]
    }
  ]
}
```

## 📊 Content Categories for TextToReels.in:

### Content Types:
- `love_quotes` - Romantic quotes and shayari
- `motivational_quotes` - Inspirational and success content
- `funny_memes` - Humorous and entertaining content
- `success_quotes` - Achievement and goal-oriented quotes
- `life_lessons` - Wisdom and life advice
- `friendship_quotes` - Friendship and relationship content
- `inspirational_stories` - Motivating stories and anecdotes
- `trending_thoughts` - Current trending topics and thoughts
- `relationship_advice` - Dating and relationship guidance
- `self_care_tips` - Mental health and wellness content

### Languages:
- `hindi` - Pure Hindi content
- `english` - Pure English content  
- `hinglish` - Mix of Hindi and English (very popular!)
- `punjabi` - Punjabi language content
- `gujarati` - Gujarati language content

### Themes:
- `dark_theme` - Dark backgrounds with light text
- `light_theme` - Light backgrounds with dark text
- `gradient_theme` - Colorful gradient backgrounds
- `minimalist_theme` - Clean, simple designs
- `colorful_theme` - Vibrant, energetic colors
- `neon_theme` - Bright neon colors and effects

### Platforms:
- `instagram_post` - Square format, hashtag-heavy
- `instagram_story` - Vertical format, interactive elements
- `twitter_post` - Character limit optimized
- `facebook_post` - Longer form content allowed
- `linkedin_post` - Professional tone
- `tiktok_video` - Short-form video content text
- `youtube_shorts` - Vertical video format

### Audiences:
- `students` - College and school students
- `professionals` - Working professionals
- `entrepreneurs` - Business owners and startup founders
- `teenagers` - 13-19 age group
- `young_adults` - 20-30 age group
- `fitness_enthusiasts` - Health and fitness focused
- `travelers` - Travel and adventure lovers
- `booklovers` - Reading and literature fans

## 🚀 Usage Examples:

### 1. Generate Motivational Content:
```javascript
const prompt = TextToReelsPromptGenerator.generatePrompt({
  contentType: "motivational_quotes",
  language: "hinglish",
  theme: "gradient_theme", 
  platform: "instagram_post",
  audience: "entrepreneurs",
  count: 5
});
```

### 2. Generate Funny Memes:
```javascript
const prompt = TextToReelsPromptGenerator.generatePrompt({
  contentType: "funny_memes",
  language: "english",
  theme: "colorful_theme",
  platform: "tiktok_video", 
  audience: "teenagers",
  count: 3
});
```

### 3. Batch Generation:
```javascript
const prompts = TextToReelsPromptGenerator.generateBatchPrompts(
  ['love_quotes', 'motivational_quotes'],  // content types
  ['hindi', 'hinglish'],                   // languages  
  ['dark_theme', 'gradient_theme'],        // themes
  ['twitter_post', 'instagram_post'],      // platforms
  ['students', 'young_adults'],            // audiences
  2  // count per batch
);
```

## 🎯 Integration with Your System:

### 1. API Integration:
```javascript
const GeminiIntegration = require('./scripts/gemini-integration');
const { TextToReelsPromptGenerator } = require('./scripts/texttoreels-gemini-prompt');

const gemini = new GeminiIntegration({
  apiKey: process.env.GEMINI_API_KEY,
  model: 'gemma3-1b'
});

// Generate content
const promptData = TextToReelsPromptGenerator.generatePrompt({
  contentType: "love_quotes",
  language: "hindi",
  theme: "dark_theme",
  platform: "twitter_post", 
  audience: "students"
});

const response = await gemini.callGeminiAPI(promptData.prompt);
const validation = TextToReelsPromptGenerator.validateResponse(response);

if (validation.valid) {
  // Save to MongoDB
  const TextToReelsContent = require('./src/models/TextToReelsContent');
  
  for (const entry of validation.data.content_entries) {
    const content = new TextToReelsContent(entry);
    await content.save();
  }
}
```

### 2. Static Page Generation:
Update your static generation script to use TextToReels content:

```javascript
// In your generation script
const content = await TextToReelsContent.findByCategory('love_quotes', 'hindi', 50);

content.forEach(item => {
  const html = generateTextToReelsPage(item);
  // Save HTML file
});
```

This setup will generate perfect content for TextToReels.in that matches your social media content generation platform! 🎬✨