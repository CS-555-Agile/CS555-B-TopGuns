const express = require("express");
const router = express.Router();
const xss = require("xss");
const dotenv = require("dotenv");
dotenv.config();
const { users: userData } = require("../data");
const {
  validEmail,
  validPassword,
  validName,
  // validDate,
  // validDOB,
  // validUsername,
} = require("../helpers/validations");

router.route("/").get(async(req,res) => {
  console.log("Root route");
  if(!req.session.user || !req.session.user.verified) {
    // return res.redirect("/login");
    return res
          .status(200)
          .render("landing/landingPage", {
            title: "LandingPage",
            css: "auth-css",
          });
  } else {
    return res.redirect("/home");
  }
})

router
  .route("/login")
  .get(async (req, res) => {
    //code here for GET
    try {
      if (!req.session.user?.verified) {
        return res
          .status(200)
          .render("auth/signup", {
            title: "Login",
            partial: "signup-script",
            css: "signup-css",
          });
      } else {
        return res.redirect("/home");
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
      let { emailInput, passwordInput } = req.body;
      emailInput = xss(emailInput);
      passwordInput = xss(passwordInput);

      validEmail(emailInput);
      validPassword(passwordInput);
    } catch (err) {
      console.log("Line 96", err);
      return res.status(err?.status ?? 400).render("auth/signup", {
        title: "Login",
        error: err?.message ?? err,
        partial: "signup-script",
        css: "signup-css",
      });
    }

    try {
      let { emailInput, passwordInput } = req.body;
      emailInput = xss(emailInput);
      passwordInput = xss(passwordInput);

      const existingUser = await userData.checkUser(emailInput, passwordInput);
      if (existingUser) {
        req.session.user = existingUser;
        req.session.user.verified = true;
        // return res.redirect("otp");
        return res.status(200).redirect("/home");
      } else {
        console.log("Line 115 .......", err);
        return res.status(err?.status ?? 500).render("auth/signup", {
          title: "Login",
          error: err?.message ?? err,
          partial: "signup-script",
          css: "signup-css",
        });
      }
    } catch (err) {
      console.log("Line 124", err);
      return res.status(err?.status ?? 500).render("auth/signup", {
        title: "Login",
        error: err?.message ?? err,
        partial: "signup-script",
        css: "signup-css",
      });
    }
  });

router
  .route("/signup")
  .get(async (req, res) => {
    //code here for GET
    try {
      if (!req.session.user || !req.session.user.verified) {
        return res
          .status(200)
          .render("auth/signup", {
            title: "Sign-up",
            partial: "signup-script",
            css: "signup-css",
          });
      } else {
        return res.redirect("/home");
      }
    } catch (err) {
      console.log(err);
      return res.status(err?.status ?? 500).render("auth/signup", {
        title: "Sign-up",
        partial: "signup-script",
        css: "signup-css",
        error: err?.message ?? err,
      });
    }
  })
  .post(async (req, res) => {
    try {
      const {
        firstnameInput,
        lastnameInput,
        // DOBInput,
        // usernameInput,
        emailInput,
        passwordInput,
      } = req.body; // TODO: Input Validation
      validEmail(emailInput);
      validName(firstnameInput);
      validName(lastnameInput);
      // validDate(DOBInput);
      // validDOB(DOBInput);
      // validUsername(usernameInput);
      validPassword(passwordInput);
    } catch (err) {
      console.log(err, "Line 160");
      return res.status(err?.status ?? 400).render("auth/signup", {
        title: "Sign-up",
        partial: "signup-script",
        css: "signup-css",
        error: err?.message ?? err,
      });
    }
    try {
      let {
        firstnameInput,
        lastnameInput,
        // DOBInput,
        // usernameInput,
        emailInput,
        passwordInput,
      } = req.body;
      firstnameInput = xss(firstnameInput);
      lastnameInput = xss(lastnameInput);
      // DOBInput = xss(DOBInput);
      // usernameInput = xss(usernameInput);
      emailInput = xss(emailInput);
      passwordInput = xss(passwordInput);

      const newUser = await userData.createUser(
        firstnameInput,
        lastnameInput,
        // DOBInput,
        // usernameInput,
        emailInput,
        passwordInput
      );
      if (!newUser.insertedUser) {
        console.log(err, "Line 194");
        return res.status(err?.status ?? 500).render("auth/signup", {
          title: "Sign-up",
          partial: "signup-script",
          css: "signup-css",
          error: err?.message ?? err,
        });
      } else {
        return res.redirect("/signup");
      }
    } catch (err) {
      console.log(err, "Line 206");
      return res.status(err?.status ?? 500).render("auth/signup", {
        title: "Sign-up",
        partial: "signup-script",
        css: "signup-css",
        error: err?.message ?? err,
      });
    }
  });



router.route("/logout").get(async (req, res) => {
  //code here for GET
  req.session.destroy();
  return res.render("landing/landingPage", {
    title: "Logged out",
    partial: "auth-script",
    css: "landing-css",
  });
});

module.exports = router;

