import express from 'express';
import userRoute from './user/user.js'; // Ensure this path is correct

const router = express.Router();

router.use('/user', userRoute);

router.get('/test', (req, res) => {
  res.send('Test route working');
});

export default router;
