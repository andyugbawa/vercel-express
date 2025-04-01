const mongoose = require("mongoose");
const Film = require("./models/movie")

mongoose
  .connect("mongodb://127.0.0.1:27017/movieState ", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));


const seedFilm = [
    {
        title:"Hard Corp",
        genre:"action",
        year:2009
    },
    {
        title:"Super flash",
        genre:"thriller",
        year:2010
    },
    {
        title:"space cadet",
        genre:"drama",
        year:2023
    },
    {
        title:"mufasa",
        genre:"action",
        year:2024
    },
    
  ]

  Film.insertMany(seedFilm)
  .then(res=>{
    console.log(res)
  }).catch(e=>{
    consoe.log(e)
  })