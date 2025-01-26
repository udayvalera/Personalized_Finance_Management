require('dotenv').config();
const express = require("express");
const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const connectDB  = require("./config/database");

const app = express();
const PORT = 5050;


connectDB();

app.use(express.json());

app.use("/api/v1/test", testRoutes);

app.use("/api/v1/auth", authRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// module.exports = app;
