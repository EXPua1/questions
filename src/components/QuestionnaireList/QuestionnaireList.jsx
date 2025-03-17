import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuestionnaireCard from '../QuestionnaireCard/QuestionnaireCard';
import css from './QuestionnaireList.module.css';

const mockData = {
    1: {
        id: 1,
        name: 'Quiz 1',
        description: 'First quiz',
        questions: [
            { type: 'text', text: 'What is your name?' },
            { type: 'single', text: 'Favorite color?', options: ['Red', 'Blue'] },
            { type: 'multiple', text: 'Hobbies?', options: ['Reading', 'Gaming'] },
        ],
        completions: 0,
    },
    2: {
        id: 2,
        name: 'Quiz 1',
        description: 'First quiz',
        questions: [
            { type: 'text', text: 'What is your name?' },
            { type: 'single', text: 'Favorite color?', options: ['Red', 'Blue'] },
            { type: 'multiple', text: 'Hobbies?', options: ['Reading', 'Gaming'] },
        ],
        completions: 0,
    },
    3: {
        id: 3,
        name: 'Quiz 1',
        description: 'First quiz',
        questions: [
            { type: 'text', text: 'What is your name?' },
            { type: 'single', text: 'Favorite color?', options: ['Red', 'Blue'] },
            { type: 'multiple', text: 'Hobbies?', options: ['Reading', 'Gaming'] },
        ],
        completions: 0,
    },
};

const QuestionnaireList = () => {
    const [questionnaires, setQuestionnaires] = useState([]);

    useEffect(() => {
        // Загружаем начальные данные (позже заменим на API)
        setQuestionnaires(Object.values(mockData));
    }, []);

    const handleDelete = (id) => {
        setQuestionnaires(questionnaires.filter(q => q.id !== id));
    };

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
                            key={q.id}
                            id={q.id}
                            name={q.name}
                            description={q.description}
                            questionCount={q.questions.length}
                            completions={q.completions}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>

        </div>
    );
};

export default QuestionnaireList;