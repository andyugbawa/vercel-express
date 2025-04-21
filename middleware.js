const ExpressError = require("./utils/ExpressError");
const {movieSchema,reviewSchema} = require("./schema.js");
const Film = require("./models/movie");
const Review = require("./models/review")

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash("error","You Must be Signed In First");
       return res.redirect("/login")
      }
      next()
}


module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


module.exports.isAuthor = async(req,res,next)=>{
  const {id}= req.params;
  const movie  = await Film.findById(id);
  if(!movie.author.equals(req.user._id)){
    req.flash("error","YOU DO NOT HAVE PERMISSION TO EDIT THIS MOVIE")
    return res.redirect(`/movie/${id}`)
  }
  next();
}

// module.exports.isReviewAuthor = async(req,res,next)=>{
//   const {id,reviewId}= req.params;
//   const review  = await Review.findById(reviewId);
//   if(!review.author.equals(req.user._id)){
//     req.flash("error","YOU DO NOT HAVE PERMISSION TO EDIT THIS MOVIE")
//     return res.redirect(`/movie/${id}`)
//   }
//   next();
// }

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    
    if (!review) {
      req.flash("error", "Review not found.");
      return res.redirect(`/movie/${id}`);
    }
  
    if (!review.author.equals(req.user._id)) {
      req.flash("error", "YOU DO NOT HAVE PERMISSION TO EDIT THIS REVIEW");
      return res.redirect(`/movie/${id}`);
    }
  
    next();
  };
  

module.exports.validateMovie = (req,res,next)=>{
  const {error} = movieSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el=>el.message).join(",")
    throw new ExpressError(msg,400)
  }else{
    next();
  }
}


module.exports.validateReview= (req,res,next)=>{
  const {error} =reviewSchema.validate(req.body)
  if(error){
    const msg = error.details.map(el=>el.message).join(",")
    throw new ExpressError(msg,400)
  }else{
    next();
  }
}
