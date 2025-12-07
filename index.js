require('dotenv').config();
const express = require('express');
const cors = require('cors');

const products = require('./routes/products');;
const enquiries = require('./routes/enquires');

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/products', products);

app.use('/api/enquiries', enquiries);

app.get('/', (req, res) => res.json({ message: "API running" }));

app.listen(process.env.PORT || 3001, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
