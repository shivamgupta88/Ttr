'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiZap, FiCpu, FiActivity, FiVideo, FiTrendingUp, FiGlobe, FiEye, FiTarget } from 'react-icons/fi';

const FeaturesSection = styled.section`
  padding: 8rem 0;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  color: white;
  position: relative;
  overflow: hidden;
`;

const BackgroundElements = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.1;
  
  &::before {
    content: '';
    position: absolute;
    top: 20%;
    left: -20%;
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, #667eea 0%, transparent 70%);
    animation: float 8s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10%;
    right: -15%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, #764ba2 0%, transparent 70%);
    animation: float 6s ease-in-out infinite reverse;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-30px) rotate(180deg); }
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 2;
`;

const SectionTitle = styled(motion.h2)`
  text-align: center;
  font-size: clamp(2.5rem, 4vw, 4rem);
  font-weight: 900;
  margin-bottom: 1rem;
  
  span {
    background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const SectionSubtitle = styled(motion.p)`
  text-align: center;
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  opacity: 0.8;
  margin-bottom: 4rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 6rem;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  
  &:hover {
    transform: translateY(-10px);
    border-color: rgba(102, 126, 234, 0.5);
    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #667eea, transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  .icon-container {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 22px;
      background: linear-gradient(135deg, #667eea, #764ba2, #ffd89b);
      z-index: -1;
      opacity: 0;
      transition: opacity 0.4s ease;
    }
  }
  
  &:hover .icon-container::after {
    opacity: 0.7;
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #ffffff 0%, #ffd89b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    line-height: 1.6;
    opacity: 0.8;
    margin-bottom: 1.5rem;
  }
  
  .feature-list {
    list-style: none;
    padding: 0;
    
    li {
      padding: 0.5rem 0;
      opacity: 0.7;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      &::before {
        content: '✓';
        color: #ffd89b;
        font-weight: bold;
      }
    }
  }
`;

const AIShowcase = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  padding: 4rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(from 0deg, transparent, rgba(102, 126, 234, 0.1), transparent);
    animation: rotate 10s linear infinite;
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const AIContent = styled.div`
  position: relative;
  z-index: 2;
  
  h3 {
    font-size: clamp(2rem, 3vw, 3rem);
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #667eea 0%, #ffd89b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    font-size: 1.2rem;
    opacity: 0.8;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const AIStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const AIStat = styled(motion.div)`
  .number {
    font-size: 2.5rem;
    font-weight: 900;
    background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
  }
  
  .label {
    opacity: 0.7;
    font-size: 0.9rem;
  }
`;

const PremiumButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.25rem 2.5rem;
  border-radius: 50px;
  font-weight: 700;
  text-decoration: none;
  font-size: 1.1rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #764ba2 0%, #ffd89b 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  span {
    position: relative;
    z-index: 2;
  }
  
  .icon {
    position: relative;
    z-index: 2;
  }
`;

const PremiumFeatures: React.FC = () => {
  const features = [
    {
      icon: FiActivity,
      title: 'AI-Powered Content Engine',
      description: 'Advanced neural networks analyze trends and generate viral-ready content optimized for maximum engagement.',
      features: ['GPT-4 Integration', 'Trend Analysis', 'Viral Prediction', 'Auto-Optimization']
    },
    {
      icon: FiVideo,
      title: 'Hollywood-Grade Video Generation',
      description: 'Professional video rendering with cinematic effects, transitions, and custom animations.',
      features: ['4K Resolution', 'HDR Support', 'Custom Transitions', 'Motion Graphics']
    },
    {
      icon: FiTarget,
      title: 'Smart Audience Targeting',
      description: 'Machine learning algorithms identify and target your ideal audience across all platforms.',
      features: ['Demographic Analysis', 'Behavior Tracking', 'Platform Optimization', 'Conversion Tracking']
    },
    {
      icon: FiGlobe,
      title: 'Global Language Matrix',
      description: 'Support for 100+ languages with native cultural adaptation and regional trend integration.',
      features: ['Cultural Adaptation', 'Regional Trends', 'Native Voice AI', 'Localization']
    },
    {
      icon: FiTrendingUp,
      title: 'Real-Time Analytics',
      description: 'Live performance tracking with AI-driven insights and optimization recommendations.',
      features: ['Live Metrics', 'Competitor Analysis', 'Growth Predictions', 'ROI Tracking']
    },
    {
      icon: FiEye,
      title: 'Vision Recognition AI',
      description: 'Advanced computer vision for automated scene detection, object recognition, and style matching.',
      features: ['Scene Detection', 'Object Recognition', 'Style Transfer', 'Auto-Editing']
    }
  ];

  const aiStats = [
    { number: '99.7%', label: 'Accuracy Rate' },
    { number: '15x', label: 'Faster Than Manual' },
    { number: '2M+', label: 'Videos Generated' },
    { number: '50ms', label: 'Response Time' }
  ];

  return (
    <FeaturesSection>
      <BackgroundElements />
      
      <Container>
        <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Next-Generation <span>AI Video Studio</span>
        </SectionTitle>
        
        <SectionSubtitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Experience the future of content creation with our revolutionary AI-powered platform. 
          From concept to viral video in seconds.
        </SectionSubtitle>
        
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="icon-container">
                <feature.icon size={36} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <ul className="feature-list">
                {feature.features.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </FeatureCard>
          ))}
        </FeaturesGrid>
        
        <AIShowcase>
          <AIContent>
            <motion.h3
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Powered by Advanced AI
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Our proprietary AI engine combines computer vision, natural language processing, 
              and machine learning to deliver unprecedented video generation capabilities.
            </motion.p>
            
            <AIStats>
              {aiStats.map((stat, index) => (
                <AIStat
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="number">{stat.number}</div>
                  <div className="label">{stat.label}</div>
                </AIStat>
              ))}
            </AIStats>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
              style={{ marginTop: '3rem' }}
            >
              <PremiumButton
                href="/create"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Experience AI Magic</span>
                <FiZap className="icon" size={20} />
              </PremiumButton>
            </motion.div>
          </AIContent>
        </AIShowcase>
      </Container>
    </FeaturesSection>
  );
};

export default PremiumFeatures;