import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import AuthHero from './AuthHero';
import './Registration.css';

const Registration = () => {
  const navigate = useNavigate();

  // Form input state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation errors state
  const [errors, setErrors] = useState({});

  // Submission state
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    if (serverError) {
      setServerError('');
    }
  };

  // Client-side validation function
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!mobileRegex.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerUser({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        address: formData.address.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      setSuccessMessage(response.message || 'Registration successful! Redirecting to login...');

      setFormData({
        fullName: '',
        email: '',
        mobileNumber: '',
        address: '',
        password: '',
        confirmPassword: '',
        agreeTerms: true,
      });

      setTimeout(() => {
        navigate('/login');
      }, 1800);
    } catch (err) {
      setServerError(err.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
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
            <h2>Create an account</h2>
            <p className="form-subtext">
              Already have an account?{' '}
              <Link to="/login" className="switch-auth-link">
                Sign in
              </Link>
            </p>
          </div>

          {/* Server Error Alert */}
          {serverError && (
            <div className="alert-box alert-box-error" role="alert">
              <span>⚠️</span>
              <span>{serverError}</span>
            </div>
          )}

          {/* Success Message Alert */}
          {successMessage && (
            <div className="alert-box alert-box-success" role="alert">
              <span>✅</span>
              <span>{successMessage}</span>
            </div>
          )}

          <form className="edutech-form" onSubmit={handleSubmit} noValidate>
            {/* 1. Full Name */}
            <div className="field-group">
              <label htmlFor="fullName">Full Name</label>
              <div className="input-container">
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? 'input-has-error' : ''}
                  disabled={isLoading}
                  required
                />
              </div>
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            {/* 2. Email Address */}
            <div className="field-group">
              <label htmlFor="email">Email address</label>
              <div className="input-container">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'input-has-error' : ''}
                  disabled={isLoading}
                  required
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            {/* 3. Mobile Number */}
            <div className="field-group">
              <label htmlFor="mobileNumber">Mobile Number</label>
              <div className="input-container">
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  placeholder="10-digit mobile (e.g. 9876543210)"
                  maxLength="10"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className={errors.mobileNumber ? 'input-has-error' : ''}
                  disabled={isLoading}
                  required
                />
              </div>
              {errors.mobileNumber && <span className="error-text">{errors.mobileNumber}</span>}
            </div>

            {/* 4. Address */}
            <div className="field-group">
              <label htmlFor="address">Address</label>
              <div className="input-container">
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="City, State, ZIP"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? 'input-has-error' : ''}
                  disabled={isLoading}
                  required
                />
              </div>
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>

            {/* 5. Password with Eye toggle */}
            <div className="field-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* 6. Confirm Password with Eye toggle */}
            <div className="field-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-container">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'input-has-error' : ''}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? (
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
                  <span>{showConfirmPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-text">{errors.confirmPassword}</span>
              )}
            </div>

            {/* Checkbox */}
            <div className="form-options-row">
              <label className="remember-label">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
                <span>I agree to terms and conditions</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary-action"
              disabled={isLoading}
              id="register-submit-btn"
            >
              {isLoading ? (
                <>
                  <span className="spinner-icon" aria-hidden="true"></span>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </form>

          {/* Google Button */}
          <div className="auth-divider">
            <span>or continue with</span>
          </div>

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

          <div className="auth-terms-note">
            By continuing, you agree to our <a href="#terms">Terms of Service</a> and{' '}
            <a href="#privacy">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
