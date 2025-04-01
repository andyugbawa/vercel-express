const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");




mongoose
  .connect("mongodb://127.0.0.1:27017/movieState ", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));







app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"))



app.get("/",(req,res)=>{
    res.render("home")
})



app.listen(4001,()=>{
    console.log("APP RUNING ON 4001")
})