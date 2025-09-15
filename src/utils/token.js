// utils/token.js
import jwt from "jsonwebtoken";

export const createToken = (userId) => {
  return jwt.sign({_id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};
