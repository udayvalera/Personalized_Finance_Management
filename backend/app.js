require("dotenv").config();
const express = require("express");
const cors = require("cors");
//Database connection
const connectDB = require("./config/database");

//Routes
const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const socialRoutes = require("./routes/socialRoutes");
const financeRoutes = require("./routes/financeRoutes");

//Middleware
const adminMiddleware = require("./middleware/adminAuthMiddleware");
const { authenticate } = require("./middleware/authMiddleware");
const loggerMiddleware = require("./middleware/loggerMiddleware");
//Scheduler
const {
  initializeReminderScheduler,
} = require("./schedulers/reminderScheduler");

const app = express();
const PORT = 5050;

connectDB();

//CORS Configuration
const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from this origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(loggerMiddleware);

app.use("/api/v1/test", testRoutes);

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/admin", adminMiddleware, adminRoutes);
// app.use("/api/v1/admin", adminRoutes);

app.use("/api/v1/social", socialRoutes);

app.use("/api/v1/finance", authenticate, financeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// module.exports = app;
