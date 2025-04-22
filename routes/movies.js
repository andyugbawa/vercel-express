const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const movies = require("../controllers/movies")
const ExpressError = require("../utils/ExpressError");
const Film = require("../models/movie");
const {movieSchema} = require("../schema.js");
const {isLoggedIn,isAuthor,validateMovie} = require("../middleware") 




router.route("/")
  .get(catchAsync(movies.index))
  .post(isLoggedIn,validateMovie,catchAsync(movies.createMovie))


   router.get("/new",isLoggedIn,movies.newForm)

router.route("/:id")
   .get(catchAsync(movies.showMovie))
   .put(isLoggedIn,isAuthor,validateMovie,catchAsync(movies.updateMovie))
   .delete(isLoggedIn,isAuthor,catchAsync(movies.deleteMovie))


router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(movies.renderEditForm));


module.exports = router;




