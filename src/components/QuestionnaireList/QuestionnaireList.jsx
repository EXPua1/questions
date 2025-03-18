import React from 'react';
import { Link } from 'react-router-dom';
import QuestionnaireCard from '../QuestionnaireCard/QuestionnaireCard';
import css from './QuestionnaireList.module.css';
import { deleteQuestionnaire } from '../../api/api';

const QuestionnaireList = ({ questionnaires, onQuestionnaireDelete }) => {
    const handleDelete = async (id) => {
        try {
            await deleteQuestionnaire(id);
            onQuestionnaireDelete(id); 
        } catch (error) {
            console.error('Error deleting questionnaire:', error);
            alert('Failed to delete questionnaire');
        }
    };

    return (
        <div>
            <h2>Questionnaire Catalog</h2>
            <Link to="/create">
                <button style={{ marginBottom: '10px' }}>Create New Questionnaire</button>
            </Link>
            <div className={css.list}>
               
                {questionnaires.length === 0 ? (
                    <p>No questionnaires available.</p>
                ) : (
                    questionnaires.map((q) => (
                        <QuestionnaireCard
                            key={q._id}
                            id={q._id}
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