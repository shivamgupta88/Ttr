import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import PremiumFeatures from '@/components/PremiumFeatures';
import VideoShowcase from '@/components/VideoShowcase';
import FuturisticStats from '@/components/FuturisticStats';
import QuickLinks from '@/components/QuickLinks';
import { PageContent } from '@/types';
import { pagesApi } from '@/utils/api';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTrendingUp, FiStar, FiGrid } from 'react-icons/fi';

const FeaturesSection = styled.section`
  padding: 4rem 0;
  background: #f7fafc;
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: clamp(2rem, 3vw, 2.5rem);
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 3rem;
  
  span {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const FeatureCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  }
  
  .icon {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 1rem;
  }
  
  p {
    color: #718096;
    line-height: 1.6;
  }
`;

const ContentSection = styled.section`
  padding: 4rem 0;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const ContentCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
`;

const ContentCardHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ContentCardBody = styled.div`
  padding: 1.5rem;
  
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }
  
  p {
    color: #718096;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 1rem;
  }
`;

const ContentCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #a0aec0;
  
  .platform {
    background: #edf2f7;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-weight: 500;
  }
`;

const ViewAllButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  margin: 2rem auto;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
`;

interface HomeProps {
  featuredPages: PageContent[];
}

const HomePage: React.FC<HomeProps> = ({ featuredPages }) => {
  const [pages, setPages] = useState<PageContent[]>(featuredPages || []);
  const [loading, setLoading] = useState(!featuredPages?.length);

  useEffect(() => {
    if (!featuredPages?.length) {
      loadFeaturedContent();
    }
  }, []);

  const loadFeaturedContent = async () => {
    try {
      const response = await pagesApi.getRandomPages(12);
      if (response.success) {
        setPages(response.data);
      }
    } catch (error) {
      console.error('Error loading featured content:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: FiGrid,
      title: '1M+ Content Templates',
      description: 'Access over 1 million pre-generated content templates across all categories, themes, and languages for instant inspiration.'
    },
    {
      icon: FiTrendingUp,
      title: '50+ Languages Support',
      description: 'Create content in Hindi, English, Punjabi, Urdu, Bengali, Tamil, and 45+ other regional languages for maximum reach.'
    },
    {
      icon: FiStar,
      title: 'AI-Powered Generation',
      description: 'Advanced AI algorithms optimize your content for engagement, readability, and platform-specific requirements.'
    }
  ];

  return (
    <Layout
      title="TextToReels.in - AI-Powered Text to Video Generator | Create Viral Content in Seconds"
      description="Transform text into stunning videos with TextToReels.in's advanced AI. Generate Instagram Reels, YouTube Shorts & social media content in 50+ languages including Hindi. 1M+ templates, instant results, Hollywood-grade quality. Free to start!"
      keywords="text to video generator, AI video maker, Instagram reels creator, YouTube shorts generator, hindi video maker, social media content creator, viral video generator, TextToReels.in, automatic video creation, content marketing tools"
      canonical="https://texttoreels.in/"
    >
      <Hero />
      <PremiumFeatures />
      <VideoShowcase />
      <FuturisticStats />
      
      <FeaturesSection>
        <FeaturesContainer>
          <SectionTitle>
            Why Choose <span>TextToReels.in</span>?
          </SectionTitle>
          
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="icon">
                  <feature.icon size={28} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>
      
      <ContentSection>
        <ContentContainer>
          <SectionTitle>
            Featured <span>Content Templates</span>
          </SectionTitle>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="loading" style={{ 
                width: '40px', 
                height: '40px', 
                border: '3px solid #f3f3f3', 
                borderTop: '3px solid #667eea', 
                borderRadius: '50%', 
                margin: '0 auto' 
              }}></div>
              <p style={{ marginTop: '1rem', color: '#718096' }}>Loading featured content...</p>
            </div>
          ) : (
            <ContentGrid>
              {pages.slice(0, 12).map((page, index) => (
                <ContentCard
                  key={page.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ContentCardHeader>
                    {page.dimensions.theme.replace(/_/g, ' ').toUpperCase()}
                  </ContentCardHeader>
                  <ContentCardBody>
                    <h3>{page.content.title.replace(' | TextToReels.in', '')}</h3>
                    <p>{page.content.description.substring(0, 120)}...</p>
                    <ContentCardFooter>
                      <span className="platform">
                        {page.dimensions.platform.replace(/_/g, ' ')}
                      </span>
                      <span>{page.dimensions.language}</span>
                    </ContentCardFooter>
                  </ContentCardBody>
                </ContentCard>
              ))}
            </ContentGrid>
          )}
          
          <CenteredContainer>
            <ViewAllButton href="/explore">
              View All Templates
              <FiArrowRight size={20} />
            </ViewAllButton>
          </CenteredContainer>
        </ContentContainer>
      </ContentSection>

      <QuickLinks
        currentTheme="love_and_romance"
        currentLanguage="hindi"
        limit={6}
      />
    </Layout>
  );
};

export async function getStaticProps() {
  // For static export, return empty featured pages
  // Frontend will load them dynamically via client-side API calls
  return {
    props: {
      featuredPages: []
    }
  };
}

export default HomePage;