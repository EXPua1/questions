import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
        name: 'Quiz 2',
        description: 'Second quiz',
        questions: [
            { type: 'text', text: 'What is your name?' },
            { type: 'single', text: 'Favorite color?', options: ['Red', 'Blue'] },
            { type: 'multiple', text: 'Hobbies?', options: ['Reading', 'Gaming'] },
        ],
        completions: 0,
    },
    3: {
        id: 3,
        name: 'Quiz 3',
        description: 'Third quiz',
        questions: [
            { type: 'text', text: 'What is your name?' },
            { type: 'single', text: 'Favorite color?', options: ['Red', 'Blue'] },
            { type: 'multiple', text: 'Hobbies?', options: ['Reading', 'Gaming'] },
        ],
        completions: 0,
    },
};

const Run = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [questionnaire, setQuestionnaire] = useState(null);
    const [answers, setAnswers] = useState({});
    const [startTime] = useState(Date.now());
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    // Загружаем анкету из mockData (позже заменим на API)
    useEffect(() => {
        setQuestionnaire(mockData[id]);
    }, [id]);

    // Таймер в реальном времени
    useEffect(() => {
        if (!isCompleted) {
            const timer = setInterval(() => {
                setElapsedTime(((Date.now() - startTime) / 1000).toFixed(0));
            }, 1000); // Обновление каждую секунду (было 100 мс, но ты указал 1000)
            return () => clearInterval(timer);
        }
    }, [startTime, isCompleted]);

    const handleAnswerChange = (index, value) => {
        const questionType = questionnaire.questions[index].type; // Получаем тип вопроса
        // Фильтруем пустые текстовые ответы
        if (questionType === 'text' && value.trim() === '') {
            const { [index]: _, ...rest } = answers; // Удаляем пустой ответ
            setAnswers(rest);
        } else {
            setAnswers({ ...answers, [index]: value });
        }
    };

    const handleSubmit = () => {
        const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
        const response = {
            questionnaireId: Number(id),
            answers,
            timeTaken,
            completedAt: Date.now(),
        };

        // Здесь будет вызов API для сохранения в базу данных
        console.log('Response to send to backend:', response);

        // Увеличиваем completions локально (позже это будет на бэкенде)
        setQuestionnaire(prev => ({
            ...prev,
            completions: prev.completions + 1,
        }));

        setIsCompleted(true);
    };

    // Проверяем, есть ли хотя бы один ответ
    const isSubmitDisabled = Object.keys(answers).length === 0;

    if (!questionnaire) return <div>Loading...</div>;

    return (
        <div>
            <h2>{questionnaire.name}</h2>
            <p>{questionnaire.description}</p>

            {!isCompleted ? (
                // Форма прохождения анкеты с таймером
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
                // Результаты после завершения
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