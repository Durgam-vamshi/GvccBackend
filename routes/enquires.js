

const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { enquiryValidationRules, handleValidation } = require("../utils/validation");
const { adminAuth, auth } = require("../middlewares/auth");


router.post(
  "/",
  auth,
  enquiryValidationRules(),
  handleValidation,
  async (req, res) => {
    try {
      const { product_id, name, email, phone, message } = req.body;

      const result = await db.runAsync(
        `INSERT INTO enquiries (product_id, name, email, phone, message)
         VALUES (?, ?, ?, ?, ?)`,
        [product_id || null, name, email, phone, message]
      );

      res.status(201).json({
        id: result.id,
        message: "Enquiry submitted",
      });
    } catch (error) {
      console.error("Enquiry Insert Error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);


router.get("/", adminAuth, async (req, res) => {
  try {
    const rows = await db.allAsync(
      `
      SELECT e.*, p.name AS product_name
      FROM enquiries e
      LEFT JOIN products p ON e.product_id = p.id
      ORDER BY e.created_at DESC
      `
    );

    res.json({ enquiries: rows });
  } catch (error) {
    console.error("Enquiry Fetch Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
