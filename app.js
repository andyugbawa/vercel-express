require("dotenv").config();
// console.log("MONGO_URI:", process.env.MONGO_URI);

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Film = require("./models/movie");
const methodOverride = require("method-override")




mongoose
  .connect("mongodb+srv://andyugbawa:hero@cluster0.9fppg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{dbName:"moviestate"} 
   
  )
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));







app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))



// app.get("/",(req,res)=>{
//     res.render("home")
// })

app.get("/",async(req,res)=>{
    const movies = await Film.find({})
    res.render("movie/index",{movies})
    // res.render("movie/index")
});

app.get("/movie/new",(req,res)=>{
  res.render("movie/new")
  // res.send("New")
})

app.post("/movie",async(req,res)=>{
  const movie = new Film(req.body.movie)
  await movie.save()
  res.redirect(`/movie/${movie._id}`)
})

app.get("/movie/:id",async(req,res)=>{
  const movie = await Film.findById(req.params.id)
  res.render("movie/show",{movie})
})

app.get("/movie/:id/edit",async(req,res)=>{
  const movie = await Film.findById(req.params.id)
  res.render("movie/edit",{movie})
});

app.put("/movie/:id",async(req,res)=>{
  const{id}=req.params
  const movie = await Film.findByIdAndUpdate(id, {...req.body.movie})
  res.redirect(`/movie/${movie._id}`)
});

// app.delete("/movie/:id",async(req,res)=>{
//   const{id}=req.params
//    await Film.findByIdAndDelete(id)
//   res.redirect("/")
// })


app.listen(4001,()=>{
    console.log("APP RUNING ON 4001")
})