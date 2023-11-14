const express = require('express');
const router = express.Router();
const {ObjectId} = require('mongodb');
const validatiion = require('../helpers/validations');
router
  .route('/')
  .get(async (req, res) => {
    try {
      
      
          let userId = req.session.user._id.toString();
          userId = userId.trim();
          if(validatiion.validString(userId,"ID"));
          if(validatiion.validObjectId(userId,"ID"));
          if(req.session.user.category ==="patient"){
            return res.render("home/homePage",{
              title: "Home",
              partial: "home-script",
              css: "home-css",
              patient:true
            });
          }
          else{
            return res.render("home/homePage",{
              title: "Home",
              partial: "home-script",
              css: "home-css",
              doctor:true
            });
          }
      
    } 
    catch (e) {
      if(typeof(e)==='object'){
        return res
          .status(404)
          .render('home/error',{
          partial: "home-script",
          css: "home-css",
          title:"Error",
          error:e.error});
      }
      else{
        return res
          .status(400)
          .render('home/error',{
          partial: "home-script",
          css: "home-css",
          title:"Error",
          error:e});
      }
    } 
  });
  module.exports = router;
