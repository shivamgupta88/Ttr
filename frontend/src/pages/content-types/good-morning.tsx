import React from 'react';
import CategoryPage from '@/components/CategoryPage';

const GoodMorningPage: React.FC = () => {
  return (
    <CategoryPage
      title="Good Morning"
      description="Start your day with beautiful good morning quotes, wishes, and messages. Spread positivity with inspiring morning greetings."
      breadcrumb="Content Types / Good Morning"
      filterKey="theme"
      filterValue="good_morning"
      seoTitle="Good Morning Quotes & Wishes - TextToReels.in"
      seoDescription="Beautiful good morning quotes, wishes and greetings in Hindi, English. Start your day with positive morning messages and images."
      keywords="good morning quotes, good morning wishes, morning greetings, hindi good morning, suprabhat messages"
      canonicalUrl="https://texttoreels.in/content-types/good-morning"
    />
  );
};

export default GoodMorningPage;