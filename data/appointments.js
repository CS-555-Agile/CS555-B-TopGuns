const { ObjectId } = require("mongodb");
const { appointments } = require("../config/mongoCollections");
const { users } = require("../config/mongoCollections");
const bcrypt = require("bcryptjs");
const { badRequestError, internalServerError, notFoundError } = require("../helpers/wrappers");
const {validString, validObjectId } = require("../helpers/validations");
const dateString  = new Date().toISOString().split('T')[0];



const updateAppointmentStatus = async (appId, status) => {
  
  try {
    appId = appId.trim();
    let statusStr = 'Accepted';
    if(!status) statusStr = 'Declined'; 
    const appointmentCollection = await appointments();    
    const filter = { _id: ObjectId(appId) };
    const update = { $set: { status: statusStr } };
    const result = await appointmentCollection.updateOne(filter, update);

    if (result.matchedCount === 1) {
      // console.log(Updated status for appointment with appId ${appId} to ${statusStr});
      return {
        message: "Updated status for appointment with appId",
        code: 200,
      };
    } else {
      // console.log(Appointment with appId ${appId} not found.);
      return {
        message: "No appointments found with this ID!",
        code: 404,
      };
    }
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return {
      message: error,
      code: 500,
    };
  }
};


const getPendingAppointment = async (userId) => {
  
  validObjectId(userId, "ID");
  userId = userId.trim();
  const appointmentCollection = await appointments();
  const userObject = await appointmentCollection.find( { consultant_id: (userId), date: {$gte: dateString}, status:"Pending" }).toArray();
  if (userObject === null)
    throw new notFoundError("No appointments found with this ID");
  return userObject;
};
const getPast = async (userId) => {
  
  validObjectId(userId, "ID");
  userId = userId.trim();
  const appointmentCollection = await appointments();
  const userObject = await appointmentCollection.find( { consultant_id: (userId), date: {$lt: dateString}, status: { $ne: "Pending" } }).toArray();
  if (userObject === null)
    throw new notFoundError("No appointments found with this ID");
  return userObject;
};
const getupComing = async (userId) => {
  validObjectId(userId, "ID");
  userId = userId.trim();
  const appointmentCollection = await appointments();
  const userObject = await appointmentCollection.find( { consultant_id: (userId), date: {$gte: dateString}, status: { $ne: "Pending" } }).toArray();
  if (userObject === null)
    throw new notFoundError("No appointments found with this ID");
  return userObject;
};


const getPastAppointment = async (userId) => {
  
  validObjectId(userId, "ID");
  userId = userId.trim();
  const appointmentCollection = await appointments();
  const userObject = await appointmentCollection.find( { patient_id: (userId), date: {$lt: dateString} }).toArray();
  if (userObject === null)
    throw new notFoundError("No appointments found with this ID");
  return userObject;
};
const getupComingAppointment = async (userId) => {
  validObjectId(userId, "ID");
  userId = userId.trim();
  const appointmentCollection = await appointments();
  const userObject = await appointmentCollection.find( { patient_id: (userId), date: {$gte: dateString} }).toArray();
  if (userObject === null)
    throw new notFoundError("No appointments found with this ID");
  return userObject;
};
const getUserByprofessionalStaff = async () => {
  
  const userCollection = await users();
  const userObject = await userCollection.find({ category:"professionalStaff" }).toArray();
  if (userObject === null)
    throw new notFoundError("No Staff found with this ID");
  return userObject;
};
const getUserByconsultant = async () => {
  
  const userCollection = await users();
  const userObject = await userCollection.find({ category:"consultant" }).toArray();
  if (userObject === null)
    throw new notFoundError("No Consultant found with this ID");
  return userObject;
};

function MissingFieldsError(message) {
  this.name = 'MissingFieldsError';
  this.message = message || 'All fields must be supplied!';
  this.stack = new Error().stack;
}


const createAppointments = async (category, consultant_id, patient_id, time_slot, date,notes) => {
  // Validations
  try {
    if (!category || !consultant_id || !patient_id || !time_slot || !date) throw new MissingFieldsError();
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
      throw new internalServerError("Could not book appointment");
  
    return {bookedAppointment: true};
  } 
  catch (err) {
    throw new err;
  }
};



module.exports = {
  
  createAppointments,
  getPastAppointment,
  getUserByconsultant,
  getUserByprofessionalStaff,
  getupComingAppointment,
  getPast,
  getPendingAppointment,
  getupComing,
  updateAppointmentStatus
 
};
