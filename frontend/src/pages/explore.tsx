import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { PageContent, FilterOptions } from '@/types';
import { pagesApi } from '@/utils/api';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiFilter, FiSearch, FiGrid, FiList } from 'react-icons/fi';

const ExploreContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
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
  }
  
  p {
    font-size: 1.2rem;
    color: #718096;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const FilterSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SearchBox = styled.div`
  position: relative;
  grid-column: 1 / -1;
  
  input {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1.1rem;
    transition: border-color 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: #667eea;
    }
  }
  
  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #a0aec0;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  
  button {
    padding: 0.75rem 1rem;
    border: 2px solid #e2e8f0;
    background: white;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }
    
    &:hover:not(.active) {
      border-color: #667eea;
      color: #667eea;
    }
  }
`;

const ContentGrid = styled.div<{ view: 'grid' | 'list' }>`
  display: grid;
  grid-template-columns: ${props => 
    props.view === 'grid' 
      ? 'repeat(auto-fill, minmax(320px, 1fr))' 
      : '1fr'
  };
  gap: 1.5rem;
`;

const ContentCard = styled(motion.div)<{ view: 'grid' | 'list' }>`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  display: ${props => props.view === 'list' ? 'flex' : 'block'};
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 40px rgba(102, 126, 234, 0.15);
    border-color: #667eea;
  }
`;

const CardHeader = styled.div<{ view: 'grid' | 'list' }>`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: ${props => props.view === 'grid' ? '1rem' : '0.75rem 1rem'};
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: ${props => props.view === 'list' ? '150px' : 'auto'};
`;

const CardBody = styled.div<{ view: 'grid' | 'list' }>`
  padding: ${props => props.view === 'grid' ? '1.5rem' : '1rem'};
  flex: 1;
  
  h3 {
    font-size: ${props => props.view === 'grid' ? '1.1rem' : '1rem'};
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
    display: -webkit-box;
    -webkit-line-clamp: ${props => props.view === 'grid' ? '3' : '2'};
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const CardFooter = styled.div`
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
    color: #4a5568;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
  
  button {
    padding: 0.5rem 1rem;
    border: 2px solid #e2e8f0;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    &:hover:not(:disabled) {
      border-color: #667eea;
      color: #667eea;
    }
    
    &.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }
  }
`;

const ExplorePage: React.FC = () => {
  const router = useRouter();
  const [pages, setPages] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterOptions>({
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 0,
    total: 0
  });

  useEffect(() => {
    loadPages();
  }, [filters]);

  const loadPages = async () => {
    setLoading(true);
    try {
      const response = await pagesApi.getPages(filters);
      if (response.success) {
        setPages(response.data);
        setPagination({
          page: response.page || 1,
          pages: Math.ceil((response.total || 0) / (filters.limit || 20)),
          total: response.total || 0
        });
      }
    } catch (error) {
      console.error('Error loading pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
      page: 1 // Reset to first page
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  return (
    <Layout
      title="Explore Content Templates - TextToReels.in"
      description="Browse through thousands of content templates for Instagram Reels, YouTube Shorts, and social media. Find the perfect template for your next viral video."
      keywords="content templates, video templates, Instagram reels, YouTube shorts, social media templates, TextToReels.in"
      canonical="https://texttoreels.in/explore"
    >
      <ExploreContainer>
        <Header>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Explore <span>Content Templates</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover thousands of pre-made templates across all categories, themes, and languages.
            Find the perfect starting point for your next viral video.
          </motion.p>
        </Header>

        <FilterSection>
          <FilterGrid>
            <SearchBox>
              <FiSearch className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search templates..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </SearchBox>
            
            <FilterSelect
              value={filters.theme || ''}
              onChange={(e) => handleFilterChange('theme', e.target.value)}
            >
              <option value="">All Themes</option>
              <option value="love_quotes">Love Quotes</option>
              <option value="motivational_quotes">Motivational</option>
              <option value="friendship_quotes">Friendship</option>
              <option value="good_morning">Good Morning</option>
              <option value="birthday_wishes">Birthday</option>
            </FilterSelect>

            <FilterSelect
              value={filters.language || ''}
              onChange={(e) => handleFilterChange('language', e.target.value)}
            >
              <option value="">All Languages</option>
              <option value="hindi">Hindi</option>
              <option value="english">English</option>
              <option value="punjabi">Punjabi</option>
              <option value="urdu">Urdu</option>
            </FilterSelect>

            <FilterSelect
              value={filters.platform || ''}
              onChange={(e) => handleFilterChange('platform', e.target.value)}
            >
              <option value="">All Platforms</option>
              <option value="instagram_reel">Instagram Reels</option>
              <option value="youtube_shorts">YouTube Shorts</option>
              <option value="whatsapp_status">WhatsApp Status</option>
              <option value="facebook_story">Facebook Stories</option>
            </FilterSelect>

            <FilterSelect
              value={filters.audience || ''}
              onChange={(e) => handleFilterChange('audience', e.target.value)}
            >
              <option value="">All Audiences</option>
              <option value="young_adults">Young Adults</option>
              <option value="millennials">Millennials</option>
              <option value="working_professionals">Professionals</option>
            </FilterSelect>
          </FilterGrid>
        </FilterSection>

        <ViewToggle>
          <button
            className={view === 'grid' ? 'active' : ''}
            onClick={() => setView('grid')}
          >
            <FiGrid size={18} />
            Grid
          </button>
          <button
            className={view === 'list' ? 'active' : ''}
            onClick={() => setView('list')}
          >
            <FiList size={18} />
            List
          </button>
        </ViewToggle>

        {loading ? (
          <LoadingSpinner>
            <div className="spinner"></div>
          </LoadingSpinner>
        ) : (
          <>
            <ContentGrid view={view}>
              {pages.map((page, index) => (
                <ContentCard
                  key={page.slug}
                  view={view}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => router.push(`/content/${page.slug}`)}
                >
                  <CardHeader view={view}>
                    {page.dimensions.theme.replace(/_/g, ' ').toUpperCase()}
                  </CardHeader>
                  <CardBody view={view}>
                    <h3>{page.content.title.replace(' | TextToReels.in', '')}</h3>
                    <p>{page.content.description}</p>
                    <CardFooter>
                      <span className="platform">
                        {page.dimensions.platform.replace(/_/g, ' ')}
                      </span>
                      <span>{page.dimensions.language}</span>
                    </CardFooter>
                  </CardBody>
                </ContentCard>
              ))}
            </ContentGrid>

            <Pagination>
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const pageNum = Math.max(1, pagination.page - 2) + i;
                if (pageNum > pagination.pages) return null;
                
                return (
                  <button
                    key={pageNum}
                    className={pageNum === pagination.page ? 'active' : ''}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
              >
                Next
              </button>
            </Pagination>
          </>
        )}
      </ExploreContainer>
    </Layout>
  );
};

export default ExplorePage;