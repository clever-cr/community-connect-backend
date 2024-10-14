// src/utils/token.js

import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  const JWT_SECRET = '39M8AVa5g850HwFaPYxt5jAqurqQ00NSURAaW1Pp4G0='; // Replace with your actual secret key

  if (!JWT_SECRET) {
    throw new Error("JWT secret key is not defined");
  }

  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '1d', // Token expiration time
  });
};
