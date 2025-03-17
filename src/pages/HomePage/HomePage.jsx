import React, { useEffect, useState } from 'react'
import QuestionnaireList from '../../components/QuestionnaireList/QuestionnaireList'
import { fetchQuestionnaires } from '../../api/api';

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

  return (
    <QuestionnaireList questionnaires={questionnaires} />
  )
}

export default HomePage