'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlay, FiStar, FiTrendingUp, FiZap } from 'react-icons/fi';

const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6rem 0;
  position: relative;
  overflow: hidden;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
  position: relative;
  z-index: 2;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  
  span {
    background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  line-height: 1.6;
  margin-bottom: 2.5rem;
  opacity: 0.9;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const HeroButtons = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
`;

const PrimaryButton = styled.a`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const SecondaryButton = styled.a`
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.8);
    transform: translateY(-3px);
  }
`;

const StatsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  
  .icon {
    color: #ffd89b;
    margin-bottom: 0.5rem;
  }
  
  .number {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
  }
  
  .label {
    opacity: 0.8;
    font-size: 0.9rem;
  }
`;

const BackgroundElements = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 20%;
    left: -10%;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    filter: blur(100px);
    animation: float 6s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 20%;
    right: -5%;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgba(255, 216, 155, 0.2);
    filter: blur(80px);
    animation: float 4s ease-in-out infinite reverse;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`;

const LanguageStrip = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
`;

const LanguageTag = styled.span`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Hero: React.FC = () => {
  const [currentStat, setCurrentStat] = useState(0);
  
  const stats = [
    { icon: FiZap, number: '1M+', label: 'Content Templates' },
    { icon: FiStar, number: '100K+', label: 'Happy Creators' },
    { icon: FiTrendingUp, number: '50+', label: 'Languages' },
    { icon: FiPlay, number: '24/7', label: 'Generation Ready' }
  ];

  const languages = [
    'Hindi', 'English', 'Punjabi', 'Urdu', 'Bengali', 'Tamil', 
    'Telugu', 'Marathi', 'Gujarati', 'Kannada'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <HeroSection>
      <BackgroundElements />
      
      <HeroContent>
        <HeroTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Create Stunning <span>Video Content</span> from Text
        </HeroTitle>
        
        <HeroSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Transform your ideas into engaging Instagram Reels, YouTube Shorts, and social media content 
          with TextToReels.in - India's #1 AI-powered text-to-video generator supporting 50+ languages.
        </HeroSubtitle>
        
        <HeroButtons
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <PrimaryButton href="/explore">
            <FiPlay size={20} />
            Start Creating Free
          </PrimaryButton>
          <SecondaryButton href="/explore">
            <FiTrendingUp size={20} />
            Explore Templates
          </SecondaryButton>
        </HeroButtons>
        
        <LanguageStrip
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {languages.map((lang, index) => (
            <LanguageTag key={index}>{lang}</LanguageTag>
          ))}
        </LanguageStrip>
        
        <StatsContainer
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {stats.map((stat, index) => (
            <StatCard key={index}>
              <div className="icon">
                <stat.icon size={32} />
              </div>
              <div className="number">{stat.number}</div>
              <div className="label">{stat.label}</div>
            </StatCard>
          ))}
        </StatsContainer>
      </HeroContent>
    </HeroSection>
  );
};

export default Hero;