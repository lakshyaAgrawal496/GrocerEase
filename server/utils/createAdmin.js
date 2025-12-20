import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";
import { existsSync } from "fs";
import connectDB from "../config/connectDB.js";
import UserModel from "../models/user.model.js";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to load .env file from server directory first, then root directory
const serverEnvPath = join(__dirname, "../.env");
const rootEnvPath = join(__dirname, "../../.env");

if (existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else if (existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  // Try default location (current working directory)
  dotenv.config();
}

/**
 * Script to create or update a user to admin role
 * Usage: node server/utils/createAdmin.js <email>
 */
async function createAdmin() {
  try {
    await connectDB();

    const email = process.argv[2];

    if (!email) {
      console.error("Please provide an email address");
      console.log("Usage: node server/utils/createAdmin.js <email>");
      process.exit(1);
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      console.error(`User with email ${email} not found. Please register first.`);
      process.exit(1);
    }

    // Update user role to ADMIN
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { role: "ADMIN" },
      { new: true }
    );

    console.log(`✅ Successfully updated ${email} to ADMIN role`);
    console.log(`User Details:`, {
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();

