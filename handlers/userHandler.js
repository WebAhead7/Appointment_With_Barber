const model = require("../model/userModel");
const bcrypt = require("bcryptjs");
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
  const { userid, businessId, hour, date, prevhour, isDeleted } = appointment;
  getAppointments(userid)
    .then((arr) => {
      return arr;
    })
    .then((arr) => {
      const appointmentToPush = {
        businessId,
        date,
        hour,
      };
      //{ userid, businessId, hour, date , prevhour, isDeleted}
      // we have to add & date=date
      if (prevhour) {
        arr = arr.filter((appt) => {
          if (appt.businessId != businessId) return true;
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
        res.status(200).json(user);
      }
    })
    .catch(next);
}

function updateUserPassword(req, res, next) {
  console.log("ana hon bal change pass");
  let { newPassword, oldPassword } = req.body;
  let userId = req.userid;
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

module.exports = {
  getAppointments,
  updateAppointments,
  updateUser,
  updateUserPassword,
};
