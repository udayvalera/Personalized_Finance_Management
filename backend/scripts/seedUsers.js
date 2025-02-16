const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // Import existing User model
const connectDB = require("../config/database"); // Import existing DB connection

// Sample User Data
async function getSampleUsers() {
  const passwordHash = await bcrypt.hash("password123", 10);

  return [
    {
      username: "alice",
      email: "alice@example.com",
      password: passwordHash,
      isVerified: true,
      friends: ["bob", "charlie"],
      pendingRequests: [],
    },
    {
      username: "bob",
      email: "bob@example.com",
      password: passwordHash,
      isVerified: true,
      friends: ["alice"],
      pendingRequests: ["david"],
    },
    {
      username: "charlie",
      email: "charlie@example.com",
      password: passwordHash,
      isVerified: false,
      friends: ["alice"],
      pendingRequests: ["eve"],
    },
    {
      username: "david",
      email: "david@example.com",
      password: passwordHash,
      isVerified: true,
      friends: [],
      pendingRequests: ["bob"],
    },
    {
      username: "eve",
      email: "eve@example.com",
      password: passwordHash,
      isVerified: true,
      friends: [],
      pendingRequests: ["charlie"],
    },
    {
      username: "frank",
      email: "frank@example.com",
      password: passwordHash,
      isVerified: false,
      friends: [],
      pendingRequests: [],
    },
    {
      username: "grace",
      email: "grace@example.com",
      password: passwordHash,
      isVerified: true,
      friends: ["eve"],
      pendingRequests: ["charlie", "david"],
    },
  ];
}

// Insert Data into MongoDB
async function seedDatabase() {
  try {
    await connectDB(); // Use existing DB connection

    const users = await getSampleUsers();

    // Clear existing data (optional)
    await User.deleteMany({});
    console.log("Existing users removed");

    // Insert new sample data
    await User.insertMany(users);
    console.log("Sample users added successfully");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.connection.close();
  }
}

// Run Seeder
seedDatabase();
