import { PageContent } from '@/types';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
}

export const generateSEO = (props: SEOProps = {}) => {
  const {
    title = 'TextToReels.in - Premium Text to Video Content Generator',
    description = 'Create stunning video content from text with TextToReels.in. AI-powered text-to-video generator for Instagram Reels, YouTube Shorts, and more. Generate engaging social media content in Hindi, English, and regional languages.',
    keywords = ['text to video', 'reel generator', 'content creation', 'TextToReels.in', 'AI video generator', 'hindi content', 'social media'],
    canonicalUrl = 'https://texttoreels.in/',
    ogImage = 'https://texttoreels.in/og-image.jpg',
    ogType = 'website',
    twitterCard = 'summary_large_image'
  } = props;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    canonical: canonicalUrl,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: ogType,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      siteName: 'TextToReels.in'
    },
    twitter: {
      card: twitterCard,
      title,
      description,
      images: [ogImage],
      creator: '@TextToReels'
    },
    additionalMetaTags: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'TextToReels.in' },
      { name: 'generator', content: 'TextToReels.in AI Content Engine' },
      { httpEquiv: 'Content-Language', content: 'en, hi' }
    ]
  };
};

export const generatePageSEO = (page: PageContent) => {
  const baseUrl = 'https://texttoreels.in';
  const fullUrl = `${baseUrl}${page.seo.canonicalUrl}`;
  
  return generateSEO({
    title: page.seo.metaTitle,
    description: page.seo.metaDescription,
    keywords: [...page.seo.keywords, 'TextToReels.in', 'content generator'],
    canonicalUrl: fullUrl,
    ogType: 'article'
  });
};

export const generateBreadcrumbs = (page: PageContent) => {
  return [
    { name: 'Home', url: '/' },
    { name: 'Content', url: '/content' },
    { 
      name: page.content.title.replace(' | TextToReels.in', ''),
      url: page.seo.canonicalUrl
    }
  ];
};

export const generateStructuredData = (page: PageContent) => {
  const baseUrl = 'https://texttoreels.in';
  
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'TextToReels.in',
        description: 'Premium AI-powered text to video content generator',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/search?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'WebPage',
        '@id': `${baseUrl}${page.seo.canonicalUrl}#webpage`,
        url: `${baseUrl}${page.seo.canonicalUrl}`,
        name: page.seo.metaTitle,
        description: page.seo.metaDescription,
        isPartOf: { '@id': `${baseUrl}/#website` },
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: generateBreadcrumbs(page).map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: `${baseUrl}${crumb.url}`
          }))
        }
      },
      {
        '@type': 'Article',
        '@id': `${baseUrl}${page.seo.canonicalUrl}#article`,
        isPartOf: { '@id': `${baseUrl}${page.seo.canonicalUrl}#webpage` },
        headline: page.content.title,
        description: page.content.description,
        mainEntityOfPage: `${baseUrl}${page.seo.canonicalUrl}`,
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        author: {
          '@type': 'Organization',
          name: 'TextToReels.in'
        },
        publisher: {
          '@type': 'Organization',
          name: 'TextToReels.in',
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`
          }
        }
      }
    ]
  };
};