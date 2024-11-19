import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import pkg from "pg";

const { Pool } = pkg;

// Ortam değişkenlerini yükle
dotenv.config();

// PostgreSQL bağlantısı
const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
});

// Bağlantıyı kontrol et
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("Connected to PostgreSQL");
  release();
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Basit bir GET endpoint
app.get("/", (req, res) => {
  res.send("API is working!");
});

// Tüm gönderileri al
app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send("An error occurred while fetching posts");
  }
});

// Yeni gönderi oluştur
app.post("/posts", async (req, res) => {
  const { author, title, content, cover } = req.body;

  // Verilerin eksik olup olmadığını kontrol et
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
    console.error("Error creating post:", error);
    res.status(500).send("An error occurred while creating the post.");
  }
});

// Belirli bir gönderiyi al
app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).send("Post not found.");
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).send("An error occurred while fetching the post.");
  }
});

// Belirli bir gönderiyi güncelle
app.put("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { author, title, content, cover } = req.body;

  // En az bir alanın dolu olduğundan emin ol
  if (!title && !content && !cover && !author) {
    return res.status(400).send("At least one field is required to update.");
  }

  try {
    const result = await pool.query(
      "UPDATE posts SET author = COALESCE($1, author), title = COALESCE($2, title), content = COALESCE($3, content), cover = COALESCE($4, cover) WHERE id = $5 RETURNING *",
      [author, title, content, cover, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Post not found.");
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).send("An error occurred while updating the post.");
  }
});

// Belirli bir gönderiyi sil
app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM posts WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Post not found.");
    }
    res.send("Post deleted successfully.");
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send("An error occurred while deleting the post.");
  }
});
// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default pool;
