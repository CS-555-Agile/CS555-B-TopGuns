const express = require("express");
const router = express.Router();


router.route("/").get(async (req, res) => {
    try {
        if (!req.session.user?.verified || req.session.user.category!="patient") {
          return res.render("home/homePage",{
            title: "Home",
            partial: "home-script",
            css: "home-css",
            doctor:true
          });
        } 
        else {
          
          return res
            .status(200)
            .render("entertainment/entertainment", {
              title: "Entertainment",
              partial: "entertainment-script",
              css: "entertainment-css",
              
            });
          
        }
      } 
      catch (err) {
        return res
          .status(err?.status ?? 500)
          .render("auth/signup", {
            title: "Login",
            partial: "signup-script",
            css: "signup-css",
          });
      }


});


router.route("/music").get(async (req, res) => {
  try {
      if (!req.session.user?.verified || req.session.user.category!="patient") {
        return res.render("home/homePage",{
          title: "Home",
          partial: "home-script",
          css: "home-css",
          doctor:true
        });
      } 
      else {
        
        return res
          .status(200)
          .render("entertainment/music", {
            title: "Entertainment",
            partial: "music-script",
            css: "music-css",
            
          });
        
      }
    } 
    catch (err) {
      return res
        .status(err?.status ?? 500)
        .render("auth/signup", {
          title: "Login",
          partial: "signup-script",
          css: "signup-css",
        });
    }


});
router.route("/gallary").get(async (req, res) => {
  try {
      if (!req.session.user?.verified || req.session.user.category!="patient") {
        return res.render("home/homePage",{
          title: "Home",
          partial: "home-script",
          css: "home-css",
          doctor:true
        });
      } 
      else {
        
        return res
          .status(200)
          .render("entertainment/gallary", {
            title: "Entertainment",
            partial: "gallary-script",
            css: "gallary-css",
            
          });
        
      }
    } 
    catch (err) {
      return res
        .status(err?.status ?? 500)
        .render("auth/signup", {
          title: "Login",
          partial: "signup-script",
          css: "signup-css",
        });
    }


});


module.exports = router;
