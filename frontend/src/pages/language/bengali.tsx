import React from 'react';
import CategoryPage from '@/components/CategoryPage';

const BengaliContentPage: React.FC = () => {
  return (
    <CategoryPage
      title="Bengali Content"
      description="Rich Bengali content with cultural quotes, Rabindranath Tagore's wisdom, and regional expressions. Connect with Bengali heritage."
      breadcrumb="Languages / Bengali"
      filterKey="language"
      filterValue="bengali"
      seoTitle="Bengali Content - Quotes & Poetry - TextToReels.in"
      seoDescription="Discover rich Bengali content with cultural quotes, poetry and regional expressions. Perfect for Bengali social media content."
      keywords="bengali content, bengali quotes, bengali poetry, বাংলা content, tagore quotes, bengali messages"
      canonicalUrl="https://texttoreels.in/language/bengali"
    />
  );
};

export default BengaliContentPage;