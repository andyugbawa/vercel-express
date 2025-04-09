require("dotenv").config();
// console.log("MONGO_URI:", process.env.MONGO_URI);

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Film = require("./models/movie");
const methodOverride = require("method-override");
const Joi = require("joi");
const {movieSchema}=require("./schema.js")
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");


// const MONGO_URI = process.env.VERCEL_ENV === 'production'
// ? process.env.MONGO_URI_PROD
// : process.env.MONGO_URI_PROD;


    
// if (!process.env.MONGO_URI) {
//   console.error("❌ MONGO_URI is missing in environment variables!");
//   process.exit(1); // Stop the app if MONGO_URI is missing
// }



const MONGO_URI="mongodb+srv://andyugbawa:hero@cluster0.9fppg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"



  
mongoose.connect(MONGO_URI, {
  dbName: "moviestatetwo",

})
.then(() => console.log("✅ Connected to MongoDB successfully!"))
.catch(err => {
  console.error("❌ MongoDB Connection Error:", err);
  process.exit(1);
});








const absolutepath = path.join(__dirname, "./public");
app.use(express.static(absolutepath));
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(methodOverride("_method"))

const validateMovie = (req,res,next)=>{
 
  const {error} = movieSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el=>el.message).join(",")
    throw new ExpressError(msg,400)
  }else{
    next();
  }
}

// app.get("/",(req,res)=>{
//     res.render("home")
// })

app.get("/",catchAsync(async(req,res)=>{
    const movies = await Film.find({})
    res.render("movie/index",{movies})
    // res.render("movie/index")
}));

app.get("/movie/new",(req,res)=>{
  res.render("movie/new")
  // res.send("New")
})

app.post("/movie",validateMovie,catchAsync(async(req,res,next)=>{
  // if(!req.body.movie) throw new ExpressError("Invalid movie Data", 404)
    const movie = new Film(req.body.movie)
    await movie.save()
    res.redirect(`/movie/${movie._id}`)

 
}))




app.get("/movie/:id",catchAsync(async(req,res)=>{
  const movie = await Film.findById(req.params.id)
  res.render("movie/show",{movie})
}))

app.get("/movie/:id/edit",catchAsync(async(req,res)=>{
  const movie = await Film.findById(req.params.id)
  res.render("movie/edit",{movie})
}));

app.put("/movie/:id",validateMovie,catchAsync(async(req,res)=>{
  const{id}=req.params
  const movie = await Film.findByIdAndUpdate(id, {...req.body.movie})
  res.redirect(`/movie/${movie._id}`)
}));

app.delete("/movie/:id",catchAsync(async(req,res)=>{
  const{id}=req.params
   await Film.findByIdAndDelete(id)
  res.redirect("/")
}));

app.all("*",(req,res,next)=>{
  next(new ExpressError("Page Not Found",404))
})

app.use((err,req,res,next)=>{
  const { statusCode= 500}= err;
  if(!err.message) err.message = "SOMETHING WENT WRONG"
  res.status (statusCode).render("error",{err});

})


app.listen(4001,()=>{
    console.log("APP RUNING ON 4001")
})