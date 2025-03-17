import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchQuezzById } from '../../api/api';



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
                console.log('Fetched data:', response); 
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
            } else if (questionType === 'text' && value.trim() === '') {
                const { [index]: _, ...rest } = prev;
                return rest; 
            } else {
                return { ...prev, [index]: value };
            }
        });
    };

    const handleSubmit = () => {
        const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
        const response = {
            questionnaireId: id, 
            answers,
            timeTaken,
            completedAt: Date.now(),
        };

       
        console.log('Response to send to backend:', response);

       
        setQuestionnaire(prev => ({
            ...prev,
            completions: prev.completions + 1,
        }));

        setIsCompleted(true);
    };


    const isSubmitDisabled = Object.keys(answers).length === 0;

    if (!questionnaire) return <div>Loading...</div>;

    return (
        <div>
            <h2>{questionnaire.name}</h2>
            <p>{questionnaire.description}</p>

            {!isCompleted ? (
               
                <>
                    <p>Elapsed Time: {elapsedTime} seconds</p> {/* Видимый таймер */}
                    {questionnaire.questions.map((q, index) => (
                        <div key={index} style={{ margin: '10px 0' }}>
                            <p>{q.text}</p>
                            {q.type === 'text' && (
                                <input
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    placeholder="Your answer"
                                />
                            )}
                            {q.type === 'single' && q.options.map((opt, i) => (
                                <label key={i}>
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
                                <label key={i}>
                                    <input
                                        type="checkbox"
                                        value={opt}
                                        onChange={(e) => {
                                            const current = answers[index] || [];
                                            handleAnswerChange(
                                                index,
                                                e.target.checked ? [...current, opt] : current.filter(a => a !== opt)
                                            );
                                        }}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    ))}
                    <button onClick={handleSubmit} disabled={isSubmitDisabled}>
                        Submit
                    </button>
                </>
            ) : (
              
                <div>
                    <h3>Your Results</h3>
                    <p>Time Taken: {((Date.now() - startTime) / 1000).toFixed(2)} seconds</p>
                    <h4>Your Answers:</h4>
                    <ul>
                        {Object.entries(answers).map(([index, answer]) => (
                            <li key={index}>
                                {questionnaire.questions[index].text}: {Array.isArray(answer) ? answer.join(', ') : answer}
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => navigate('/')}>Back to Catalog</button>
                </div>
            )}
        </div>
    );
};

export default Run;