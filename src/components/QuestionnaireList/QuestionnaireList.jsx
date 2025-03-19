import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import QuestionnaireCard from '../QuestionnaireCard/QuestionnaireCard';
import css from './QuestionnaireList.module.css';
import { deleteQuestionnaire } from '../../api/api';

const QuestionnaireList = ({ questionnaires, onQuestionnaireDelete }) => {
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc'); 

    const handleDelete = async (id) => {
        try {
            await deleteQuestionnaire(id);
            onQuestionnaireDelete(id);
        } catch (error) {
            console.error('Error deleting questionnaire:', error);
            alert('Failed to delete questionnaire');
        }
    };

    // Sorting function
    const sortedQuestionnaires = [...questionnaires].sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'name') {
            comparison = a.name.localeCompare(b.name);
        } else if (sortBy === 'questions') {
            comparison = a.questions.length - b.questions.length;
        } else if (sortBy === 'completions') {
            comparison = a.completions - b.completions;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
    });

    const handleSortChange = (e) => {
        const [newSortBy, newSortOrder] = e.target.value.split(':');
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
    };

    return (
        <div>
            <h2>Questionnaire Catalog</h2>
            <div className={css.controls}>
                <Link to="/create">
                    <button className={css.button}>Create New Questionnaire</button>
                </Link>
                <select
                    value={`${sortBy}:${sortOrder}`}
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
                    sortedQuestionnaires.map((q) => (
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
