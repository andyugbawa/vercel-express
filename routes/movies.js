const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Film = require("../models/movie");
const {movieSchema} = require("../schema.js");
const {isLoggedIn} = require("../middleware") 

const validateMovie = (req,res,next)=>{
  const {error} = movieSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el=>el.message).join(",")
    throw new ExpressError(msg,400)
  }else{
    next();
  }
}



router.get("/",catchAsync(async(req,res)=>{
    const movies = await Film.find({})
    res.render("movie/index",{movies})
}));

router.get("/new",isLoggedIn,(req,res)=>{
  res.render("movie/new")
})

router.post("/",isLoggedIn,validateMovie,catchAsync(async(req,res,next)=>{
    const movie = new Film(req.body.movie)
    await movie.save()
    req.flash("success","Successfully created a New Movie!!!")
    res.redirect(`/movie/${movie._id}`)
}))

router.get("/:id",catchAsync(async(req,res)=>{
  const movie = await Film.findById(req.params.id).populate("reviews")
  res.render("movie/show",{movie})
}))

router.get("/:id/edit",isLoggedIn,catchAsync(async(req,res)=>{
  const movie = await Film.findById(req.params.id)
  res.render("movie/edit",{movie})
}));

router.put("/:id",isLoggedIn,validateMovie,catchAsync(async(req,res)=>{
  const{id}=req.params
  const movie = await Film.findByIdAndUpdate(id, {...req.body.movie})
  res.redirect(`/movie/${movie._id}`)
}));

router.delete("/:id",isLoggedIn,catchAsync(async(req,res)=>{
  const{id}=req.params
   await Film.findByIdAndDelete(id)
   req.flash("success","Succesfully Deleted a Movie")
   res.redirect("/movie")
}));

module.exports = router;