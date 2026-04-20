import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [role, setRole] = useState('admin');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'admin') navigate('/admin');
    else if (role === 'customer') navigate('/customer');
    else if (role === 'company') navigate('/company');
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
          <div>
            <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="user@example.com" 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', fontFamily: 'inherit' }} 
              defaultValue="user@gov.com" 
            />
          </div>
          <div>
            <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Password</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••" 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', fontFamily: 'inherit' }} 
              defaultValue="password123" 
            />
          </div>
          <div>
            <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Select Role for Testing MVP</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', fontFamily: 'inherit', backgroundColor: 'white' }}
            >
              <option value="admin">Admin / Operator</option>
              <option value="company">Company Representative</option>
              <option value="customer">Citizen / Customer</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', padding: '0.875rem', fontSize: '1rem', fontWeight: 'bold' }}>
            Secure Sign In
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <p className="text-sm text-muted">Don't have an account? <span style={{ color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}>Register here</span></p>
        </div>
      </div>
    </div>
  );
}
