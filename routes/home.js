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
    
          return res
          .status(200)
          .render('home/homePage',{
          partial: "home-script",
          css: "home-css",
          title:"Home",
        });
      
      
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
          // res.status(404).send(e);       
      }
      else{
        return res
          .status(400)
          .render('home/error',{
          partial: "home-script",
          css: "home-css",
          title:"Error",
          error:e});
        // res.status(400).send(e);
      }
    } 
  });
  module.exports = router;
