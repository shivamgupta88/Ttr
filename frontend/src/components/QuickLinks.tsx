'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiExternalLink, FiTrendingUp } from 'react-icons/fi';

interface QuickLink {
  slug: string;
  title: string;
  theme: string;
  language: string;
  platform: string;
  relevance: 'high' | 'medium';
  linkType: string;
}

interface QuickLinksProps {
  currentTheme?: string;
  currentLanguage?: string;
  limit?: number;
}

const QuickLinksSection = styled.section`
  padding: 4rem 0;
  margin-top: 3rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(102, 126, 234, 0.02) 100%);
  border-top: 1px solid rgba(102, 126, 234, 0.1);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const SectionTitle = styled(motion.h3)`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 2rem;

  span {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const QuickLinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const QuickLinkCard = styled(motion.a)`
  display: block;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-decoration: none;
  color: #2d3748;
  border: 1px solid rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: rgba(102, 126, 234, 0.3);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ThemeIcon = styled.div<{ $themeColor: string }>`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, ${props => props.$themeColor} 0%, ${props => props.$themeColor}80 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const CardContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  color: #2d3748;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const CardTags = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
`;

const Tag = styled.span<{ $variant: 'primary' | 'secondary' }>`
  background: ${props => props.$variant === 'primary' ? 'rgba(102, 126, 234, 0.1)' : '#edf2f7'};
  color: ${props => props.$variant === 'primary' ? '#667eea' : '#4a5568'};
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const RelevanceIndicator = styled.div<{ $relevance: 'high' | 'medium' }>`
  font-size: 0.8rem;
  color: #718096;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    background: ${props => props.$relevance === 'high' ? '#48bb78' : '#ed8936'};
    border-radius: 50%;
  }
`;

const ExploreButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  margin: 0 auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

// Fixed data with real URLs that exist on the site
const SAMPLE_LINKS: QuickLink[] = [
  {
    slug: 'content-types/love-quotes',
    title: 'Love Quotes & Romantic Shayari - Express Your Feelings',
    theme: 'love_and_romance',
    language: 'hindi',
    platform: 'instagram_reels',
    relevance: 'high',
    linkType: 'same_cluster'
  },
  {
    slug: 'content-types/motivational-quotes',
    title: 'Motivational Quotes for Success - Inspire Yourself',
    theme: 'motivation_and_success',
    language: 'english',
    platform: 'youtube_shorts',
    relevance: 'high',
    linkType: 'related_theme'
  },
  {
    slug: 'content-types/friendship-quotes',
    title: 'Friendship Quotes - Celebrate True Bonds',
    theme: 'friendship',
    language: 'punjabi',
    platform: 'whatsapp_status',
    relevance: 'medium',
    linkType: 'same_language'
  },
  {
    slug: 'content-types/birthday-wishes',
    title: 'Birthday Wishes & Celebrations - Perfect for Special Days',
    theme: 'birthday_special',
    language: 'hindi',
    platform: 'facebook_stories',
    relevance: 'medium',
    linkType: 'high_traffic'
  },
  {
    slug: 'content-types/good-morning',
    title: 'Good Morning Messages - Start Your Day with Positivity',
    theme: 'good_morning',
    language: 'english',
    platform: 'instagram_stories',
    relevance: 'high',
    linkType: 'related_theme'
  },
  {
    slug: 'content-types/hindi-shayari',
    title: 'Hindi Shayari & Poetry - Beautiful Hindi Expressions',
    theme: 'festival_wishes',
    language: 'hindi',
    platform: 'whatsapp_status',
    relevance: 'medium',
    linkType: 'same_language'
  },
  {
    slug: 'platform/instagram-reels',
    title: 'Instagram Reels Creator - Viral Content Templates',
    theme: 'platform_specific',
    language: 'english',
    platform: 'instagram_reels',
    relevance: 'high',
    linkType: 'platform_focused'
  },
  {
    slug: 'platform/youtube-shorts',
    title: 'YouTube Shorts Generator - Quick Video Content',
    theme: 'platform_specific',
    language: 'english',
    platform: 'youtube_shorts',
    relevance: 'high',
    linkType: 'platform_focused'
  },
  {
    slug: 'platform/whatsapp-status',
    title: 'WhatsApp Status Videos - Perfect for Status Updates',
    theme: 'platform_specific',
    language: 'hindi',
    platform: 'whatsapp_status',
    relevance: 'medium',
    linkType: 'platform_focused'
  },
  {
    slug: 'language/hindi',
    title: 'Hindi Content Templates - Regional Language Content',
    theme: 'language_specific',
    language: 'hindi',
    platform: 'all_platforms',
    relevance: 'medium',
    linkType: 'language_focused'
  },
  {
    slug: 'language/punjabi',
    title: 'Punjabi Video Content - Culture & Music',
    theme: 'language_specific',
    language: 'punjabi',
    platform: 'all_platforms',
    relevance: 'medium',
    linkType: 'language_focused'
  },
  {
    slug: 'language/english',
    title: 'English Content Library - Global Content Templates',
    theme: 'language_specific',
    language: 'english',
    platform: 'all_platforms',
    relevance: 'medium',
    linkType: 'language_focused'
  }
];

const getThemeIcon = (theme: string): string => {
  const icons: Record<string, string> = {
    'love_and_romance': '❤️',
    'motivation_and_success': '🚀',
    'friendship': '👫',
    'festival_wishes': '🎉',
    'birthday_special': '🎂',
    'good_morning': '🌅',
    'good_night': '🌙',
    'inspirational_quotes': '⭐',
    'emotional_quotes': '💝',
    'happy_quotes': '😊'
  };
  return icons[theme] || '✨';
};

const getThemeColor = (theme: string): string => {
  const colors: Record<string, string> = {
    'love_and_romance': '#f093fb',
    'motivation_and_success': '#667eea',
    'friendship': '#4facfe',
    'festival_wishes': '#43e97b',
    'birthday_special': '#fa709a',
    'good_morning': '#ffecd2',
    'good_night': '#a8edea'
  };
  return colors[theme] || '#667eea';
};

const formatLanguage = (language: string): string => {
  return language.charAt(0).toUpperCase() + language.slice(1);
};

const formatPlatform = (platform: string): string => {
  return platform.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const QuickLinks: React.FC<QuickLinksProps> = ({
  currentTheme = 'love_and_romance',
  currentLanguage = 'hindi',
  limit = 6
}) => {
  const [links, setLinks] = useState<QuickLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - in real app, fetch based on current page
    const fetchQuickLinks = async () => {
      try {
        // Filter and prioritize links based on current page context
        const relevantLinks = SAMPLE_LINKS
          .filter(link =>
            link.theme !== currentTheme || link.language !== currentLanguage
          )
          .sort((a, b) => {
            // Prioritize same language first, then high relevance
            const aLangScore = a.language === currentLanguage ? 2 : 0;
            const bLangScore = b.language === currentLanguage ? 2 : 0;
            const aRelScore = a.relevance === 'high' ? 1 : 0;
            const bRelScore = b.relevance === 'high' ? 1 : 0;

            return (bLangScore + bRelScore) - (aLangScore + aRelScore);
          })
          .slice(0, limit);

        setLinks(relevantLinks);
      } catch (error) {
        console.error('Error fetching quick links:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuickLinks();
  }, [currentTheme, currentLanguage, limit]);

  if (loading) {
    return (
      <QuickLinksSection>
        <Container>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #667eea',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ color: '#718096' }}>Loading quick links...</p>
          </div>
        </Container>
      </QuickLinksSection>
    );
  }

  if (links.length === 0) {
    return null;
  }

  return (
    <QuickLinksSection>
      <Container>
        <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {getThemeIcon(currentTheme)} Related Content & <span>Quick Links</span>
        </SectionTitle>

        <QuickLinksGrid>
          {links.map((link, index) => (
            <QuickLinkCard
              key={link.slug}
              href={`/${link.slug}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -3 }}
            >
              <CardHeader>
                <ThemeIcon $themeColor={getThemeColor(link.theme)}>
                  {getThemeIcon(link.theme)}
                </ThemeIcon>
                <CardContent>
                  <CardTitle>{link.title}</CardTitle>
                  <CardTags>
                    <Tag $variant="primary">{formatLanguage(link.language)}</Tag>
                    <Tag $variant="secondary">{formatPlatform(link.platform)}</Tag>
                  </CardTags>
                  <RelevanceIndicator $relevance={link.relevance}>
                    {link.relevance === 'high' ? 'Highly Related' : 'Related Content'}
                  </RelevanceIndicator>
                </CardContent>
              </CardHeader>
            </QuickLinkCard>
          ))}
        </QuickLinksGrid>

        <CenteredContainer>
          <ExploreButton
            href="/explore"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiTrendingUp size={20} />
            Explore More Content
          </ExploreButton>
        </CenteredContainer>
      </Container>
    </QuickLinksSection>
  );
};

export default QuickLinks;