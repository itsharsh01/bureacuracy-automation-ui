import { createContext, useContext, useState, useEffect } from 'react';
import { verifyUser, logoutUser } from '../api/auth';

// Create the Auth Context
const AuthContext = createContext(null);

// AuthProvider wraps your entire app and provides auth state everywhere
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);         // Holds logged-in user info
  const [token, setToken] = useState(null);       // JWT token
  const [loading, setLoading] = useState(true);   // true while checking auth on startup

  // On app load, check localStorage for existing session
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Called after successful login/register
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Called on logout
  const logout = () => {
    logoutUser();
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — use this in any component to access auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
};

export default AuthContext;
