import React from 'react';
import CategoryPage from '@/components/CategoryPage';

const EnglishContentPage: React.FC = () => {
  return (
    <CategoryPage
      title="English Content"
      description="High-quality English content including motivational quotes, love messages, and inspirational content for global audience."
      breadcrumb="Languages / English"
      filterKey="language"
      filterValue="english"
      seoTitle="English Content - Quotes & Messages - TextToReels.in"
      seoDescription="Create engaging English content with our collection of quotes, messages and inspirational content. Perfect for international audience."
      keywords="english content, english quotes, motivational quotes, love quotes english, inspirational messages"
      canonicalUrl="https://texttoreels.in/language/english"
    />
  );
};

export default EnglishContentPage;