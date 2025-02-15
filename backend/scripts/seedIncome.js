const mongoose = require("mongoose");
const Income = require("../models/Income"); // Import the Income model
const User = require("../models/User"); // Import the User model
const connectDB = require("../config/database"); // Import existing DB connection

// Sample Income Data (Uses existing user)
async function getSampleIncome() {
  // Fetch users from the database
  const users = await User.find({ _id: "679b905ceb4742dd9ba077e7" }); // Fetch user by the provided userId

  // If no user found, exit
  if (users.length === 0) {
    console.log("No user found with the given userId.");
    process.exit(1);
  }

  // Sample income data
  return [
    {
      userId: users[0]._id,
      amount: 5000,
      category: "Salary",
      description: "Monthly salary payment",
    },
    {
      userId: users[0]._id,
      amount: 1200,
      category: "Freelance",
      description: "Freelance web development project",
    },
    {
      userId: users[0]._id,
      amount: 200,
      category: "Investment",
      description: "Dividend payout from stocks",
    },
    {
      userId: users[0]._id,
      amount: 100,
      category: "Gift",
      description: "Birthday gift money from family",
    },
  ];
}

// Insert Data into MongoDB
async function seedIncome() {
  try {
    await connectDB(); // Use existing DB connection
    // console.log("Connected to MongoDB");

    const income = await getSampleIncome();

    // Clear existing data (optional)
    await Income.deleteMany({ userId: "679b905ceb4742dd9ba077e7" }); // Clear income for the given userId
    console.log("Existing income records removed");

    // Insert new sample data
    await Income.insertMany(income);
    console.log("Sample income records added successfully");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding income records:", error);
    mongoose.connection.close();
  }
}

// Run Seeder
seedIncome();
