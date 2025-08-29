import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { PageContent } from '@/types';
import { pagesApi } from '@/utils/api';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiSearch, FiTrendingUp, FiClock, FiTag } from 'react-icons/fi';

const SearchContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const SearchHeader = styled.div`
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
`;

const SearchBox = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto 2rem;
  
  input {
    width: 100%;
    padding: 1.25rem 1.25rem 1.25rem 4rem;
    border: 2px solid #e2e8f0;
    border-radius: 25px;
    font-size: 1.2rem;
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
    }
  }
  
  .search-icon {
    position: absolute;
    left: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    color: #a0aec0;
  }
  
  button {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 20px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-50%) scale(1.05);
    }
  }
`;

const TrendingSection = styled.div`
  margin-bottom: 3rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const TrendingTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const TrendingTag = styled.button`
  background: white;
  border: 2px solid #e2e8f0;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    border-color: #667eea;
    color: #667eea;
    transform: translateY(-2px);
  }
`;

const ResultsSection = styled.div`
  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 1.5rem;
    
    .count {
      color: #667eea;
    }
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const ResultCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 40px rgba(102, 126, 234, 0.15);
    border-color: #667eea;
  }
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CardBody = styled.div`
  padding: 1.5rem;
  
  h4 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.75rem;
    line-height: 1.4;
  }
  
  p {
    color: #718096;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
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

const NoResults = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  
  h3 {
    font-size: 1.5rem;
    color: #4a5568;
    margin-bottom: 1rem;
  }
  
  p {
    color: #718096;
    margin-bottom: 2rem;
  }
  
  button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
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

const SearchPage: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const trendingTerms = [
    'love quotes hindi',
    'motivational reels',
    'good morning wishes',
    'birthday quotes',
    'friendship shayari',
    'punjabi status',
    'instagram reels',
    'youtube shorts'
  ];

  useEffect(() => {
    if (router.query.q) {
      const searchQuery = Array.isArray(router.query.q) ? router.query.q[0] : router.query.q;
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [router.query.q]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setSearched(true);
    
    try {
      const response = await pagesApi.searchPages(searchQuery, { limit: 50 });
      if (response.success) {
        setResults(response.data);
      }
    } catch (error) {
      console.error('Error searching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;
    
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleTrendingClick = (term: string) => {
    setQuery(term);
    handleSearch(term);
  };

  return (
    <Layout
      title={query ? `Search Results for "${query}" - TextToReels.in` : 'Search Content Templates - TextToReels.in'}
      description={query ? `Find content templates related to "${query}". Browse through our collection of video templates for Instagram Reels, YouTube Shorts, and more.` : 'Search through thousands of content templates for Instagram Reels, YouTube Shorts, and social media. Find exactly what you need for your next viral video.'}
      keywords={query ? `${query}, content templates, video templates, search TextToReels.in` : 'search templates, video search, content search, TextToReels.in'}
      canonical={`https://texttoreels.in/search${query ? `?q=${encodeURIComponent(query)}` : ''}`}
    >
      <SearchContainer>
        <SearchHeader>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span>Search</span> Content Templates
          </motion.h1>
        </SearchHeader>

        <SearchBox>
          <FiSearch className="search-icon" size={24} />
          <input
            type="text"
            placeholder="Search for love quotes, motivational content, good morning wishes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={() => handleSearch()}>
            Search
          </button>
        </SearchBox>

        {!searched && (
          <TrendingSection>
            <h3>
              <FiTrendingUp size={20} />
              Trending Searches
            </h3>
            <TrendingTags>
              {trendingTerms.map((term, index) => (
                <TrendingTag
                  key={index}
                  onClick={() => handleTrendingClick(term)}
                >
                  <FiTag size={16} />
                  {term}
                </TrendingTag>
              ))}
            </TrendingTags>
          </TrendingSection>
        )}

        {loading && (
          <LoadingSpinner>
            <div className="spinner"></div>
          </LoadingSpinner>
        )}

        {searched && !loading && (
          <ResultsSection>
            <h3>
              Search Results for "{query}" 
              <span className="count">({results.length} found)</span>
            </h3>
            
            {results.length > 0 ? (
              <ResultsGrid>
                {results.map((page, index) => (
                  <ResultCard
                    key={page.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => router.push(`/content/${page.slug}`)}
                  >
                    <CardHeader>
                      {page.dimensions.theme.replace(/_/g, ' ').toUpperCase()}
                    </CardHeader>
                    <CardBody>
                      <h4>{page.content.title.replace(' | TextToReels.in', '')}</h4>
                      <p>{page.content.description}</p>
                      <CardFooter>
                        <span className="platform">
                          {page.dimensions.platform.replace(/_/g, ' ')}
                        </span>
                        <span>{page.dimensions.language}</span>
                      </CardFooter>
                    </CardBody>
                  </ResultCard>
                ))}
              </ResultsGrid>
            ) : (
              <NoResults>
                <h3>No results found for "{query}"</h3>
                <p>Try different keywords or browse our trending searches above.</p>
                <button onClick={() => router.push('/explore')}>
                  Explore All Templates
                </button>
              </NoResults>
            )}
          </ResultsSection>
        )}
      </SearchContainer>
    </Layout>
  );
};

export default SearchPage;