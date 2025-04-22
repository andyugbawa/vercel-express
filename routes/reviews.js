const express = require("express");
const router = express.Router({mergeParams:true});
const catchAsync = require("../utils/catchAsync");
const Film = require("../models/movie");
const Review = require("../models/review")
const reviews = require("../controllers/reviews")
const ExpressError = require("../utils/ExpressError");
const {validateReview,isLoggedIn,isReviewAuthor}= require("../middleware")
const {reviewSchema}=require("../schema.js") 







router.post("/",isLoggedIn,validateReview,catchAsync(reviews.createReview))

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview))

module.exports = router;
