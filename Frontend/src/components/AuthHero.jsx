const AuthHero = () => {
  return (
    <div className="auth-hero-panel">
      {/* Decorative orbital background circles */}
      <div className="hero-orbit orbit-1"></div>
      <div className="hero-orbit orbit-2"></div>
      <div className="hero-orbit orbit-3"></div>

      {/* Top Logo */}
      <div className="hero-header">
        <div className="edutech-logo-card">
          <svg className="edutech-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3L2 8L12 13L22 8L12 3Z" fill="#1e40af" />
            <path d="M4 11.5L12 16L20 11.5" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 14.5L12 18.5L18 14.5" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="edutech-brand-text">EduTech</span>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="hero-content">
        <div className="hero-tag">
          <span className="green-dot"></span>
          <span>YOUR NEXT CHAPTER STARTS HERE</span>
        </div>

        <h1 className="hero-title">
          Make room for <span className="mint-highlight">what you can become.</span>
        </h1>

        <p className="hero-description">
          Pick up where you left off, discover something new, and make every learning moment count.
        </p>

        {/* Floating Progress Card */}
        <div className="hero-floating-card">
          <div className="card-left">
            <div className="grad-icon-box">
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
              </svg>
            </div>
            <div>
              <div className="card-title">A little progress, every day</div>
              <div className="card-subtitle">Your learning journey is waiting</div>
            </div>
          </div>
          <div className="card-progress">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path
                className="circle-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="circle"
                strokeDasharray="78, 100"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" className="percentage">78%</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="hero-footer">
        <span>Made for curious minds.</span>
        <span className="rating-badge">
          <span className="stars">★★★★★</span> Loved by learners
        </span>
      </div>
    </div>
  );
};

export default AuthHero;
