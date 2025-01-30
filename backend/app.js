require('dotenv').config();
const express = require("express");

//Database connection
const connectDB  = require("./config/database");

//Routes
const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const socialRoutes = require("./routes/socialRoutes");
const expenseRoutes = require("./routes/financeRoutes");

//Middleware
const adminMiddleware = require("./middleware/adminAuthMiddleware");

//Scheduler
const { initializeReminderScheduler } = require("./schedulers/reminderScheduler");

const app = express();
const PORT = 5050;


connectDB();

app.use(express.json());

app.use("/api/v1/test", testRoutes);

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/admin", adminMiddleware, adminRoutes);
// app.use("/api/v1/admin", adminRoutes);

app.use("/api/v1/social", socialRoutes);

app.use("/api/v1/expense", expenseRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// module.exports = app;
