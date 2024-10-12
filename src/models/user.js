import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ['business', 'artisan', 'consumer'],
    },
    location: {
      address: String,
      city: String,
      zip: String,
      country: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
