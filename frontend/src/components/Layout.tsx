'use client';

import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
}

const MainContent = styled.main`
  min-height: calc(100vh - 140px);
  padding-top: 80px;
`;

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'TextToReels.in - Premium Text to Video Content Generator',
  description = 'Create stunning video content from text with TextToReels.in. AI-powered text-to-video generator for Instagram Reels, YouTube Shorts, and more.',
  keywords = 'text to video, reel generator, content creation, TextToReels.in, AI video generator, hindi content, social media',
  canonical = 'https://texttoreels.in/'
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="TextToReels.in" />
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content="TextToReels.in" />
        <meta property="og:image" content="https://texttoreels.in/og-image.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://texttoreels.in/og-image.jpg" />
        
        {/* Canonical */}
        <link rel="canonical" href={canonical} />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>
      
      <Header />
      <MainContent>{children}</MainContent>
      <Footer />
    </>
  );
};

export default Layout;