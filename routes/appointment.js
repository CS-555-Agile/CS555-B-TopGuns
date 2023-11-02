const express = require("express");
const { appointments} = require("../config/mongoCollections");
const {
  createAppointments,
  getUserByconsultant,
  getUserByprofessionalStaff,
  getPastAppointment,
  getupComingAppointment
} = require("../data/appointments");
const {
  validObjectId,
  validString,
} = require("../helpers/validations");
const router = express.Router();
const xss = require("xss");
const { ObjectId } = require("mongodb");


router.route("/").get(async (req, res) => {
  //code here for GET
  try {
    if (!req.session.user?.verified || req.session.user.category!="patient") {
      return res.redirect("/home");
    } 
    else {
      let userId = String(req.session.user._id);
      console.log(userId)
     
      const past = await getPastAppointment(userId);
      const future = await getupComingAppointment(userId);
      console.log(past)
      console.log(future)
     
        
      return res
        .status(200)
        .render("appointment/book", {
          past:past,
          future:future,
          title: "Book appointment",
          partial: "book-script",
          css: "book-css",
          
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
  console.log("patient_id")
  
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
          sub_category,
          time_slot,
          date,
          notes,
        } = req.body; 
    let patient_id = String(req.session.user._id)
    category = xss(category);
    consultant_id = xss(String(sub_category));
    time_slot = xss(time_slot);
    notes = xss(notes);
    date = xss(date);
    // let patient_id = "3454566767ebavd"
    const newAppointment = await createAppointments(
      category,
      consultant_id,
      patient_id,
      time_slot,
      date,
      notes
    );
    if (!newAppointment.bookedAppointment) {
      console.log(err, "Line 194");
      return res.status(err?.status ?? 500)
    } else {
      return res.redirect("/home");
      
    }
  } catch (err) {
    console.log(err, "Line 206");
    return res.status(err?.status ?? 500)
    
  }


});
router.route("/getConsultant").get(async (req, res) => {
  try {
    if (!req.session.user?.verified) {
      return res.redirect("/home");
    } else {
       const data = await getUserByconsultant();
      return res.json(data)
    }
  } catch (err) {
    return res.json(err)
  }


});
router.route("/getProfessioanl").get(async (req, res) => {
  try {
    if (!req.session.user?.verified) {
      return res.redirect("/home");
    } else {
       const data = await getUserByprofessionalStaff();
      return res.json(data)
    }
  } catch (err) {
    return res.json(err)
  }


});
module.exports = router;

