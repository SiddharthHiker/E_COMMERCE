import express from "express";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import rateLimiter from "./middlewares/rateLimiter.js";
import cloudinary from "cloudinary";
import Stripe from "stripe";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
// Routes imports
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import connectDB from "./config/db.js";

// dotenv config
dotenv.config();

// Database Connection
connectDB();

// stripe configuration
export const stripe = new Stripe(process.env.STRIPE_API_SECRET);

//cloudinary Config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Rest Object
const app = express();

// Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Apply rate limiter middleware globally
app.use(rateLimiter);

// route
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/Orders", orderRoutes);

// PORT
const PORT = process.env.PORT || 8080;

// Listen
app.listen(PORT, () => {
  console.log(
    `Server Running On PORT ${process.env.PORT} on ${process.env.NODE_ENV} Mode`
      .bgRed
  );
});
