const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 20,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    // Optimize for bulk operations
    mongoose.set('bufferCommands', false);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Create indexes for performance
    await createIndexes();
    
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    
    // Pages collection indexes
    await db.collection('pages').createIndex({ slug: 1 }, { unique: true });
    await db.collection('pages').createIndex({ category: 1, language: 1, style: 1 });
    await db.collection('pages').createIndex({ keywords: 1 });
    await db.collection('pages').createIndex({ createdAt: -1 });
    await db.collection('pages').createIndex({ 'seo.metaTitle': 'text', 'seo.metaDescription': 'text' });
    
    // Analytics collection indexes
    await db.collection('analytics').createIndex({ pageId: 1, date: -1 });
    
    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};

module.exports = connectDB;