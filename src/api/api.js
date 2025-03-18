import axios from "axios";

const API_URL = "https://questions-back-gyjw.onrender.com/api/quizzes";

export const fetchQuestionnaires = async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
};

export const fetchQuezzById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data.data;
};

export const createQuestionnaire = async (questionnaire) => {
  try {
    const response = await axios.post(API_URL, questionnaire);
    return response.data.data;
  } catch (error) {
    console.error("Error creating questionnaire:", error);
    throw error; 
  }
};

export const updateQuestionnaire = async (id, questionnaire) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, questionnaire);
    return response.data.data;
  } catch (error) {
    console.error("Error updating questionnaire:", error);
    throw error; 
  }
};

export const deleteQuestionnaire = async (id) => { 
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) { 
    console.error("Error deleting questionnaire:", error);
   }
}


export const completeQuestionnaire = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/complete`);
    return response.data.data;
  } catch (error) {
    console.error("Error completing questionnaire:", error);
    throw error;
  }
};