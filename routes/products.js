

const express = require("express");
const router = express.Router();
const db = require("../config/db");

let cache = null;
let expires = 0;
const CACHE_TTL = (process.env.PRODUCTS_CACHE_TTL_SEC || 30) * 1000;

router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";
    const category = req.query.category || "";
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 10);
    const offset = (page - 1) * limit;

    const cacheKey = JSON.stringify({ search, category, page, limit });

    if (cache && cache.key === cacheKey && Date.now() < expires) {
      return res.json(cache.data);
    }

  
    let where = "WHERE 1=1";
    const params = [];

    if (search.trim() !== "") {
      where += " AND (name LIKE ? OR short_desc LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category.trim() !== "") {
      where += " AND category = ?";
      params.push(category);
    }
    const countRow = await db.getAsync(
      `SELECT COUNT(*) AS total FROM products ${where}`,
      params
    );

    const total = countRow.total;
    const totalPages = Math.ceil(total / limit);

    const rows = await db.allAsync(
      `
      SELECT id, name, category, short_desc, price, image_url
      FROM products
      ${where}
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    const response = {
      meta: { total, page, limit, totalPages },
      products: rows,
    };

    cache = { key: cacheKey, data: response };
    expires = Date.now() + CACHE_TTL;

    res.json(response);

  } catch (error) {
    console.error("Products list error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const rows = await db.allAsync(
      "SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category"
    );

    res.json(rows.map((r) => r.category));
  } catch (error) {
    console.error("Category list error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const row = await db.getAsync(
      "SELECT * FROM products WHERE id = ?",
      [req.params.id]
    );

    if (!row) return res.status(404).json({ error: "Product not found" });

    res.json(row);

  } catch (error) {
    console.error("Product fetch error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
