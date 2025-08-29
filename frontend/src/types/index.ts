export interface PageContent {
  slug: string;
  dimensions: {
    theme: string;
    language: string;
    style: string;
    platform: string;
    audience: string;
    emotion: string;
    occasion: string;
    length: string;
  };
  content: {
    title: string;
    heading: string;
    description: string;
    features: string[];
    examples: string[];
    callToAction: string;
    footerText: string;
    uniqueValue: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl: string;
  };
  status: 'generated' | 'published';
  generation: {
    algorithm: string;
    hash: string;
    variations: number;
  };
  quality: {
    uniquenessScore: number;
    readabilityScore: number;
    sentimentScore: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}

export interface FilterOptions {
  theme?: string;
  language?: string;
  platform?: string;
  audience?: string;
  search?: string;
  page?: number;
  limit?: number;
}