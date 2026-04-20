export default function CustomerIntro() {
  return (
    <div className="app-container">
      <div className="main-content" style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
        <div className="card" style={{ maxWidth: '600px', width: '100%', textAlign: 'center', padding: '1rem' }}>
          <div className="card-body">
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>👋</div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Welcome, Citizen</h2>
            <p className="text-muted" style={{ lineHeight: '1.6', marginBottom: '2rem' }}>
              From this portal, you can file new complaints regarding government or corporate services, 
              track the real-time status of your existing issues, and communicate directly with resolution operators.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                File a New Complaint
              </button>
              <button className="btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
                View My History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
