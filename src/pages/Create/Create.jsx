import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchQuezzById, createQuestionnaire, updateQuestionnaire } from '../../api/api';
import Container from '../../components/Container/Container';

const QuestionnaireBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionnaire, setQuestionnaire] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchById = async () => {
        setLoading(true);
        try {
          const response = await fetchQuezzById(id);
          console.log('Fetched data:', response);
          if (response) {
            setQuestionnaire(response);
            setName(response.name);
            setDescription(response.description);
            setQuestions(response.questions || []);
          } else {
            console.log('Questionnaire not found');
            setQuestionnaire(null);
          }
        } catch (error) {
          console.error('Error fetching questionnaire:', error);
          setQuestionnaire(null);
          setError('Failed to load questionnaire');
        } finally {
          setLoading(false);
        }
      };
      fetchById();
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

    if (type === 'text') {
      newQuestions[index].options = [];
    } else if (!newQuestions[index].options || newQuestions[index].options.length === 0) {
      newQuestions[index].options = [''];
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

  const handleSubmit = async () => {
    if (!name || !description || questions.some(q => !q.text)) {
      alert('Please fill in all fields');
      return;
    }

    const invalidQuestion = questions.find(q => q.type !== 'text' && q.options.length === 0);
    if (invalidQuestion) {
      alert('Please add options for all choice-based questions');
      return;
    }

    const questionnaireData = {
      name,
      description,
      questions,
      ...(id && questionnaire && { completions: questionnaire.completions }), // Только для обновления
    };

    setLoading(true);
    setError(null);

    try {
      if (id) {
        // Обновление существующего квиза
        await updateQuestionnaire(id, questionnaireData);
      } else {
        // Создание нового квиза
        await createQuestionnaire(questionnaireData);
      }
      console.log('Questionnaire saved successfully:', questionnaireData);
      navigate('/'); // Перенаправление после успеха
    } catch (error) {
      setError(error.message || 'Failed to save questionnaire');
      console.error('Error saving questionnaire:', error);
      alert(`Error: ${error.message || 'Failed to save questionnaire'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div>
        <h2>{id ? 'Edit Questionnaire' : 'Create Questionnaire'}</h2>
        {loading && <p>{id ? 'Loading...' : 'Saving...'}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {id && !questionnaire && !loading && <p>Questionnaire not found</p>}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Questionnaire Name"
          style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
          disabled={loading}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
          disabled={loading}
        />
        <h3>Questions</h3>
        {questions.map((q, index) => (
          <div key={index} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
            <input
              value={q.text}
              onChange={(e) => updateQuestion(index, 'text', e.target.value)}
              placeholder="Question Text"
              style={{ width: '40%', marginRight: '10px', padding: '5px' }}
              disabled={loading}
            />
            <select
              value={q.type}
              onChange={(e) => updateQuestionType(index, e.target.value)}
              style={{ width: '20%', marginRight: '10px', padding: '5px' }}
              disabled={loading}
            >
              <option value="text">Text</option>
              <option value="single">Single Choice</option>
              <option value="multiple">Multiple Choice</option>
            </select>
            <button onClick={() => removeQuestion(index)} style={{ padding: '5px' }} disabled={loading}>
              Remove Question
            </button>
            {q.type !== 'text' && (
              <div style={{ marginTop: '10px' }}>
                <h4>Options</h4>
                {q.options.map((opt, optIndex) => (
                  <div key={optIndex} style={{ marginBottom: '5px' }}>
                    <input
                      value={opt}
                      onChange={(e) => {
                        const newQuestions = [...questions];
                        newQuestions[index].options[optIndex] = e.target.value;
                        setQuestions(newQuestions);
                      }}
                      placeholder={`Option ${optIndex + 1}`}
                      style={{ width: '40%', marginRight: '10px', padding: '5px' }}
                      disabled={loading}
                    />
                    <button onClick={() => removeOption(index, optIndex)} style={{ padding: '5px' }} disabled={loading}>
                      Remove Option
                    </button>
                  </div>
                ))}
                <button onClick={() => addOption(index)} style={{ padding: '5px', marginTop: '5px' }} disabled={loading}>
                  Add Option
                </button>
              </div>
            )}
          </div>
        ))}
        <button onClick={addQuestion} style={{ padding: '5px', marginTop: '10px' }} disabled={loading}>
          Add Question
        </button>
        <button onClick={handleSubmit} style={{ padding: '5px', marginTop: '10px' }} disabled={loading}>
          {id ? 'Update' : 'Save'}
        </button>
      </div>
    </Container>

  );
};

export default QuestionnaireBuilder;