import { useState } from 'react';

const mockComplaints = [
  { id: 'C-8291', text: 'I was charged twice for my property tax payment last week. Can you please reverse the duplicate charge?', category: 'Tax & Billing', confidence: 92, status: 'Auto Routed', timestamp: '10:24 AM' },
  { id: 'C-8292', text: 'The pothole on Main St. ruined my tire. I am demanding compensation!', category: 'Public Works', confidence: 85, status: 'Auto Routed', timestamp: '10:15 AM' },
  { id: 'C-8293', text: 'My water bill is unusually high but I have no leaks anywhere in my house. I need someone to check the meter.', category: 'Utilities', confidence: 42, status: 'Needs Review', timestamp: '09:41 AM' },
  { id: 'C-8294', text: 'Stray dogs are constantly barking near the park causing a disturbance.', category: 'Animal Control', confidence: 88, status: 'Auto Routed', timestamp: '09:12 AM' },
  { id: 'C-8295', text: 'Not sure where to submit forms for the new business permit. The website link is broken.', category: 'Permits', confidence: 35, status: 'Needs Review', timestamp: '08:50 AM' },
  { id: 'C-8296', text: 'Tree branches hit power lines during the storm and sparked.', category: 'Public Works', confidence: 78, status: 'Auto Routed', timestamp: '08:15 AM' },
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
  const [selectedId, setSelectedId] = useState(null);
  const selectedComplaint = mockComplaints.find(c => c.id === selectedId);

  const getStatusBadge = (status) => {
    if (status === 'Auto Routed') {
      return <span className="badge badge-success">{status}</span>;
    }
    return <span className="badge badge-warning">{status}</span>;
  };

  const getConfidenceBar = (score) => {
    let color = 'var(--accent)';
    if (score < 60) color = 'var(--warning)';
    if (score < 40) color = 'var(--error)';

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span className="text-xs font-medium">{score}%</span>
        </div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${score}%`, backgroundColor: color }}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="main-content">
        
        {/* Top Metrics Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <MetricCard title="Total Complaints Today" value="142" subtext="↑ 12% from yesterday" />
          <MetricCard title="Auto Routed" value="78%" subtext="110 successfully routed" type="success" />
          <MetricCard title="Manual Review" value="22%" subtext="32 awaiting review" type="warning" />
          <MetricCard title="Top Category" value="Public Works" subtext="45 complaints" />
        </div>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          
          {/* Main Table Section */}
          <div className="card" style={{ flex: '1', minWidth: '0' }}>
            <div className="card-header">
              <span>Incoming Complaints Queue</span>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>ID</th>
                    <th style={{ width: '35%' }}>Complaint Preview</th>
                    <th>Category</th>
                    <th style={{ width: '120px' }}>Confidence</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {mockComplaints.map(complaint => (
                    <tr 
                      key={complaint.id} 
                      onClick={() => setSelectedId(complaint.id)}
                      style={{ 
                        cursor: 'pointer',
                        backgroundColor: selectedId === complaint.id ? 'var(--bg-color)' : '',
                        borderLeft: complaint.status === 'Needs Review' ? '4px solid var(--warning)' : '4px solid transparent'
                      }}
                    >
                      <td className="text-sm font-medium text-primary">{complaint.id}</td>
                      <td>
                        <div className="text-sm truncate" style={{ maxWidth: '300px' }}>
                          {complaint.text}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-default">{complaint.category}</span>
                      </td>
                      <td>{getConfidenceBar(complaint.confidence)}</td>
                      <td>{getStatusBadge(complaint.status)}</td>
                      <td className="text-sm text-muted">{complaint.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side Panel: Complaint Detail */}
          {selectedComplaint && (
            <div className="card" style={{ width: '400px', flexShrink: 0, position: 'sticky', top: '5rem' }}>
              <div className="card-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
                <span>Complaint Details</span>
                <button 
                  onClick={() => setSelectedId(null)} 
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', padding: '0' }}
                >×</button>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div className="text-sm font-semibold text-primary">{selectedComplaint.id}</div>
                  <div className="text-xs text-muted">{selectedComplaint.timestamp}</div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase', marginBottom: '0.5rem' }}>Full Description</h4>
                  <p className="text-sm" style={{ lineHeight: '1.6', color: 'var(--text-main)', backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: '8px' }}>
                    "{selectedComplaint.text}"
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                  <div>
                    <h4 className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase', marginBottom: '0.25rem' }}>Predicted Category</h4>
                    <span className="badge badge-default" style={{ fontSize: '0.875rem' }}>{selectedComplaint.category}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase', marginBottom: '0.25rem' }}>Confidence Score</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="text-sm font-bold" style={{ color: selectedComplaint.confidence < 60 ? 'var(--warning-text)' : 'var(--accent-text)' }}>
                        {selectedComplaint.confidence}%
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                  <h4 className="text-xs font-semibold text-muted" style={{ textTransform: 'uppercase', marginBottom: '1rem' }}>Actions</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button className="btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                      ✓ Approve Routing
                    </button>
                    <button className="btn-secondary" style={{ width: '100%', padding: '0.75rem' }}>
                      ✎ Change Category
                    </button>
                    {selectedComplaint.status === 'Needs Review' && (
                      <button className="btn-danger" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
                        Mark as Critical
                      </button>
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
