require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Film = require("./models/movie");
const methodOverride = require("method-override");
const Review = require("./models/review")
const Joi = require("joi");
const {movieSchema,reviewSchema}=require("./schema.js")
const catchAsync = require("./utils/catchAsync");
const session  =require("express-session")
const flash = require("connect-flash")
const ExpressError = require("./utils/ExpressError");
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/user");
const MongoStore = require('connect-mongo');


const userRoutes = require("./routes/users")
const moviesRoutes = require("./routes/movies");
const reviewsRoutes = require("./routes/reviews")




// const MONGO_URI = process.env.VERCEL_ENV === 'production'
// ? process.env.MONGO_URI_PROD
// : process.env.MONGO_URI_DEV;

const isProduction = process.env.VERCEL_ENV === 'production';


const MONGO_URI = isProduction
  ? process.env.MONGO_URI_PROD
  : process.env.MONGO_URI_DEV;

 
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in environment variables!");
  process.exit(1);
}
console.log("Using Mongo URI:", MONGO_URI);

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





// const sessionConfig = {
//   secret: "thisshouldbeabettersecrete", // ✅ correct key
//   resave: false,
//   saveUninitialized: true,
//   httpOnly:true,
//   secure:isProduction,
//   sameSite: 'lax',
//   cookie:{
//     expires: Date.now() + 1000*60*60*24*7,
//     maxAge:1000*60*60*24*7,
//   }
// }

const sessionConfig = {
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
  name: 'session',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax', 
      maxAge: 1000 * 60 * 60 * 24 * 7 
  }
};



app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  console.log(req.session)
  res.locals.currentUser = req.user;
 res.locals.success = req.flash("success");
 res.locals.error = req.flash("error");
 next();
})

app.use("/",userRoutes);
app.use("/movie", moviesRoutes);
app.use("/movie/:id/review",reviewsRoutes)

app.get("/",(req,res)=>{
  res.redirect('/movie');
})

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