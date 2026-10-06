const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Register a new user
 * @param {Object} userData - { fullName, email, mobileNumber, address, password, confirmPassword }
 * @returns {Promise<Object>} Response data
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed. Please try again.');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Login user with Email and Password
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} Response data
 */
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed. Please try again.');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Request OTP on mobile number
 * @param {string} mobileNumber
 * @returns {Promise<Object>} Response data
 */
export const sendOtpApi = async (mobileNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mobileNumber }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send OTP.');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Login user with Mobile Number and OTP
 * @param {Object} data - { mobileNumber, otp }
 * @returns {Promise<Object>} Response data
 */
export const loginWithOtpApi = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.message || 'OTP Login failed.');
    }

    return resData;
  } catch (error) {
    throw error;
  }
};
