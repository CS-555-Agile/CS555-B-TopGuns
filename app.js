// Setup server, session and middleware here.
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
// const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");
const configRoutes = require("./routes");
const { users } = require("./config/mongoCollections");


const app = express();

const static_ = express.static(__dirname + "/public");
const loginRoutes = require('./routes/authRoutes');

const Handlebars = require('handlebars');
const handlebarsHelpers = require('handlebars-helpers');
// Handlebars.registerHelpers(handlebarsHelpers);

const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === 'number')
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    }
  },
  partialsDir: ['views/partials/']
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", static_);

app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");
app.use(
  session({
    name: "HarmonyAuthCookie",
    secret: "Where healing meets helping hand!",
    saveUninitialized: false,
    resave: true,
    cookie: { maxAge: 6000000 },
    
  })
);

// MIDDLEWARE GOES BELOW:

// LOGGING MIDDLEWARE
app.use(async (req, res, next) => {
  const dateString = new Date().toUTCString();
  const reqMethod = req.method;
  const reqRoute = req.originalUrl;
  console.log(`[${dateString}]: ${reqMethod} ${reqRoute}`);
  next();
});

// AUTH MIDDLEWARE FOR ALL PATHS EXCEPT AUTH PATHS
app.use('*', async(req, res, next) => {
  const reqPath = req.originalUrl;
  if (reqPath == '/login' || reqPath == '/signup' ) {
    if(req.session?.user?.verified) {
      return res.redirect("/home");
    }
  } else if (!req.session.user || !req.session.user.verified) {
    return res
    .status(200)
    .render("landing/landingPage", {
      title: "LandingPage",
      partial:"landing-script",
      css: "landing-css",
    });
  }
  next();
})


configRoutes(app);


app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
module.exports = app;
