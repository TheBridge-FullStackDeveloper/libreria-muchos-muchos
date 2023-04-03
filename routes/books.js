const express = require("express");
const BookController = require("../controllers/BookController");
const router = express.Router();

router.post("/create", BookController.insert);
router.get("/getAll", BookController.getAll);
router.delete("/delete/:id", BookController.delete);
router.put("/update/:id", BookController.update);

module.exports = router;
