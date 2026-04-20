import { useEffect, useMemo, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const DEPARTMENT_OPTIONS = [
  'Loans',
  'Credit Card',
  'Credit Reporting',
  'Debt Collection',
  'Banking',
  'Payments',
  'Payday',
  'Other',
];
const OPERATOR_DEPARTMENT_OPTIONS = [
  'Loans',
  'Credit Card',
  'Credit Reporting',
  'Debt Collection',
  'Banking',
  'Payments',
  'Payday',
];
const COMPANY_OPTIONS = [
  'Bank of America',
  'Wells Fargo & Company',
  'JPMorgan Chase & Co.',
  'Equifax',
  'Experian',
  'Citibank',
  'TransUnion Intermediate Holdings, Inc.',
  'Ocwen',
  'Capital One',
  'Nationstar Mortgage',
  'U.S. Bancorp',
  'Synchrony Financial',
  'Ditech Financial LLC',
  'Navient Solutions, Inc.',
  'PNC Bank N.A.',
  'Encore Capital Group',
  'HSBC North America Holdings Inc.',
  'Amex',
  'SunTrust Banks, Inc.',
  'Discover',
  'TD Bank US Holding Company',
  'Select Portfolio Servicing, Inc',
  'Portfolio Recovery Associates, Inc.',
  'Citizens Financial Group, Inc.',
  'Fifth Third Financial Corporation',
  'Seterus, Inc.',
  'Barclays PLC',
  'ERC',
  'BB&T Financial',
  'M&T Bank Corporation',
  'Ally Financial Inc.',
  'Regions Financial Corporation',
  'PayPal Holdings, Inc.',
  'USAA Savings',
  'Specialized Loan Servicing LLC',
  'Santander Consumer USA Holdings Inc',
  'Santander Bank US',
  'AES/PHEAA',
  'Expert Global Solutions, Inc.',
  'Flagstar Bank',
  'Resurgent Capital Services L.P.',
  'Navy FCU',
  'CIT Bank National Association',
  'PHH Mortgage',
  'Caliber Home Loans, Inc',
  'Transworld Systems Inc.',
  'KeyBank NA',
  'Bayview Loan Servicing, LLC',
  'Convergent Resources, Inc.',
  'The Western Union Company',
  'Other',
];

const MetricCard = ({ title, value, subtext, type = "default" }) => {
  const getSubtextColor = () => {
    switch(type) {
        case 'success': return 'var(--accent-text)';
        case 'warning': return 'var(--warning-text)';
        default: return 'var(--text-muted)';
    }
  }

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h3>
      <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: '0.875rem', fontWeight: '500', color: getSubtextColor(), display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        {subtext}
      </div>
    </div>
  );
};

