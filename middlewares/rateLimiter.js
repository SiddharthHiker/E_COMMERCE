import rateLimit from "express-rate-limit";

// Define rate limiter middleware
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true, // Includes rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disables the `X-RateLimit-*` headers
});

export default rateLimiter;
