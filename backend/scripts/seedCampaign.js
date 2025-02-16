const mongoose = require("mongoose");
const Campaign = require("../models/Crowdfunding"); // Import existing Crowdfunding model
const User = require("../models/User"); // Import User model
const connectDB = require("../config/database"); // Import existing DB connection

// Sample Crowdfunding Data
async function getSampleCrowdfunding() {
  // Fetch users based on usernames
  const users = await User.find({ username: { $in: ["alice", "bob", "charlie", "david", "eve"] } });

  // Mapping usernames to their respective _ids
  const userIds = users.reduce((acc, user) => {
    acc[user.username] = user._id;
    return acc;
  }, {});

  return [
    {
      title: "Tech for Good",
      description: "A campaign to fund innovative technology solutions for underprivileged communities.",
      goal_amount: 50000,
      current_amount: 15000,
      image_url: "https://trustngoprojects.org/wp-content/uploads/2024/12/uG80aTzjTOCqUVNUvCGLMg-1024x574.webp",
      category: "technology",
      end_date: new Date("2025-06-30"),
      creator_id: userIds["alice"],
      creator_name: "Alice",
      anonymous: false,
      proof: "Document showing technology partnership.",
      supporter_count: 100,
      status: "active",
    },
    {
      title: "Green Earth Initiative",
      description: "An environmental campaign to plant trees in urban areas.",
      goal_amount: 20000,
      current_amount: 8000,
      image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnRI5AjllhwvlHUWlRSSSYQjJGJEs8e1w25g&s",
      category: "environment",
      end_date: new Date("2025-05-01"),
      creator_id: userIds["bob"],
      creator_name: "Bob",
      anonymous: false,
      proof: "Environmental impact plan available.",
      supporter_count: 50,
      status: "pending",
    },
    {
      title: "Business Expansion Fund",
      description: "A campaign to expand a small business into new markets.",
      goal_amount: 100000,
      current_amount: 20000,
      image_url: "https://biz-file.com/c/2107/618282-700x537.jpg",
      category: "business",
      end_date: new Date("2025-07-01"),
      creator_id: userIds["charlie"],
      creator_name: "Charlie",
      anonymous: false,
      proof: "Business growth plan and projections attached.",
      supporter_count: 30,
      status: "active",
    },
    {
      title: "Education for All",
      description: "A campaign to raise funds for school supplies and tuition for underprivileged students.",
      goal_amount: 15000,
      current_amount: 5000,
      image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh1biCOkCL5aNQqncqnCOkBA69LTxin7MZoQ&s",
      category: "education",
      end_date: new Date("2025-04-15"),
      creator_id: userIds["david"],
      creator_name: "David",
      anonymous: false,
      proof: "Proof of needs assessment and educational partnership.",
      supporter_count: 25,
      status: "completed",
    },
    {
      title: "Community Kitchen Project",
      description: "A community-driven effort to set up a kitchen providing free meals to the homeless.",
      goal_amount: 30000,
      current_amount: 5000,
      image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP2jbb322JCIkaKcjqVOXlZfPJ2mH0Lh9qkw&s",
      category: "community",
      end_date: new Date("2025-08-01"),
      creator_id: userIds["eve"],
      creator_name: "Eve",
      anonymous: false,
      proof: "Social impact study and support letters included.",
      supporter_count: 10,
      status: "suspended",
    },
  ];
}

// Insert Data into MongoDB
async function seedDatabase() {
  try {
    await connectDB(); // Use existing DB connection

    const campaigns = await getSampleCrowdfunding();

    // Clear existing data (optional)
    await Campaign.deleteMany({});
    console.log("Existing campaigns removed");

    // Insert new sample data
    await Campaign.insertMany(campaigns);
    console.log("Sample crowdfunding campaigns added successfully");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.connection.close();
  }
}

// Run Seeder
seedDatabase();
