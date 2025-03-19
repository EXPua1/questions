import React, { useEffect, useState } from 'react';
import QuestionnaireList from '../../components/QuestionnaireList/QuestionnaireList';
import { fetchQuestionnaires } from '../../api/api';
import Container from '../../components/Container/Container';
import css from './HomePage.module.css';

const HomePage = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const loadQuestionnaires = async (page, sortBy, sortOrder) => {
    setIsLoading(true);
    try {
      const response = await fetchQuestionnaires({ page, sortBy, sortOrder });
      setQuestionnaires((prev) => {
        if (page === 1) {
          return response.data;
        }
        const existingIds = new Set(prev.map((q) => q._id));
        const newQuestionnaires = response.data.filter((q) => !existingIds.has(q._id));
        return [...prev, ...newQuestionnaires];
      });
      setHasNextPage(response.hasNextPage);
    } catch (error) {
      console.error('Error fetching questionnaires:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setCurrentPage(1);
    loadQuestionnaires(1, sortBy, sortOrder);
  }, [sortBy, sortOrder]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadQuestionnaires(nextPage, sortBy, sortOrder);
  };

  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handleQuestionnaireDelete = (deletedId) => {
    setQuestionnaires((prev) => prev.filter((q) => q._id !== deletedId));
  };

  return (
    <Container>
      <QuestionnaireList
        questionnaires={questionnaires}
        onQuestionnaireDelete={handleQuestionnaireDelete}
        onSortChange={handleSortChange}
        currentSortBy={sortBy}
        currentSortOrder={sortOrder}
      />

      {!isLoading && hasNextPage && questionnaires.length > 0 && (
        <button className={css.loadMoreButton} onClick={handleLoadMore} disabled={isLoading}>
          Load More
        </button>
      )}
    </Container>
  );
};

export default HomePage;
