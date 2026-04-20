export default function CompanyOpening() {
  return (
    <div className="app-container">
      <div className="main-content">
        <div className="card" style={{ maxWidth: '800px', margin: '2rem auto' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Corporate Resolution Center</span>
            <span className="badge badge-warning">3 Actions Required</span>
          </div>
          <div className="card-body" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
             <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🏢</div>
             <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>Welcome to your Company Dashboard</h2>
             <p className="text-muted" style={{ maxWidth: '500px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
               Review consumer complaints assigned to your organization, provide systematic responses, and collaborate with government regulators to close high-priority cases efficiently.
             </p>
             <button className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
               Review Open Cases
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
