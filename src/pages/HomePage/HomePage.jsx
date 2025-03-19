import React, { useEffect, useState } from 'react';
import QuestionnaireList from '../../components/QuestionnaireList/QuestionnaireList';
import { fetchQuestionnaires } from '../../api/api';
import Container from '../../components/Container/Container';
import css from './HomePage.module.css'; // Добавим стили для кнопки

const HomePage = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const loadQuestionnaires = async (page) => {
    setIsLoading(true);
    try {
      const response = await fetchQuestionnaires(page);
      setQuestionnaires(prev => {
        const existingIds = new Set(prev.map(q => q._id));
        const newQuestionnaires = response.data.filter(q => !existingIds.has(q._id));
        return [...prev, ...newQuestionnaires];
      });
      setHasNextPage(response.hasNextPage);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadQuestionnaires(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadQuestionnaires(nextPage);
  };

  const handleQuestionnaireDelete = (deletedId) => {
    setQuestionnaires((prevQuestionnaires) =>
      prevQuestionnaires.filter((q) => q._id !== deletedId)
    );
  };

  return (
    <Container>
      <QuestionnaireList
        questionnaires={questionnaires}
        onQuestionnaireDelete={handleQuestionnaireDelete}
      />

      {!isLoading && hasNextPage && questionnaires.length > 0 && (
        <button
          className={css.loadMoreButton}
          onClick={handleLoadMore}
          disabled={isLoading}
        >
          Load More
        </button>
      )}

    </Container>
  );
};

export default HomePage;