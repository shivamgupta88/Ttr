# 🎯 Final Gemini Prompt for TextToReels.in

## 🎬 **EXACT PROMPT FOR GEMMA3-1B MODEL**

Copy and paste this exact prompt into your Gemini API call:

```text
Generate 3 unique content entries for TextToReels.in - a platform that creates viral social media content templates.

CONTENT SPECIFICATIONS:
- Content Type: love_quotes
- Language: hindi
- Visual Theme: dark_theme
- Platform: twitter_post
- Target Audience: students

TEXTTOREELS.IN CONTEXT:
TextToReels.in is a premium AI-powered content generation platform that helps users create viral social media content. The platform specializes in quote templates, social media post generators, reel templates, multi-language content creation, and platform-specific optimizations.

OUTPUT FORMAT (JSON):
{
  "content_entries": [
    {
      "contentId": "ttr_love_quotes_1736358234_abc123xyz",
      "isActive": true,
      "slug": "hindi-love-quotes-dark-theme-twitter-post-students",
      "contentType": "love_quotes",
      "language": "hindi",
      "theme": "dark_theme",
      "platform": "twitter_post",
      "audience": "students",
      "metaTitle": [
        "Primary SEO title (60 chars max)",
        "Alternative title variation 1",
        "Alternative title variation 2"
      ],
      "shortDescription": "150-character compelling description for search results",
      "description": "Detailed 400-500 word description explaining the content, its appeal, usage scenarios, and benefits for students. Include specific use cases and engagement potential.",
      "contentText": {
        "primary": "Main Hindi love quote with emojis",
        "variations": [
          "Alternative version 1",
          "Alternative version 2",
          "Alternative version 3"
        ],
        "hashtags": ["#HindiLoveQuotes", "#StudentLife", "#RomanticQuotes"],
        "callToAction": "Engaging CTA text with emojis"
      },
      "designSpecs": {
        "colorScheme": ["#1a1a1a", "#ff6b6b", "#ffffff"],
        "fontStyle": "Bold Sans-serif with Hindi font support",
        "layout": "Centered text with subtle background pattern",
        "elements": ["Heart emoji", "Gradient overlay", "Stylized border"]
      },
      "seoData": {
        "keywords": [
          "hindi love quotes",
          "student romantic quotes",
          "twitter love posts",
          "college romance quotes",
          "texttoreels content"
        ],
        "canonicalUrl": "https://texttoreels.in/content/[slug]",
        "ogImage": "Dark themed image description"
      },
      "usageStats": {
        "difficulty": "easy",
        "estimatedEngagement": "high",
        "bestTimeToPost": "evening",
        "platformOptimization": "Twitter optimization tips"
      },
      "relatedContent": [
        "Motivational quotes for students",
        "Friendship quotes in Hindi"
      ],
      "creatorTips": [
        "Post during 7-9 PM for maximum engagement",
        "Add personal story in comments"
      ]
    }
  ]
}

CONTENT GUIDELINES:
1. Make content highly engaging and shareable for students
2. Use emotional triggers relevant to young adults
3. Optimize for Twitter's character limits and best practices
4. Use trending Hindi phrases and modern expressions
5. Ensure content works perfectly with dark theme visuals
6. Include call-to-actions that drive engagement and comments
7. Add relevant hashtags for maximum discoverability
8. Consider viral potential and screenshot-worthiness
9. Make content relatable to college and student life
10. Include emojis and visual elements in text

SPECIFIC INSTRUCTIONS:
- Create authentic, emotionally resonant Hindi love quotes
- Use modern slang and trending expressions popular with students
- Make content perfect for Twitter sharing and engagement
- Include 3-4 quote variations per entry
- Add 5-6 relevant hashtags per entry
- Keep quotes under 280 characters for Twitter
- Use romantic emojis and symbols
- Make content screenshot-worthy and shareable

RESPONSE FORMAT:
Return ONLY the JSON object with the "content_entries" array. No additional text, explanations, or formatting.
```

---

## 🔧 **CUSTOMIZABLE VARIABLES**

Replace these values in the prompt above to generate different content:

### Content Type Options:
- `love_quotes` - Romantic quotes and shayari
- `motivational_quotes` - Inspirational content  
- `funny_memes` - Humorous content
- `success_quotes` - Achievement-focused quotes
- `life_lessons` - Wisdom and advice
- `friendship_quotes` - Friend-focused content

