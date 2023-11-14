const { ObjectId } = require("mongodb");
const { feedbacks } = require("../config/mongoCollections");
const { badRequestError, internalServerError, notFoundError } = require("../helpers/wrappers");
const {validString, validObjectId } = require("../helpers/validations");

const getFeedbacksPatients = async (patientId) => {
    try {
        let feedbacksCollection = await feedbacks();
        let feedbacksList = await feedbacksCollection.find({patientId: patientId}).toArray();
        // console.log(feedbacksList);
        return feedbacksList;
    } catch (err) {
        // console.log(err);
        throw (err);
    }
}

const getFeedbacksStaff = async (staffId) => {
    try {
        let feedbacksCollection = await feedbacks();
        let feedbacksList = await feedbacksCollection.find({staffId: staffId}).toArray();
        // console.log(feedbacksList);
        return feedbacksList;
    } catch (err) {
        // console.log(err);
        throw (err);
    }
}

const createFeedback = async (feedbackObject) => {
    // Validations
    try {
        if (!feedbackObject.staffId) throw `Staff Id is mandatory field.`;
        if (!feedbackObject.patientId) throw `Patient Id is mandatory field.`;
        if (!feedbackObject.subject) throw `Subject/Title is mandatory field.`;
        if (!feedbackObject.body) throw `Body is mandatory field.`;
        if (!feedbackObject.rating) throw `Rating is mandatory field.`;
        if (!feedbackObject.timestamp) throw `Timestamp is mandatory field.`;

        if(!(feedbackObject.rating >= 0 && feedbackObject.rating <= 10)) {
          throw `Rating has to be in scale of 1-10`;
        }
        // Trim inputs
        feedbackObject.staffId = feedbackObject.staffId.trim();
        feedbackObject.patientId = feedbackObject.patientId.trim();
        feedbackObject.subject = feedbackObject.subject.trim();
        feedbackObject.body = feedbackObject.body.trim();
        feedbackObject.rating = feedbackObject.rating.trim();
        feedbackObject.timestamp = feedbackObject.timestamp;
  
        const feedbacksCollection = await feedbacks();

        // console.log(feedbackObject);
        const insertInfo = await feedbacksCollection.insertOne(feedbackObject);
        if (!insertInfo.acknowledged || !insertInfo.insertedId)
            throw internalServerError("Failed to add give feedback.");
            return {insertedFeedback: true};
        } 
        catch (err) {
            console.log("Error while creating feedback: " + err);
            throw err;
        }
}

module.exports = {
    createFeedback,
    getFeedbacksPatients,
    getFeedbacksStaff
};
  