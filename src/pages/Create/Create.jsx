import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchQuezzById } from '../../api/api';

const QuestionnaireBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionnaire, setQuestionnaire] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchById = async () => {
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

  const handleSubmit = () => {
    if (!name || !description || questions.some(q => !q.text)) {
      alert('Please fill in all fields');
      return;
    }

    const invalidQuestion = questions.find(q => q.type !== 'text' && q.options.length === 0);
    if (invalidQuestion) {
      alert('Please add options for all choice-based questions');
      return;
    }

    const updatedQuestionnaire = {
      _id: id || undefined, 
      name,
      description,
      questions,
      completions: questionnaire ? questionnaire.completions : 0,
    };

    console.log('Questionnaire to send to server:', updatedQuestionnaire);
    navigate('/');
  };

  return (
    <div>
      <h2>{id ? 'Edit Questionnaire' : 'Create Questionnaire'}</h2>
      {id && !questionnaire && <p>Loading or questionnaire not found...</p>}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Questionnaire Name"
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
            placeholder="Question Text"
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
                  />
                  <button onClick={() => removeOption(index, optIndex)} style={{ padding: '5px' }}>
                    Remove Option
                  </button>
                </div>
              ))}
              <button onClick={() => addOption(index)} style={{ padding: '5px', marginTop: '5px' }}>
                Add Option
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