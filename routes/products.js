const express = require('express');
const router = express.Router();
const pool = require('../config/db');

let cache = null;
let expires = 0;
const CACHE_TTL = (process.env.PRODUCTS_CACHE_TTL_SEC || 30) * 1000;

router.get('/', async (req, res) => {
  try {
    const search = req.query.search || '';
    const category = req.query.category || '';
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 10);
    const offset = (page - 1) * limit;

    const cacheKey = JSON.stringify({ search, category, page, limit });

    if (cache && cache.key === cacheKey && Date.now() < expires) {
      return res.json(cache.data);
    }



    let where = "WHERE 1=1";
const params = [];

if (search && search.trim() !== "") {
  where += " AND (name LIKE ? OR short_desc LIKE ?)";
  params.push(`%${search}%`, `%${search}%`);
}

if (category && category.trim() !== "") {
  where += " AND category = ?";
  params.push(category);
}


    const [[countRow]] = await pool.query(
      `SELECT COUNT(*) as total FROM products ${where}`,
      params
    );

    const total = countRow.total;
    const totalPages = Math.ceil(total / limit);

    const [rows] = await pool.query(
      `SELECT id, name, category, short_desc, price, image_url 
       FROM products 
       ${where} 
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const response = {
      meta: { total, page, limit, totalPages },
      products: rows
    };

    cache = { key: cacheKey, data: response };
    expires = Date.now() + CACHE_TTL;

    res.json(response);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});



router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT DISTINCT category FROM products ORDER BY category"
    );

    res.json(rows.map(r => r.category));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [req.params.id]
    );

    if (!rows.length) return res.status(404).json({ error: "Product not found" });

    res.json(rows[0]);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});






module.exports = router;
