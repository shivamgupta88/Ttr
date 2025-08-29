import React from 'react';
import CategoryPage from '@/components/CategoryPage';

const LoveQuotesPage: React.FC = () => {
  return (
    <CategoryPage
      title="Love Quotes"
      description="Beautiful love quotes and romantic shayari in multiple languages. Perfect for Instagram reels, WhatsApp status, and social media content."
      breadcrumb="Content Types / Love Quotes"
      filterKey="theme"
      filterValue="love_quotes"
      seoTitle="Love Quotes & Romantic Shayari - TextToReels.in"
      seoDescription="Discover beautiful love quotes, romantic shayari, and heartfelt messages in Hindi, English, and other languages. Perfect for Instagram Reels and social media."
      keywords="love quotes, romantic quotes, love shayari, hindi love quotes, english love quotes, romantic messages"
      canonicalUrl="https://texttoreels.in/content-types/love-quotes"
    />
  );
};

export default LoveQuotesPage;