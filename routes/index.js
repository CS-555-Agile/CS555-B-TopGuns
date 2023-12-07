
const authRoutes = require("./authRoutes");
const homeRoutes= require('./home');
const appointmentsRoutes= require('./appointment');
const feedbackRoutes = require('./feedbacks');
const blogRoutes = require('./blog');
const entertainmentRoutes = require('./entertainment');
const dmRoutes = require('./dm');
const multer = require("multer");
const path = require('path');
var fs = require('fs');

var storage = multer.diskStorage({
  destination : function(req, file, callBack){
    callBack(null, "./public/uploads");
  },
  filename: function(req, file, callBack){
    callBack( null, file.originalname);
  },
});
var uploadImage = multer({storage:storage}).single("postContent");
const constructorMethod = (app) => {
  app.use('/', authRoutes);
  app.use('/home', homeRoutes);
  app.use('/appointment', appointmentsRoutes);
  app.use('/feedbacks', feedbackRoutes);
  app.use('/blog', blogRoutes);
  app.use('/dm', dmRoutes);
  app.use('/service', entertainmentRoutes);
  app.post("/uploadImage", (req, res) => {
    uploadImage(req, res, function (e) {
      if(e)
        return res.status(500).json("Failed to upload image");
      console.log(req.file)
      let path = req.file.destination + "/" + req.file.filename;
      path = path.substring(1);
      return res.json(path);
    });
  });
  app.use('*', (req, res) => {
    res.status(404).send("Page not found");
  });
};
module.exports = constructorMethod;
