'use client';

import React from 'react';
import styled from 'styled-components';
import { FiHeart, FiGithub, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';

const FooterContainer = styled.footer`
  background: #1a202c;
  color: #e2e8f0;
  padding: 3rem 0 1.5rem;
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FooterSection = styled.div`
  h3 {
    color: #f7fafc;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
`;

const FooterLink = styled.a`
  color: #cbd5e0;
  text-decoration: none;
  padding: 0.25rem 0;
  display: block;
  transition: color 0.2s ease;
  
  &:hover {
    color: #667eea;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  color: #cbd5e0;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #2d3748;
  padding-top: 1.5rem;
  display: flex;
  justify-content: between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: #a0aec0;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
`;

const FooterNav = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: #cbd5e0;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <Logo>TextToReels.in</Logo>
            <Description>
              Premium AI-powered text to video content generator for creating stunning 
              social media content in multiple languages including Hindi, English, and regional languages.
            </Description>
            <SocialLinks>
              <SocialLink href="https://twitter.com/texttoreels" target="_blank" rel="noopener noreferrer">
                <FiTwitter size={20} />
              </SocialLink>
              <SocialLink href="https://instagram.com/texttoreels" target="_blank" rel="noopener noreferrer">
                <FiInstagram size={20} />
              </SocialLink>
              <SocialLink href="https://youtube.com/texttoreels" target="_blank" rel="noopener noreferrer">
                <FiYoutube size={20} />
              </SocialLink>
              <SocialLink href="https://github.com/texttoreels" target="_blank" rel="noopener noreferrer">
                <FiGithub size={20} />
              </SocialLink>
            </SocialLinks>
          </FooterSection>
          
          <FooterSection>
            <h3>Content Types</h3>
            <FooterLink href="/content-types/love-quotes">Love Quotes</FooterLink>
            <FooterLink href="/content-types/motivational-quotes">Motivational Quotes</FooterLink>
            <FooterLink href="/content-types/friendship-quotes">Friendship Quotes</FooterLink>
            <FooterLink href="/content-types/good-morning">Good Morning</FooterLink>
            <FooterLink href="/content-types/birthday-wishes">Birthday Wishes</FooterLink>
            <FooterLink href="/content-types/hindi-shayari">Hindi Shayari</FooterLink>
          </FooterSection>
          
          <FooterSection>
            <h3>Platforms</h3>
            <FooterLink href="/platform/instagram-reels">Instagram Reels</FooterLink>
            <FooterLink href="/platform/youtube-shorts">YouTube Shorts</FooterLink>
            <FooterLink href="/platform/whatsapp-status">WhatsApp Status</FooterLink>
            <FooterLink href="/platform/facebook-stories">Facebook Stories</FooterLink>
          </FooterSection>
          
          <FooterSection>
            <h3>Languages</h3>
            <FooterLink href="/language/hindi">Hindi Content</FooterLink>
            <FooterLink href="/language/english">English Content</FooterLink>
            <FooterLink href="/language/punjabi">Punjabi Content</FooterLink>
            <FooterLink href="/language/urdu">Urdu Content</FooterLink>
            <FooterLink href="/language/bengali">Bengali Content</FooterLink>
            <FooterLink href="/language/tamil">Tamil Content</FooterLink>
          </FooterSection>
        </FooterGrid>
        
        <FooterBottom>
          <Copyright>
            © {currentYear} TextToReels.in. Made with <FiHeart size={16} style={{ color: '#e53e3e' }} /> for creators
          </Copyright>
          
          <FooterNav>
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/terms">Terms of Service</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="/api">API</FooterLink>
          </FooterNav>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;