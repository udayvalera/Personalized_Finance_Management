const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    hasFilledAdditionalInfo: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String, // Store the OTP
      default: null,
    },
    otpExpires: {
      type: Date, // Store the OTP expiration time
      default: null,
    },
    friends: [
      {
        type: String, // Changed to String to store usernames
        ref: "User",
      },
    ],
    pendingRequests: [
      {
        type: String, // Changed to String to store usernames
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Method to compare password for login
UserSchema.methods.comparePassword = async function (candidatePassword) {
  // console.log("Candidate Password:", candidatePassword);
  // console.log("Stored Hashed Password:", this.password);
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  // console.log("Password Match:", isMatch);
  return isMatch;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
