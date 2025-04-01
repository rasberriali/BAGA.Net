require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require('express-rate-limit');
const projectRoutes = require("./routes/projectRoutes");
const doctorRoutes = require("./routes/doctorRoutes");

const app = express();

// Trust proxy headers
app.set('trust proxy', 1);

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipFailedRequests: true, // Don't count failed requests
  keyGenerator: (req) => {
    // Use the real IP address from the request
    return req.ip || req.connection.remoteAddress;
  }
});

// Apply rate limiting to all routes
app.use(limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  }
});

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(express.json({ limit: "10mb" }));
app.use(cors(corsOptions));

// JWT Secret check
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing. Check your .env file.");
  process.exit(1);
}

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("MONGO_URI is missing. Check your .env file.");
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Apply auth rate limiting to auth routes
app.use('/patients/login', authLimiter);
app.use('/patients/signup', authLimiter);

// Routes
app.use('/patients', projectRoutes);
app.use('/doctors', doctorRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
