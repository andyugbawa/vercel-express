const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");

router.get("/register",(req,res)=>{
   res.render("users/register")
})

router.post("/register",catchAsync(async(req,res,next)=>{
   try{
      const {email,username,password} = req.body;
      const user = new User({email,username})
      const registeredUser = await User.register(user,password);
      req.login(registeredUser,err=>{
         if(err)return next(err)
            console.log(registeredUser);
            req.flash("success",`WELCOME, ${registeredUser.username.toUpperCase()}`)
            res.redirect("/movie")
      })
   }catch(e){
      req.flash("error",e.message);
      res.redirect("/register")
   }
}));

router.get("/login",(req,res)=>{
   res.render("users/login")
})

router.post("/login",passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),(req,res)=>{
 req.flash("success", `WELCOME BACK, ${req.user.username.toUpperCase()}`);
 const redirectUrl = req.session.returnTo || "/movie";
 delete req.session.returnTo
 res.redirect(redirectUrl)
});

// router.get("/logout", (req, res, next) => {
//    req.logout(function(err) {
//        if (err) { return next(err); }
//        req.flash("success", "Goodbye");
//        res.redirect("/movie");
//    });
// });

router.get("/logout", (req, res, next) => {
   const username = req.user?.username; // Get the username before logout

   req.logout(function(err) {
       if (err) return next(err);

       if (username) {
           req.flash("success", `GOODBYE, ${username.toUpperCase()}!`);
       } else {
           req.flash("success", "GOODBYE!");
       }

       res.redirect("/movie");
   });
});




module.exports = router;