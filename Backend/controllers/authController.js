import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import OtpRecord from '../models/OtpRecord.js';

// Validation regex patterns
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MOBILE_REGEX = /^[0-9]{10}$/;

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, mobileNumber, address, password, confirmPassword } = req.body;

    // 1. Validation: Required fields
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        field: 'fullName',
        message: 'Full Name is required.',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        field: 'email',
        message: 'Email address is required.',
      });
    }

    // 2. Validation: Email format
    const cleanEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        field: 'email',
        message: 'Please enter a valid email address.',
      });
    }

    // 3. Validation: Mobile number format
    if (!mobileNumber || !mobileNumber.trim()) {
      return res.status(400).json({
        success: false,
        field: 'mobileNumber',
        message: 'Mobile number is required.',
      });
    }

    const cleanMobile = mobileNumber.trim();
    if (!MOBILE_REGEX.test(cleanMobile)) {
      return res.status(400).json({
        success: false,
        field: 'mobileNumber',
        message: 'Please enter a valid 10-digit mobile number.',
      });
    }

    // 4. Validation: Address
    if (!address || !address.trim()) {
      return res.status(400).json({
        success: false,
        field: 'address',
        message: 'Address is required.',
      });
    }

    // 5. Validation: Password
    if (!password) {
      return res.status(400).json({
        success: false,
        field: 'password',
        message: 'Password is required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        field: 'password',
        message: 'Password must be at least 6 characters long.',
      });
    }

    // 6. Validation: Confirm password match
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        field: 'confirmPassword',
        message: 'Passwords do not match.',
      });
    }

    // 7. Check if user with this email or mobile already exists
    const existingUser = await User.findOne({
      $or: [{ email: cleanEmail }, { mobileNumber: cleanMobile }],
    });

    if (existingUser) {
      const isEmailMatch = existingUser.email === cleanEmail;
      return res.status(400).json({
        success: false,
        field: isEmailMatch ? 'email' : 'mobileNumber',
        message: isEmailMatch
          ? 'An account with this email already exists.'
          : 'An account with this mobile number already exists.',
      });
    }

    // 8. Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 9. Generate a random 6-digit OTP for this user
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // 10. Save new user to database
    const newUser = await User.create({
      fullName: fullName.trim(),
      email: cleanEmail,
      mobileNumber: cleanMobile,
      address: address.trim(),
      password: hashedPassword,
    });

    // 11. Store the random OTP in MongoDB for future mobile login
    await OtpRecord.findOneAndUpdate(
      { mobileNumber: cleanMobile },
      { mobileNumber: cleanMobile, otp: randomOtp, name: newUser.fullName },
      { upsert: true, new: true }
    );

    return res.status(201).json({
      success: true,
      message: `Registration successful! Your mobile OTP is ${randomOtp}`,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        mobileNumber: newUser.mobileNumber,
        address: newUser.address,
        otp: randomOtp,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Error in registerUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
      error: error.message,
    });
  }
};

/**
 * @desc    Login user with Email & Password
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
      },
    });
  } catch (error) {
    console.error('Error in loginUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
      error: error.message,
    });
  }
};

/**
 * @desc    Send / Fetch stored OTP for mobile number
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
export const sendOtp = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    if (!mobileNumber || !mobileNumber.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a 10-digit mobile number.',
      });
    }

    const cleanMobile = mobileNumber.trim();
    if (!MOBILE_REGEX.test(cleanMobile)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number.',
      });
    }

    // Retrieve OTP stored in MongoDB
    let otpRecord = await OtpRecord.findOne({ mobileNumber: cleanMobile });
    
    if (!otpRecord) {
      // Check if user is registered
      const user = await User.findOne({ mobileNumber: cleanMobile });
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      
      otpRecord = await OtpRecord.create({
        mobileNumber: cleanMobile,
        otp: newOtp,
        name: user ? user.fullName : 'Learner User',
      });
    }

    return res.status(200).json({
      success: true,
      message: `OTP retrieved from database for ${cleanMobile}`,
      otp: otpRecord.otp,
      name: otpRecord.name,
    });
  } catch (error) {
    console.error('Error in sendOtp:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP.',
      error: error.message,
    });
  }
};

/**
 * @desc    Login with Mobile Number & OTP
 * @route   POST /api/auth/login-otp
 * @access  Public
 */
export const loginWithOtp = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    if (!mobileNumber || !mobileNumber.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required.',
      });
    }

    if (!otp || !otp.trim()) {
      return res.status(400).json({
        success: false,
        message: 'OTP is required.',
      });
    }

    const cleanMobile = mobileNumber.trim();
    const cleanOtp = otp.trim();

    // 1. Check in MongoDB OtpRecord collection
    const record = await OtpRecord.findOne({ mobileNumber: cleanMobile });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Mobile number not found. Please register first or use a valid demo mobile number.',
      });
    }

    // 2. Validate OTP
    if (record.otp !== cleanOtp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please enter the correct OTP.',
      });
    }

    // 3. Find associated user if registered
    const user = await User.findOne({ mobileNumber: cleanMobile });

    return res.status(200).json({
      success: true,
      message: 'OTP verified! Login successful.',
      user: {
        id: user?._id || record._id,
        fullName: user?.fullName || record.name || 'Learner User',
        email: user?.email || `${cleanMobile}@edutech.io`,
        mobileNumber: cleanMobile,
      },
    });
  } catch (error) {
    console.error('Error in loginWithOtp:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
      error: error.message,
    });
  }
};
