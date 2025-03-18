import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchQuezzById } from '../../api/api';
import Container from '../../components/Container/Container';
import css from './Run.module.css'; // Подключаем CSS-модуль

const Run = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [questionnaire, setQuestionnaire] = useState(null);
    const [answers, setAnswers] = useState({});
    const [startTime] = useState(Date.now());
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        const fetchById = async () => {
            try {
                const response = await fetchQuezzById(id);
                setQuestionnaire(response);
            } catch (error) {
                console.error('Error fetching questionnaire:', error);
                setQuestionnaire(null);
            }
        };
        fetchById();
    }, [id]);

    useEffect(() => {
        if (!isCompleted) {
            const timer = setInterval(() => {
                setElapsedTime(((Date.now() - startTime) / 1000).toFixed(0));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isCompleted]);

    const handleAnswerChange = (index, value, isCheckbox = false) => {
        if (!questionnaire) return;
        const questionType = questionnaire.questions[index].type;

        setAnswers(prev => {
            if (questionType === 'multiple') {
                const current = prev[index] || [];
                return {
                    ...prev,
                    [index]: isCheckbox
                        ? value.checked
                            ? [...current, value.value]
                            : current.filter(a => a !== value.value)
                        : value,
                };
            } else {
                return { ...prev, [index]: value };
            }
        });
    };

    const handleSubmit = () => {
        const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log('Response:', { questionnaireId: id, answers, timeTaken });

        setIsCompleted(true);
    };

    const isSubmitDisabled = Object.keys(answers).length === 0;

    if (!questionnaire) return <div className={css.loading}>Loading...</div>;

    return (
        <Container>
            <div className={css.quizContainer}>
                <h2>{questionnaire.name}</h2>
                <p className={css.description}>{questionnaire.description}</p>

                {!isCompleted ? (
                    <>
                        <p className={css.timer}>Elapsed Time: {elapsedTime} seconds</p>

                        <div className={css.questions}>
                            {questionnaire.questions.map((q, index) => (
                                <div key={index} className={css.questionBlock}>
                                    <p className={css.questionText}>{q.text}</p>

                                    {q.type === 'text' && (
                                        <input
                                            className={css.input}
                                            type="text"
                                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                                            placeholder="Your answer"
                                        />
                                    )}

                                    {q.type === 'single' && q.options.map((opt, i) => (
                                        <label key={i} className={css.option}>
                                            <input
                                                type="radio"
                                                name={`q${index}`}
                                                value={opt}
                                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                            />
                                            {opt}
                                        </label>
                                    ))}

                                    {q.type === 'multiple' && q.options.map((opt, i) => (
                                        <label key={i} className={css.option}>
                                            <input
                                                type="checkbox"
                                                value={opt}
                                                onChange={(e) => handleAnswerChange(index, e.target, true)}
                                            />
                                            {opt}
                                        </label>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <button className={css.submitButton} onClick={handleSubmit} disabled={isSubmitDisabled}>
                            Submit
                        </button>
                    </>
                ) : (
                    <div className={css.results}>
                        <h3>Your Results</h3>
                        <p>Time Taken: {elapsedTime} seconds</p>
                        <h4>Your Answers:</h4>
                        <ul>
                            {Object.entries(answers).map(([index, answer]) => (
                                <li key={index}>
                                    <strong>{questionnaire.questions[index].text}:</strong> {Array.isArray(answer) ? answer.join(', ') : answer}
                                </li>
                            ))}
                        </ul>
                        <button className={css.backButton} onClick={() => navigate('/')}>Back to Catalog</button>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default Run;
