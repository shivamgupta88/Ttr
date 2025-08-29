import React from 'react';
import CategoryPage from '@/components/CategoryPage';

const HindiContentPage: React.FC = () => {
  return (
    <CategoryPage
      title="Hindi Content"
      description="Discover beautiful Hindi content including quotes, shayari, wishes, and messages. Perfect for creating authentic Hindi social media content."
      breadcrumb="Languages / Hindi"
      filterKey="language"
      filterValue="hindi"
      seoTitle="Hindi Content - Quotes, Shayari & Messages - TextToReels.in"
      seoDescription="Create authentic Hindi content with our collection of quotes, shayari, wishes and messages. Perfect for Indian social media audience."
      keywords="hindi content, hindi quotes, hindi shayari, hindi messages, hindi wishes, देवनागरी content"
      canonicalUrl="https://texttoreels.in/language/hindi"
    />
  );
};

export default HindiContentPage;