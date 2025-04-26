import fs from "fs";
import path from "path";
import crypto from "crypto";

// Path to the JSON file that stores users
const dataFilePath = path.join(process.cwd(), "data", "users.json");

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Initialize users file if it doesn't exist
const initUsersFile = () => {
  ensureDataDir();
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify({ users: [] }), "utf8");
  }
};

// Hash password using SHA-256
export const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

// Get all users
export const getUsers = () => {
  initUsersFile();
  try {
    const fileData = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileData).users;
  } catch (error) {
    console.error("Error reading users file:", error);
    return [];
  }
};

// Get user by username
export const getUserByUsername = (username) => {
  const users = getUsers();
  return users.find((user) => user.username === username);
};

// Create a new user
export const createUser = (userData) => {
  try {
    const users = getUsers();

    // Check if user already exists
    const existingUser = users.find(
      (user) => user.username === userData.username
    );
    if (existingUser) {
      return null; // User already exists
    }

    // Hash the password
    const hashedPassword = hashPassword(userData.password);

    const newUser = {
      ...userData,
      password: hashedPassword, // Store hashed password only
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    fs.writeFileSync(dataFilePath, JSON.stringify({ users }, null, 2), "utf8");

    return { ...newUser, password: undefined }; // Return user without password
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Verify user credentials
export const verifyCredentials = (username, password) => {
  const user = getUserByUsername(username);
  if (!user) return false;

  const hashedPassword = hashPassword(password);
  return user.password === hashedPassword;
};

// Seed admin user if not exists
export const seedAdminUser = () => {
  const adminUsername = "finerlux_admin";
  const adminPassword = "hashed_pass_fin";

  // Check if admin user already exists
  const existingAdmin = getUserByUsername(adminUsername);

  if (!existingAdmin) {
    // Create admin user
    createUser({
      username: adminUsername,
      password: adminPassword,
      role: "admin",
    });
    console.log("Admin user seeded successfully");
  }
};

// Initialize admin user on first import
seedAdminUser();
