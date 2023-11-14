const express = require("express");
const { appointments} = require("../config/mongoCollections");
const {
  createAppointments,
  getUserByconsultant,
  getUserByprofessionalStaff,
  getPastAppointment,
  getupComingAppointment,
  getPast,
  getupComing,
  getPendingAppointment,
  updateAppointmentStatus
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
      return res.render("home/homePage",{
        title: "Home",
        partial: "home-script",
        css: "home-css",
        doctor:true
      });
    } 
    else {
      let userId = String(req.session.user._id);
     
     
      const past = await getPastAppointment(userId);
      const future = await getupComingAppointment(userId);
    
        
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
  
    const newAppointment = await createAppointments(
      category,
      consultant_id,
      patient_id,
      time_slot,
      date,
      notes
    );
    if (!newAppointment.bookedAppointment) {
     
      return res.status(err?.status ?? 500)
    } else if {
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
  } catch (err) {
    
    return res.status(err?.status ?? 500)
    
  }


});
router.route("/getConsultant").get(async (req, res) => {
  try {
    if (!req.session.user?.verified) {
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
    } else {
       const data = await getUserByprofessionalStaff();
      return res.json(data)
    }
  } catch (err) {
    return res.json(err)
  }


});

// doctor side 

router.route("/show").get(async (req, res) => {
  //code here for GET
  try {
    if (!req.session.user?.verified || req.session.user.category==="patient") {
      return res.render("home/homePage",{
        title: "Home",
        partial: "home-script",
        css: "home-css",
        doctor:true
      });
    } 
    else {
      let userId = String(req.session.user._id);
  
     
      const past = await getPast(userId);
      const future = await getupComing(userId);
      const pending = await getPendingAppointment(userId);

        
      return res
        .status(200)
        .render("appointment/adminView", {
          past:past,
          future:future,
          pending:pending,
          title: "Appointment",
          partial: "adminView-script",
          css: "adminView-css",
          
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
});


router.put('/accept/:appId', async (req, res) => {
  try {
    const  appId = req.params.appId;
    const  status  = true;
   
    const result = await updateAppointmentStatus(appId, status);
    res.status(result.code).json({ message: result.message });
  } catch (error) {

    res.status(500).json({ message: 'Internal server error' });
  }
});
router.put('/decline/:appId', async (req, res) => {
  try {
    const  appId = req.params.appId;
    const  status  = false;
 
    const result = await updateAppointmentStatus(appId, status);
    res.status(result.code).json({ message: result.message });
  } catch (error) {

    res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;

