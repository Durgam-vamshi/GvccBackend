require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require("fs");
const db = require("./config/db");

const products = require('./routes/products');;
const enquiries = require('./routes/enquires');

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());


if (process.argv.includes("--init")) {
  const schema = fs.readFileSync("./init.sql", "utf8");
  db.exec(schema, (err) => {
    if (err) console.error("DB Init Error:", err.message);
    else console.log("Database initialized successfully!");
    process.exit();
  });
}

app.use('/api/auth', authRoutes);

app.use('/api/products', products);

app.use('/api/enquiries', enquiries);

app.get('/', (req, res) => res.json({ message: "API running" }));

app.listen(process.env.PORT || 3001, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
