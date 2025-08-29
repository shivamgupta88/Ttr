'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiHome, FiGrid, FiSearch, FiHeart, FiSmartphone, FiGlobe, FiChevronDown } from 'react-icons/fi';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &.scrolled {
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.a`
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  
  &:hover {
    transform: translateY(-1px);
    transition: transform 0.2s ease;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.div`
  position: relative;
  
  &:hover .dropdown {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const NavLink = styled.a`
  color: #4a5568;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s ease;
  z-index: 1000;
  padding: 0.5rem 0;
`;

const DropdownItem = styled.a`
  display: block;
  padding: 0.75rem 1rem;
  color: #4a5568;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  padding: 0.5rem;
  border-radius: 8px;
  color: #4a5568;
  transition: all 0.2s ease;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  gap: 1rem;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLink = styled.a`
  color: #4a5568;
  font-weight: 500;
  padding: 1rem;
  border-radius: 12px;
  transition: all 0.2s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  
  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
    transform: translateX(4px);
  }
`;

const CTAButton = styled.a`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { href: '/', label: 'Home', icon: FiHome },
    { href: '/explore', label: 'Explore', icon: FiGrid },
    { href: '/search', label: 'Search', icon: FiSearch },
  ];

  const contentTypes = [
    { href: '/content-types/love-quotes', label: 'Love Quotes' },
    { href: '/content-types/motivational-quotes', label: 'Motivational Quotes' },
    { href: '/content-types/friendship-quotes', label: 'Friendship Quotes' },
    { href: '/content-types/good-morning', label: 'Good Morning' },
    { href: '/content-types/birthday-wishes', label: 'Birthday Wishes' },
    { href: '/content-types/hindi-shayari', label: 'Hindi Shayari' },
  ];

  const platforms = [
    { href: '/platform/instagram-reels', label: 'Instagram Reels' },
    { href: '/platform/youtube-shorts', label: 'YouTube Shorts' },
    { href: '/platform/whatsapp-status', label: 'WhatsApp Status' },
    { href: '/platform/facebook-stories', label: 'Facebook Stories' },
  ];

  const languages = [
    { href: '/language/hindi', label: 'Hindi Content' },
    { href: '/language/english', label: 'English Content' },
    { href: '/language/punjabi', label: 'Punjabi Content' },
    { href: '/language/urdu', label: 'Urdu Content' },
    { href: '/language/bengali', label: 'Bengali Content' },
    { href: '/language/tamil', label: 'Tamil Content' },
  ];

  return (
    <>
      <HeaderContainer className={isScrolled ? 'scrolled' : ''}>
        <Nav>
          <Logo href="/">TextToReels.in</Logo>
          
          <NavLinks>
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href}>
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
            
            <NavItem>
              <NavLink href="/content-types/love-quotes">
                <FiHeart size={18} />
                Content Types
                <FiChevronDown size={14} />
              </NavLink>
              <DropdownMenu className="dropdown">
                {contentTypes.map((item) => (
                  <DropdownItem key={item.href} href={item.href}>
                    {item.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </NavItem>

            <NavItem>
              <NavLink href="/platform/instagram-reels">
                <FiSmartphone size={18} />
                Platforms
                <FiChevronDown size={14} />
              </NavLink>
              <DropdownMenu className="dropdown">
                {platforms.map((item) => (
                  <DropdownItem key={item.href} href={item.href}>
                    {item.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </NavItem>

            <NavItem>
              <NavLink href="/language/hindi">
                <FiGlobe size={18} />
                Languages
                <FiChevronDown size={14} />
              </NavLink>
              <DropdownMenu className="dropdown">
                {languages.map((item) => (
                  <DropdownItem key={item.href} href={item.href}>
                    {item.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </NavItem>

            <CTAButton href="/explore">
              Get Started
            </CTAButton>
          </NavLinks>
          
          <MobileMenuButton onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </MobileMenuButton>
        </Nav>
      </HeaderContainer>
      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {navItems.map((item) => (
              <MobileNavLink 
                key={item.href} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon size={20} />
                {item.label}
              </MobileNavLink>
            ))}
            
            <div style={{ padding: '0.5rem 1rem', fontWeight: '600', color: '#667eea', fontSize: '0.9rem' }}>
              Content Types
            </div>
            {contentTypes.map((item) => (
              <MobileNavLink 
                key={item.href} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ paddingLeft: '2rem' }}
              >
                {item.label}
              </MobileNavLink>
            ))}
            
            <div style={{ padding: '0.5rem 1rem', fontWeight: '600', color: '#667eea', fontSize: '0.9rem' }}>
              Platforms
            </div>
            {platforms.map((item) => (
              <MobileNavLink 
                key={item.href} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ paddingLeft: '2rem' }}
              >
                {item.label}
              </MobileNavLink>
            ))}
            
            <div style={{ padding: '0.5rem 1rem', fontWeight: '600', color: '#667eea', fontSize: '0.9rem' }}>
              Languages
            </div>
            {languages.map((item) => (
              <MobileNavLink 
                key={item.href} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ paddingLeft: '2rem' }}
              >
                {item.label}
              </MobileNavLink>
            ))}
            
            <CTAButton href="/explore" onClick={() => setIsMobileMenuOpen(false)}>
              Get Started
            </CTAButton>
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;