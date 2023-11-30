const { ObjectId } = require("mongodb");
const moment = require("moment");
/**
 * @author Kajol Rajesh Shah <kajol.shsh@gmail.com>
 * */

const validString = function error_handling_for_string(
  userInput,
  inputParameter
) {
  /**
   * @param {userInput} string - The input given by the user to be validated as a string
   * @param {inputParameter} string - The name of the input variable
   * @throws {MissingInput} `Please provide ${inputParameter}`
   */
  if (!userInput) throw `Please provide ${inputParameter}!`;
  if (typeof userInput !== "string" || typeof userInput === "undefined")
    throw `${inputParameter} must be a string!`;
  if (userInput.trim().length === 0)
    throw (
      inputParameter + " cannot be an empty string or string with just spaces!"
    );
};

const validObjectId = function error_handling_for_id(inputId, inputParameter) {
  /**
   * @param {inputId} string - The input given by the user to be validated as a objectid
   * @param {inputParameter} string - The name of the input variable
   * @throws {MissingInput} `Please provide ${inputParameter}`
   * @throws {InvalidObjectID} `Invalid object " + inputParameter`
   */
  if (!inputId) throw "You must provide an " + inputParameter;
  if (typeof inputId !== "string" || typeof inputId === "undefined")
    throw inputParameter + " must be a string!";
  if (inputId.trim().length === 0)
    throw inputParameter + " cannot be an empty string or just spaces!";

  if (!ObjectId.isValid(inputId.trim()))
    throw `Invalid object ${inputParameter}!`;
};
const validName = function error_handling_for_name(inputName, inputParameter) {
  /**
   * @param {inputName} string - The input given by the user to be validated as a valid name
   * @param {inputParameter} string - The name of the input variable
   * @throws {Format1} `inputParameter + " must be atleast 3 character long and should not contain special characters or numbers"`
   * @throws {Format2} `inputParameter + " should be in valid format`
   */
  if (!inputName) throw new Error(`Please provide ${inputParameter}!`);
  if (typeof inputName !== "string" || typeof inputName === "undefined")
    throw inputParameter + " must be a string!";
  if (inputName.trim().length === 0)
    throw new Error(inputParameter + " cannot be an empty string or string with just spaces!");

  const name = inputName.trim().split(" ");
  if (name.length > 1) {
    throw new Error(inputParameter + " should be in valid format!");
  } else {
    let format = /[`0123456789!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?~]/;
    if (inputName.length < 3 || format.test(inputName)) {
      throw new Error(inputParameter + " must be atleast 3 characters long and should not contain special characters or numbers!");
    }
  }
};

const validLogin = function error_handling_for_login(
  inputUsername,
  inputPassword
) {
  /**
   * @param {inputUsername} string - The input given by the user to be validated as a valid username
   * @param {inputPassword} string - The input given by the user to be validated as a valid password
   * @throws {MissingInput} `You must provide username and password`
   * @throws {noSpecialChar} `Please enter valid username .i.e without special characters or spaces`
   * @throws {passwordLength} `Password should be at least 6 characters long.`
   * @throws {passwordSpaces} `Password cannot contain spaces`
   * @throws {passwordFormat} `Password should contain at least one uppercase character, at least one number and at least one special character`
   */
  let format = /[` !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  let spaces = /(.+\s+.*)|(^\s+.*)|(.*\s+$)/g;
  let password_format = /^(?=.*[A-Z])(?=.*\d)(?=.*\W).*$/g;
  inputUsername = inputUsername.trim();
  if (!inputUsername || !inputPassword)
    throw new Error("You must provide username and password!");
  if (typeof inputUsername !== "string" || typeof inputUsername === "undefined")
    throw new Error("Username must be a string!");
  if (typeof inputPassword !== "string" || typeof inputPassword === "undefined")
    throw new Error("Password must be a string!");
  if (inputUsername.length < 4)
    throw new Error("Username should be at least 4 characters long!");
  if (format.test(inputUsername))
    throw new Error("Please enter valid username .i.e without special characters or spaces!");
  if (inputPassword.length < 6)
    throw new Error("Password should be at least 6 characters long!");
  if (spaces.test(inputPassword)) throw "Password cannot contain spaces!";
  if (!password_format.test(inputPassword))
    throw new Error("Password should contain at least one uppercase character, at least one number and at least one special character!");
};
const validEmail = function error_handling_for_email(inputEmail) {
  /**
   * @param {inputEmail} string - The input given by the user to be validated as a valid email address
   * @throws {emailFormat} `"Please enter valid Email Address" `
   */
  
  let emailFormat = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g;
  inputEmail = inputEmail.trim();
  if (!inputEmail) throw "You must provide Email Address!";
  if (typeof inputEmail !== "string" || typeof inputEmail === "undefined")
    throw new Error("Email Address must be a string!");
  if (!emailFormat.test(inputEmail))
    throw new Error("Please enter a valid Email Address!");
};


const validUsername = (username) => {
  if (!username || typeof username != "string" || username.trim().length === 0)
    throw new Error(`Missing Username`);
  username = username.trim();
  const usernameRegex = /^[a-z0-9]{4,}$/i;
  if (!usernameRegex.test(username)) throw new Error(`Invalid Username: The username must be only alphanumeric and have atleast 4 characters`);
};

const validPassword = (password) => {
  // INSTRUCTIONS:
  /**For the password, it must be a valid string (no empty spaces and no spaces but can be any other character
   * including special characters) and should be at least 6 characters long. If it fails any of those conditions,
   * you will throw an error.  The constraints for password will be: There needs to be at least one uppercase
   * character, there has to be at least one number and there has to be at least one special character:
   * for example:  Not valid: test123, test123$, foobar, tS12$ Valid: Test123$, FooBar123*, HorsePull748*% */
  if (!password || typeof password != "string" || password.trim().length === 0)
    throw new Error(`Missing Password`);
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[a-zA-Z\d$@$!%*?&_]{8,}$/;

  if (!passwordRegex.test(password)) throw new Error(`Invalid Password: The password must contain atleast 1 uppercase character, 1 lowercase character, 1 number, 1 special character and be atleast 8 characters long`);
  return true;
};



const validDate = (dateString) => {
  if (!dateString || typeof dateString != "string" || dateString.trim().length === 0)
  throw new Error(`Missing Date`);
  if (!moment(dateString, 'YYYY-MM-DD',true).isValid()) throw new Error(`Invalid Date`);
};

const validDOB = (dateString) => {
  var dobDate = moment().diff(dateString, 'years');
  if (dobDate < 13) throw  new Error(`You must be atleast 13 years of age!`);
};

module.exports = {
  validObjectId: validObjectId,
  validName: validName,
  validString: validString,
  validLogin: validLogin,
  validEmail: validEmail,
  validUsername,
  validPassword,
  validDOB,
  validDate: validDate
};
