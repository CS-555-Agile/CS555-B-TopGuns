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



const server = require('http').createServer(app);
const io = require('socket.io')(server);
let clientSocketIds = [];
let connectedUsers= [];
let roomList=[];
let roomFlag = false;

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
    if(req && req.session && req.session.user && req.session.user.verified) {
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

const getSocketByUserId = (userId) =>{
  let socket = '';
  for(let i = 0; i<clientSocketIds.length; i++) {
      if(clientSocketIds[i].userId == userId) {
          socket = clientSocketIds[i].socket;
          break;
      }
  }
  return socket;
}

/* socket function starts */
io.on('connection', socket => {
  console.log('conected')
  socket.on('disconnect', () => {
      console.log("disconnected")
      
      connectedUsers = connectedUsers.filter(item => item.socketId != socket.id);
      console.log(connectedUsers)
      let disconnect_room = ''
      for (const item of roomList) {
        if (connectedUsers.find((obj) => obj.user_id === item.userId && obj.user_id === item.withUserId)){
          continue;
        }
        else{
          disconnect_room = item.room
          roomList.pop(item);
          break
        }
      }
      io.emit('updateUserList', connectedUsers)
      io.emit('updateWindow', disconnect_room)
  });

  socket.on('loggedin', function(user) {
      clientSocketIds.push({socket: socket, userId:  user.user_id});
      connectedUsers = connectedUsers.filter(item => item.user_id != user.user_id);
      connectedUsers.push({...user, socketId: socket.id})
      io.emit('updateUserList', connectedUsers)
  });

  socket.on('create', function(data) {
      console.log("create room",data)
      for (const item of roomList) {
        if ((item.userId === data.userId || item.userId === data.withUserId) && (item.withUserId === data.userId || item.withUserId === data.withUserId && (item.room != data.room)) ) {
          console.log("They already have a room");
          roomFlag = true
          data = item
          break;
        }
      }
     
      if(roomFlag===true){
        socket.join(data.room);
        let withSocket = getSocketByUserId(data.withUserId);
        socket.broadcast.to(withSocket.id).emit("invite",{room:data})
        io.emit('openChatWindow',data)
    }
   else{
     
    socket.join(data.room);
    let withSocket = getSocketByUserId(data.withUserId);
    socket.broadcast.to(withSocket.id).emit("invite",{room:data})
    roomList.push(data);
    io.emit('openChatWindow',data)
   }




      
  });
  socket.on('joinRoom', function(data) {
    console.log("joinn",data)
      socket.join(data.room.room);
  });
 
  socket.on('message', function(data) {
    console.log("message" , data)
    console.log("message" , socket.id)
      socket.join(data.room);
      socket.to(data.room).emit('message', data);
  })
});
/* socket function ends */
configRoutes(app);


server.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});


module.exports = app;
