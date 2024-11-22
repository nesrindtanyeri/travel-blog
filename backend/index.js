import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

const { Pool } = pkg;

dotenv.config();

if (
  !process.env.PG_HOST ||
  !process.env.PG_PORT ||
  !process.env.PG_DATABASE ||
  !process.env.PG_USER ||
  !process.env.PG_PASSWORD
) {
  console.error(
    "Missing required environment variables for PostgreSQL connection."
  );
  process.exit(1);
}

// PostgreSQL
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

// Test
pool
  .query("SELECT 1")
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => {
    console.error("Error connecting to PostgreSQL:", err.message);
    process.exit(1);
  });

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("API is working!");
});

app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (error) {
    console.error(`[Error - GET /posts]:`, error.message);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

app.get("/posts/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).send("Invalid ID format.");
  }
  try {
    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).send("Post not found.");
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`[Error - GET /posts/:id]:`, error.message);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
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
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

app.put("/posts/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).send("Invalid ID format.");
  }

  const { author, title, content, cover } = req.body;
  if (!author && !title && !content && !cover) {
    return res
      .status(400)
      .json({ error: "At least one field is required to update." });
  }

  try {
    const result = await pool.query(
      "UPDATE posts SET author = COALESCE($1, author), title = COALESCE($2, title), content = COALESCE($3, content), cover = COALESCE($4, cover) WHERE id = $5 RETURNING *",
      [author, title, content, cover, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Post not found.");
    }
    res.json({
      message: `Post with ID ${id} updated successfully!`,
      post: result.rows[0],
    });
  } catch (error) {
    console.error(`[Error - PUT /posts/:id]:`, error.message);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

app.delete("/posts/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).send("Invalid ID format.");
  }
  try {
    const result = await pool.query(
      "DELETE FROM posts WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Post not found.");
    }
    res.json({
      message: "Post deleted successfully.",
      deletedPost: result.rows[0],
    });
  } catch (error) {
    console.error(`[Error - DELETE /posts/:id]:`, error.message);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default pool;
