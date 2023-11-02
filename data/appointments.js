const { ObjectId } = require("mongodb");
const { appointments } = require("../config/mongoCollections");
const { users } = require("../config/mongoCollections");
const bcrypt = require("bcryptjs");
const { badRequestError, internalServerError, notFoundError } = require("../helpers/wrappers");
const {validString, validObjectId } = require("../helpers/validations");
const dateString  = new Date().toISOString().split('T')[0];

const getPastAppointment = async (userId) => {
  
  validObjectId(userId, "ID");
  userId = userId.trim();
  const appointmentCollection = await appointments();
  const userObject = await appointmentCollection.find( { patient_id: (userId), date: {$lt: dateString} }).toArray();
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
  const userObject = await appointmentCollection.find( { patient_id: (userId), date: {$gte: dateString} }).toArray();
  if (userObject === null)
    throw {
      message: "No appointments found with this ID!",
      code: 404,
    };
  return userObject;
};
const getUserByprofessionalStaff = async () => {
  
  const userCollection = await users();
  const userObject = await userCollection.find({ category:"professionalStaff" }).toArray();
  if (userObject === null)
    throw {
      message: "No user found as professional staff!",
      code: 404,
    };
  return userObject;
};
const getUserByconsultant = async () => {
  
  const userCollection = await users();
  const userObject = await userCollection.find({ category:"consultant" }).toArray();
  if (userObject === null)
    throw {
      message: "No user found as consultant !",
      code: 404,
    };
  return userObject;
};

const createAppointments = async (category, consultant_id, patient_id, time_slot, date,notes) => {
  // Validations
  try {
    if (!category || !consultant_id || !patient_id || !time_slot || !date) throw `All fields must be supplied!`;
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
      date:date,
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
  getPastAppointment,
  getUserByconsultant,
  getUserByprofessionalStaff,
  getupComingAppointment
 
};
