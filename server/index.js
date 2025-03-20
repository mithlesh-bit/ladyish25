const mongoose = require("mongoose");
require("dotenv").config();

/* internal imports */
const app = require("./app");
const consoleMessage = require("./utils/console.util");
const port = process.env.PORT || 5000;

/* database connection */
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI, {
      serverSelectionTimeoutMS: 5000, // Reduce timeout to detect issues faster
      socketTimeoutMS: 45000, // Prevent socket hang-ups
      family: 4, // Force IPv4 for compatibility
    });
    //consoleMessage.successMessage("Connected to MongoDB.");
  } catch (error) {
    consoleMessage.errorMessage(`Database connection failed: ${error.message}`);
    process.exit(1); // Exit the process on database connection failure
  }
};

/* Initialize the server after database connection */
const startServer = async () => {
  await connectToDatabase(); // Ensure database is connected first
  app.listen(port, () => {
    consoleMessage.warningMessage(`Server is running on port ${port}.`);
  });
};

startServer();
