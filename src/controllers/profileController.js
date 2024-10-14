// controllers/profileController.js
import User from '../models/User.js'; // Adjust the path as needed

export const updateProfile = async (req, res) => {
  const { services, availability, pricing } = req.body;

  try {
    const userId = req.user.id; // Assuming you are using some kind of authentication middleware

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { services, availability, pricing },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
