const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const handleError = require('./middleware/error');
const logger = require('./middleware/logger');
const dotenv = require('dotenv');
//handlers
const signupHandler = require('./handlers/signupHandler');
const loginHandler = require('./handlers/loginHandler');
const getBusinessHandler = require('./handlers/getBusinessHandler');
const editBusinessHandler = require('./handlers/editBusinessHandler');
const newBusinessHandler = require('./handlers/newBusinessHandler');
const verifyUser = require('./middleware/auth');

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
server.post('/signup', signupHandler.addUser);
server.post('/login', loginHandler.login);
server.get('/getbusiness/:name', getBusinessHandler);
server.get('/getbusiness', getBusinessHandler);
server.post('/newbusiness', verifyUser, newBusinessHandler);
server.put('/editbusinsess/:id', verifyUser, editBusinessHandler);

server.get('/appointments/:id', loginHandler.getAppointments);

server.use(handleError);

server.listen(port, () =>
  console.log(`Listening to  http://localhost:${port}/`)
);
