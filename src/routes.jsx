import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import CustomerDashboard from './pages/CustomerDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import CompanyQueryChat from './pages/CompanyQueryChat';
import Navbar from './components/Navbar';

const Layout = ({ children, title }) => (
  <>
    <Navbar title={title} />
    {children}
  </>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/admin" 
        element={<Layout title="Complaint Routing Dashboard"><Home /></Layout>} 
      />
      <Route 
        path="/customer" 
        element={<Layout title="Citizen Support Portal"><CustomerDashboard /></Layout>} 
      />
      <Route 
        path="/company" 
        element={<Layout title="Corporate Resolution Center"><CompanyDashboard /></Layout>} 
      />
      <Route 
        path="/company/query/:id" 
        element={<Layout title="Query Details & Support"><CompanyQueryChat /></Layout>} 
      />
    </Routes>
  );
};

export default AppRoutes;
