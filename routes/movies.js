const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Film = require("../models/movie");
const {movieSchema} = require("../schema.js");
const {isLoggedIn,isAuthor,validateMovie} = require("../middleware") 






router.get("/",catchAsync(async(req,res)=>{
    const movies = await Film.find({})
    res.render("movie/index",{movies})
}));

router.get("/new",isLoggedIn,(req,res)=>{
  res.render("movie/new")
})

router.post("/",isLoggedIn,validateMovie,catchAsync(async(req,res,next)=>{
    const movie = new Film(req.body.movie)
    movie.author = req.user._id;
    await movie.save()
    req.flash("success","SUCCESSFULY CREATED A NEW MOVIE!!!")
    res.redirect(`/movie/${movie._id}`)
}))

router.get("/:id",catchAsync(async(req,res)=>{
  const movie = await Film.findById(req.params.id).populate("reviews").populate("author");
  res.render("movie/show",{movie})
}))

router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
  const movie = await Film.findById(req.params.id);
  if(!movie){
    req.flash("error", "CANNOT FIND MOVIE")
    return res.redirect("/movie")
  }
  res.render("movie/edit",{movie})
}));

router.put("/:id",isLoggedIn,isAuthor,validateMovie,catchAsync(async(req,res)=>{
  const{id}=req.params;
  const movie = await Film.findByIdAndUpdate(id, {...req.body.movie})
  req.flash("success", "SUCCESSFULLY UPDATED MOVIE")
  res.redirect(`/movie/${movie._id}`)
}));

router.delete("/:id",isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
  const{id}=req.params
   await Film.findByIdAndDelete(id)
   req.flash("success","SUCCESSFULLY DELETED A MOVIE")
   res.redirect("/movie")
}));

module.exports = router;




