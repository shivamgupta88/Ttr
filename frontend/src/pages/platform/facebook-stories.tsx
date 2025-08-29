import React from 'react';
import CategoryPage from '@/components/CategoryPage';

const FacebookStoriesPage: React.FC = () => {
  return (
    <CategoryPage
      title="Facebook Stories"
      description="Create engaging Facebook Stories with our content templates. Stand out in your friends' feed with compelling story content."
      breadcrumb="Platforms / Facebook Stories"
      filterKey="platform"
      filterValue="facebook_story"
      seoTitle="Facebook Stories Content Templates - TextToReels.in"
      seoDescription="Create engaging Facebook Stories with our templates. Perfect content for quotes, wishes, and updates in multiple languages."
      keywords="facebook stories, story content, facebook templates, story ideas, facebook posts, social media stories"
      canonicalUrl="https://texttoreels.in/platform/facebook-stories"
    />
  );
};

export default FacebookStoriesPage;