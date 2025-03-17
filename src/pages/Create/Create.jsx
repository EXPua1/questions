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
};

const QuestionnaireBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (id) {
      const questionnaire = mockData[id];
      if (questionnaire) {
        setName(questionnaire.name);
        setDescription(questionnaire.description);
        setQuestions(questionnaire.questions);
      }
    }
  }, [id]);

  const addQuestion = () => {
    setQuestions([...questions, { type: 'text', text: '', options: [] }]);
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const updateQuestionType = (index, type) => {
    const newQuestions = [...questions];
    newQuestions[index].type = type;

    // Обработка типа вопроса
    if (type === 'text') {
      // Если тип вопроса "text", очищаем options, если они есть
      newQuestions[index].options = [];
    } else if (type !== 'text') {
      // Если тип не "text", но options ещё не существует, создаем пустой массив
      if (!newQuestions[index].options) {
        newQuestions[index].options = ['']; // Начальная опция для выбора
      }
    }

    setQuestions(newQuestions);
  };

  const addOption = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].options.push('');
    setQuestions(newQuestions);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
    setQuestions(newQuestions);
  };

  const handleSubmit = () => {
    // Проверка на пустые значения
    if (!name || !description || questions.some(q => !q.text)) {
      alert('Please fill in all fields');
      return;
    }

    // Если у вопроса с типом "single" или "multiple" нет вариантов, показать ошибку
    const invalidQuestion = questions.find(q => {
      return (q.type !== 'text' && q.options.length === 0);
    });

    if (invalidQuestion) {
      alert('Please add options for all choice-based questions.');
      return;
    }

    const questionnaire = {
      id: id ? Number(id) : Date.now(),
      name,
      description,
      questions,
      completions: id ? mockData[id].completions : 0,
    };

    console.log('Questionnaire to send to backend:', questionnaire);

    navigate('/');
  };

  return (
    <div>
      <h2>{id ? 'Edit' : 'Create'} Quiz</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Quiz Name"
        style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
      />
      <h3>Questions</h3>
      {questions.map((q, index) => (
        <div key={index} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
          <input
            value={q.text}
            onChange={(e) => updateQuestion(index, 'text', e.target.value)}
            placeholder="Question"
            style={{ width: '40%', marginRight: '10px', padding: '5px' }}
          />
          <select
            value={q.type}
            onChange={(e) => updateQuestionType(index, e.target.value)}
            style={{ width: '20%', marginRight: '10px', padding: '5px' }}
          >
            <option value="text">Text</option>
            <option value="single">Single Choice</option>
            <option value="multiple">Multiple Choice</option>
          </select>
          <button onClick={() => removeQuestion(index)} style={{ padding: '5px' }}>
            Remove
          </button>
          {q.type !== 'text' && (
            <div style={{ marginTop: '10px' }}>
              <h4>Answers</h4>
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} style={{ marginBottom: '5px' }}>
                  <input
                    value={opt}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].options[optIndex] = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    placeholder={`Choice ${optIndex + 1}`}
                    style={{ width: '40%', marginRight: '10px', padding: '5px' }}
                  />
                  <button onClick={() => removeOption(index, optIndex)} style={{ padding: '5px' }}>
                    Remove
                  </button>
                </div>
              ))}
              <button onClick={() => addOption(index)} style={{ padding: '5px', marginTop: '5px' }}>
                Add Choice
              </button>
            </div>
          )}
        </div>
      ))}
      <button onClick={addQuestion} style={{ padding: '5px', marginTop: '10px' }}>
        Add Question
      </button>
      <button onClick={handleSubmit} style={{ padding: '5px', marginTop: '10px' }}>
        Save
      </button>
    </div>
  );
};

export default QuestionnaireBuilder;
