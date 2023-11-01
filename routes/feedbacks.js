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

router.route("/").post(async (req, res) => {
  console.log("POSTING A FEEDBACK..... ");
  // const patientId = req.session.user._id
  const patientId = "3454566767ebavd";

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
      staffId: staffId,
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
      return res.json("Feedback posted successfully. ");
    }
  } catch (err) {
    console.log("Erorr while creating a feedback: " + err);
    return res.status(err?.status ?? 500)
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

