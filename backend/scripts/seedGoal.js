const mongoose = require("mongoose");
const Goal = require("../models/Goal"); // Import the Goal model
const User = require("../models/User"); // Import the User model
const connectDB = require("../config/database"); // Import existing DB connection

// Sample Goal Data (Uses existing users)
async function getSampleGoals() {
  // Fetch usernames from the database
  const users = await User.find({}, "username");

  // If no users exist, exit
  if (users.length === 0) {
    console.log("No users found. Please seed users first.");
    process.exit(1);
  }

  return [
    {
      username: users[0].username,
      goalName: "Buy a Car",
      goalAmount: 50000,
      currentSavings: 10000,
    },
    {
      username: users[1].username,
      goalName: "Vacation Fund",
      goalAmount: 10000,
      currentSavings: 3000,
    },
    {
      username: users[2].username,
      goalName: "Emergency Fund",
      goalAmount: 20000,
      currentSavings: 5000,
    },
    {
      username: users[3].username,
      goalName: "Home Renovation",
      goalAmount: 15000,
      currentSavings: 2000,
    },
    {
      username: users[4].username,
      goalName: "Gadget Upgrade",
      goalAmount: 5000,
      currentSavings: 1000,
    },
    {
      username: users[5].username,
      goalName: "Education Fund",
      goalAmount: 30000,
      currentSavings: 7000,
    },
    {
      username: users[6].username,
      goalName: "Retirement Savings",
      goalAmount: 100000,
      currentSavings: 15000,
    },
  ];
}

// Insert Data into MongoDB
async function seedGoals() {
  try {
    await connectDB(); // Use existing DB connection
    // console.log("Connected to MongoDB");

    const goals = await getSampleGoals();

    // Clear existing data (optional)
    await Goal.deleteMany({});
    console.log("Existing goals removed");

    // Insert new sample data
    await Goal.insertMany(goals);
    console.log("Sample goals added successfully");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding goals:", error);
    mongoose.connection.close();
  }
}

// Run Seeder
seedGoals();
