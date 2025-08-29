import React from 'react';
import CategoryPage from '@/components/CategoryPage';

const HindiShayariPage: React.FC = () => {
  return (
    <CategoryPage
      title="Hindi Shayari"
      description="Beautiful Hindi shayari collection including love, sad, motivational, and romantic shayari. Express your emotions with authentic Urdu poetry."
      breadcrumb="Content Types / Hindi Shayari"
      filterKey="theme"
      filterValue="hindi_shayari"
      seoTitle="Hindi Shayari - Love, Sad & Romantic Poetry - TextToReels.in"
      seoDescription="Discover beautiful Hindi shayari, Urdu poetry, love shayari, sad shayari and romantic verses. Perfect for WhatsApp status and social media."
      keywords="hindi shayari, urdu shayari, love shayari, sad shayari, romantic shayari, hindi poetry"
      canonicalUrl="https://texttoreels.in/content-types/hindi-shayari"
    />
  );
};

export default HindiShayariPage;