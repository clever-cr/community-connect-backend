import httpStatus from 'http-status';
import User from '../models/user.js';
import Response from '../utils/Response.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/token.js';

export const signUp = async (req, res) => {
  try {
    const { name, email, password, role, location } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return Response.errorMessage(
        res,
        'User already exists',
        httpStatus.BAD_REQUEST
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
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
        'user created successfully',
        user,
        httpStatus.OK
      );
    }
    return Response.errorMessage(
      res,
      'User failed to be created',
      httpStatus.BAD_REQUEST
    );
  } catch (error) {
    return Response.errorMessage(res, 'Internal server error', httpStatus[500]);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({
      email,
    });
    if (!userExists) {
      return Response.errorMessage(
        res,
        'Invalid email',
        httpStatus.BAD_REQUEST
      );
    }
    const passwordMatch = await bcrypt.compare(password, userExists?.password);
    if (!passwordMatch) {
      return Response.errorMessage(
        res,
        'Invalid password',
        httpStatus.BAD_REQUEST
      );
    }
    return Response.succesMessage(
      res,
      'User logged in successfully',
      {
        _id: userExists._id,
        name: userExists.name,
        email: userExists.email,
        locaiton: userExists.location,
        token: generateToken(userExists._id),
      },
      httpStatus.OK
    );
  } catch (error) {
    return Response.errorMessage(
      'Internal server error',
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};
