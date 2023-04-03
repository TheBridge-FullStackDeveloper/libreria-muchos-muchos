const express = require("express")
const GenreController = require("../controllers/GenreController")
const router = express.Router()

router.post("/create",GenreController.insert)

module.exports = router;