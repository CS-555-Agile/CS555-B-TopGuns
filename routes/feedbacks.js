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
    if (!req.session.user?.verified || req.session.user.category!="patient") {
      return res.redirect("/home");
    } else {
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
      .status(err?.status ?? 500)
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
    const newFeedback = await createFeedback(FeedbackObject);
    if (!newFeedback.insertedFeedback) {
      console.log("Failed to post a feedback.");
      return res.status(err?.status ?? 500)
    } else {
      return res.redirect("/home");
    }
  } catch (err) {
    console.log("Erorr while creating a feedback: " + err);
    return res.status(err?.status ?? 500)
  }


});

router.route("/patients/:patientId").get(async (req, res) => {

  let patientId = req.params.patientId
  try {
    let feedbacksList = await getFeedbacksPatients(patientId);
    res.json(feedbacksList);
  } catch (error) {
    console.log("ERROR: " + error);
    res.status(500).send("Error: " + error.message);
  }

});

router.route("/staff/:staffId").get(async (req, res) => {

  let staffId = req.params.staffId
  try {
    feedbacksList = await getFeedbacksStaff(staffId);
    res.json(feedbacksList);
  } catch (error) {
    console.log("ERROR: " + error);
    res.status(500).send("Error: " + error.message);
  }

});



module.exports = router;

