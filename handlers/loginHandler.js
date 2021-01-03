const model = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const SECRET = process.env.JWT_SECRET;

function login(req, res, next) {
  const obj = {
    msg: "",
    access_token: "",
    userObj: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      myFavorites: "",
      myAppointments: "",
      isBusinessOwner: "",
    },
  };
  if (req.body.phone) {
    const { phone, pass } = req.body;
    model
      .getUserByPhone(phone)
      .then((dbUser) => {
        obj.userObj = {
          firstname: dbUser.firstname,
          lastname: dbUser.lastname,
          email: dbUser.email,
          phone: dbUser.phone,
          myFavorites: dbUser.myfavorites,
          myAppointments: dbUser.myappointments,
          isBusinessOwner: dbUser.isbusinessowner,
        };
        return bcrypt.compare(pass, dbUser.pass);
      })
      .then((match) => {
        if (!match) {
          const error = new Error("Wrong Password - Unathorized");
          obj.msg = "Wrong Password";
          res.status(404).json(obj.msg);
          next(error);
        } else {
          const token = jwt.sign({ phone: phone }, SECRET);

          obj.msg = "Logged in";
          res.cookie("access_token", token);
          obj.access_token = token;
          res.status(200).json(obj);
        }
      })
      .catch(next);
  } else if (req.body.email) {
    const { email, pass } = req.body;
    model
      .getUserByEmail(email)
      .then((dbUser) => {
        console.log("DBUSEEEEEEEEEEEEEER: ", dbUser);

        if (dbUser.errorMsg) {
          return res.status(404).json(dbUser.errorMsg);
        }
        obj.userObj = {
          firstname: dbUser.firstname,
          lastname: dbUser.lastname,
          email: dbUser.email,
          phone: dbUser.phone,
          myFavorites: dbUser.myfavorites,
          myAppointments: dbUser.myappointments,
          isBusinessOwner: dbUser.isbusinessowner,
        };
        return bcrypt.compare(pass, dbUser.pass);
      })
      .then((match) => {
        if (!match) {
          const error = new Error("Wrong Password - Unathorized");
          obj.msg = "Wrong Password";
          res.status(404).json(obj.msg);
          next(error);
        } else {
          const token = jwt.sign({ email: email }, SECRET);
          obj.msg = "Logged in";
          res.cookie("access_token", token);
          obj.access_token = token;
          res.status(200).send(obj);
        }
      })
      .catch(next);
  }
}

module.exports = { login };
