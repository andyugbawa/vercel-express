const User = require("../models/user");
const passport = require("passport");

module.exports.renderRegister = (req,res)=>{
    res.render("users/register")
 }
 module.exports.register = async(req,res,next)=>{
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
 }

 module.exports.renderLogin = (req,res)=>{
    res.render("users/login")
 }

 module.exports.login =  (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      
      if (!user) {
        // User not found or password incorrect
        req.flash("error", "Invalid credentials. Don’t have an account? Register below.");
        return res.redirect("/register");
      }
  
      req.login(user, (err) => {
        if (err) return next(err);
        req.flash("success", `WELCOME BACK, ${user.username.toUpperCase()}`);
        const redirectUrl = req.session.returnTo || "/movie";
        delete req.session.returnTo;
        return res.redirect(redirectUrl);
      });
    })(req, res, next);
  }


  module.exports.logout = (req, res, next) => {
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
 }