import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import pkg from "pg";

const { Pool } = pkg;

dotenv.config();

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// PostgreSQL connection
try {
  pool.connect((err, client, release) => {
    if (err) {
      console.error("Error acquiring client", err.stack);
      process.exit(1);
    } else {
      console.log("Connected to PostgreSQL");
      release();
    }
  });
} catch (error) {
  console.error("Unexpected error during connection initialization:", error);
  process.exit(1);
}

// Error Handling
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Test 
app.get("/", (req, res) => {
  res.send("API is working!");
});

// CRUD 
app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (error) {
    console.error(`[Error - GET /posts]:`, error.message);
    res.status(500).send({ error: "Internal server error", details: error.message });
  }
});

app.get("/posts/:id", async (req, res) => {
  const { id } = req.params; 
  try {
    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id]); 
    if (result.rows.length === 0) {
      return res.status(404).send("Post not found"); 
    }
    res.json(result.rows[0]); 
  } catch (error) {
    console.error(`[Error - GET /posts/:id]:`, error.message);
    res.status(500).send({ error: "Internal server error", details: error.message });
  }
});

app.post("/posts", async (req, res) => {
  const { author, title, content, cover } = req.body;
  if (!title || !content || !cover) {
    return res.status(400).send("Title, content, and cover are required.");
  }
  try {
    const result = await pool.query(
      "INSERT INTO posts (author, title, content, cover) VALUES ($1, $2, $3, $4) RETURNING *",
      [author, title, content, cover]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(`[Error - POST /posts]:`, error.message);
    res.status(500).send({ error: "Internal server error", details: error.message });
  }
});

app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM posts WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).send("Post not found.");
    }
    res.json({ message: "Post deleted successfully.", deletedPost: result.rows[0] });
  } catch (error) {
    console.error(`[Error - DELETE /posts/:id]:`, error.message);
    res.status(500).send({ error: "Internal server error", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default pool;
