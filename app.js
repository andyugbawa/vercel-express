const express = require("express");
const app = express();


app.get("/",(req,res)=>{
    res.send("HELLO WORLD")
})



app.listen(4001,()=>{
    console.log("APP RUNING ON 4001")
})