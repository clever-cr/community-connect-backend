import User from '../models/user.js'; // Ensure the correct path to your User model
import bcrypt from 'bcrypt'; // Change to bcryptjs if that's the package you're using
import httpStatus from 'http-status'; // Ensure you have this package installed
import Response from '../utils/Response.js'; // Ensure the correct path to your Response utility
import { generateToken } from '../utils/token.js'; // Ensure to import the token generation function

export const signUp = async (req, res) => {
  try {
    const { name, email, password, role, location } = req.body;

    // Validate input
    if (!name || !email || !password || !role || !location) {
      return Response.errorMessage(
        res,
        'All fields are required',
        httpStatus.BAD_REQUEST
      );
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return Response.errorMessage(
        res,
        'User already exists',
        httpStatus.BAD_REQUEST
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      email,
      name,
      role,
      location,
      password: hashedPassword,
    });

    if (user) {
      return Response.succesMessage(
        res,
        'User created successfully',
        user,
        httpStatus.CREATED
      );
    }
    return Response.errorMessage(
      res,
      'User failed to be created',
      httpStatus.BAD_REQUEST
    );
  } catch (error) {
    console.error('Error during signup:', error.message); // Log the error message
    console.error('Stack trace:', error.stack); // Log the stack trace for more context
    return Response.errorMessage(
      res,
      'Internal server error',
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return Response.errorMessage(
        res,
        'Email and password are required',
        httpStatus.BAD_REQUEST
      );
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return Response.errorMessage(
        res,
        'Invalid email',
        httpStatus.BAD_REQUEST
      );
    }

    console.log('User found:', userExists); // Log the found user

    // Check password
    const passwordMatch = await bcrypt.compare(password, userExists.password);
    if (!passwordMatch) {
      return Response.errorMessage(
        res,
        'Invalid password',
        httpStatus.BAD_REQUEST
      );
    }

    // Return success response with user info and token
    return Response.succesMessage(
      res,
      'User logged in successfully',
      {
        _id: userExists._id,
        name: userExists.name,
        email: userExists.email,
        location: userExists.location,
        // Generate and return the token
        token: generateToken(userExists._id), // Ensure this function is defined
      },
      httpStatus.OK
    );
  } catch (error) {
    console.error('Error during login:', error.message); // Log the error message
    console.error('Stack trace:', error.stack); // Log the stack trace for more context
    return Response.errorMessage(
      res,
      'Internal server error',
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};
