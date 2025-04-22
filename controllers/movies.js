const Film = require("../models/movie");
module.exports.index = async(req,res)=>{
    const movies = await Film.find({})
    res.render("movie/index",{movies})
};

module.exports.newForm = (req,res)=>{
    res.render("movie/new")
};

module.exports.createMovie = async(req,res,next)=>{
    const movie = new Film(req.body.movie)
    movie.author = req.user._id;
    await movie.save()
    req.flash("success","SUCCESSFULY CREATED A NEW MOVIE!!!")
    res.redirect(`/movie/${movie._id}`)
}

module.exports.showMovie = async(req,res)=>{
  const movie = await Film.findById(req.params.id).populate({
    path:"reviews",
    populate:{
      path:"author"
    }
  }).populate("author");
  console.log(movie)
    
  res.render("movie/show",{movie})
}
module.exports.renderEditForm = async(req,res)=>{
  const movie = await Film.findById(req.params.id);
  if(!movie){
    req.flash("error", "CANNOT FIND MOVIE")
    return res.redirect("/movie")
  }
  res.render("movie/edit",{movie})
}

module.exports.updateMovie = async(req,res)=>{
  const{id}=req.params;
  const movie = await Film.findByIdAndUpdate(id, {...req.body.movie})
  req.flash("success", "SUCCESSFULLY UPDATED MOVIE")
  res.redirect(`/movie/${movie._id}`)
}

module.exports.deleteMovie = async(req,res)=>{
    const{id}=req.params
     await Film.findByIdAndDelete(id)
     req.flash("success","SUCCESSFULLY DELETED A MOVIE")
     res.redirect("/movie")
  }