const model = require("../model/userModel");
//get all appointments:

function getAppointments(userid) {
  return model.getAppointments(userid).then((data) => {
    let parsed = [];

    if (data.myappointments !== null) {
      console.log(data.appointments);
      parsed = JSON.parse(data.myappointments);
    }

    return parsed;
  });
}

//add  appointments:
function updateAppointments(appointment, clabback) {
  console.log("IN UPDAAAAAAAAAAATE");
  const { userid, businessId, hour, date } = appointment;
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
      arr.push(appointmentToPush);
      model.updateAppointments(JSON.stringify(arr), userid).then((user) => {
        clabback(user);
      });
    });
}

module.exports = { getAppointments, updateAppointments };
