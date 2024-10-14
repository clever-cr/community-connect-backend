import express from 'express';
import Profile from '../models/Profile.js'; // Ensure this path is correct
import multer from 'multer'; // For handling file uploads
import path from 'path';

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the folder where you want to store the uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Append file extension
  }
});

const upload = multer({ storage: storage });

// Create a new profile
router.post('/user/profile', upload.single('profilePicture'), async (req, res) => {
  try {
    const { businessName, services, availability, pricing } = req.body;

    const profilePictureUrl = req.file ? req.file.path : null; // Save the path to the uploaded profile picture

    const newProfile = new Profile({
      businessName,
      services,
      availability,
      pricing,
      profilePictureUrl,
      userId: req.user.id, // Make sure to have user authentication middleware
    });

    await newProfile.save();
    res.status(201).json(newProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create profile' });
  }
});

// Get user profile
router.get('/user/profile', async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id }); // Fetch profile by user ID

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch profile data' });
  }
});

// Update user profile
router.put('/user/profile', upload.single('profilePicture'), async (req, res) => {
  try {
    const { businessName, services, availability, pricing } = req.body;

    const updateData = { businessName, services, availability, pricing };
    
    if (req.file) {
      updateData.profilePictureUrl = req.file.path; // Update the profile picture if a new one is uploaded
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id }, 
      updateData, 
      { new: true, runValidators: true } // Return the updated document and validate
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

export default router;
