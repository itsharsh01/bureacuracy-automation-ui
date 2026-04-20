import axiosInstance from './axiosInstance';

/**
 * Send a user message to the chatbot
 * @param {string} message - The user's query text
 */
export const sendUserMessage = async (message) => {
  const response = await axiosInstance.post('/chat', { message });
  return response.data;
};

/**
 * Fetch the full chat history for the current user
 */
export const getChatHistory = async () => {
  const response = await axiosInstance.get('/chat/history');
  return response.data;
};
