import React from 'react';
import CategoryPage from '@/components/CategoryPage';

const TamilContentPage: React.FC = () => {
  return (
    <CategoryPage
      title="Tamil Content"
      description="Authentic Tamil content with cultural wisdom, traditional sayings, and regional expressions. Celebrate Tamil heritage and literature."
      breadcrumb="Languages / Tamil"
      filterKey="language"
      filterValue="tamil"
      seoTitle="Tamil Content - Quotes & Sayings - TextToReels.in"
      seoDescription="Discover authentic Tamil content with cultural wisdom, traditional sayings and regional expressions. Perfect for Tamil social media content."
      keywords="tamil content, tamil quotes, tamil sayings, தமிழ் content, tamil messages, tamil wisdom"
      canonicalUrl="https://texttoreels.in/language/tamil"
    />
  );
};

export default TamilContentPage;