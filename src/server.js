import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import http from 'http';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import routes from './routes/index.js';
import Response from './utils/Response.js'; 
import profileRoutes from './routes/profileRoutes.js';// Correct import statement for the Response class

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

app.use(express.json());
app.use('/communityconnect', routes);

// Use the correct environment variable for the MongoDB URI
const dbUrl = process.env.DB_URL || 'mongodb+srv://cleverumuhuza:123Onedrop.@cluster0.skpal3u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
console.log(dbUrl);

// Connect to MongoDB with error handling
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`Database connected successfully`);
  })
  .catch((error) => {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1); // Exit the process with failure
  });

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Generate token function
export const generateToken = (userId) => {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error('JWT secret key is not defined');
  }
  return jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
};

// Login function (example of how you might use the token generation)
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return Response.errorMessage(res, 'Email and password are required', 400);
    }

    const userExists = await User.findOne({ email });
    if (!userExists) {
      return Response.errorMessage(res, 'Invalid email', 400);
    }

    const passwordMatch = await bcrypt.compare(password, userExists.password);
    if (!passwordMatch) {
      return Response.errorMessage(res, 'Invalid password', 400);
    }

    return Response.succesMessage(res, 'User logged in successfully', {
      _id: userExists._id,
      name: userExists.name,
      email: userExists.email,
      location: userExists.location,
      token: generateToken(userExists._id),
    }, 200);
  } catch (error) {
    console.error('Error during login:', error.message);
    console.error('Stack trace:', error.stack);
    return Response.errorMessage(res, 'Internal server error', 500);
  }
});
