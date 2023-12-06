const { ObjectId } = require("mongodb");
const { post } = require("../config/mongoCollections");
const bcrypt = require("bcryptjs");
const { badRequestError, internalServerError, notFoundError } = require("../helpers/wrappers");
const createPost = async ( postContent, userId) => {

  
  
   
    const postCollection = await post();
  
    let newPost = {
      postContent: postContent,
      userId:userId
    }
  
    const insertInfo = await postCollection.insertOne(newPost);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw {statusCode: 500, error: 'Could not add new post!!'};
  
    const newId = insertInfo.insertedId.toString();
   
    return newId;
  };
  



  const getPost = async (userId) => {
    try {
        let postCollection = await post();
        let postList = await postCollection.find({userId: userId}).toArray();
       
        return postList;
    } catch (err) {
        // console.log(err);
        throw (err);
    }
}

module.exports = {
  
    createPost,
    getPost
 
};
