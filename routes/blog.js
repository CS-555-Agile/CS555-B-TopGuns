const express = require("express");
const router = express.Router();


router.route("/").get(async (req, res) => {
    try {
        if (!req.session.user.verified || req.session.user.category!="patient") {
          return res.render("home/homePage",{
            title: "Home",
            partial: "home-script",
            css: "homedoc-css",
            doctor:true
          });
        } 
        else {
          
          return res
            .status(200)
            .render("blog/blog", {
              title: "Blog",
              partial: "blog-script",
              css: "blog-css",
              
            });
          
        }
      } 
      catch (err) {
        return res
          .status(err&&err.status?err.status:500)
          .render("auth/signup", {
            title: "Login",
            partial: "signup-script",
            css: "signup-css",
          });
      }


});


router.route("/display").get(async (req, res) => {
  try {
      if (!req.session.user.verified || req.session.user.category!="patient") {
        return res.render("home/homePage",{
          title: "Home",
          partial: "home-script",
          css: "homedoc-css",
          doctor:true
        });
      } 
      else {
        
        return res
          .status(200)
          .render("blog/blogdisplay", {
            title: "Blog",
            partial: "blogdisplay-script",
            css: "blogdisplay-css",
            
          });
        
      }
    } 
    catch (err) {
      return res
        .status(err&&err.status?err.status:500)
        .render("auth/signup", {
          title: "Login",
          partial: "signup-script",
          css: "signup-css",
        });
    }


});
router.route("/Decoding_Health").get(async (req, res) => {
  try {
      if (!req.session.user.verified || req.session.user.category!="patient") {
        return res.render("home/homePage",{
          title: "Home",
          partial: "home-script",
          css: "homedoc-css",
          doctor:true
        });
      } 
      else {
        
        return res
          .status(200)
          .render("blog/Decoding_Health", {
            title: "Blog",
            partial: "blogdisplay-script",
            css: "blogdisplay-css",
            
          });
        
      }
    } 
    catch (err) {
      return res
        .status(err&&err.status?err.status:500)
        .render("auth/signup", {
          title: "Login",
          partial: "signup-script",
          css: "signup-css",
        });
    }


});
router.route("/migraine").get(async (req, res) => {
  try {
      if (!req.session.user.verified || req.session.user.category!="patient") {
        return res.render("home/homePage",{
          title: "Home",
          partial: "home-script",
          css: "homedoc-css",
          doctor:true
        });
      } 
      else {
        
        return res
          .status(200)
          .render("blog/migraine", {
            title: "Blog",
            partial: "blogdisplay-script",
            css: "blogdisplay-css",
            
          });
        
      }
    } 
    catch (err) {
      return res
        .status(err&&err.status?err.status:500)
        .render("auth/signup", {
          title: "Login",
          partial: "signup-script",
          css: "signup-css",
        });
    }


});
router.route("/selfttoughtblog").get(async (req, res) => {
  try {
      if (!req.session.user.verified || req.session.user.category!="patient") {
        return res.render("home/homePage",{
          title: "Home",
          partial: "home-script",
          css: "homedoc-css",
          doctor:true
        });
      } 
      else {
        
        return res
          .status(200)
          .render("blog/selfttoughtblog", {
            title: "Blog",
            partial: "blogdisplay-script",
            css: "blogdisplay-css",
            
          });
        
      }
    } 
    catch (err) {
      return res
        .status(err&&err.status?err.status:500)
        .render("auth/signup", {
          title: "Login",
          partial: "signup-script",
          css: "signup-css",
        });
    }


});
router.route("/winterblog").get(async (req, res) => {
  try {
      if (!req.session.user.verified || req.session.user.category!="patient") {
        return res.render("home/homePage",{
          title: "Home",
          partial: "home-script",
          css: "homedoc-css",
          doctor:true
        });
      } 
      else {
        
        return res
          .status(200)
          .render("blog/winterblog", {
            title: "Blog",
            partial: "blogdisplay-script",
            css: "blogdisplay-css",
            
          });
        
      }
    } 
    catch (err) {
      return res
        .status(err&&err.status?err.status:500)
        .render("auth/signup", {
          title: "Login",
          partial: "signup-script",
          css: "signup-css",
        });
    }


});
router.route("/linessblog").get(async (req, res) => {
  try {
      if (!req.session.user.verified || req.session.user.category!="patient") {
        return res.render("home/homePage",{
          title: "Home",
          partial: "home-script",
          css: "homedoc-css",
          doctor:true
        });
      } 
      else {
        
        return res
          .status(200)
          .render("blog/linessblog", {
            title: "Blog",
            partial: "blogdisplay-script",
            css: "blogdisplay-css",
            
          });
        
      }
    } 
    catch (err) {
      return res
        .status(err&&err.status?err.status:500)
        .render("auth/signup", {
          title: "Login",
          partial: "signup-script",
          css: "signup-css",
        });
    }


});



module.exports = router;

