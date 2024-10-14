import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  services: { type: String, required: true },
  availability: { type: String, required: true },
  pricing: { type: String, required: true },
  profilePictureUrl: { type: String, required: true }, // This can be a URL or a path to the image
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' } // Reference to User model
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
