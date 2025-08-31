const db = require("../config/db");

// Create Book
exports.createBook = (req, res) => {
  const { title, author, published_year, price } = req.body;
  db.run(
    `INSERT INTO books (title, author, published_year, price) VALUES (?, ?, ?, ?)`,
    [title, author, published_year, price],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, title, author, published_year, price });
    }
  );
};

// Get Books with Search, Filter & Pagination
exports.getBooks = (req, res) => {
  const { author, title, published_year, price, page = 1, limit = 10 } = req.query;

  let sql = "SELECT * FROM books WHERE 1=1";
  let values = [];

  // ✅ Filters
  if (author) {
    sql += " AND author LIKE ?";
    values.push(`%${author}%`);
  }

  if (title) {
    sql += " AND title LIKE ?";
    values.push(`%${title}%`);
  }

  if (published_year) {
    sql += " AND published_year = ?";
    values.push(Number(published_year));
  }

  if (price){
    sql += " AND price = ? ";
    values.push(Number(price))
  }

  // Pagination
  const offset = (page - 1) * limit;
  sql += " LIMIT ? OFFSET ?";
  values.push(Number(limit), offset);

  db.all(sql, values, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Get book from book ID
exports.getBookById = (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM books WHERE id=?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Book not found" });
    res.json(row);
  });
};


// Update book
exports.updateBook = (req, res) => {
  const { id } = req.params;
  const { title, author, published_year, price } = req.body;

  // Collect fields that are actually provided
  const fields = [];
  const values = [];

  if (title !== undefined) {
    fields.push("title=?");
    values.push(title);
  }
  if (author !== undefined) {
    fields.push("author=?");
    values.push(author);
  }
  if (published_year !== undefined) {
    fields.push("published_year=?");
    values.push(published_year);
  }
  if (price !== undefined) {
    fields.push("price=?");
    values.push(price);
  }

  // If no fields given, return error
  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields provided to update" });
  }

  values.push(id); // last param is id

  const sql = `UPDATE books SET ${fields.join(", ")} WHERE id=?`;

  db.run(sql, values, function (err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book updated successfully" });
  });
};

// delete book
exports.deleteBook = (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM books WHERE id=?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Book deleted" });
  });
};