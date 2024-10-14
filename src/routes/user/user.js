import express from 'express';
import { signUp, login } from '../../controllers/user.js'; // Correct path to user.js in controllers

const router = express.Router();

router.post('/signup', signUp); // Signup route
router.post('/login', login);   // Login route

export default router;
