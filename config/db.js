const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./bookstore.db", (err) => {
  if (err) {
    console.error("Error opening database", err.message);
  } else {
    console.log("✅ Connected to SQLite database");
  }
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    mobile TEXT UNIQUE,
    otp TEXT,
    otp_expiry INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    published_year INTEGER,
    price REAL
  )`);
});

module.exports = db;