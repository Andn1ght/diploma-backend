const { Pool } = require("pg");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Choose the correct database URL based on the environment
const DATABASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL // Internal connection for Railway deployment
    : process.env.DATABASE_PUBLIC_URL; // Public connection for local development

if (!DATABASE_URL) {
  console.error("❌ ERROR: Database URL is undefined. Check .env file.");
  process.exit(1);
}

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Attempt database connection
pool
  .connect()
  .then(() => console.log("✅ Successfully connected to PostgreSQL"))
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  });

module.exports = pool;