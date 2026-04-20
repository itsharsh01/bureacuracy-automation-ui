import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('itsharshgpt@gmail.com');
  const [password, setPassword] = useState('harsh1234');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload = { email, password, role };

      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Login failed. Please check your credentials.');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Navigate based on role from server response
      if (data.user.role === 'admin') navigate('/admin');
      else if (data.user.role === 'customer') navigate('/customer');
      else if (data.user.role === 'company') navigate('/company');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)' }}>
      <div className="card" style={{ width: '400px', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px', height: '48px', backgroundColor: 'var(--primary)', color: 'white',
            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', margin: '0 auto 1rem auto'
          }}>🏛️</div>
          <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Government Services</h2>
          <p className="text-muted text-sm">Sign in to your portal</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          <div>
            <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="user@example.com" 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', fontFamily: 'inherit' }} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Password</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••" 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', fontFamily: 'inherit' }} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Select Role for Testing MVP</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', fontFamily: 'inherit', backgroundColor: 'white' }}
            >
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
              <option value="company">Company Representative</option>
              <option value="customer">Citizen / Customer</option>
            </select>
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary" style={{ marginTop: '0.5rem', padding: '0.875rem', fontSize: '1rem', fontWeight: 'bold', opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? 'Signing In...' : 'Secure Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
