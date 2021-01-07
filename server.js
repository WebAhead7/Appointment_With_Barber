const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const handleError = require("./middleware/error");
const logger = require("./middleware/logger");
const dotenv = require("dotenv");
//handlers
const signupHandler = require("./handlers/signupHandler");
const loginHandler = require("./handlers/loginHandler");
const getBusinessHandler = require("./handlers/getBusinessHandler");
const editBusinessHandler = require("./handlers/editBusinessHandler");
const newBusinessHandler = require("./handlers/newBusinessHandler");
const verifyUser = require("./middleware/auth");
const appointmentHandlers = require("./handlers/appointmentHandlers");
const { verify } = require("jsonwebtoken");
const favoritesHandlers = require("./handlers/favoritesHandlers");

const userHandler = require("./handlers/userHandler");
dotenv.config();
const port = 4000 || process.env.PORT;
const server = express();

//server use
server.use(cookieParser());
//server.use(express.urlencoded());
server.use(logger);
server.use(cors());
server.use(express.json());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

//routes
server.post("/signup", signupHandler.addUser);
server.post("/login", loginHandler.login);
server.get("/getbusiness/:name", getBusinessHandler.getBusinessHandler);
server.get("/getbusiness", verifyUser, getBusinessHandler.getBusinessHandler);
server.get("/business/:id", verifyUser, getBusinessHandler.getBusinessById);
server.get("/calendar/:name", verifyUser, getBusinessHandler.getCalendarByName);

server.get(
  "/getbusinessbyownerid/",
  verifyUser,
  getBusinessHandler.getBusinessByOwnerId
);
server.post("/newbusiness", verifyUser, newBusinessHandler);
server.put("/editbusinsess/:id", verifyUser, editBusinessHandler);
server.post(
  "/appointment",
  verifyUser,
  appointmentHandlers.makeAppointmentHandler
);
server.put(
  "/appointment/",
  verifyUser,
  appointmentHandlers.updateAppointmentHandler
);
server.delete(
  "/appointment/",
  verifyUser,
  appointmentHandlers.deleteAppointmentHandler
);

server.post("/favorites/", verifyUser, favoritesHandlers.add);
server.delete("/favorites", verifyUser, favoritesHandlers.del);

server.put("/updateUser/", verifyUser, userHandler.updateUser);
server.put("/updateUserPassword/", verifyUser, userHandler.updateUserPassword);

server.get("/user/:id", userHandler.getUserById);
server.use(handleError);

server.listen(port, () =>
  console.log(`Listening to  http://localhost:${port}/`)
);
