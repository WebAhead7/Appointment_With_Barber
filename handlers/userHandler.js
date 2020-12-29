const model = require("../model/userModel");
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
        arr = arr.filter((appt) => {
          appt.businessId != businessId &&
            appt.hour != prevhour &&
            appt.date != date;
        });
      }
      if (isDeleted) {
        arr = arr.filter((appt) => {
          appt.businessId != businessId &&
            appt.hour != hour &&
            appt.date != date;
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

module.exports = { getAppointments, updateAppointments, updateUser };
