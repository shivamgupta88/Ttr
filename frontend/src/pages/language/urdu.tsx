import React from 'react';
import CategoryPage from '@/components/CategoryPage';

const UrduContentPage: React.FC = () => {
  return (
    <CategoryPage
      title="Urdu Content"
      description="Beautiful Urdu content with classical poetry, romantic ghazals, and elegant expressions. Experience the richness of Urdu literature."
      breadcrumb="Languages / Urdu"
      filterKey="language"
      filterValue="urdu"
      seoTitle="Urdu Content - Poetry & Ghazals - TextToReels.in"
      seoDescription="Discover beautiful Urdu content with classical poetry, ghazals and elegant expressions. Perfect for Urdu literature enthusiasts."
      keywords="urdu content, urdu shayari, urdu ghazal, urdu poetry, اردو content, urdu quotes"
      canonicalUrl="https://texttoreels.in/language/urdu"
    />
  );
};

export default UrduContentPage;