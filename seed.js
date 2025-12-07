const db = require("./config/db");

async function seed() {
  try {
    console.log("Seeding database...");

    // ===== CREATE TABLES IF NOT EXIST =====
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT,
        short_desc TEXT,
        long_desc TEXT,
        price REAL,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
      )
    `);

    // ===== CLEAR OLD DATA =====
    await db.runAsync("DELETE FROM enquiries");
    await db.runAsync("DELETE FROM products");
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name='products'");
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name='enquiries'");

    // ===== INSERT SAMPLE PRODUCTS =====

    const products = [
      ["Modern Luxury Sofa", "Furniture", "Premium 3-seater sofa", "A high-quality luxury sofa with soft cushions and durable fabric.", 19999, "https://images.unsplash.com/photo-1586023492125-27b2c045efd7"],
      ["Ergonomic Office Chair", "Furniture", "Comfortable office chair", "Ergonomic design with lumbar support, ideal for long working hours.", 7999, "https://images.unsplash.com/photo-1586201375761-83865001e31b"],
      ["Smart LED TV 55-inch", "Electronics", "4K Ultra HD TV", "Smart LED TV with HDR10+ and full app support.", 38999, "https://images.unsplash.com/photo-1587829741301-dc798b82b9b0"],
      ["Bluetooth Headphones", "Electronics", "Noise cancellation headphones", "High-quality noise cancellation for music and calls.", 3499, "https://images.unsplash.com/photo-1518441380016-454864b6fa7a"],
      ["Gaming Laptop Pro", "Computers", "High performance laptop", "NVIDIA RTX graphics, 16GB RAM, 1TB SSD.", 89999, "https://images.unsplash.com/photo-1517336714731-489689fd1ca8"],
      ["Wooden Dining Table", "Furniture", "6-seater dining table", "Solid wood table with premium finish.", 24999, "https://images.unsplash.com/photo-1555041469-a586c61ea9bc"],
      ["Smartphone X200", "Mobiles", "Flagship smartphone", "AMOLED display, 108MP camera, 5G connectivity.", 29999, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"],
      ["Wireless Earbuds", "Mobiles", "Deep bass earbuds", "Compact earbuds with 24-hour battery life.", 1999, "https://images.unsplash.com/photo-1585386959984-a4155223166f"],
      ["DSLR Camera Pro", "Electronics", "Professional camera", "24MP DSLR with interchangeable lenses.", 55999, "https://images.unsplash.com/photo-1519183071298-a2962be96c85"],
      ["Running Shoes", "Sports", "High comfort sports shoes", "Lightweight running shoes with superior cushioning.", 2999, "https://images.unsplash.com/photo-1528701800489-20be3c5e9a09"],
      ["Air Purifier Max", "Home Appliances", "Anti-pollution purifier", "HEPA filter removes 99.9% pollutants.", 9999, "https://images.unsplash.com/photo-1606813907291-35243e1a20e8"],
      ["Refrigerator 350L", "Home Appliances", "Double door fridge", "Energy-efficient refrigerator with inverter cooling.", 27999, "https://images.unsplash.com/photo-1580910051074-dc05e9b1901f"],
      ["Microwave Oven", "Home Appliances", "20L smart oven", "Auto-cook menus with digital display.", 6999, "https://images.unsplash.com/photo-1606817073278-3cc7ab8c0f56"],
      ["Luxury Watch", "Accessories", "Premium wristwatch", "Stainless steel body with sapphire glass.", 11999, "https://images.unsplash.com/photo-1523275335684-37898b6baf30"],
      ["Sports Backpack", "Accessories", "Durable travel backpack", "Waterproof material with multiple compartments.", 1499, "https://images.unsplash.com/photo-1514473656314-56e39c00a12b"],
      ["Kitchen Knife Set", "Home & Kitchen", "6-piece knife set", "Stainless steel knives with ergonomic grips.", 1299, "https://images.unsplash.com/photo-1586201375754-442a1fbf6365"],
      ["Electric Kettle", "Home Appliances", "1.7L fast-boil kettle", "Auto-shutoff and stainless steel body.", 2499, "https://images.unsplash.com/photo-1564767609342-620cb19b2357"],
      ["Bluetooth Speaker", "Electronics", "Portable speaker", "Deep bass, waterproof body, 12-hour battery.", 1599, "https://images.unsplash.com/photo-1585386959984-a4155223166f"],
      ["Study Table", "Furniture", "Compact wooden study desk", "Ideal for students and work-from-home setups.", 4599, "https://images.unsplash.com/photo-1616594039964-8e79fba399de"],
      ["Ceiling Fan Deluxe", "Home Appliances", "High-speed ceiling fan", "Silent motor with 5-star energy rating.", 1899, "https://images.unsplash.com/photo-1593508512255-86ab42a8e620"]
    ];

    for (const p of products) {
      await db.runAsync(
        `INSERT INTO products (name, category, short_desc, long_desc, price, image_url)
         VALUES (?, ?, ?, ?, ?, ?)`,
        p
      );
    }

    // ===== INSERT SAMPLE ENQUIRIES =====
    const enquiries = [
      [1, 'Rahul Sharma', 'rahul@example.com', '9876543210', 'I want to know the dimensions of this sofa.'],
      [3, 'Amit Verma', 'amitv@example.com', '9955441122', 'Is the 55-inch smart TV available in stock?'],
      [5, 'Sara Khan', 'sara.khan@example.com', '9822113344', 'Does this laptop include warranty?'],
      [7, 'John Mathew', 'john@test.com', '9000011111', 'Is the smartphone available in blue color?'],
      [2, 'Ravi Teja', 'ravi99@example.com', '8999988888', 'Does the chair come with arm support?']
    ];

    for (const e of enquiries) {
      await db.runAsync(
        `INSERT INTO enquiries (product_id, name, email, phone, message)
         VALUES (?, ?, ?, ?, ?)`,
        e
      );
    }

    console.log("✔ Seeding Completed");
    process.exit();

  } catch (err) {
    console.error("SEED ERROR:", err);
    process.exit(1);
  }
}

seed();
