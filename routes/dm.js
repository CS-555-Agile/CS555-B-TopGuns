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
         let user = req.session.user
          return res
            .status(200)
            .render("dm", {
              title: "Chat",
              partial: "dm-script",
              css: "dm-css",
              user:user
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

