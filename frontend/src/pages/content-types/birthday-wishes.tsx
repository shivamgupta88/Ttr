import React from 'react';
import CategoryPage from '@/components/CategoryPage';

const BirthdayWishesPage: React.FC = () => {
  return (
    <CategoryPage
      title="Birthday Wishes"
      description="Heartfelt birthday wishes, quotes, and messages to make someone's special day memorable. Perfect for social media posts and stories."
      breadcrumb="Content Types / Birthday Wishes"
      filterKey="theme"
      filterValue="birthday_wishes"
      seoTitle="Birthday Wishes & Quotes - TextToReels.in"
      seoDescription="Celebrate birthdays with beautiful wishes, quotes and messages in Hindi, English. Create memorable birthday posts for social media."
      keywords="birthday wishes, happy birthday quotes, birthday messages, hindi birthday wishes, birthday greetings"
      canonicalUrl="https://texttoreels.in/content-types/birthday-wishes"
    />
  );
};

export default BirthdayWishesPage;