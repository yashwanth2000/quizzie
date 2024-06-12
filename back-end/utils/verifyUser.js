import errorHandler from "../utils/error.js";
import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    console.log("Received access_token cookie:", token);

    if (!token) return next(errorHandler(401, "Unauthorized"));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error("Token verification error:", err);
        return next(errorHandler(403, "Forbidden"));
      }

      console.log("Decoded user payload:", user);

      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
};

export default verifyToken;
