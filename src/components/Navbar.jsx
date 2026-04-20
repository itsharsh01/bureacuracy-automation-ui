import { useLocation, useNavigate } from 'react-router-dom';

export default function Navbar({ title = "Government Services Portal" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdminUserManagementVisible =
    location.pathname === '/admin' && (user?.role || '').toLowerCase() === 'admin';
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleOpenUserManagement = () => {
    window.dispatchEvent(new Event('open-user-management'));
  };

  return (
    <nav style={{
      backgroundColor: 'var(--primary)',
      color: '#FFFFFF',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: 'var(--shadow)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '36px',
          height: '36px',
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '20px',
          border: '1px solid rgba(255,255,255,0.3)'
        }}>
          🏛️
        </div>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600', color: 'white', letterSpacing: '-0.02em' }}>
          {title}
        </h1>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(0,0,0,0.15)', padding: '0.25rem 0.75rem', borderRadius: '99px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }}></div>
          <span style={{ fontWeight: '500' }}>System Active</span>
        </div>
        <div style={{ color: '#E5E7EB', fontWeight: '500' }}>{currentDate}</div>
        {isAdminUserManagementVisible && (
          <button
            type="button"
            onClick={handleOpenUserManagement}
            style={{
              backgroundColor: 'rgba(37, 99, 235, 0.95)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              padding: '0.45rem 0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            User Management
          </button>
        )}
        <button
          type="button"
          onClick={handleLogout}
          style={{
            backgroundColor: 'rgba(220, 38, 38, 0.9)',
            color: '#ffffff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            padding: '0.45rem 0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
