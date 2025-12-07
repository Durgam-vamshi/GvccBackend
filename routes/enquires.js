const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { enquiryValidationRules, handleValidation } = require('../utils/validation');
const { adminAuth, auth } = require('../middlewares/auth');

router.post('/', auth, enquiryValidationRules(), handleValidation, async (req, res) => {
  try {
    const { product_id, name, email, phone, message } = req.body;

    const [result] = await pool.query(
      `INSERT INTO enquiries (product_id, name, email, phone, message)
       VALUES (?, ?, ?, ?, ?)`,
      [product_id || null, name, email, phone, message]
    );

    res.status(201).json({ id: result.insertId, message: "Enquiry submitted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get('/', adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, p.name AS product_name
      FROM enquiries e
      LEFT JOIN products p ON e.product_id = p.id
      ORDER BY e.created_at DESC
    `);

    res.json({ enquiries: rows });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
