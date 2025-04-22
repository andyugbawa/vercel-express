const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const movies = require("../controllers/movies")
const ExpressError = require("../utils/ExpressError");
const Film = require("../models/movie");
const {movieSchema} = require("../schema.js");
const {isLoggedIn,isAuthor,validateMovie} = require("../middleware") 






router.get("/",catchAsync(movies.index));

router.get("/new",isLoggedIn,movies.newForm)

router.post("/",isLoggedIn,validateMovie,catchAsync(movies.createMovie))

router.get("/:id",catchAsync(movies.showMovie))

router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(movies.renderEditForm));

router.put("/:id",isLoggedIn,isAuthor,validateMovie,catchAsync(movies.updateMovie));

router.delete("/:id",isLoggedIn,isAuthor,catchAsync(movies.deleteMovie));

module.exports = router;




