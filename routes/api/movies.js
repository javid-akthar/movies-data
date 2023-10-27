const express = require("express");
const router = express.Router();

const moviesController = require("../../controllers/api/movies_controller");

router.get("/search", moviesController.search);
router.get("/favourites", moviesController.favourite);
module.exports = router;
