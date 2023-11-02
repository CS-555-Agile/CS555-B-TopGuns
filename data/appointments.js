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



const getPastAppointment = async (userId) => {
  validObjectId(userId, "ID");
  userId = userId.trim();
  const appointmentCollection = await appointments();

  const today = new Date(); // Get the current date and time
  const currentDate = new Date();
  const formattedDate = '2023-12-01'
  //currentDate.toISOString().substr(0, 10);
  const formattedTime = '10:00';
  //currentDate.toTimeString().substr(0, 5);
  
  const userObject = await appointmentCollection.findOne( {
    patient_id: ObjectId(userId), // Convert patient_id to ObjectId
    date: { $lt: formattedDate }, // Date should be less than targetDate
    time_slot: { $lt: formattedTime }, // Time should be less than targetTime
  }).toArray();
  if (userObject === null)
    throw {
      message: "No appointments found with this ID!",
      code: 404,
    };
  return userObject;
};

const getupComingAppointment = async (userId) => {
  validObjectId(userId, "ID");
  userId = userId.trim();
  const appointmentCollection = await appointments();
  const userObject = await appointmentCollection.findOne( { patient_id: ObjectId(userId), date: {$gt: new Date()}, "time_slot": { $gt: new Date() } });
  if (userObject === null)
    throw {
      message: "No appointments found with this ID!",
      code: 404,
    };
  return userObject;
};


module.exports = {
  
  createAppointments,
 
};
