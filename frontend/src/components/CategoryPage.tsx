import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { PageContent, FilterOptions } from '@/types';
import { pagesApi } from '@/utils/api';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiGrid, FiList, FiFilter } from 'react-icons/fi';

const CategoryContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const CategoryHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  .breadcrumb {
    color: #718096;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    
    a {
      color: #667eea;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  h1 {
    font-size: clamp(2.5rem, 4vw, 3.5rem);
    font-weight: 900;
    color: #1a202c;
    margin-bottom: 1rem;
    
    .highlight {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
  
  p {
    font-size: 1.2rem;
    color: #718096;
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  justify-content: center;
  
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

interface CategoryPageProps {
  title: string;
  description: string;
  breadcrumb: string;
  filterKey: keyof FilterOptions;
  filterValue: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string;
  canonicalUrl: string;
}

const CategoryPage: React.FC<CategoryPageProps> = ({
  title,
  description,
  breadcrumb,
  filterKey,
  filterValue,
  seoTitle,
  seoDescription,
  keywords,
  canonicalUrl
}) => {
  const router = useRouter();
  const [pages, setPages] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 0,
    total: 0
  });

  const limit = 20;

  useEffect(() => {
    loadPages();
  }, [currentPage]);

  const loadPages = async () => {
    setLoading(true);
    try {
      const filters: FilterOptions = {
        [filterKey]: filterValue,
        page: currentPage,
        limit
      };
      
      const response = await pagesApi.getPages(filters);
      if (response.success) {
        setPages(response.data);
        setPagination({
          page: response.page || 1,
          pages: Math.ceil((response.total || 0) / limit),
          total: response.total || 0
        });
      }
    } catch (error) {
      console.error('Error loading pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <Layout
      title={seoTitle}
      description={seoDescription}
      keywords={keywords}
      canonical={canonicalUrl}
    >
      <CategoryContainer>
        <CategoryHeader>
          <div className="breadcrumb">
            <a href="/">Home</a> / {breadcrumb}
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="highlight">{title}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {description}
          </motion.p>
        </CategoryHeader>

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

            {pagination.pages > 1 && (
              <Pagination>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const pageNum = Math.max(1, currentPage - 2) + i;
                  if (pageNum > pagination.pages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      className={pageNum === currentPage ? 'active' : ''}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= pagination.pages}
                >
                  Next
                </button>
              </Pagination>
            )}
          </>
        )}
      </CategoryContainer>
    </Layout>
  );
};

export default CategoryPage;