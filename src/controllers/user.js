import httpStatus from 'http-status';
import User from '../models/user.js';
import Response from '../utils/Response.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/token.js';
import mongoose from 'mongoose';

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
        httpStatus.CREATED
      );
    }
    return Response.errorMessage(
      res,
      'User failed to be created',
      httpStatus.BAD_REQUEST
    );
  } catch (error) {
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

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return Response.errorMessage(
        res,
        'invalid user id',
        httpStatus.BAD_REQUEST
      );
    }
    const user = await User.findById({ _id: userId });
    if (!user) {
      return Response.errorMessage(
        res,
        "User with this id doesn't exist",
        httpStatus.BAD_REQUEST
      );
    }
    return Response.succesMessage(
      res,
      'User data retrieved succcessfully',
      user,
      httpStatus.OK
    );
  } catch (error) {
    return Response.errorMessage(
      res,
      'Internal server error',
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return Response.errorMessage(
        res,
        'invalid user id',
        httpStatus.BAD_REQUEST
      );
    }
    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    if (!user) {
      return Response.errorMessage(
        res,
        'Failed to update user',
        httpStatus.BAD_REQUEST
      );
    }
    return Response.succesMessage(
      res,
      'User updated successfully',
      user,
      httpStatus.OK
    );
  } catch (error) {
    return Response.errorMessage(
      res,
      'Internal server error',
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return Response.errorMessage(
        res,
        'invalid user id',
        httpStatus.BAD_REQUEST
      );
    }
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return Response.errorMessage(
        res,
        'Failed to delete user',
        httpStatus.BAD_REQUEST
      );
    }
    return Response.succesMessage(
      res,
      'User deleted successfully',
      {},
      httpStatus.OK
    );
  } catch (error) {
    res, 'Internal server error', httpStatus.INTERNAL_SERVER_ERROR;
  }
};

export const getAllUsers = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = page || 0;
    limit = limit || 15;
    const skip = page * limit;
    const users = await User.find().skip(skip).limit(limit);
    const total = await User.countDocuments();
    if (!users.length) {
      return Response.errorMessage(
        res,
        'Users data retreieved successfully',
        httpStatus.BAD_REQUEST
      );
    }
    return Response.succesMessage(
      res,
      'Users data retreieved successfully',
      users,
      httpStatus.OK,
      total
    );
  } catch (error) {
    return Response.errorMessage(
      res,
      'Internal server error',
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};
