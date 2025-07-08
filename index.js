// triptag-backend/index.js

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// GET all trip tags
app.get("/api/tags", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM trip_tags ORDER BY tagged_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
});

// POST a new trip tag
app.post("/api/tag", async (req, res) => {
  const { user_id, location, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO trip_tags (user_id, location, description) VALUES ($1, $2, $3) RETURNING *",
      [user_id, location, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save tag" });
  }
});

app.listen(port, () => {
  console.log(`TripTag backend running on port ${port}`);
});
