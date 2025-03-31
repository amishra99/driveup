import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon.tech
  },
});

// Function to Query Database
export const query = async (text, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows;
  } catch (error) {
    console.error("Database Query Error:", error);
    throw error;
  } finally {
    client.release();
  }
};

export default pool;
