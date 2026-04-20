import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — wraps any page that requires login.
 * If user is NOT logged in → redirect to /login (root /)
 * If user IS logged in → show the page normally
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // While checking localStorage on startup, show nothing (or a spinner)
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  // Not logged in → go back to login page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Logged in → render the protected page
  return children;
};

export default ProtectedRoute;