export default function Home() {
  const [queries, setQueries] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [isUpdatingDepartment, setIsUpdatingDepartment] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('customer');
  const [newUserDepartment, setNewUserDepartment] = useState('');
  const [newUserCompany, setNewUserCompany] = useState('');
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [createUserMessage, setCreateUserMessage] = useState('');
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [forwardCompanyName, setForwardCompanyName] = useState('');
  const [forwardMessage, setForwardMessage] = useState('Please review and resolve this issue.');
  const [isForwarding, setIsForwarding] = useState(false);
  const [forwardStatusMessage, setForwardStatusMessage] = useState('');

  useEffect(() => {
    const fetchQueriesByRole = async () => {
      setLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('token');
        const rawUser = localStorage.getItem('user');
        const user = rawUser ? JSON.parse(rawUser) : null;
        const role = (user?.role || '').toLowerCase();
        setUserRole(role);

        if (!token) {
          throw new Error('Missing auth token. Please login again.');
        }

        const endpoint = role === 'operator' ? '/chatbot/operator/queries' : '/chatbot/admin/queries';
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch queries for dashboard.');
        }

        const data = await response.json();
        const list = Array.isArray(data?.queries) ? data.queries : Array.isArray(data) ? data : [];
        setQueries(list);
      } catch (err) {
        setError(err.message || 'Unable to load dashboard queries.');
      } finally {
        setLoading(false);
      }
    };

    fetchQueriesByRole();
  }, []);

  const selectedComplaint = queries.find((q) => String(q.id) === String(selectedId));
  const pendingCount = useMemo(
    () => queries.filter((q) => (q.status || '').toUpperCase() === 'PENDING').length,
    [queries]
  );
  const resolvedCount = useMemo(
    () => queries.filter((q) => (q.status || '').toUpperCase() === 'RESOLVED').length,
    [queries]
  );
  const inProgressCount = useMemo(
    () => queries.filter((q) => (q.status || '').toUpperCase() === 'IN_PROGRESS').length,
    [queries]
  );

  const getStatusBadge = (status) => {
    const normalizedStatus = (status || '').toUpperCase();
    if (normalizedStatus === 'RESOLVED') {
      return <span className="badge badge-success">RESOLVED</span>;
    }
    if (normalizedStatus === 'IN_PROGRESS') {
      return <span className="badge badge-primary">IN PROGRESS</span>;
    }
    return <span className="badge badge-warning">{normalizedStatus || 'PENDING'}</span>;
  };

  useEffect(() => {
    setSelectedDepartment(selectedComplaint?.department || '');
    setForwardCompanyName(selectedComplaint?.company || '');
    setForwardMessage('Please review and resolve this issue.');
    setUpdateMessage('');
    setForwardStatusMessage('');
  }, [selectedComplaint]);

  const handleUpdateDepartment = async () => {
    if (userRole !== 'admin' || !selectedComplaint?.id || !selectedDepartment) return;

    setIsUpdatingDepartment(true);
    setUpdateMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Missing auth token. Please login again.');
      }

      const response = await fetch(
        `${API_BASE_URL}/chatbot/admin/query/${selectedComplaint.id}/department`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ department: selectedDepartment }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update department.');
      }

      setQueries((prev) =>
        prev.map((query) =>
          String(query.id) === String(selectedComplaint.id)
            ? { ...query, department: selectedDepartment }
            : query
        )
      );
      setUpdateMessage('Department updated successfully.');
    } catch (err) {
      setUpdateMessage(err.message || 'Unable to update department.');
    } finally {
      setIsUpdatingDepartment(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (userRole !== 'admin') return;

    setCreateUserMessage('');
    setIsCreatingUser(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Missing auth token. Please login again.');
      }

      const payload = {
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole,
      };

      if (newUserRole === 'operator') {
        payload.department = newUserDepartment;
      }
      if (newUserRole === 'company') {
        payload.company = newUserCompany;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.detail || data?.message || 'Failed to create user.');
      }

      setCreateUserMessage('User created successfully.');
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('customer');
      setNewUserDepartment('');
      setNewUserCompany('');
      setShowCreateUserModal(false);
    } catch (err) {
      setCreateUserMessage(err.message || 'Unable to create user.');
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleOpenCreateUserModal = () => {
    setCreateUserMessage('');
    setShowCreateUserModal(true);
  };

  const handleCloseCreateUserModal = () => {
    setShowCreateUserModal(false);
    setCreateUserMessage('');
  };

  useEffect(() => {
    if (newUserRole !== 'operator') {
      setNewUserDepartment('');
    }
    if (newUserRole !== 'company') {
      setNewUserCompany('');
    }
  }, [newUserRole]);

  useEffect(() => {
    const onOpenUserManagement = () => {
      if (userRole === 'admin') {
        handleOpenCreateUserModal();
      }
    };

    window.addEventListener('open-user-management', onOpenUserManagement);
    return () => window.removeEventListener('open-user-management', onOpenUserManagement);
  }, [userRole]);

  const handleForwardToCompany = async () => {
    if (userRole !== 'operator' || !selectedComplaint?.id || !forwardCompanyName.trim() || !forwardMessage.trim()) return;

    setIsForwarding(true);
    setForwardStatusMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Missing auth token. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}/chatbot/operator/forward`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query_id: selectedComplaint.id,
          company_name: forwardCompanyName.trim(),
          message: forwardMessage.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.detail || data?.message || 'Failed to forward query.');
      }

      setForwardStatusMessage('Query forwarded to company successfully.');
    } catch (err) {
      setForwardStatusMessage(err.message || 'Unable to forward query.');
    } finally {
      setIsForwarding(false);
    }
  };

  return (
    <div className="app-container">
      <div className="main-content">
        
        {/* Top Metrics Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <MetricCard title="Total Queries" value={queries.length} subtext="Loaded by current role scope" />
          <MetricCard title="Pending" value={pendingCount} subtext="Requires action" type="warning" />
          <MetricCard title="In Progress" value={inProgressCount} subtext="Being processed" />
          <MetricCard title="Resolved" value={resolvedCount} subtext="Closed queries" type="success" />
        </div>

        {userRole === 'admin' && showCreateUserModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem',
            }}
          >
            <div className="card" style={{ width: '100%', maxWidth: '560px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: 'var(--primary)' }}>Create User</h3>
                <button
                  type="button"
                  onClick={handleCloseCreateUserModal}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleCreateUser} style={{ display: 'grid', gap: '0.75rem' }}>
                <div>
                  <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.35rem' }}>Name</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.35rem' }}>Email</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.35rem' }}>Password</label>
                  <input
                    type="password"
                    required
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.35rem' }}>Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                  >
                    <option value="customer">Customer</option>
                    <option value="company">Company</option>
                    <option value="operator">Operator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {newUserRole === 'operator' && (
                  <div>
                    <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.35rem' }}>Department</label>
                    <select
                      required
                      value={newUserDepartment}
                      onChange={(e) => setNewUserDepartment(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                    >
                      <option value="">Select department</option>
                      {OPERATOR_DEPARTMENT_OPTIONS.map((department) => (
                        <option key={department} value={department}>
                          {department}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {newUserRole === 'company' && (
                  <div>
                    <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.35rem' }}>Company</label>
                    <select
                      required
                      value={newUserCompany}
                      onChange={(e) => setNewUserCompany(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                    >
                      <option value="">Select company</option>
                      {COMPANY_OPTIONS.map((company) => (
                        <option key={company} value={company}>
                          {company}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {createUserMessage && (
                  <div
                    className="text-sm"
                    style={{
                      color: createUserMessage.includes('successfully') ? 'var(--accent-text)' : 'var(--error)',
                    }}
                  >
                    {createUserMessage}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.3rem' }}>
                  <button type="button" className="btn-secondary" onClick={handleCloseCreateUserModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={isCreatingUser} style={{ opacity: isCreatingUser ? 0.7 : 1 }}>
                    {isCreatingUser ? 'Creating...' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          
          {/* Main Table Section */}
          <div className="card" style={{ flex: '1', minWidth: '0' }}>
            <div className="card-header">
              <span>Incoming Queries Queue</span>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              {error && (
                <div style={{ color: 'var(--error)', padding: '1rem' }}>{error}</div>
              )}
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>ID</th>
                    <th style={{ width: '35%' }}>Query Preview</th>
                    <th>Company</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>Loading queries...</td>
                    </tr>
                  ) : queries.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>No queries found for this role.</td>
                    </tr>
                  ) : (
                  queries.map((complaint) => (
                    <tr 
                      key={complaint.id} 
                      onClick={() => setSelectedId(complaint.id)}
                      style={{ 
                        cursor: 'pointer',
                        backgroundColor: selectedId === complaint.id ? 'var(--bg-color)' : '',
                        borderLeft: (complaint.status || '').toUpperCase() === 'PENDING' ? '4px solid var(--warning)' : '4px solid transparent'
                      }}
                    >
                      <td className="text-sm font-medium text-primary">Q-{complaint.id}</td>
                      <td>
                        <div className="text-sm truncate" style={{ maxWidth: '300px' }}>
                          {complaint.query_text}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-default">{complaint.company || 'N/A'}</span>
                      </td>
                      <td>
                        <span className="badge badge-default">{complaint.department || 'Unassigned'}</span>
                      </td>
                      <td>{getStatusBadge(complaint.status)}</td>
                      <td className="text-sm text-muted">{new Date(complaint.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side Panel: Complaint Detail */}
          {selectedComplaint && (
            <div className="card" style={{ width: '400px', flexShrink: 0, position: 'sticky', top: '5rem' }}>
              <div className="card-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
                <span>Query Details</span>
                <button 
                  onClick={() => setSelectedId(null)} 
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', padding: '0' }}
                >×</button>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div className="text-sm font-semibold text-primary">Q-{selectedComplaint.id}</div>
                  <div className="text-xs text-muted">{new Date(selectedComplaint.date).toLocaleString()}</div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase', marginBottom: '0.5rem' }}>Full Description</h4>
                  <p className="text-sm" style={{ lineHeight: '1.6', color: 'var(--text-main)', backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: '8px' }}>
                    "{selectedComplaint.query_text}"
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                  <div>
                    <h4 className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase', marginBottom: '0.25rem' }}>Company</h4>
                    <span className="badge badge-default" style={{ fontSize: '0.875rem' }}>{selectedComplaint.company || 'N/A'}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase', marginBottom: '0.25rem' }}>Department</h4>
                    <span className="badge badge-default" style={{ fontSize: '0.875rem' }}>{selectedComplaint.department || 'Unassigned'}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase', marginBottom: '0.25rem' }}>Status</h4>
                    {getStatusBadge(selectedComplaint.status)}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                  <h4 className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase', marginBottom: '1rem' }}>Actions</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {userRole === 'admin' && (
                      <>
                        <select
                          value={selectedDepartment}
                          onChange={(e) => setSelectedDepartment(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            fontFamily: 'inherit',
                            backgroundColor: '#fff',
                          }}
                          disabled={isUpdatingDepartment}
                        >
                          <option value="">Select department</option>
                          {DEPARTMENT_OPTIONS.map((department) => (
                            <option key={department} value={department}>
                              {department}
                            </option>
                          ))}
                        </select>
                        <button
                          className="btn-primary"
                          style={{ width: '100%', padding: '0.75rem' }}
                          onClick={handleUpdateDepartment}
                          disabled={
                            isUpdatingDepartment ||
                            !selectedDepartment ||
                            selectedDepartment === (selectedComplaint.department || '')
                          }
                        >
                          {isUpdatingDepartment ? 'Updating Department...' : 'Update Department'}
                        </button>
                        {updateMessage && (
                          <div
                            className="text-sm"
                            style={{
                              color: updateMessage.includes('successfully') ? 'var(--accent-text)' : 'var(--error)',
                              padding: '0.25rem 0.1rem',
                            }}
                          >
                            {updateMessage}
                          </div>
                        )}
                      </>
                    )}
                    {userRole === 'operator' && (
                      <>
                        <div>
                          <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.35rem' }}>
                            Company Name
                          </label>
                          <input
                            type="text"
                            value={forwardCompanyName}
                            onChange={(e) => setForwardCompanyName(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.7rem',
                              borderRadius: '8px',
                              border: '1px solid var(--border)',
                              fontFamily: 'inherit',
                            }}
                            disabled={isForwarding}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.35rem' }}>
                            Forward Message
                          </label>
                          <textarea
                            value={forwardMessage}
                            onChange={(e) => setForwardMessage(e.target.value)}
                            rows={3}
                            style={{
                              width: '100%',
                              padding: '0.7rem',
                              borderRadius: '8px',
                              border: '1px solid var(--border)',
                              fontFamily: 'inherit',
                              resize: 'vertical',
                            }}
                            disabled={isForwarding}
                          />
                        </div>
                        <button
                          className="btn-primary"
                          style={{ width: '100%', padding: '0.75rem' }}
                          onClick={handleForwardToCompany}
                          disabled={isForwarding || !forwardCompanyName.trim() || !forwardMessage.trim()}
                        >
                          {isForwarding ? 'Forwarding...' : 'Forward to Company'}
                        </button>
                        {forwardStatusMessage && (
                          <div
                            className="text-sm"
                            style={{
                              color: forwardStatusMessage.includes('successfully') ? 'var(--accent-text)' : 'var(--error)',
                              padding: '0.25rem 0.1rem',
                            }}
                          >
                            {forwardStatusMessage}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