### Language Options:
- `hindi` - Pure Hindi content
- `english` - English content
- `hinglish` - Hindi + English mix (very popular!)
- `punjabi` - Punjabi content

### Theme Options:
- `dark_theme` - Dark backgrounds
- `light_theme` - Light backgrounds
- `gradient_theme` - Colorful gradients
- `minimalist_theme` - Clean, simple
- `neon_theme` - Bright, vibrant

### Platform Options:
- `twitter_post` - Twitter optimized
- `instagram_post` - Instagram square posts
- `instagram_story` - Instagram stories
- `facebook_post` - Facebook posts
- `tiktok_video` - TikTok video text

### Audience Options:
- `students` - College/school students
- `professionals` - Working adults
- `teenagers` - 13-19 age group  
- `young_adults` - 20-30 age group
- `entrepreneurs` - Business owners

---

## 📝 **EXAMPLE API CALL**

```javascript
const response = await fetch('YOUR_GEMINI_API_ENDPOINT', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${GEMINI_API_KEY}`
  },
  body: JSON.stringify({
    contents: [{
      parts: [{
        text: PROMPT_FROM_ABOVE
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 4000,
      responseMimeType: "application/json"
    }
  })
});

const data = await response.json();
const generatedContent = data.candidates[0].content.parts[0].text;

// Parse and validate
const parsed = JSON.parse(generatedContent);
console.log(parsed.content_entries); // Your generated content!
```

---

## ✅ **EXPECTED OUTPUT EXAMPLE**

Your Gemini API should return JSON like this:

```json
{
  "content_entries": [
    {
      "contentId": "ttr_love_quotes_1736358234_abc123",
      "isActive": true,
      "slug": "hindi-love-quotes-dark-theme-twitter-students-romantic",
      "contentType": "love_quotes",
      "language": "hindi",
      "theme": "dark_theme", 
      "platform": "twitter_post",
      "audience": "students",
      "metaTitle": [
        "Hindi Love Quotes for Students | Dark Theme Twitter Posts",
        "Romantic Hindi Shayari - Perfect for College Students",
        "Trending Love Status for Student Social Media"
      ],
      "shortDescription": "Beautiful Hindi love quotes perfect for students to share on Twitter with stunning dark theme visuals and high engagement.",
      "description": "Create viral Twitter posts with our curated collection of Hindi love quotes specifically designed for students. These romantic quotes capture the essence of young love, college romance, and heartfelt emotions that resonate with the student community. Each quote is crafted to be highly shareable, emotionally engaging, and perfect for Twitter's character limit...",
      "contentText": {
        "primary": "जब तुम्हारा इंतज़ार करते हैं, तो लगता है जैसे वक़्त भी रुक गया हो ❤️",
        "variations": [
          "तुम्हारी याद में खुद को खो देना, ये भी एक खुशी है 💫",
          "प्यार में पड़ना आसान है, पर सच्चा प्यार मिलना मुश्किल ✨",
          "तुम्हारी मुस्कान ही मेरी दुनिया की सबसे खूबसूरत बात है 😊"
        ],
        "hashtags": ["#HindiLoveQuotes", "#StudentLife", "#RomanticQuotes", "#PyarKeStatus", "#LoveShayari"],
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
          "texttoreels hindi content",
          "college romance quotes"
        ],
        "canonicalUrl": "https://texttoreels.in/content/hindi-love-quotes-dark-theme-twitter-students-romantic",
        "ogImage": "Dark themed image with elegant Hindi love quote typography"
      },
      "usageStats": {
        "difficulty": "easy",
        "estimatedEngagement": "high", 
        "bestTimeToPost": "evening",
        "platformOptimization": "Perfect for Twitter's 280 character limit, includes trending hashtags and engaging emojis"
      },
      "relatedContent": [
        "Motivational quotes for students",
        "Friendship quotes in Hindi",
        "Success quotes for young adults"
      ],
      "creatorTips": [
        "Post during 7-9 PM for maximum student engagement",
        "Add a personal story in comments to increase relatability",
        "Use with aesthetic backgrounds for Instagram stories"
      ]
    }
  ]
}
```

This format will generate perfect content for your TextToReels.in platform that can be directly imported into your MongoDB and used to generate beautiful static pages! 🎬✨