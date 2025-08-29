import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '@/components/Layout';
import { PageContent } from '@/types';
import { pagesApi } from '@/utils/api';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiShare2, 
  FiDownload, 
  FiHeart, 
  FiBookmark, 
  FiCopy, 
  FiCheck,
  FiStar,
  FiTarget,
  FiUsers,
  FiCalendar,
  FiTrendingUp
} from 'react-icons/fi';

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const ContentHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  .breadcrumb {
    color: #718096;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    
    a {
      color: #667eea;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  h1 {
    font-size: clamp(2rem, 3vw, 2.5rem);
    font-weight: 900;
    color: #1a202c;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  
  .description {
    font-size: 1.1rem;
    color: #718096;
    max-width: 800px;
    margin: 0 auto 2rem;
    line-height: 1.6;
  }
`;

const CategoryBadge = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
  margin-bottom: 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
`;

const ActionButton = styled.button<{ primary?: boolean; copied?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid ${props => props.primary ? '#667eea' : '#e2e8f0'};
  background: ${props => props.primary ? '#667eea' : 'white'};
  color: ${props => props.primary ? 'white' : props.copied ? '#10b981' : '#4a5568'};
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
    ${props => !props.primary && `
      border-color: #667eea;
      color: #667eea;
    `}
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const MainContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  
  h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f7fafc;
  
  &:last-child {
    border-bottom: none;
  }
  
  .label {
    color: #718096;
    font-size: 0.9rem;
  }
  
  .value {
    color: #2d3748;
    font-weight: 500;
    text-transform: capitalize;
  }
`;

const ContentSection = styled.div`
  margin-bottom: 2rem;
  
  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    padding: 0.75rem 0;
    padding-left: 2rem;
    position: relative;
    color: #4a5568;
    line-height: 1.6;
    
    &:before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #10b981;
      font-weight: bold;
      font-size: 1.1rem;
    }
  }
`;

const ExamplesList = styled.div`
  display: grid;
  gap: 1rem;
`;

const ExampleCard = styled.div`
  background: #f7fafc;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  font-style: italic;
  color: #4a5568;
  line-height: 1.5;
`;

const QualityScores = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
`;

const ScoreItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  
  .score {
    font-size: 1.5rem;
    font-weight: bold;
    color: #667eea;
  }
  
  .label {
    font-size: 0.8rem;
    color: #718096;
    margin-top: 0.25rem;
  }
`;

const RelatedSection = styled.div`
  margin-top: 3rem;
  
  h2 {
    text-align: center;
    margin-bottom: 2rem;
  }
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const RelatedCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  }
  
  .header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.75rem 1rem;
    font-size: 0.8rem;
    font-weight: 600;
  }
  
  .body {
    padding: 1rem;
    
    h4 {
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      line-height: 1.3;
    }
    
    p {
      font-size: 0.8rem;
      color: #718096;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem;
  
  h2 {
    color: #e53e3e;
    margin-bottom: 1rem;
  }
  
  p {
    color: #718096;
    margin-bottom: 2rem;
  }
  
  button {
    background: #667eea;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
  }
`;

interface ContentDetailPageProps {
  pageContent?: PageContent | null;
  relatedContent?: PageContent[];
}

const ContentDetailPage: React.FC<ContentDetailPageProps> = ({ 
  pageContent: initialPageContent, 
  relatedContent: initialRelatedContent = [] 
}) => {
  const router = useRouter();
  const { slug } = router.query;
  const [pageContent, setPageContent] = useState<PageContent | null>(initialPageContent || null);
  const [relatedContent, setRelatedContent] = useState<PageContent[]>(initialRelatedContent);
  const [loading, setLoading] = useState(!initialPageContent);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!initialPageContent && slug && typeof slug === 'string') {
      loadContent(slug);
    }
  }, [slug, initialPageContent]);

  const loadContent = async (contentSlug: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await pagesApi.getPageBySlug(contentSlug);
      if (response.success) {
        setPageContent(response.data);
        
        // Load related content based on theme
        try {
          const relatedResponse = await pagesApi.getPages({
            theme: response.data.dimensions.theme,
            limit: 6
          });
          if (relatedResponse.success) {
            // Filter out current page
            const filtered = relatedResponse.data.filter(page => page.slug !== contentSlug);
            setRelatedContent(filtered.slice(0, 3));
          }
        } catch (relatedError) {
          console.error('Error loading related content:', relatedError);
        }
      } else {
        setError('Content not found');
      }
    } catch (err) {
      setError('Failed to load content');
      console.error('Error loading content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyContent = async () => {
    if (!pageContent) return;
    
    const textToCopy = `${pageContent.content.heading}\n\n${pageContent.content.description}\n\n${pageContent.content.examples.join('\n\n')}\n\nFrom TextToReels.in`;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy content:', err);
    }
  };

  const handleShare = async () => {
    if (!pageContent) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: pageContent.content.title,
          text: pageContent.content.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('URL copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
    }
  };

  if (loading) {
    return (
      <Layout title="Loading... - TextToReels.in">
        <LoadingSpinner>
          <div className="spinner"></div>
        </LoadingSpinner>
      </Layout>
    );
  }

  if (error || !pageContent) {
    return (
      <Layout title="Content Not Found - TextToReels.in">
        <ErrorMessage>
          <h2>Content Not Found</h2>
          <p>The content you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => router.push('/explore')}>
            Browse All Content
          </button>
        </ErrorMessage>
      </Layout>
    );
  }

  return (
    <Layout
      title={pageContent.seo.metaTitle}
      description={pageContent.seo.metaDescription}
      keywords={pageContent.seo.keywords.join(', ')}
      canonical={pageContent.seo.canonicalUrl}
    >
      <ContentContainer>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <ContentHeader>
            <div className="breadcrumb">
              <a href="/">Home</a> / <a href="/explore">Explore</a> / {pageContent.dimensions.theme.replace(/_/g, ' ')}
            </div>
            
            <CategoryBadge>
              {pageContent.dimensions.theme.replace(/_/g, ' ')}
            </CategoryBadge>
            
            <h1>{pageContent.content.heading}</h1>
            <p className="description">{pageContent.content.description}</p>
          </ContentHeader>

          <ActionButtons>
            <ActionButton primary onClick={handleCopyContent}>
              {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
              {copied ? 'Copied!' : 'Copy Content'}
            </ActionButton>
            
            <ActionButton onClick={handleShare}>
              <FiShare2 size={18} />
              Share
            </ActionButton>
            
            <ActionButton onClick={() => setLiked(!liked)}>
              <FiHeart size={18} fill={liked ? 'currentColor' : 'none'} />
              {liked ? 'Liked' : 'Like'}
            </ActionButton>
            
            <ActionButton onClick={() => setBookmarked(!bookmarked)}>
              <FiBookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
              {bookmarked ? 'Saved' : 'Save'}
            </ActionButton>
          </ActionButtons>

          <ContentGrid>
            <MainContent>
              <ContentSection>
                <h2>
                  <FiStar size={20} />
                  Key Features
                </h2>
                <FeaturesList>
                  {pageContent.content.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </FeaturesList>
              </ContentSection>

              <ContentSection>
                <h2>
                  <FiTrendingUp size={20} />
                  Content Examples
                </h2>
                <ExamplesList>
                  {pageContent.content.examples.map((example, index) => (
                    <ExampleCard key={index}>
                      "{example}"
                    </ExampleCard>
                  ))}
                </ExamplesList>
              </ContentSection>

              <ContentSection>
                <h2>Quality Scores</h2>
                <QualityScores>
                  <ScoreItem>
                    <div className="score">{Math.round(pageContent.quality.uniquenessScore)}%</div>
                    <div className="label">Uniqueness</div>
                  </ScoreItem>
                  <ScoreItem>
                    <div className="score">{Math.round(pageContent.quality.readabilityScore)}%</div>
                    <div className="label">Readability</div>
                  </ScoreItem>
                  <ScoreItem>
                    <div className="score">{Math.round(pageContent.quality.sentimentScore)}%</div>
                    <div className="label">Sentiment</div>
                  </ScoreItem>
                </QualityScores>
              </ContentSection>
            </MainContent>

            <Sidebar>
              <InfoCard>
                <h3>
                  <FiTarget size={18} />
                  Content Details
                </h3>
                <InfoItem>
                  <span className="label">Platform</span>
                  <span className="value">{pageContent.dimensions.platform.replace(/_/g, ' ')}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Language</span>
                  <span className="value">{pageContent.dimensions.language}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Style</span>
                  <span className="value">{pageContent.dimensions.style}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Audience</span>
                  <span className="value">{pageContent.dimensions.audience.replace(/_/g, ' ')}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Emotion</span>
                  <span className="value">{pageContent.dimensions.emotion}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Occasion</span>
                  <span className="value">{pageContent.dimensions.occasion}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Length</span>
                  <span className="value">{pageContent.dimensions.length}</span>
                </InfoItem>
              </InfoCard>

              <InfoCard>
                <h3>
                  <FiUsers size={18} />
                  Usage Stats
                </h3>
                <InfoItem>
                  <span className="label">Status</span>
                  <span className="value">{pageContent.status}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Variations</span>
                  <span className="value">{pageContent.generation.variations}</span>
                </InfoItem>
                <InfoItem>
                  <span className="label">Algorithm</span>
                  <span className="value">{pageContent.generation.algorithm}</span>
                </InfoItem>
              </InfoCard>
            </Sidebar>
          </ContentGrid>

          {relatedContent.length > 0 && (
            <RelatedSection>
              <h2>Related Content</h2>
              <RelatedGrid>
                {relatedContent.map((content, index) => (
                  <RelatedCard
                    key={content.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => router.push(`/content/${content.slug}`)}
                  >
                    <div className="header">
                      {content.dimensions.theme.replace(/_/g, ' ').toUpperCase()}
                    </div>
                    <div className="body">
                      <h4>{content.content.title.replace(' | TextToReels.in', '')}</h4>
                      <p>{content.content.description}</p>
                    </div>
                  </RelatedCard>
                ))}
              </RelatedGrid>
            </RelatedSection>
          )}
        </motion.div>
      </ContentContainer>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // For now, we'll use fallback rendering
  // In production, you might want to pre-generate popular pages
  return {
    paths: [],
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params?.slug || typeof params.slug !== 'string') {
    return {
      notFound: true,
    };
  }

  try {
    const response = await pagesApi.getPageBySlug(params.slug);
    
    if (!response.success || !response.data) {
      return {
        notFound: true,
      };
    }

    // Load related content
    let relatedContent: PageContent[] = [];
    try {
      const relatedResponse = await pagesApi.getPages({
        theme: response.data.dimensions.theme,
        limit: 6
      });
      if (relatedResponse.success) {
        relatedContent = relatedResponse.data
          .filter(page => page.slug !== params.slug)
          .slice(0, 3);
      }
    } catch (error) {
      console.error('Error loading related content:', error);
    }

    return {
      props: {
        pageContent: response.data,
        relatedContent
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      notFound: true,
    };
  }
};

export default ContentDetailPage;