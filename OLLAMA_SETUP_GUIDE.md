# 🚀 Ollama + Gemma Local Setup for TextToReels.in

Complete guide for generating TextToReels.in content using your local Gemma model via Ollama.

## 🛠️ Quick Setup

### 1. Test Your Ollama Connection
```bash
# Test if Ollama is working
node scripts/ollama-gemma-integration.js test

# List your available models
node scripts/ollama-gemma-integration.js models
```

### 2. Generate Your First Content
```bash
# Generate 3 Hindi love quotes for students
node scripts/ollama-gemma-integration.js single love_quotes hindi dark_theme twitter_post students 3
```

### 3. Generate Popular Content Combinations
```bash
# Generate 5 entries for each popular combination
node scripts/ollama-gemma-integration.js popular 5 my-content.json
```

## 🎯 Command Options

### Single Content Generation:
```bash
node scripts/ollama-gemma-integration.js single [contentType] [language] [theme] [platform] [audience] [count]
```

**Examples:**
```bash
# Hindi love quotes for students (5 entries)
node scripts/ollama-gemma-integration.js single love_quotes hindi dark_theme twitter_post students 5

# English motivational quotes for professionals (10 entries)  
node scripts/ollama-gemma-integration.js single motivational_quotes english minimalist_theme linkedin_post professionals 10

# Hinglish funny content for teenagers (3 entries)
node scripts/ollama-gemma-integration.js single funny_memes hinglish colorful_theme tiktok_video teenagers 3
```

### Batch Generation:
```bash
# Generate popular content combinations
node scripts/ollama-gemma-integration.js popular 10 popular-content.json

# Custom batch with your configurations
node scripts/ollama-gemma-integration.js batch 5 custom-batch.json
```

## 📊 Available Options

### Content Types:
- `love_quotes` - Romantic quotes and shayari
- `motivational_quotes` - Inspirational content
- `funny_memes` - Humorous content
- `success_quotes` - Achievement quotes
- `life_lessons` - Wisdom and advice
- `friendship_quotes` - Friend-focused content
- `inspirational_stories` - Motivating stories
- `trending_thoughts` - Current trends
- `relationship_advice` - Dating advice
- `self_care_tips` - Mental health content

### Languages:
- `hindi` - Pure Hindi content
- `english` - English content  
- `hinglish` - Hindi + English mix (very popular!)
- `punjabi` - Punjabi content
- `gujarati` - Gujarati content

### Themes:
- `dark_theme` - Dark backgrounds with light text
- `light_theme` - Light backgrounds with dark text  
- `gradient_theme` - Colorful gradient backgrounds
- `minimalist_theme` - Clean, simple designs
- `colorful_theme` - Vibrant, energetic colors
- `neon_theme` - Bright neon colors and effects

### Platforms:
- `instagram_post` - Square format, hashtag-heavy
- `instagram_story` - Vertical format, interactive
- `twitter_post` - Character limit optimized
- `facebook_post` - Longer form content
- `linkedin_post` - Professional tone
- `tiktok_video` - Short-form video content
- `youtube_shorts` - Vertical video format

### Audiences:
- `students` - College and school students
- `professionals` - Working professionals
- `entrepreneurs` - Business owners
- `teenagers` - 13-19 age group
- `young_adults` - 20-30 age group
- `fitness_enthusiasts` - Health focused
- `travelers` - Travel lovers
- `booklovers` - Literature fans

## 🎬 Example Output

When you run the command, you'll get JSON output like this:

```json
{
  "content_entries": [
    {
      "contentId": "ttr_love_quotes_1736358234_abc123",
      "slug": "hindi-love-quotes-dark-theme-twitter-students",
      "contentType": "love_quotes",
      "language": "hindi",
      "theme": "dark_theme",
      "platform": "twitter_post", 
      "audience": "students",
      "metaTitle": [
        "Hindi Love Quotes for Students | Dark Theme Twitter Posts",
        "Romantic Hindi Shayari - Perfect for College Students"
      ],
      "contentText": {
        "primary": "जब तुम्हारा इंतज़ार करते हैं, तो लगता है जैसे वक़्त भी रुक गया हो ❤️",
        "variations": [
          "तुम्हारी याद में खुद को खो देना, ये भी एक खुशी है 💫"
        ],
        "hashtags": ["#HindiLoveQuotes", "#StudentLife", "#RomanticQuotes"],
        "callToAction": "Share if you can relate! ❤️"
      },
      // ... more fields
    }
  ]
}
```

## ⚙️ Configuration

### Customize Your Model:
Edit the model in `ollama-gemma-integration.js`:
```javascript
const ollama = new OllamaGemmaIntegration({
  model: 'gemma:7b',  // Change to your model
  ollamaUrl: 'http://localhost:11434',
  temperature: 0.7,   // Creativity level (0.0-1.0)
  numPredict: 4000   // Max tokens to generate
});
```

### Popular Model Options:
- `gemma:2b` - Faster, smaller model (2 billion parameters)
- `gemma:7b` - Better quality, slower (7 billion parameters)  
- `gemma2` - Latest version
- `llama3:8b` - Alternative model

## 🚨 Troubleshooting

### "Connection failed" error:
```bash
# Make sure Ollama is running
ollama serve

# Check if your model is pulled
ollama list

# Pull the model if missing
ollama pull gemma:2b
```

### "Invalid JSON response" error:
- Try reducing the number of entries (start with 1-2)
- Lower the temperature setting (try 0.5)
- Check if your model has enough memory

### Model running slowly:
- Use `gemma:2b` instead of `gemma:7b` for speed
- Reduce `numPredict` limit
- Close other applications to free up RAM

## 🎯 Production Workflow

### 1. Generate Content:
```bash
# Generate 100 entries across popular combinations
node scripts/ollama-gemma-integration.js popular 10 production-content.json
```

### 2. Import to Database:
```javascript
const TextToReelsContent = require('./src/models/TextToReelsContent');
const generatedData = require('./production-content.json');

// Import to MongoDB
for (const entry of generatedData.content) {
  const content = new TextToReelsContent(entry);
  await content.save();
}
```

### 3. Generate Static Pages:
```bash
# Use your existing static generation script
node frontend/scripts/smart-batch-generator.js
```

## 🔥 Pro Tips

1. **Start Small**: Test with 1-2 entries first
2. **Monitor Memory**: Watch your system resources
3. **Popular Combinations**: Focus on `love_quotes + hindi + students` for high engagement
4. **Batch Processing**: Generate in small batches (5-10 entries) for better quality
5. **Local Advantage**: No API costs, unlimited generations!

## 📈 Next Steps

1. Generate your first batch of content
2. Import into your MongoDB database
3. Use the updated static site generator
4. Deploy your enhanced TextToReels.in site
5. Monitor engagement and generate more popular combinations

Your local Gemma setup gives you unlimited content generation power for TextToReels.in! 🎬✨