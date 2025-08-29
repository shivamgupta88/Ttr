import React from 'react';
import CategoryPage from '@/components/CategoryPage';

const FriendshipQuotesPage: React.FC = () => {
  return (
    <CategoryPage
      title="Friendship Quotes"
      description="Heartwarming friendship quotes and dosti shayari celebrating the bond of friendship. Share beautiful messages with your best friends."
      breadcrumb="Content Types / Friendship Quotes"
      filterKey="theme"
      filterValue="friendship_quotes"
      seoTitle="Friendship Quotes & Dosti Shayari - TextToReels.in"
      seoDescription="Celebrate friendship with beautiful quotes and dosti shayari. Perfect messages for friends in Hindi, English and regional languages."
      keywords="friendship quotes, dosti quotes, friendship shayari, best friend quotes, hindi friendship quotes"
      canonicalUrl="https://texttoreels.in/content-types/friendship-quotes"
    />
  );
};

export default FriendshipQuotesPage;