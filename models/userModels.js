import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { type } from "os";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "Email alredy taken"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "password length should be greater then 6 character"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    city: {
      type: String,
      required: [true, "city name is required"],
    },
    country: {
      type: String,
      required: [true, "country name is required"],
    },
    phone: {
      type: String,
      required: [true, "phone number is required"],
    },
    profilePic: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    answer: {
      type: String,
      required: [true, "answer is required"],
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

// bcrypt the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare the password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// JWT tOKEN
userSchema.methods.generateToken = function () {
  return JWT.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const userModel = mongoose.model("User", userSchema);
export default userModel;
