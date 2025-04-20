const mongoose = require("mongoose");
const Film = require("./models/movie")

const AUTHOR_ID = new mongoose.Types.ObjectId("6805491b38d2db0391748d1b");

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
        year:2009,
        author: AUTHOR_ID
    },
    {
        title:"Super flash",
        genre:"thriller",
        year:2010,
        author: AUTHOR_ID
    },
    {
        title:"space cadet",
        genre:"drama",
        year:2023,
        author: AUTHOR_ID
    },
    {
        title:"mufasa",
        genre:"action",
        year:2024,
        author: AUTHOR_ID
    },
    
  ]

  Film.insertMany(seedFilm)
  .then(res=>{
    console.log(res)
  }).catch(e=>{
    consoe.log(e)
  })
  db.films.updateMany(
    { author: { $exists: false } },
    { $set: { author: ObjectId("6805491b38d2db0391748d1b") } }
  )
  
  