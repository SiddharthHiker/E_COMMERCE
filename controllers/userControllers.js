import { token } from "morgan";
import userModel from "../models/userModels.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, address, city, country, phone, answer } =
      req.body;
    //Validation
    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !city ||
      !country ||
      !phone ||
      !answer
    ) {
      return res.status(500).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }
    // check existing User
    const existingUser = await userModel.findOne({ email });
    //Validation
    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "email already taken",
      });
    }
    const user = await userModel.create({
      name,
      email,
      password,
      address,
      city,
      country,
      phone,
      answer,
    });
    res.status(201).send({
      success: true,
      message: "Registeration Success, please login",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Register API",
      error,
    });
  }
};

//login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please add Email or Password",
      });
    }
    // check user
    const user = await userModel.findOne({ email });

    // user  Validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not Found ",
      });
    }
    // check Password
    const isMatch = await user.comparePassword(password);
    // validation
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid credentials",
      });
    }
    // Token
    const token = user.generateToken();

    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "Login SuccesFully",
        token,
        user,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Login API",
      error,
    });
  }
};

// Get user Profile
export const getUserProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "User Profile Fetch Sucessfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get Profile API",
      error,
    });
  }
};

// Logout
export const logoutController = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "Logout Successfully ",
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Logout API",
      error,
    });
  }
};

// Update user  Profile
export const updateProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { name, email, address, city, country, phone } = req.body;
    // Validation + Update
    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (city) user.city = city;
    if (country) user.country = country;
    if (phone) user.phone = phone;

    // user Save
    await user.save();
    res.status(200).send({
      success: true,
      message: "User Profile Updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Update Profile",
      error,
    });
  }
};

// Updated Password
export const updatedPasswordControllers = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;
    // Validation
    if (!oldPassword || !newPassword) {
      return res.status(500).send({
        success: false,
        message: "Please provide old or new password",
      });
    }
    // old pass check
    const isMatch = await user.comparePassword(oldPassword);
    // Validation
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid Old Password",
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Password Updated SuccessFully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Updated Password API",
      error,
    });
  }
};

// Update Profile
export const updateProfilePicControllers = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    // file get from user photo
    const file = getDataUri(req.file);
    // Delete prev Image
    //  await cloudinary.v2.uploader.destroy(user.profilePic.public_id)
    // Update
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    user.profilePic = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    // save function
    await user.save();
    res.status(200).send({
      success: true,
      message: "Profile Picture updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in UpdateProfile Pic API",
      error,
    });
  }
};

// forgot password
export const passwordResetControllers = async (req, res) => {
  try {
    // user get email || newPassword || answer
    const { email, newPassword, answer } = req.body;
    // validation
    if (!email || !newPassword || !answer) {
      return res.status(404).send({
        success: false,
        message: "Please Provide All fields",
      });
    }
    // find user
    const user = await userModel.findOne({ email, answer });
    // validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: " Invalid user or answer",
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Your Password has Been Reset Please Login !",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Forgot API",
      error,
    });
  }
};
