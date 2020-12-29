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
function updateAppointments(appointment, callback) {
  console.log("IN UPDAAAAAAAAAAATE");
  const { userid, businessId, hour, date, prevhour } = appointment;
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
      //{ userid, businessId, hour, date , prevhour}

      if (prevhour) {
        arr = arr.filter((appt) => {
          appt.businessId == businessId && appt.hour != prevhour;
        });
      } else if (prevhour == null) {
        throw new Error("prev hour with no value! ");
      }

      arr.push(appointmentToPush);
      model.updateAppointments(JSON.stringify(arr), userid).then((user) => {
        callback(user);
      });
    });
}

module.exports = { getAppointments, updateAppointments };
