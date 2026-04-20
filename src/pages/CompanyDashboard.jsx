import { useNavigate } from 'react-router-dom';

const mockQueries = [
  { id: 'QRY-3042', title: 'Service Interruption Response', status: 'Action Required', date: '2026-04-20', priority: 'High', customer: 'John Doe' },
  { id: 'QRY-3041', title: 'Billing Dispute Resolution', status: 'Pending Review', date: '2026-04-19', priority: 'Medium', customer: 'Jane Smith' },
  { id: 'QRY-3038', title: 'Product Quality Complaint', status: 'In Progress', date: '2026-04-18', priority: 'Low', customer: 'Alice Johnson' },
  { id: 'QRY-3035', title: 'Data Privacy Inquiry', status: 'Action Required', date: '2026-04-17', priority: 'High', customer: 'Robert Brown' },
  { id: 'QRY-3030', title: 'Refund Processing Delay', status: 'Resolved', date: '2026-04-15', priority: 'Medium', customer: 'Charlie Davis' },
];

export default function CompanyDashboard() {
  const navigate = useNavigate();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#ef4444'; // red
      case 'Medium': return '#f59e0b'; // amber
      case 'Low': return '#10b981'; // green
      default: return '#6b7280';
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Action Required') return 'badge-error';
    if (status === 'Resolved') return 'badge-success';
    if (status === 'Pending Review') return 'badge-warning';
    return 'badge-primary';
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
              <h4>Action Required</h4>
              <p className="value">2</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>⏳</div>
            <div className="stat-info">
              <h4>Pending Review</h4>
              <p className="value">1</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>✅</div>
            <div className="stat-info">
              <h4>Resolved Cases</h4>
              <p className="value">124</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>📈</div>
            <div className="stat-info">
              <h4>Resolution Rate</h4>
              <p className="value">96.5%</p>
            </div>
          </div>
        </div>

        <div className="table-card">
          <div className="table-header">
            <div className="table-title">Assigned Customer Queries</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Updated just now</div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="corp-table">
              <thead>
                <tr>
                  <th>Query ID</th>
                  <th>Customer</th>
                  <th>Issue Title</th>
                  <th>Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {mockQueries.map(query => (
                  <tr key={query.id}>
                    <td style={{ fontWeight: '500', color: '#0f172a' }}>{query.id}</td>
                    <td>{query.customer}</td>
                    <td style={{ fontWeight: '500' }}>{query.title}</td>
                    <td style={{ color: '#64748b' }}>{query.date}</td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="priority-dot" style={{ backgroundColor: getPriorityColor(query.priority) }}></span>
                        {query.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(query.status)}`}>{query.status}</span>
                    </td>
                    <td>
                      <button 
                        className="action-btn"
                        onClick={() => navigate(`/company/query/${query.id}`)}
                      >
                        Open Dashboard Chat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
