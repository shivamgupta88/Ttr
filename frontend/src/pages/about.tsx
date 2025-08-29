import React from 'react';
import Layout from '@/components/Layout';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiTarget, 
  FiHeart, 
  FiUsers, 
  FiTrendingUp,
  FiStar,
  FiAward
} from 'react-icons/fi';

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Hero = styled.section`
  text-align: center;
  padding: 4rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: -2rem -1rem 4rem -1rem;
  color: white;
  border-radius: 0 0 20px 20px;
  
  h1 {
    font-size: clamp(2.5rem, 4vw, 3.5rem);
    font-weight: 900;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.2rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const Section = styled.section`
  margin-bottom: 4rem;
  
  h2 {
    font-size: 2rem;
    font-weight: 800;
    color: #1a202c;
    margin-bottom: 2rem;
    text-align: center;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  
  .icon {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
  }
  
  .number {
    font-size: 2.5rem;
    font-weight: 900;
    color: #667eea;
    margin-bottom: 0.5rem;
  }
  
  .label {
    color: #718096;
    font-weight: 500;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const FeatureCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  
  .icon {
    color: #667eea;
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 1rem;
  }
  
  p {
    color: #718096;
    line-height: 1.6;
  }
`;

const Timeline = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const TimelineItem = styled(motion.div)`
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  
  .year {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem;
    border-radius: 12px;
    font-weight: 700;
    min-width: 80px;
    text-align: center;
    height: fit-content;
  }
  
  .content {
    flex: 1;
    
    h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1a202c;
      margin-bottom: 0.5rem;
    }
    
    p {
      color: #718096;
      line-height: 1.6;
    }
  }
`;

const AboutPage: React.FC = () => {
  const stats = [
    { icon: FiUsers, number: '1M+', label: 'Content Templates' },
    { icon: FiTrendingUp, number: '50K+', label: 'Daily Users' },
    { icon: FiStar, number: '15+', label: 'Languages' },
    { icon: FiAward, number: '99%', label: 'Satisfaction Rate' }
  ];

  const features = [
    {
      icon: FiTarget,
      title: 'AI-Powered Generation',
      description: 'Our advanced AI algorithms create unique, engaging content tailored to your specific needs and audience.'
    },
    {
      icon: FiHeart,
      title: 'Quality Assured',
      description: 'Every template goes through quality checks for uniqueness, readability, and emotional impact.'
    },
    {
      icon: FiUsers,
      title: 'Multi-Platform Ready',
      description: 'Content optimized for Instagram Reels, YouTube Shorts, TikTok, and other social media platforms.'
    }
  ];

  const timeline = [
    {
      year: '2024',
      title: 'Launch & Scale',
      description: 'Launched TextToReels.in with 1M+ content templates and expanded to 15+ languages with AI-powered generation.'
    },
    {
      year: '2023',
      title: 'Development',
      description: 'Started development with a focus on creating high-quality, diverse content templates for social media creators.'
    },
    {
      year: '2023',
      title: 'Vision',
      description: 'Identified the need for authentic, culturally relevant content templates in multiple languages for global creators.'
    }
  ];

  return (
    <Layout
      title="About Us - TextToReels.in"
      description="Learn about TextToReels.in - the leading platform for AI-generated content templates for Instagram Reels, YouTube Shorts, and social media. Discover our mission and story."
      keywords="about TextToReels.in, content creation platform, AI content generation, social media templates"
      canonical="https://texttoreels.in/about"
    >
      <AboutContainer>
        <Hero>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>About TextToReels.in</h1>
            <p>
              Empowering creators worldwide with AI-generated content templates 
              that drive engagement and inspire authentic storytelling.
            </p>
          </motion.div>
        </Hero>

        <Section>
          <h2>Our Impact</h2>
          <StatsGrid>
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="icon">
                  <stat.icon size={24} />
                </div>
                <div className="number">{stat.number}</div>
                <div className="label">{stat.label}</div>
              </StatCard>
            ))}
          </StatsGrid>
        </Section>

        <Section>
          <h2>What We Do</h2>
          <FeatureGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="icon">
                  <feature.icon size={32} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </FeatureCard>
            ))}
          </FeatureGrid>
        </Section>

        <Section>
          <h2>Our Journey</h2>
          <Timeline>
            {timeline.map((item, index) => (
              <TimelineItem
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="year">{item.year}</div>
                <div className="content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </TimelineItem>
            ))}
          </Timeline>
        </Section>
      </AboutContainer>
    </Layout>
  );
};

export default AboutPage;