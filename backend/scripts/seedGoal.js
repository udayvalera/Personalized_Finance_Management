const mongoose = require("mongoose");
const Goal = require("../models/Goal"); // Import the Goal model
const User = require("../models/User"); // Import the User model
const connectDB = require("../config/database"); // Import existing DB connection

// Sample Goal Data (Uses existing user)
async function getSampleGoals() {
  // Fetch users from the database
  const users = await User.find({ _id: "679b905ceb4742dd9ba077e7" }); // Fetch user by the provided userId

  // If no user found, exit
  if (users.length === 0) {
    console.log("No user found with the given userId.");
    process.exit(1);
  }

  // Sample goal data
  return [
    {
      userId: users[0]._id,
      goalName: "Buy a New Laptop",
      goalAmount: 1200,
      currentSavings: 300,
    },
    {
      userId: users[0]._id,
      goalName: "Vacation Fund",
      goalAmount: 5000,
      currentSavings: 1500,
    },
    {
      userId: users[0]._id,
      goalName: "Emergency Fund",
      goalAmount: 10000,
      currentSavings: 2000,
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
    await Goal.deleteMany({ userId: "679b905ceb4742dd9ba077e7" }); // Clear goals for the given userId
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
