function makeid(length) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for(let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

$(document).ready(function() {
  $("#signup-form").submit(function (e) {
    let errorDiv = $("#error-div");
    // Validations
    // Firstname validation
    let signupBool = true;
    let firstname = $("#firstnameInput").val();
    if (!firstname || typeof firstname !== "string" || typeof firstname === "undefined" || firstname.trim().length === 0) {
      $("#error-div").text("Missing Firstname");
      signupBool = false;
    }
    let format = /[`0123456789!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?~]/;
    if (firstname.length < 3 || format.test(firstname)) {
      $("#error-div").text("Firstname must be atleast 3 characters long and should not contain special characters or numbers");
      signupBool = false;
    }

    // Lastname validation
    let lastname = $("#firstnameInput").val();
    if (!lastname || typeof lastname !== "string" || typeof lastname === "undefined" || lastname.trim().length === 0) {
      $("#error-div").text("Missing Firstname");
      signupBool = false;
    }
    if (lastname.length < 3 || format.test(lastname)) {
      $("#error-div").text("Firstname must be atleast 3 characters long and should not contain special characters or numbers");
      signupBool = false;
    }

    // Username validation
    let username = $("#usernameInput").val();
    const usernameRegex = /^[a-z0-9]{4,}$/i;
    if (!username || typeof username != "string" || username.trim().length === 0) {
      $("#error-div").text("Missing Username");
      signupBool = false;
    } else if (!usernameRegex.test(username)) {
      $("#error-div").text("Invalid Username: The username must be only alphanumeric and have atleast 4 characters");
      signupBool = false;
    };

    // Email validation
    let email = $("#emailInput").val();
    const emailFormat =
    /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/g;
    if (!email || typeof email != "string" || email.trim().length === 0) {
      $("#error-div").text("Missing Email");
      signupBool = false;
    } else if (!emailFormat.test(email.trim())) {
      $("#error-div").text("Invalid Email");
      signupBool = false;
    }

    // Password validation
    let password = $("#passwordInput").val().trim();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&_]{8,}$/;
    if (!password || typeof password != "string" || password.trim().length === 0) {
      $("#error-div").text("Missing Password");
      signupBool = false;
    } else if (!passwordRegex.test(password)) {
      $("#error-div").text("Invalid Password: The password must contain atleast 1 uppercase character, 1 lowercase character, 1 number, 1 special character and be atleast 8 characters long");
      signupBool = false;
    }

    // Date validation
    let dob = $("#DOBInput").val().trim();
    let today = new Date();
    let birthDate = new Date(dob);
    if (!dob ||!birthDate || !(birthDate instanceof Date)) {
      $("#error-div").text("Invalid Date");
      signupBool = false;
    }
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if (age < 13) {
      $("#error-div").text("You must be atleast 13 years old to register!");
      signupBool = false;
    }

    if (signupBool) {
      errorDiv.hide();
      // proceed to post request
      let requestConfig = {
        method: "POST",
        url: "/signup",
        contentType: "application/json",
        data: JSON.stringify({
          usernameInput: username,
          firstnameInput: firstname,
          lastnameInput: lastname,
          emailInput: email,
          passwordInput: password,
          DOBInput: dob,
        }),
      };
      $.ajax(requestConfig).then(function (responseMessage) {
        if (responseMessage != false) {
          console.log(responseMessage);
        } else {
          // no accepted
          console.log(responseMessage);
          errorDiv.text(responseMessage);
          errorDiv.show();
        }
      });
    } else {
      // error
      errorDiv.show();
    }
  });

  $("#login-form").submit(function (e) {});


});
