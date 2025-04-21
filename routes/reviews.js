const express = require("express");
const router = express.Router({mergeParams:true});
const catchAsync = require("../utils/catchAsync");
const Film = require("../models/movie");
const Review = require("../models/review")
const ExpressError = require("../utils/ExpressError");
const {validateReview,isLoggedIn,isReviewAuthor}= require("../middleware")
const {reviewSchema}=require("../schema.js") 







router.post("/",isLoggedIn,validateReview,catchAsync(async(req,res)=>{
   const movie = await Film.findById(req.params.id)
   const review = new Review(req.body.review)
   review.author = req.user._id;
   movie.reviews.push(review)
   await review.save();
   await movie.save()
   req.flash("success","CREATED A  NEW REVIEW")
     res.redirect(`/movie/${movie._id}`)
}))

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,catchAsync(async(req,res)=>{
  const {id,reviewId} = req.params;
  await Film.findByIdAndUpdate(id,{$pul:{reviews:reviewId}})
  await Review.findByIdAndDelete(reviewId)
  req.flash("success","SUCCESSFULLY DELETED A REVIEW")
  res.redirect(`/movie/${id}`)
}))

module.exports = router;
