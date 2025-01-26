const bcrypt = require("bcryptjs");

const candidatePassword = "$2a$10$9mzYaXDuhF60KfRA0I4ba.pUSDE19mUn0gxC4u.KSm46AQ974kXVW";
const storedHashedPassword = "$2a$10$GD7z7kMxh5B/2AzR.fZj.uF9CJ6rOYtIQFfvNw6Dqm3GjjQcoBfWy";

// Hash the candidate password
bcrypt
  .hash(candidatePassword, 10)
  .then((hashedCandidatePassword) => {
    console.log("Hashed Candidate Password:", hashedCandidatePassword);
    // Compare the hashed candidate password with the stored hashed password
    return bcrypt.compare(candidatePassword, storedHashedPassword);
  })
  .then((isMatch) => {
    console.log("Password Match:", isMatch); // Should log `true`
  })
  .catch((err) => {
    console.error("Error:", err);
  });
