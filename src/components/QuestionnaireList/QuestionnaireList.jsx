import React from 'react';
import { Link } from 'react-router-dom';
import QuestionnaireCard from '../QuestionnaireCard/QuestionnaireCard';
import css from './QuestionnaireList.module.css';
import { deleteQuestionnaire } from '../../api/api';

const QuestionnaireList = ({ questionnaires, onQuestionnaireDelete, onSortChange, currentSortBy, currentSortOrder }) => {

    const handleDelete = async (id) => {
        try {
            await deleteQuestionnaire(id);
            onQuestionnaireDelete(id);
        } catch (error) {
            console.error('Error deleting questionnaire:', error);
            alert('Failed to delete questionnaire');
        }
    };

    const handleSortChange = (e) => {
        const [newSortBy, newSortOrder] = e.target.value.split(':');
        onSortChange(newSortBy, newSortOrder);
    };

    return (
        <div>
            <h2>Questionnaire Catalog</h2>
            <div className={css.controls}>
                <Link to="/create">
                    <button className={css.button}>Create New Questionnaire</button>
                </Link>
                <select
                    value={`${currentSortBy}:${currentSortOrder}`}
                    onChange={handleSortChange}
                    className={css.sortSelect}
                >
                    <option value="name:asc">By Name (A-Z)</option>
                    <option value="name:desc">By Name (Z-A)</option>
                    <option value="questions:asc">By Questions (Ascending)</option>
                    <option value="questions:desc">By Questions (Descending)</option>
                    <option value="completions:asc">By Completions (Ascending)</option>
                    <option value="completions:desc">By Completions (Descending)</option>
                </select>
            </div>
            <div className={css.list}>
                {questionnaires.length === 0 ? (
                    <p className={css.loading}>Loading...</p>
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
