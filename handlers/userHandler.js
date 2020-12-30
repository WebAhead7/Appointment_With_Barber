const model = require("../model/userModel");
const bcrypt = require("bcryptjs");
//get all appointments:

function getAppointments(userid) {
  return model.getAppointments(userid).then((data) => {
    let parsed = [];

    if (data.myappointments !== null) {
      console.log(data.myappointments);
      parsed = JSON.parse(data.myappointments);
    }

    return parsed;
  });
}

//add  appointments:
function updateAppointments(appointment, callback) {
  console.log("IN UPDAAAAAAAAAAATE");
  const { userid, businessId, hour, date, prevhour, isDeleted } = appointment;
  getAppointments(userid)
    .then((arr) => {
      console.log("ARRR: ", arr);
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
        console.log("the prev os ", prevhour);
        console.log("businessIddd ", businessId);
        console.log("dateeee ", date);

        arr = arr.filter((appt) => {
          console.log("appt.bus: ", appt.businessId);
          console.log("appt.hour: ", appt.hour);
          console.log("appt.date: ", appt.date);

          if (appt.businessId != businessId) return true;
          if (appt.date != date) return true;
          if (appt.hour != prevhour) return true;
          return false;
        });
      }
      if (isDeleted) {
        console.log("42");

        arr = arr.filter((appt) => {
          if (appt.businessId != businessId) return true;
          if (appt.date != date) return true;
          if (appt.hour != hour) return true;
          return false;
        });
        console.log("arr: ", arr);
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
  let {
    email,
    phone,
    firstname,
    lastname,
    isBusinessOwner,
    myAppointments,
  } = req.body;
  let userId = req.userid;
  model
    .updateUser({
      userId,
      email,
      phone,
      firstname,
      lastname,
      isBusinessOwner,
      myAppointments,
    })
    .then((user) => {
      console.log("halalalaaaa");
      if (user == null) {
        throw new Error("something went wrong!");
      } else {
        console.log("user", user);
        res.status(200).json(user);
      }
    })
    .catch(next);
}

function updateUserPassword(req, res, next) {
  let { newPassword } = req.body;
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
          console.log("user", user);
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
