const express = require("express");
const router = express.Router({mergeParams:true});
const catchAsync = require("../utils/catchAsync");
const Film = require("../models/movie");
const Review = require("../models/review")
const ExpressError = require("../utils/ExpressError");
const {reviewSchema}=require("../schema.js") 



const validateReview= (req,res,next)=>{
  const {error} =reviewSchema.validate(req.body)
  if(error){
    const msg = error.details.map(el=>el.message).join(",")
    throw new ExpressError(msg,400)
  }else{
    next();
  }
}





router.post("/",validateReview,catchAsync(async(req,res)=>{
   const movie = await Film.findById(req.params.id)
   const review = new Review(req.body.review)
   movie.reviews.push(review)
   await review.save();
   await movie.save()
   req.flash("success","CREATED A  NEW REVIEW")
     res.redirect(`/movie/${movie._id}`)
}))

router.delete("/:reviewId",catchAsync(async(req,res)=>{
  const {id,reviewId} = req.params;
  await Film.findByIdAndUpdate(id,{$pul:{reviews:reviewId}})
  await Review.findByIdAndDelete(reviewId)
  req.flash("success","SUCCESSFULLY DELETED A REVIEW")
  res.redirect(`/movie/${id}`)
}))

module.exports = router;
