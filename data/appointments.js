const { ObjectId } = require("mongodb");
const { appointments } = require("../config/mongoCollections");
const bcrypt = require("bcryptjs");
const { badRequestError, internalServerError, notFoundError } = require("../helpers/wrappers");
const {validString, validObjectId } = require("../helpers/validations");


const createAppointments = async (category, consultant_id, patient_id, time_slot, notes) => {
  // Validations
  try {
    if (!category || !consultant_id || !patient_id || !time_slot || !notes) throw `All fields must be supplied!`;
    //add validations
    //check time

  // Trim inputs
  category = category.trim();
  consultant_id = consultant_id.trim();
  patient_id = patient_id.trim();
  time_slot = time_slot.trim();
  notes = notes.trim();
  

  
    const appointmentsCollection = await appointments();
    let newAppointments = {
      category: category,
      consultant_id:consultant_id,
      patient_id:patient_id,
      time_slot:time_slot,
      notes:notes,
      status:"Pending"
    };

    const insertInfo = await appointmentsCollection.insertOne(newAppointments);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw internalServerError("Could not book appointment");
  
    return {bookedAppointment: true};
  } 
  catch (err) {
    throw err;
  }
};



module.exports = {
  
  createAppointments,
 
};
