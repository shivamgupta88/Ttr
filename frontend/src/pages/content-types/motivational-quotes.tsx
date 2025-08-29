import React from 'react';
import CategoryPage from '@/components/CategoryPage';

const MotivationalQuotesPage: React.FC = () => {
  return (
    <CategoryPage
      title="Motivational Quotes"
      description="Inspiring motivational quotes and success mantras to boost your confidence. Perfect for daily motivation and social media inspiration."
      breadcrumb="Content Types / Motivational Quotes"
      filterKey="theme"
      filterValue="motivational_quotes"
      seoTitle="Motivational Quotes & Success Mantras - TextToReels.in"
      seoDescription="Find inspiring motivational quotes, success mantras, and positive affirmations in multiple languages. Create engaging motivational content."
      keywords="motivational quotes, success quotes, inspiration quotes, hindi motivational quotes, english motivation"
      canonicalUrl="https://texttoreels.in/content-types/motivational-quotes"
    />
  );
};

export default MotivationalQuotesPage;