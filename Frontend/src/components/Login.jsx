import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, loginWithOtpApi, sendOtpApi } from '../services/api';
import AuthHero from './AuthHero';
import './Registration.css';

const Login = () => {
  const navigate = useNavigate();

  // Login Mode: 'email' or 'otp'
  const [loginMethod, setLoginMethod] = useState('email');

  // Email form state
  const [emailForm, setEmailForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  // Mobile OTP form state
  const [otpForm, setOtpForm] = useState({
    mobileNumber: '',
    otp: '',
  });

  // Modal State for Database OTP Popup
  const [otpModal, setOtpModal] = useState({
    isOpen: false,
    mobileNumber: '',
    otp: '',
    userName: '',
  });

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle email login changes
  const handleEmailChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmailForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  // Handle OTP login changes
  const handleOtpChange = async (e) => {
    const { name, value } = e.target;
    setOtpForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');

    // Automatically trigger OTP popup when user completes typing 10 digits
    if (name === 'mobileNumber' && value.trim().length === 10) {
      triggerOtpFetch(value.trim());
    }
  };

  // Fetch OTP and open popup modal
  const triggerOtpFetch = async (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      setErrors((prev) => ({ ...prev, mobileNumber: 'Enter a valid 10-digit mobile number' }));
      return;
    }

    setIsSendingOtp(true);
    setServerError('');

    try {
      const res = await sendOtpApi(mobile);
      // Open the OTP Popup Modal with retrieved MongoDB OTP
      setOtpModal({
        isOpen: true,
        mobileNumber: mobile,
        otp: res.otp,
        userName: res.name || 'Learner',
      });
    } catch (err) {
      setServerError(err.message || 'Failed to fetch OTP.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Auto-fill OTP from modal into form
  const handleAutoFillOtp = () => {
    setOtpForm((prev) => ({
      ...prev,
      otp: otpModal.otp,
    }));
    setOtpModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    if (loginMethod === 'email') {
      const newErrors = {};
      if (!emailForm.email.trim()) newErrors.email = 'Email address is required';
      if (!emailForm.password) newErrors.password = 'Password is required';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setIsLoading(true);
      try {
        const response = await loginUser({
          email: emailForm.email.trim(),
          password: emailForm.password,
        });
        setSuccessMessage(response.message || 'Login successful!');
        setTimeout(() => {
          navigate('/dashboard', { state: { user: response.user } });
        }, 1200);
      } catch (err) {
        setServerError(err.message || 'Invalid email or password.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Mobile OTP submission
      const newErrors = {};
      const mobileRegex = /^[0-9]{10}$/;
      if (!otpForm.mobileNumber.trim()) {
        newErrors.mobileNumber = 'Mobile number is required';
      } else if (!mobileRegex.test(otpForm.mobileNumber.trim())) {
        newErrors.mobileNumber = 'Enter a valid 10-digit mobile number';
      }

      if (!otpForm.otp.trim()) {
        newErrors.otp = 'OTP is required';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setIsLoading(true);
      try {
        const response = await loginWithOtpApi({
          mobileNumber: otpForm.mobileNumber.trim(),
          otp: otpForm.otp.trim(),
        });
        setSuccessMessage(response.message || 'Login with OTP successful!');
        setTimeout(() => {
          navigate('/dashboard', { state: { user: response.user } });
        }, 1200);
      } catch (err) {
        setServerError(err.message || 'Invalid OTP. Please check and try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="auth-split-layout">
      {/* Left EduTech Hero Banner */}
      <AuthHero />

      {/* Right Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-form-wrapper">
          <div className="form-header">
            <h2>Welcome back</h2>
            <p className="form-subtext">
              New to EduTech?{' '}
              <Link to="/register" className="switch-auth-link">
                Create an account
              </Link>
            </p>
          </div>

          {/* Login Method Tab Switcher */}
          <div className="login-tabs">
            <button
              type="button"
              className={`login-tab-btn ${loginMethod === 'email' ? 'active' : ''}`}
              onClick={() => { setLoginMethod('email'); setServerError(''); setErrors({}); }}
            >
              Email & Password
            </button>
            <button
              type="button"
              className={`login-tab-btn ${loginMethod === 'otp' ? 'active' : ''}`}
              onClick={() => { setLoginMethod('otp'); setServerError(''); setErrors({}); }}
            >
              Mobile Number & OTP
            </button>
          </div>

          {serverError && (
            <div className="alert-box alert-box-error" role="alert">
              <span>⚠️</span>
              <span>{serverError}</span>
            </div>
          )}

          {successMessage && (
            <div className="alert-box alert-box-success" role="alert">
              <span>✅</span>
              <span>{successMessage}</span>
            </div>
          )}

          <form className="edutech-form" onSubmit={handleSubmit} noValidate>
            {loginMethod === 'email' ? (
              <>
                {/* Email Address */}
                <div className="field-group">
                  <label htmlFor="login-email">Email address</label>
                  <div className="input-container">
                    <input
                      type="email"
                      id="login-email"
                      name="email"
                      placeholder="you@example.com"
                      value={emailForm.email}
                      onChange={handleEmailChange}
                      className={errors.email ? 'input-has-error' : ''}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                {/* Password with Eye toggle */}
                <div className="field-group">
                  <label htmlFor="login-password">Password</label>
                  <div className="input-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="login-password"
                      name="password"
                      placeholder="Enter your password"
                      value={emailForm.password}
                      onChange={handleEmailChange}
                      className={errors.password ? 'input-has-error' : ''}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      tabIndex="-1"
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                      <span>{showPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  {errors.password && <span className="error-text">{errors.password}</span>}
                </div>

                {/* Remember Me */}
                <div className="form-options-row">
                  <label className="remember-label">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={emailForm.rememberMe}
                      onChange={handleEmailChange}
                    />
                    <span>Remember me</span>
                  </label>
                  <a href="#forgot" className="forgot-link" onClick={(e) => { e.preventDefault(); alert('Password reset instructions sent.'); }}>
                    Forgot password?
                  </a>
                </div>
              </>
            ) : (
              <>
                {/* Mobile Number */}
                <div className="field-group">
                  <label htmlFor="otp-mobile">Mobile Number</label>
                  <div className="input-container">
                    <input
                      type="tel"
                      id="otp-mobile"
                      name="mobileNumber"
                      placeholder="Enter 10-digit mobile"
                      maxLength="10"
                      value={otpForm.mobileNumber}
                      onChange={handleOtpChange}
                      className={errors.mobileNumber ? 'input-has-error' : ''}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      className="btn-send-otp"
                      onClick={() => triggerOtpFetch(otpForm.mobileNumber.trim())}
                      disabled={isSendingOtp || isLoading}
                    >
                      {isSendingOtp ? 'Fetching...' : 'Get OTP'}
                    </button>
                  </div>
                  {errors.mobileNumber && <span className="error-text">{errors.mobileNumber}</span>}
                </div>

                {/* OTP Input */}
                <div className="field-group">
                  <label htmlFor="otp-input">Enter 6-Digit OTP</label>
                  <div className="input-container">
                    <input
                      type="text"
                      id="otp-input"
                      name="otp"
                      placeholder="e.g. 123456"
                      maxLength="6"
                      value={otpForm.otp}
                      onChange={handleOtpChange}
                      className={errors.otp ? 'input-has-error' : ''}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  {errors.otp && <span className="error-text">{errors.otp}</span>}
                </div>
              </>
            )}

            {/* Sign in action button */}
            <button
              type="submit"
              className="btn-primary-action"
              disabled={isLoading}
              id="login-submit-btn"
            >
              {isLoading ? (
                <>
                  <span className="spinner-icon" aria-hidden="true"></span>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>{loginMethod === 'email' ? 'Sign in' : 'Verify & Sign in'}</span>
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          {/* Google Button */}
          <button
            type="button"
            className="btn-social-google"
            onClick={() => alert('Google authentication is integrated with your EduTech identity.')}
          >
            <svg viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="auth-footer-prompt" style={{ textAlign: 'center', marginTop: '0.85rem', fontSize: '12.5px', color: '#64748b' }}>
            Not a member yet?{' '}
            <Link to="/register" className="switch-auth-link">
              Join EduTech
            </Link>
          </div>

          <div className="auth-terms-note">
            By continuing, you agree to our <a href="#terms">Terms of Service</a> and{' '}
            <a href="#privacy">Privacy Policy</a>.
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* MONGODB OTP POPUP MODAL DIALOG           */}
      {/* ========================================= */}
      {otpModal.isOpen && (
        <div className="otp-modal-backdrop" onClick={() => setOtpModal((prev) => ({ ...prev, isOpen: false }))}>
          <div className="otp-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="otp-modal-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </div>
            <h3>Your Database OTP</h3>
            <p>
              The OTP stored in MongoDB for <strong>+91 {otpModal.mobileNumber}</strong> is:
            </p>
            <div className="otp-code-highlight" title="Click to copy">
              {otpModal.otp}
            </div>
            <div className="otp-modal-actions">
              <button
                type="button"
                className="btn-autofill-otp"
                onClick={handleAutoFillOtp}
              >
                Auto-Fill OTP ✨
              </button>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setOtpModal((prev) => ({ ...prev, isOpen: false }))}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
