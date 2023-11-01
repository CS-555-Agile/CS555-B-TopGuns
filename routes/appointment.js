const express = require("express");
const { appointments} = require("../config/mongoCollections");
const {
  createAppointments
} = require("../data/appointments");
const {
  validObjectId,
  validString,
} = require("../helpers/validations");
const router = express.Router();
const xss = require("xss");
const { ObjectId } = require("mongodb");



router.route("/").post(async (req, res) => {
  console.log("patient_id")
  // const patient_id = req.session.user._id
  // console.log(patient_id)

  // try {
  //   const {
  //     category,
  //     consultant_id,
  //     time_slot,
  //     notes,
  //   } = req.body; 
  //   // TODO: Input Validation
 
  // } catch (err) {
   
  //   return res.json(err)
  // }
  try {
    let {
          category,
          consultant_id,
          time_slot,
          notes,
        } = req.body; 
    category = xss(category);
    consultant_id = xss(consultant_id);
    time_slot = xss(time_slot);
    notes = xss(notes);
    
    let patient_id = "3454566767ebavd"
    const newAppointment = await createAppointments(
      category,
      consultant_id,
      patient_id,
      time_slot,
      notes
    );
    if (!newAppointment.bookedAppointment) {
      console.log(err, "Line 194");
      return res.status(err?.status ?? 500)
    } else {
      // return res.redirect("/home");
      return res.json("inserted");
    }
  } catch (err) {
    console.log(err, "Line 206");
    return res.status(err?.status ?? 500)
    
  }


});

module.exports = router;

