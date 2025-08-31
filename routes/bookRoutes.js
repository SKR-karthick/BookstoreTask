const express = require("express");
const router = express.Router();
const { createBook, getBooks, getBookById, updateBook, deleteBook } = require("../controllers/bookController");
const auth = require("../middleware/authMiddleware");

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", auth, createBook);
router.put("/:id", auth, updateBook);
router.delete("/:id", auth, deleteBook);

module.exports = router;