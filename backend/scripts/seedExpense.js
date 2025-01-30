const mongoose = require("mongoose");
const Expense = require("../models/Expense"); // Import the Expense model
const User = require("../models/User"); // Import the User model
const connectDB = require("../config/database"); // Import existing DB connection

// Sample Expense Data (Uses existing users)
async function getSampleExpenses() {
    // Fetch usernames from the database
    const users = await User.find({}, "username");

    // If no users exist, exit
    if (users.length === 0) {
        console.log("No users found. Please seed users first.");
        process.exit(1);
    }

    return [
        { username: users[0].username, amount: 500, category: "Food", description: "Grocery shopping", date: new Date("2024-01-01") },
        { username: users[1].username, amount: 1200, category: "Rent", description: "Monthly house rent", date: new Date("2024-01-02") },
        { username: users[2].username, amount: 200, category: "Transport", description: "Fuel expenses", date: new Date("2024-01-03") },
        { username: users[3].username, amount: 100, category: "Entertainment", description: "Movie ticket", date: new Date("2024-01-04") },
        { username: users[4].username, amount: 300, category: "Utilities", description: "Electricity bill", date: new Date("2024-01-05") },
        { username: users[5].username, amount: 150, category: "Healthcare", description: "Doctor consultation", date: new Date("2024-01-06") },
        { username: users[6].username, amount: 80, category: "Miscellaneous", description: "Stationery purchase", date: new Date("2024-01-07") },
    ];
}

// Insert Data into MongoDB
async function seedExpenses() {
    try {
        await connectDB(); // Use existing DB connection
        // console.log("Connected to MongoDB");

        const expenses = await getSampleExpenses();

        // Clear existing data (optional)
        await Expense.deleteMany({});
        console.log("Existing expenses removed");

        // Insert new sample data
        await Expense.insertMany(expenses);
        console.log("Sample expenses added successfully");

        mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding expenses:", error);
        mongoose.connection.close();
    }
}

// Run Seeder
seedExpenses();
