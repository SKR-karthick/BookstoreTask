const express = require("express");
const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/books", bookRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));



// // Reset DB Route (for demo only)
// app.post("/reset-db", (req, res) => {
//   db.serialize(() => {
//     db.run("DROP TABLE IF EXISTS books", (err) => {
//       if (err) {
//         console.error("Error dropping books table:", err.message);
//         return res.status(500).json({ error: "Failed to reset database" });
//       }
//       db.run(`CREATE TABLE books (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         title TEXT NOT NULL,
//         author TEXT NOT NULL,
//         published_year INTEGER,
//         price REAL
//       )`, (err) => {
//         if (err) {
//           console.error("Error creating books table:", err.message);
//           return res.status(500).json({ error: "Failed to reset database" });
//         }
//         res.json({ message: "✅ Database reset successfully, IDs will now start from 1" });
//       });
//     });
//   });
// });