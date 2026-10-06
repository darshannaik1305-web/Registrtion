import mongoose from 'mongoose';

const otpRecordSchema = new mongoose.Schema(
  {
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      default: 'Learner User',
    },
  },
  {
    timestamps: true,
  }
);

const OtpRecord = mongoose.model('OtpRecord', otpRecordSchema);

/**
 * Seed 5 default mobile numbers and OTPs into MongoDB if not present
 */
export const seedDefaultOtps = async () => {
  try {
    const defaultOtps = [
      { mobileNumber: '9876543210', otp: '123456', name: 'Aarav Sharma' },
      { mobileNumber: '9876543211', otp: '654321', name: 'Priya Patel' },
      { mobileNumber: '9123456780', otp: '112233', name: 'Rohan Verma' },
      { mobileNumber: '9988776655', otp: '445566', name: 'Sneha Rao' },
      { mobileNumber: '8877665544', otp: '998877', name: 'Vikram Singh' },
    ];

    for (const item of defaultOtps) {
      const exists = await OtpRecord.findOne({ mobileNumber: item.mobileNumber });
      if (!exists) {
        await OtpRecord.create(item);
      }
    }
    console.log('5 default Mobile + OTP records verified in MongoDB.');
  } catch (error) {
    console.error('Error seeding OTP records:', error.message);
  }
};

export default OtpRecord;
