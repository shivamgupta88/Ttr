'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiPause, FiMaximize2, FiTrendingUp, FiHeart, FiShare } from 'react-icons/fi';

const ShowcaseSection = styled.section`
  padding: 6rem 0;
  background: #f8fafc;
  position: relative;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const SectionTitle = styled(motion.h2)`
  text-align: center;
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 900;
  color: #1a202c;
  margin-bottom: 1rem;
  
  span {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const SectionSubtitle = styled(motion.p)`
  text-align: center;
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  color: #4a5568;
  margin-bottom: 4rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const VideoCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  aspect-ratio: 9/16;
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.15);
  }
`;

const VideoThumbnail = styled.div<{ $bgImage: string }>`
  width: 100%;
  height: 70%;
  background: linear-gradient(135deg, ${props => props.$bgImage});
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const PlayButton = styled(motion.div)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-size: 1.5rem;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: white;
    transform: scale(1.1);
  }
`;

const VideoInfo = styled.div`
  padding: 1.5rem;
  height: 30%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const VideoTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  line-height: 1.3;
`;

const VideoStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #718096;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const VideoModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  max-width: 400px;
  width: 100%;
  aspect-ratio: 9/16;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  
  &:hover {
    background: white;
  }
`;

const CreationSteps = styled.div`
  background: white;
  border-radius: 30px;
  padding: 4rem 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  margin-top: 4rem;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const Step = styled(motion.div)`
  text-align: center;
  position: relative;
  
  .step-number {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 800;
    margin: 0 auto 1.5rem;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2, #ffd89b);
      z-index: -1;
      opacity: 0.3;
    }
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

const VideoShowcase: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  const videos = [
    {
      id: 1,
      title: 'Motivational Hindi Quote for Success',
      thumbnail: '#667eea, #764ba2',
      views: '2.1M',
      likes: '150K',
      platform: 'Instagram'
    },
    {
      id: 2,
      title: 'Love Shayari with Romantic Background',
      thumbnail: '#f093fb, #f5576c',
      views: '1.8M',
      likes: '98K',
      platform: 'YouTube'
    },
    {
      id: 3,
      title: 'Good Morning Wishes in Punjabi',
      thumbnail: '#4facfe, #00f2fe',
      views: '950K',
      likes: '67K',
      platform: 'WhatsApp'
    },
    {
      id: 4,
      title: 'Birthday Special Video with Music',
      thumbnail: '#43e97b, #38f9d7',
      views: '1.2M',
      likes: '89K',
      platform: 'Facebook'
    },
    {
      id: 5,
      title: 'Friendship Day Special Quotes',
      thumbnail: '#fa709a, #fee140',
      views: '760K',
      likes: '45K',
      platform: 'Instagram'
    },
    {
      id: 6,
      title: 'Desi Swag Status Video',
      thumbnail: '#ffecd2, #fcb69f',
      views: '1.5M',
      likes: '112K',
      platform: 'Moj'
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Input Your Text',
      description: 'Simply type or paste your content in any language. Our AI understands context and emotion.'
    },
    {
      number: 2,
      title: 'AI Magic Processing',
      description: 'Advanced algorithms analyze your content and generate optimal visuals, music, and effects.'
    },
    {
      number: 3,
      title: 'Instant Video Generation',
      description: 'Watch as your text transforms into a professional video ready for any platform.'
    },
    {
      number: 4,
      title: 'Share & Go Viral',
      description: 'Download in any format and share across all social media platforms with one click.'
    }
  ];

  return (
    <ShowcaseSection>
      <Container>
        <SectionTitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Videos Created by <span>Real Users</span>
        </SectionTitle>
        
        <SectionSubtitle
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          See how creators worldwide are using TextToReels.in to generate millions of views 
          and build their social media presence.
        </SectionSubtitle>
        
        <VideoGrid>
          {videos.map((video, index) => (
            <VideoCard
              key={video.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedVideo(video.id)}
            >
              <VideoThumbnail $bgImage={video.thumbnail}>
                <PlayButton
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiPlay />
                </PlayButton>
              </VideoThumbnail>
              <VideoInfo>
                <VideoTitle>{video.title}</VideoTitle>
                <VideoStats>
                  <StatItem>
                    <FiTrendingUp size={16} />
                    {video.views}
                  </StatItem>
                  <StatItem>
                    <FiHeart size={16} />
                    {video.likes}
                  </StatItem>
                  <span>{video.platform}</span>
                </VideoStats>
              </VideoInfo>
            </VideoCard>
          ))}
        </VideoGrid>
        
        <CreationSteps>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            From Text to <span>Viral Video</span> in 4 Steps
          </SectionTitle>
          
          <StepsGrid>
            {steps.map((step, index) => (
              <Step
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="step-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </Step>
            ))}
          </StepsGrid>
        </CreationSteps>
      </Container>
      
      <AnimatePresence>
        {selectedVideo && (
          <VideoModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVideo(null)}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton onClick={() => setSelectedVideo(null)}>
                ×
              </CloseButton>
              <VideoThumbnail
                $bgImage={videos.find(v => v.id === selectedVideo)?.thumbnail || '#667eea, #764ba2'}
              >
                <PlayButton>
                  <FiPlay />
                </PlayButton>
              </VideoThumbnail>
              <VideoInfo>
                <VideoTitle>
                  {videos.find(v => v.id === selectedVideo)?.title}
                </VideoTitle>
                <VideoStats>
                  <StatItem>
                    <FiTrendingUp size={16} />
                    {videos.find(v => v.id === selectedVideo)?.views}
                  </StatItem>
                  <StatItem>
                    <FiHeart size={16} />
                    {videos.find(v => v.id === selectedVideo)?.likes}
                  </StatItem>
                  <StatItem>
                    <FiShare size={16} />
                    Share
                  </StatItem>
                </VideoStats>
              </VideoInfo>
            </ModalContent>
          </VideoModal>
        )}
      </AnimatePresence>
    </ShowcaseSection>
  );
};

export default VideoShowcase;