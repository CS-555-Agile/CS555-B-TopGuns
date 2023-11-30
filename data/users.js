const { ObjectId } = require("mongodb");
const { users } = require("../config/mongoCollections");
const bcrypt = require("bcryptjs");
const saltRounds= 11
const { badRequestError, internalServerError, notFoundError } = require("../helpers/wrappers");
const { validEmail, validName, validUsername, validPassword, validDate, validDOB, validString, validObjectId } = require("../helpers/validations");

const getUserById = async (userId) => {
  validObjectId(userId, "ID");
  userId = userId.trim();
  const userCollection = await users();
  const userObject = await userCollection.findOne({ _id: ObjectId(userId) });
    if (userObject === null) {
      const error = new Error("No user with this ID can be found!");
      error.code = 404;
      throw error;
    }
  return userObject;
};

const deleteAllUsers = async () => {
  const userCollection = await users();
  userCollection.deleteMany({});
};

const deleteUserById = async (userId) => {
  validObjectId(userId, "ID");
  userId = userId.trim();
  const userCollection = await users();
  const deletionInfo = userCollection.deleteOne({ _id: ObjectId(userId) });
  if (deletionInfo.deletedCount === 0) {
    const error = new Error(`Could not delete user with the user id ${userId}`);
    error.code = 404;
    throw error;
  }
  return { userId: userId, deleted: true };
  
};

const getUserByUsername = async (username) => {
  // Validations
  try {
    validUsername(username);
  } catch (err) {
    throw badRequestError(err);
  }

  // Trim inputs
  username = username.trim().toLowerCase();
  
  // Mongo Collection operations
  try {
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!user || user === null) return false;
    return user;
  } catch (err) {
    // Log the error or perform some error-handling action
    console.error('An error occurred while fetching user:', err);

    // Rethrow the error to maintain the exception propagation
    throw err;
}
};

const getUserByEmail = async (email) => {
  // Validations
  try {
    validEmail(email);
  } catch (err) {
    throw badRequestError(err);
  }

  // Trim inputs
  email = email.trim().toLowerCase();

  // Mongo Collection operations
  try {
    const userCollection = await users();
    const user = await userCollection.findOne({ email: email });
    if (!user || user === null) return false;
    user._id = user._id.toString();
    return user;
  } catch (err) {
    console.error('An error occurred while fetching user:', err);
    throw err;
  }
};

const checkUser = async (email, password) => {
  // Validations
  try {
    validEmail(email);
    validPassword(password);
  } catch (err) {
    throw badRequestError(err);
  }

  // Trim inputs
  email = email.trim().toLowerCase();

  // Mongo Collection operations
  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) throw badRequestError("Either the email or password is invalid");

    const comparePasswords = await bcrypt.compare(password, existingUser.hashedPassword);
    if (comparePasswords) {
      return existingUser;
    } else throw badRequestError("Either the email or password is invalid");
  } catch (err) {
    console.error('An error occurred while fetching user:', err);
    throw err;
  }
};

const createUser = async (firstnameInput, lastnameInput, emailInput, passwordInput) => {
  // Validations
  try {
    if (!firstnameInput || !lastnameInput || !emailInput || !passwordInput) throw new Error(`All fields must be supplied!`);
    validName(firstnameInput);
    validName(lastnameInput);
    validEmail(emailInput);
    validPassword(passwordInput);

    const takenEmail = await getUserByEmail(emailInput);
    if (takenEmail) throw new Error(`Email already registered to another account!`);
  } catch (err) {
    throw badRequestError(err);
  }

  // Trim inputs
  firstnameInput = firstnameInput.trim();
  lastnameInput = lastnameInput.trim();
  emailInput = emailInput.trim().toLowerCase();

  // Mongo Collection operations and password hashing
  try {
    const hash = await bcrypt.hash(passwordInput, saltRounds);
    const userCollection = await users();
    let newUser = {
      // userName: usernameInput,
      hashedPassword: hash,
      lastName: lastnameInput,
      firstName: firstnameInput,
      email: emailInput,
      // dateOfBirth: DOBInput,
      profilePicture: null,
      category:"Patient",
      subcategory:"Patient"

    };

    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw internalServerError("Could not add user");
  
    return {insertedUser: true};
  } catch (err) {
    console.error('An error occurred while fetching info:', err);
    throw err;
  }
};

const updateUserById = async (
  userId,
  userName,
  firstName,
  lastName,
  email,
  dateOfBirth
) => {
  if (
    !userName ||
    !firstName ||
    !lastName ||
    !email ||
    !dateOfBirth
  )
  throw Object.assign(new Error("All fields must be supplied!"), { code: 400 });

  validObjectId(userId);
  validString(userName);
  validString(firstName);
  validString(lastName);
  validString(email);
  validString(dateOfBirth);

  const userExists = await getUserById(userId);
  if (!userExists) throw Object.assign(new Error("User doesn't exist!"), { code: 400 });
  const userCollection = await users();
  const updatedUser = {
    userName: userName.trim(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    dateOfBirth: dateOfBirth.trim(),
  };
  const updatedInfo = userCollection.updateOne(
    { _id: ObjectId(userId.trim()) },
    { $set: updatedUser }
  );
  if (updatedInfo.modifiedCount === 0)
    {
    const error = new Error(`Could not update user with user ID ${userId}!`);
    error.code = 404;
    throw error;
    }
  else {
    const newUser = await getUserById(userId);
    return newUser;
  }
};

const searchUsers = async (searchText) => {
  try {
    if (!searchText || typeof searchText != 'string' || searchText.trim().length === 0) throw new Error(`Empty search text`);
  } catch (err) {
    throw badRequestError(err);
  }

  try {
    const splitSearch = searchText.split(" ");
    const userCollection = await users();
    const matchedUsers = await userCollection.find({$or: [
      {userName: {$in: splitSearch}},
      {firstName: {$in: splitSearch}},
      {lastName: {$in: splitSearch}}
    ]}).toArray();
    if (!matchedUsers) throw Object.assign(new Error("No users found"), { code: 400 });

    return matchedUsers;
  } catch (err) {
    console.error('An error occurred while fetching info:', err);
    throw (err);
  }
};


module.exports = {
  checkUser,
  getUserByEmail,
  getUserById,
  deleteAllUsers,
  // getAllUsers,
  createUser,
  deleteUserById,
  updateUserById,
  searchUsers,
};
