'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { FiUsers, FiVideo, FiGlobe, FiZap, FiTrendingUp, FiClock } from 'react-icons/fi';

const StatsSection = styled.section`
  padding: 6rem 0;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  position: relative;
  overflow: hidden;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.1;
  background-image: 
    radial-gradient(circle at 25% 25%, #ffffff 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, #ffffff 2px, transparent 2px);
  background-size: 50px 50px;
  animation: float 20s ease-in-out infinite;
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
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
  font-size: clamp(2.5rem, 4vw, 3.5rem);
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
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  opacity: 0.9;
  margin-bottom: 4rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 2.5rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #ffd89b, transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  &:hover {
    transform: translateY(-10px);
    border-color: rgba(255, 216, 155, 0.4);
    box-shadow: 0 20px 60px rgba(255, 216, 155, 0.2);
  }
`;

const StatIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255, 216, 155, 0.2) 0%, rgba(25, 84, 123, 0.2) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: #ffd89b;
  font-size: 2rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 22px;
    background: linear-gradient(135deg, #ffd89b, transparent, #19547b);
    z-index: -1;
    opacity: 0.5;
  }
`;

const StatNumber = styled(motion.div)`
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 900;
  background: linear-gradient(135deg, #ffd89b 0%, #ffffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  opacity: 0.9;
  margin-bottom: 0.5rem;
`;

const StatDescription = styled.div`
  font-size: 0.9rem;
  opacity: 0.7;
  line-height: 1.4;
`;

const LiveCounter = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #ffd89b 0%, #ffffff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const CounterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const CounterItem = styled(motion.div)`
  .counter-number {
    font-size: 1.8rem;
    font-weight: 800;
    color: #ffd89b;
    margin-bottom: 0.25rem;
  }
  
  .counter-label {
    font-size: 0.9rem;
    opacity: 0.8;
  }
`;

const FuturisticStats: React.FC = () => {
  const [liveStats, setLiveStats] = useState({
    videosToday: 45678,
    activeUsers: 12834,
    processingTime: 0.8
  });

  const controls = useAnimation();

  useEffect(() => {
    // Simulate live counter updates
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        videosToday: prev.videosToday + Math.floor(Math.random() * 5) + 1,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1,
        processingTime: Math.max(0.1, Math.min(2.0, prev.processingTime + (Math.random() - 0.5) * 0.1))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      icon: FiUsers,
      number: '2.5M+',
      label: 'Active Creators',
      description: 'Content creators worldwide trust our platform'
    },
    {
      icon: FiVideo,
      number: '50M+',
      label: 'Videos Generated',
      description: 'Professional videos created with AI technology'
    },
    {
      icon: FiGlobe,
      number: '150+',
      label: 'Countries Served',
      description: 'Global reach across all continents'
    },
    {
      icon: FiZap,
      number: '99.9%',
      label: 'Uptime Guaranteed',
      description: 'Enterprise-grade reliability and performance'
    },
    {
      icon: FiTrendingUp,
      number: '15x',
      label: 'Engagement Boost',
      description: 'Average increase in social media engagement'
    },
    {
      icon: FiClock,
      number: '30s',
      label: 'Average Generation',
      description: 'From text to professional video in seconds'
    }
  ];

  const animateValue = (start: number, end: number) => {
    return { from: start, to: end };
  };

  return (
    <StatsSection>
      <BackgroundPattern />
      
      <Container>
        <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Trusted by <span>Millions</span> Worldwide
        </SectionTitle>
        
        <SectionSubtitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Join the revolution of AI-powered content creation and become part of 
          the fastest-growing creator community on the planet.
        </SectionSubtitle>
        
        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <StatIcon>
                <stat.icon />
              </StatIcon>
              <StatNumber
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
              >
                {stat.number}
              </StatNumber>
              <StatLabel>{stat.label}</StatLabel>
              <StatDescription>{stat.description}</StatDescription>
            </StatCard>
          ))}
        </StatsGrid>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <LiveCounter>
            <h3>🔴 Live Performance Dashboard</h3>
            <p style={{ opacity: 0.8, marginBottom: '1rem' }}>
              Real-time statistics updating every second
            </p>
            
            <CounterGrid>
              <CounterItem
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="counter-number">
                  {liveStats.videosToday.toLocaleString()}
                </div>
                <div className="counter-label">Videos Today</div>
              </CounterItem>
              
              <CounterItem
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <div className="counter-number">
                  {liveStats.activeUsers.toLocaleString()}
                </div>
                <div className="counter-label">Online Now</div>
              </CounterItem>
              
              <CounterItem
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              >
                <div className="counter-number">
                  {liveStats.processingTime.toFixed(1)}s
                </div>
                <div className="counter-label">Avg Processing</div>
              </CounterItem>
              
              <CounterItem
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              >
                <div className="counter-number">
                  100%
                </div>
                <div className="counter-label">System Health</div>
              </CounterItem>
            </CounterGrid>
          </LiveCounter>
        </motion.div>
      </Container>
    </StatsSection>
  );
};

export default FuturisticStats;