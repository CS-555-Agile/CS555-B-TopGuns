
const authRoutes = require("./authRoutes");
const homeRoutes= require('./home');

const constructorMethod = (app) => {
  app.use('/', authRoutes);
  app.use('/home', homeRoutes);
  

  app.use('*', (req, res) => {
    res.status(404).send("Page not found");
  });
};
module.exports = constructorMethod;
