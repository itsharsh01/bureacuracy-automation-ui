import axiosInstance from './axiosInstance';

/**
 * Register a new user
 * @param {{ name: string, email: string, password: string }} data
 */
export const registerUser = async (data) => {
  const response = await axiosInstance.post('/register', data);
  return response.data;
};

/**
 * Login an existing user
 * @param {{ email: string, password: string }} data
 */
export const loginUser = async (data) => {
  const response = await axiosInstance.post('/login', data);
  return response.data;
};

/**
 * Verify current user token (used to check if session is still valid)
 */
export const verifyUser = async () => {
  const response = await axiosInstance.get('/verify');
  return response.data;
};

/**
 * Logout — clears token from localStorage
 */
export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};
