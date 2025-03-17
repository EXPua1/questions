import axios from "axios";

export const fetchQuestionnaires = async () => {
  const response = await axios.get("http://localhost:3000/api/quizzes");
  return response.data.data;
};

export const fetchQuezzById = async (id) => {
    const response = await axios.get(`http://localhost:3000/api/quizzes/${id}`);
    return response.data.data;
 }