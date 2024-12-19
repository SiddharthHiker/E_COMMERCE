import JWT from "jsonwebtoken";
import userModel from "../models/userModels.js";

// user Auth
export const isAuth = async (req, res, next) => {
  const { token } = req.cookies;
  // validation
  if (!token) {
    return res.status(401).send({
      success: false,
      message: "UnAuthorized User",
    });
  }
  const decodeData = JWT.verify(token, process.env.JWT_SECRET);
  req.user = await userModel.findById(decodeData._id);
  next();
};

// Admin AUTh
export const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(404).send({
      success: false,
      message: "Admin only",
    });
  }
  next();
};
