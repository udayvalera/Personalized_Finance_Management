const mongoose = require("mongoose");
const Expense = require("../models/Expense"); // Import the Expense model
const User = require("../models/User"); // Import the User model
const connectDB = require("../config/database"); // Import existing DB connection

// Sample Expense Data (Uses existing user)
async function getSampleExpenses() {
  // Fetch users from the database
  const users = await User.find({ _id: "679b905ceb4742dd9ba077e7" }); // Fetch user by the provided userId

  // If no user found, exit
  if (users.length === 0) {
    console.log("No user found with the given userId.");
    process.exit(1);
  }

  // Sample expense data
  return [
    {
      userId: users[0]._id,
      amount: 100,
      category: "Groceries",
      description: "Weekly grocery shopping",
    },
    {
      userId: users[0]._id,
      amount: 50,
      category: "Transportation",
      description: "Taxi ride to the office",
    },
    {
      userId: users[0]._id,
      amount: 200,
      category: "Utilities",
      description: "Monthly electricity bill",
    },
    {
      userId: users[0]._id,
      amount: 80,
      category: "Dining Out",
      description: "Dinner at a restaurant",
    },
    {
      userId: users[0]._id,
      amount: 120,
      category: "Entertainment",
      description: "Movie and snacks",
    },
  ];
}

// Insert Data into MongoDB
async function seedExpenses() {
  try {
    await connectDB(); // Use existing DB connection
    // console.log("Connected to MongoDB");

    const expenses = await getSampleExpenses();

    // Clear existing data (optional)
    await Expense.deleteMany({ userId: "679b905ceb4742dd9ba077e7" }); // Clear expenses for the given userId
    console.log("Existing expense records removed");

    // Insert new sample data
    await Expense.insertMany(expenses);
    console.log("Sample expense records added successfully");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding expense records:", error);
    mongoose.connection.close();
  }
}

// Run Seeder
seedExpenses();
