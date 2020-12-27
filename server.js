const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const handleError = require("./middleware/error");
const logger = require("./middleware/logger");
const dotenv = require("dotenv");
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
//handlers
const signupHandler = require("./handlers/signupHandler");
const loginHandler = require("./handlers/loginHandler");
const getBusinessHandler = require("./handlers/getBusiness");
const editBusinessHandler = require("./handlers/editBusiness");
const newBusinessHandler = require("./handlers/newBusinessHandler");
const auth = require("./middleware/auth");
//routes
server.post("/signup", signupHandler.addUser);
// server.post("/login", auth, loginHandler);
// server.get("/business/:name", auth, getBusinessHandler);
// server.put("/editbusinsess/:id", auth, editBusinessHandler);
// server.post("/newbusinsess/", auth, newBusinessHandler);

server.use(handleError);

server.listen(port, () =>
  console.log(`Listening to  http://localhost:${port}/`)
);
