const express = require("express");
const router = express.Router();
const data = require('../data');
const postData = data.post;
const {getPost } = require("../data/post");
router.route("/").get(async (req, res) => {
    try {
        if (!req.session.user?.verified || req.session.user.category!="patient") {
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
          css: "homedoc-css",
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
          css: "homedoc-css",
          doctor:true
        });
      } 
      else {
        let userId = String(req.session.user._id);
      console.log(userId)
     
      const postList = await getPost(userId);
      console.log(postList)
     
        return res
          .status(200)
          .render("entertainment/gallary", {
            title: "Entertainment",
            partial: "gallary-script",
            css: "gallary-css",
            user:req.session.user,
            posts:postList,
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

router.route("/upload").get(async (req, res) => {
  try {
      if (!req.session.user?.verified || req.session.user.category!="patient") {
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
          .render("entertainment/upload", {
            title: "Entertainment",
            partial: "upload-script",
            css: "upload-css",
            user:req.session.user
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
router.route('/add_post').post(async (req, res) => {
  const postInfo = req.body;
  postInfo.postContent=postInfo.postContent;

  try {
    const newPost = await postData.createPost(
      postInfo.postContent,
      req.session.user._id.toString(),
    );
    res.json(newPost);
  } catch (e) {
    res.status(400).json({ error: e });
    }
})

module.exports = router;

