import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuestionnaireCard from '../QuestionnaireCard/QuestionnaireCard';
import css from './QuestionnaireList.module.css';



const QuestionnaireList = ({ questionnaires }) => {
    // const [questionnaires, setQuestionnaires] = useState([]);

    // useEffect(() => {
    //     // Загружаем начальные данные (позже заменим на API)
    //     setQuestionnaires(Object.values(mockData));
    // }, []);

    // const handleDelete = (id) => {
    //     setQuestionnaires(questionnaires.filter(q => q.id !== id));
    // };

    return (
        <div

        >
            <h2>Questionnaire Catalog</h2>
            <div className={css.list}>
                <Link to="/create">
                    <button style={{ marginBottom: '10px' }}>Create New Questionnaire</button>
                </Link>
                {questionnaires.length === 0 ? (
                    <p>No questionnaires available.</p>
                ) : (
                    questionnaires.map(q => (
                        <QuestionnaireCard
                            key={q._id}
                            id={q._id}
                            name={q.name}
                            description={q.description}
                            questionCount={q.questions.length}
                            completions={q.completions}
                        // onDelete={handleDelete}
                        />
                    ))
                )}
            </div>

        </div>
    );
};

export default QuestionnaireList;