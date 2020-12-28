const model = require('../model/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const SECRET = process.env.JWT_SECRET;

function login(req, res, next) {
  const obj = {
    msg: '',
    access_token: '',
  };
  if (req.body.phone) {
    const { phone, pass } = req.body;
    console.log('HERE PHONE');
    model
      .getUserByPhone(phone)
      .then((dbUser) => bcrypt.compare(pass, dbUser.pass))
      .then((match) => {
        if (!match) {
          const error = new Error('Wrong Password - Unathorized');
          obj.msg = 'Wrong Password - Unathorized';
          res.status(404).send(obj.msg);
          next(error);
        } else {
          const token = jwt.sign({ phone: phone }, SECRET);
          obj.msg = 'Logged in';
          res.cookie('access_token', token);
          obj.access_token = token;
          res.status(200).send(obj);
        }
      })
      .catch(next);
  } else if (req.body.email) {
    console.log('HERE EMAIL');
    const { email, pass } = req.body;
    model
      .getUserByEmail(email)
      .then((dbUser) => bcrypt.compare(pass, dbUser.pass))
      .then((match) => {
        if (!match) {
          const error = new Error('Wrong Password - Unathorized');
          obj.msg = 'Wrong Password - Unathorized';
          res.status(404).send(obj.msg);
          next(error);
        } else {
          const token = jwt.sign({ email: email }, SECRET);
          obj.msg = 'Logged in';
          res.cookie('access_token', token);
          obj.access_token = token;
          res.status(200).send(obj);
        }
      })
      .catch(next);
  }
}
//get all appointments:
async function getAppointments(userid) {
  try {
    let data = await model.getAppointments(userid);
    if (!data) {
      data = [];
    }
    return JSON.parse(data);
  } catch (error) {
    next(error);
  }
}

//add  appointments:
function updateAppointments(appointment) {
  const { userid, businessId, hour } = appointment;
  let arr = getAppointments(userid);
  arr.push(appointment);
  model.updateAppointments(JSON.stringify(arr), userid);
}
module.exports = { login, getAppointments, updateAppointments };
