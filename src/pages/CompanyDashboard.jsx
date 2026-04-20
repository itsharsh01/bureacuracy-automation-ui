import { useEffect, useMemo, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export default function CompanyDashboard() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [actionType, setActionType] = useState('resolve');
  const [companyResponse, setCompanyResponse] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    const fetchCompanyQueries = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Missing auth token. Please login again.');
        }

        const response = await fetch(`${API_BASE_URL}/chatbot/company/queries`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch company queries.');
        }

        const data = await response.json();
        const list = Array.isArray(data?.queries) ? data.queries : Array.isArray(data) ? data : [];
        setQueries(list);
      } catch (err) {
        setError(err.message || 'Unable to load company queries.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyQueries();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#ef4444'; // red
      case 'Medium': return '#f59e0b'; // amber
      case 'Low': return '#10b981'; // green
      default: return '#6b7280';
    }
  };

  const getStatusBadge = (status) => {
    const normalized = (status || '').toUpperCase();
    if (normalized === 'REJECTED') return 'badge-error';
    if (normalized === 'RESOLVED') return 'badge-success';
    if (normalized === 'PENDING') return 'badge-warning';
    return 'badge-primary';
  };

  const shouldShowCompanyResponse = (status) => {
    const normalized = (status || '').toUpperCase();
    return normalized === 'RESOLVED' || normalized === 'REJECTED';
  };

  const pendingCount = useMemo(
    () => queries.filter((q) => (q.status || '').toUpperCase() === 'PENDING').length,
    [queries]
  );
  const resolvedCount = useMemo(
    () => queries.filter((q) => (q.status || '').toUpperCase() === 'RESOLVED').length,
    [queries]
  );
  const rejectedCount = useMemo(
    () => queries.filter((q) => (q.status || '').toUpperCase() === 'REJECTED').length,
    [queries]
  );
  const progressRate = useMemo(() => {
    if (!queries.length) return 0;
    return Math.round((resolvedCount / queries.length) * 100);
  }, [queries.length, resolvedCount]);

  const handleOpenResponseModal = (query) => {
    setSelectedQuery(query);
    setActionType('resolve');
    setCompanyResponse('');
    setActionMessage('');
  };

  const handleCloseResponseModal = () => {
    if (isSubmittingAction) return;
    setSelectedQuery(null);
    setActionMessage('');
  };

  const handleSubmitAction = async (e) => {
    e.preventDefault();
    if (!selectedQuery?.id || !companyResponse.trim()) return;

    setIsSubmittingAction(true);
    setActionMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Missing auth token. Please login again.');
      }

      const response = await fetch(
        `${API_BASE_URL}/chatbot/company/query/${selectedQuery.id}/action`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: actionType,
            company_response: companyResponse.trim(),
          }),
        }
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.detail || data?.message || 'Failed to submit response.');
      }

      const nextStatus = actionType === 'resolve' ? 'RESOLVED' : 'REJECTED';
      setQueries((prev) =>
        prev.map((query) =>
          String(query.id) === String(selectedQuery.id)
            ? { ...query, status: data?.status || nextStatus, company_response: companyResponse.trim() }
            : query
        )
      );

      setActionMessage(`Query ${actionType === 'resolve' ? 'resolved' : 'rejected'} successfully.`);
      setSelectedQuery(null);
    } catch (err) {
      setActionMessage(err.message || 'Unable to update query action.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  return (
    <div className="app-container" style={{ backgroundColor: '#F1F5F9' }}>
      <style>{`
        .dash-container {
          padding: 2rem 5%;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .stat-info h4 {
          margin: 0;
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .stat-info .value {
          margin: 0.25rem 0 0 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
        }

        .table-card {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .table-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8fafc;
        }

        .table-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
        }

        .corp-table {
          width: 100%;
          border-collapse: collapse;
        }

        .corp-table th {
          background: #f1f5f9;
          padding: 1rem 1.5rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .corp-table td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
          font-size: 0.9rem;
        }

        .corp-table tr {
          transition: background-color 0.2s;
        }

        .corp-table tr:last-child td {
          border-bottom: none;
        }

        .corp-table tr:hover {
          background-color: #f8fafc;
        }

        .action-btn {
          padding: 0.5rem 1rem;
          background: #eff6ff;
          color: #3b82f6;
          border: 1px solid #bfdbfe;
          border-radius: 6px;
          font-weight: 500;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #3b82f6;
          color: white;
        }

        .priority-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 6px;
        }
      `}</style>
      <div className="dash-container">
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>🚨</div>
            <div className="stat-info">
              <h4>Pending</h4>
              <p className="value">{pendingCount}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>⏳</div>
            <div className="stat-info">
              <h4>Rejected</h4>
              <p className="value">{rejectedCount}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>✅</div>
            <div className="stat-info">
              <h4>Resolved Cases</h4>
              <p className="value">{resolvedCount}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>📈</div>
            <div className="stat-info">
              <h4>Resolution Rate</h4>
              <p className="value">{progressRate}%</p>
            </div>
          </div>
        </div>

        <div className="table-card">
          <div className="table-header">
            <div className="table-title">Assigned Customer Queries</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Updated just now</div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            {error && (
              <div style={{ color: '#dc2626', padding: '1rem 1.5rem' }}>{error}</div>
            )}
            {actionMessage && (
              <div style={{ color: actionMessage.includes('successfully') ? '#16a34a' : '#dc2626', padding: '0 1.5rem 1rem' }}>
                {actionMessage}
              </div>
            )}
            <table className="corp-table">
              <thead>
                <tr>
                  <th>Query ID</th>
                  <th>Customer ID</th>
                  <th>Issue</th>
                  <th>Date</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>Loading queries...</td>
                  </tr>
                ) : queries.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>No company queries found.</td>
                  </tr>
                ) : (
                  queries.map((query) => (
                  <tr key={query.id}>
                    <td style={{ fontWeight: '500', color: '#0f172a' }}>Q-{query.id}</td>
                    <td>{query.customer_id || 'N/A'}</td>
                    <td style={{ fontWeight: '500' }}>{query.query_text}</td>
                    <td style={{ color: '#64748b' }}>{new Date(query.date).toLocaleDateString()}</td>
                    <td>
                      {query.department || 'Unassigned'}
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(query.status)}`}>{query.status}</span>
                    </td>
                    <td>
                      <button 
                        className="action-btn"
                        onClick={() => handleOpenResponseModal(query)}
                      >
                        Respond
                      </button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedQuery && (
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
            <div className="table-card" style={{ width: '100%', maxWidth: '620px' }}>
              <div className="table-header">
                <div className="table-title">Respond to Query Q-{selectedQuery.id}</div>
                <button
                  type="button"
                  onClick={handleCloseResponseModal}
                  style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmitAction} style={{ padding: '1.5rem', display: 'grid', gap: '0.9rem' }}>
                <div style={{ color: '#334155', fontSize: '0.92rem', background: '#f8fafc', padding: '0.8rem', borderRadius: '8px' }}>
                  {selectedQuery.query_text}
                </div>
                {shouldShowCompanyResponse(selectedQuery.status) && (
                  <div>
                    <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.35rem', color: '#334155' }}>
                      Existing Company Response
                    </label>
                    <div
                      style={{
                        color: '#334155',
                        fontSize: '0.92rem',
                        background: '#f8fafc',
                        padding: '0.8rem',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        lineHeight: 1.5,
                      }}
                    >
                      {selectedQuery.company_response || 'No response provided by company.'}
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.35rem', color: '#334155' }}>
                    Action
                  </label>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    disabled={isSubmittingAction}
                  >
                    <option value="resolve">resolve</option>
                    <option value="reject">reject</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold" style={{ display: 'block', marginBottom: '0.35rem', color: '#334155' }}>
                    Company Response
                  </label>
                  <textarea
                    rows={4}
                    value={companyResponse}
                    onChange={(e) => setCompanyResponse(e.target.value)}
                    placeholder="Enter your response for the customer"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical', fontFamily: 'inherit' }}
                    disabled={isSubmittingAction}
                    required
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                  <button type="button" className="action-btn" onClick={handleCloseResponseModal} disabled={isSubmittingAction}>
                    Cancel
                  </button>
                  <button type="submit" className="action-btn" disabled={isSubmittingAction || !companyResponse.trim()}>
                    {isSubmittingAction ? 'Submitting...' : 'Submit Response'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
