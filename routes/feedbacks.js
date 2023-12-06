const express = require("express");
const { feedbacks } = require("../config/mongoCollections");
const {
  validObjectId,
  validString,
} = require("../helpers/validations");
const router = express.Router();
const xss = require("xss");
const { ObjectId } = require("mongodb");
const { createFeedback, getFeedbacksPatients, getFeedbacksStaff } = require("../data/feedbacks");

function getCurrentTimestamp() {
  let now = new Date();
  let formattedDate = (now.getMonth() + 1).toString().padStart(2, '0') + '/'
                    + now.getDate().toString().padStart(2, '0') + '/'
                    + now.getFullYear() + ' '
                    + now.getHours().toString().padStart(2, '0') + ':'
                    + now.getMinutes().toString().padStart(2, '0');

  return formattedDate;
}

router.route("/").get(async (req, res) => {
  //code here for GET
  try {
    if (!req.session.user.verified || req.session.user.category!="patient") {
      return res.redirect("/home");
    } else {
        // const past = await getPastAppointment(String(req.session.user._id));
        // const future = await getupComingAppointment(String(req.session.user._id));
        // console.log(past)
        // console.log(future)
      return res
        .status(200)
        .render("feedback", {
          // past:past,
          // future:future,
          title: "Feedback",
          partial: "feedback-script",
          css: "feedback-css",
          
        });
      
    }
  } catch (err) {
    return res
      .status(err&&err.status?err.status:500)
      .render("auth/signup", {
        title: "Login",
        partial: "signup-script",
        css: "signup-css",
      });
  }
})
.post(async (req, res) => {
  console.log("POSTING A FEEDBACK..... ");
  const patientId = String(req.session.user._id);
  // const patientId = "3454566767ebavd";

  try {
    let {
          staffId,
          body,
          subject, 
          rating
        } = req.body; 
   
    staffId = xss(staffId);
    body = xss(body);
    subject = xss(subject);
    rating = xss(rating);
    
    const FeedbackObject = {
      staffId: String(staffId),
      body: body,
      subject: subject,
      patientId: patientId,
      rating: rating,
      timestamp: getCurrentTimestamp()
    }
    // console.log(FeedbackObject)
    const newFeedback = await createFeedback(FeedbackObject);
    if (!newFeedback.insertedFeedback) {
      console.log("Failed to post a feedback.");
      return res.status(err&&err.status?err.status:500)
    } else {
      // return res.json("Feedback posted successfully. ");
      return res.redirect("/home");
    }
  } catch (err) {
    console.log("Erorr while creating a feedback: " + err);
    return res.status(err&&err.status?err.status:500)
  }


});
// doctor side 

router.route("/show").get(async (req, res) => {
  //code here for GET
  try {
    if (!req.session.user.verified || req.session.user.category==="patient") {
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
     
      const feedbacksList = await getFeedbacksStaff(userId);
      console.log(feedbacksList)
     
      return res
        .status(200)
        .render("rating", {
          rating:feedbacksList,
          title: "Feedback",
          partial: "rating-script",
          css: "rating-css",
          
        });
      
    }
  } catch (err) {
    console.log(err)
    return res
      .status(err&&err.status?err.status:500)
      .render("auth/signup", {
        title: "Login",
        partial: "signup-script",
        css: "signup-css",
      });
  }
});


router.route("/patients/:patientId").get(async (req, res) => {

  patientId = req.params.patientId
  try {
    feedbacksList = await getFeedbacksPatients(patientId);
    res.json(feedbacksList);
  } catch (error) {
    console.log("ERROR: " + error);
    res.status(500).send("Error: " + error.message);
  }

});

router.route("/staff/:staffId").get(async (req, res) => {

  staffId = req.params.staffId
  try {
    feedbacksList = await getFeedbacksStaff(staffId);
    res.json(feedbacksList);
  } catch (error) {
    console.log("ERROR: " + error);
    res.status(500).send("Error: " + error.message);
  }

});



module.exports = router;

