const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users")
const passport = require("passport");


router.route("/register")
.get(users.renderRegister)
.post(catchAsync(users.register));


 router.route("/login")
 .get(users.renderLogin)
 .post(users.login);


 router.get("/logout", users.logout);










// router.post("/login",passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),(req,res)=>{
//  req.flash("success", `WELCOME BACK, ${req.user.username.toUpperCase()}`);
//  const redirectUrl = req.session.returnTo || "/movie";
//  delete req.session.returnTo
//  res.redirect(redirectUrl)
// });


 

// router.get("/logout", (req, res, next) => {
//    req.logout(function(err) {
//        if (err) { return next(err); }
//        req.flash("success", "Goodbye");
//        res.redirect("/movie");
//    });
// });






module.exports = router;