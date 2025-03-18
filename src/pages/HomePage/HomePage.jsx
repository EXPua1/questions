import React, { useEffect, useState } from 'react';
import QuestionnaireList from '../../components/QuestionnaireList/QuestionnaireList';
import { fetchQuestionnaires } from '../../api/api';
import Container from '../../components/Container/Container';


const HomePage = () => {
  const [questionnaires, setQuestionnaires] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetchQuestionnaires();
        setQuestionnaires(response);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    console.log('Questionnaires:', questionnaires);
  }, [questionnaires]);

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
    </Container>



  );
};

export default HomePage;