#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config();

// Target 1M pages
const TARGET = 1000000;
let totalGenerated = 0;
const startTime = Date.now();

// Simple page template
const themes = ['love_quotes', 'motivational_quotes', 'friendship_quotes', 'good_morning', 'birthday_wishes'];
const languages = ['hindi', 'english', 'punjabi', 'urdu'];  
const platforms = ['instagram_reel', 'youtube_shorts', 'whatsapp_status', 'facebook_story'];
const audiences = ['young_adults', 'millennials', 'working_professionals'];

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');
}

async function getCurrentCount() {
  const db = mongoose.connection.db;
  return await db.collection('pages').countDocuments();
}

function generateContent(theme, language, platform, audience, index) {
  const slug = `${theme}-${language}-${platform}-${audience}-${index}`.replace(/_/g, '-');
  
  return {
    slug: slug,
    dimensions: {
      theme: theme,
      language: language, 
      style: 'modern_gradient',
      platform: platform,
      audience: audience,
      emotion: 'happy_joyful',
      occasion: 'general',
      length: 'medium'
    },
    content: {
      title: `${theme.replace(/_/g, ' ')} for ${audience.replace(/_/g, ' ')} | TextToReels.in`,
      heading: `Beautiful ${theme.replace(/_/g, ' ')} in ${language}`,
      description: `Create amazing ${theme.replace(/_/g, ' ')} content for ${platform.replace(/_/g, ' ')} with TextToReels.in. Perfect for ${audience.replace(/_/g, ' ')} who want engaging ${language} content.`,
      features: [`${theme.replace(/_/g, ' ')} generator`, `${language} optimization`, `${platform.replace(/_/g, ' ')} ready`],
      examples: [`Popular ${theme.replace(/_/g, ' ')}`, `Trending ${language} content`],
      callToAction: `Create ${theme.replace(/_/g, ' ')} with TextToReels.in`,
      footerText: `Make your ${platform.replace(/_/g, ' ')} posts amazing with TextToReels.in`,
      uniqueValue: `AI-powered ${theme.replace(/_/g, ' ')} in ${language}`
    },
    seo: {
      metaTitle: `${theme.replace(/_/g, ' ')} ${language} | TextToReels.in`,
      metaDescription: `Generate ${theme.replace(/_/g, ' ')} in ${language} for ${platform.replace(/_/g, ' ')}. TextToReels.in offers the best content creation tools.`,
      keywords: [`${theme} ${language}`, `${platform} ${theme}`, `TextToReels.in ${language}`],
      canonicalUrl: `/${slug}`
    },
    status: 'generated',
    generation: {
      algorithm: 'v2.0-fast',
      hash: `${slug}-${Date.now()}`,
      variations: 1
    },
    quality: {
      uniquenessScore: 95,
      readabilityScore: 80,
      sentimentScore: 5
    }
  };
}

async function generateBulkPages() {
  const batchSize = 1000;
  const pages = [];
  let index = 0;
  
  const currentCount = await getCurrentCount();
  totalGenerated = currentCount;
  
  console.log(`🚀 Starting from ${currentCount.toLocaleString()} pages`);
  console.log(`🎯 Target: ${TARGET.toLocaleString()} pages\n`);
  
  while (totalGenerated < TARGET) {
    pages.length = 0; // Clear array
    
    // Generate batch
    for (let i = 0; i < batchSize && totalGenerated + i < TARGET; i++) {
      const themeIndex = (index + i) % themes.length;
      const langIndex = Math.floor((index + i) / themes.length) % languages.length;
      const platformIndex = Math.floor((index + i) / (themes.length * languages.length)) % platforms.length;
      const audienceIndex = Math.floor((index + i) / (themes.length * languages.length * platforms.length)) % audiences.length;
      
      const page = generateContent(
        themes[themeIndex],
        languages[langIndex], 
        platforms[platformIndex],
        audiences[audienceIndex],
        index + i
      );
      
      pages.push(page);
    }
    
    // Insert batch
    try {
      const db = mongoose.connection.db;
      await db.collection('pages').insertMany(pages, { ordered: false });
      
      totalGenerated += pages.length;
      index += pages.length;
      
      const progress = (totalGenerated / TARGET * 100).toFixed(2);
      const elapsed = (Date.now() - startTime) / 1000;
      const rate = totalGenerated / elapsed;
      const eta = (TARGET - totalGenerated) / rate;
      
      console.log(`✅ ${totalGenerated.toLocaleString()}/${TARGET.toLocaleString()} (${progress}%) | ${Math.round(rate)} p/s | ETA: ${Math.round(eta/60)}m`);
      
    } catch (error) {
      if (error.code === 11000) {
        console.log('⚠️ Some duplicates skipped');
      } else {
        console.error('❌ Error:', error.message);
      }
    }
  }
  
  console.log('\n🎉 1 MILLION PAGES GENERATED!');
  const totalTime = (Date.now() - startTime) / 1000;
  console.log(`⏱️ Total Time: ${Math.round(totalTime/60)} minutes`);
  console.log(`📊 Speed: ${Math.round(TARGET/totalTime)} pages/second`);
}

async function main() {
  await connectDB();
  await generateBulkPages();
  mongoose.connection.close();
}

main().catch(console.error);