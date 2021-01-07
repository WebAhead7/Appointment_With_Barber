const model = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const SECRET = process.env.JWT_SECRET;
//get all appointments:

function getAppointments(userid) {
  return model.getAppointments(userid).then((data) => {
    let parsed = [];

    if (data.myappointments !== null) {
      parsed = JSON.parse(data.myappointments);
    }

    return parsed;
  });
}

//add  appointments:
function updateAppointments(appointment, callback) {
  const {
    userid,
    businessId,
    hour,
    date,
    month,
    prevhour,
    isDeleted,
  } = appointment;
  getAppointments(userid)
    .then((arr) => {
      return arr;
    })
    .then((arr) => {
      const appointmentToPush = {
        businessId,
        date,
        hour,
        month,
      };
      //{ userid, businessId, hour, date , prevhour, isDeleted}
      // we have to add & date=date
      if (prevhour) {
        arr = arr.filter((appt) => {
          if (appt.businessId != businessId) return true;
          if (appt.month != month) return true;
          if (appt.date != date) return true;
          if (appt.hour != prevhour) return true;
          return false;
        });
      }
      if (isDeleted) {
        arr = arr.filter((appt) => {
          if (appt.businessId != businessId) return true;
          if (appt.date != date) return true;
          if (appt.hour != hour) return true;
          return false;
        });
      }
      if (isDeleted === undefined) {
        arr.push(appointmentToPush);
      }

      model.updateAppointments(JSON.stringify(arr), userid).then((user) => {
        callback(user);
      });
    });
}

// update user:
function updateUser(req, res, next) {
  console.log("Im nuwrss");
  let { email, phone, firstname, lastname, isBusinessOwner } = req.body;
  let userId = req.userid;
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
  model
    .updateUser({
      userId,
      email,
      phone,
      firstname,
      lastname,
      isBusinessOwner,
    })
    .then((user) => {
      if (user == null) {
        res.status(404).json("something went wrong!");
        // throw new Error("something went wrong!");
      } else {
        const token = jwt.sign({ phone: phone }, SECRET);
        obj.userObj = {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone,
          myFavorites: user.myfavorites,
          myAppointments: user.myappointments,
          isBusinessOwner: user.isbusinessowner,
        };
        obj.msg = "Logged in";
        res.cookie("access_token", token);
        obj.access_token = token;
        res.status(200).json(obj);
      }
    })
    .catch(next);
}

function updateUserPassword(req, res, next) {
  console.log("ana hon bal change pass");
  let { newPassword, oldPassword } = req.body;
  let userId = req.userid;
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
  model
    .getUserById(userId)
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
      return bcrypt.compare(oldPassword, dbUser.pass);
    })
    .then((match) => {
      if (!match) {
        const error = new Error("Wrong Old Password ");
        obj.msg = "Wrong Old Password";
        res.status(404).json(obj.msg);
        next(error);
      } else {
        bcrypt
          .genSalt(10)
          .then((salt) => bcrypt.hash(newPassword, salt))
          .then((hash) =>
            model
              .updateUserPassword({
                userId,
                pass: hash,
              })
              .then((user) => {
                res.status(200).send(user);
              })
              .catch(next)
          );
      }
    })
    .catch(next);
}

const getUserById = (req, res, next) => {
  const { id } = req.params;
  model
    .getUserById(id)
    .then((user) => {
      const objToSend = {
        firstname: user.firstname,
        lastname: user.lastname,
      };
      return res.status(200).json(objToSend);
    })
    .catch(next);
};

module.exports = {
  getAppointments,
  updateAppointments,
  updateUser,
  updateUserPassword,
  getUserById,
};
