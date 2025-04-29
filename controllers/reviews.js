const Review = require("../models/review");
const Film = require("../models/movie");

module.exports.createReview = async(req,res)=>{
   const movie = await Film.findById(req.params.id)
   const review = new Review(req.body.review)
   review.author = req.user._id;
   movie.reviews.push(review)
   await review.save();
   await movie.save()
   req.flash("success","Created A  New Review")
     res.redirect(`/movie/${movie._id}`)
}

module.exports.deleteReview = async(req,res)=>{
    const {id,reviewId} = req.params;
    await Film.findByIdAndUpdate(id,{$pul:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","Successfully Deleted A Review")
    res.redirect(`/movie/${id}`)
  }
