import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const userObj = this.toObject();
  delete userObj.password;
  return userObj;
};

const User = mongoose.model('User', userSchema);

export default User;
