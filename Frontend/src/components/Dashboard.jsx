import { useLocation, Link } from 'react-router-dom';
import './Registration.css';

const Dashboard = () => {
  const location = useLocation();
  const user = location.state?.user || { fullName: 'User', email: 'registered@user.com' };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div className="auth-header">
          <h2>🎉 Welcome, {user.fullName}!</h2>
          <p>You have successfully authenticated with MongoDB & Express backend.</p>
        </div>

        <div style={{ padding: '1rem', background: 'var(--code-bg)', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'left' }}>
          <p style={{ margin: '0.25rem 0', color: 'var(--text-h)' }}><strong>Email:</strong> {user.email}</p>
          {user.id && <p style={{ margin: '0.25rem 0', color: 'var(--text-h)' }}><strong>User ID:</strong> {user.id}</p>}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Link to="/login" className="btn-submit" style={{ textDecoration: 'none', padding: '0.6rem 1.25rem' }}>
            Logout / Switch User
          </Link>
          <Link to="/register" className="btn-submit" style={{ textDecoration: 'none', background: 'var(--code-bg)', color: 'var(--text-h)', border: '1px solid var(--border)', padding: '0.6rem 1.25rem' }}>
            Register Another
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
