import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true, // Ensures that email addresses are unique
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ['business', 'artisan', 'consumer'], // Allowed values for role
    },
    location: {
      address: String,
      city: String,
      zip: String,
      country: String,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Export the User model
export default mongoose.model('User', userSchema);
