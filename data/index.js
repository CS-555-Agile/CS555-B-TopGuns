const authRoutes = require("./authRoutes");
const homeRoutes= require('./home');
const appointmentsRoutes= require('./appointment');
const feedbackRoutes = require('./feedbacks');
const blogRoutes = require('./blog');
const entertainmentRoutes = require('./entertainment');

const constructorMethod = (app) => {
  app.use('/', authRoutes);
  app.use('/home', homeRoutes);
  app.use('/appointment', appointmentsRoutes);
  app.use('/feedbacks', feedbackRoutes);
  app.use('/blog', blogRoutes);
  app.use('/entertainment', entertainmentRoutes);
  app.use('*', (req, res) => {
    res.status(404).send("Page not found");
  });
};
module.exports = constructorMethod;
