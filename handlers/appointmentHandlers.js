const businessModel = require("../model/businessModel");
const loginHandler = require("../handlers/loginHandler");
const { json } = require("body-parser");

//  we will get this  -> {day: "august/18", hour: "16:30", businessId:5}
const makeAppointmentHandler = (req, res) => {
  const { userid } = req;
  const { day, hour, businessId } = req.body;
  const month = day.split("/")[0];
  const date = day.split("/")[1];
  const tableName = month + "_" + businessId;
  businessModel.getCalendarTable(tableName).then((days) => {
    const dateObj = days.filter((day) => day.daynum == date)[0];
    if (dateObj.isworking) {
      const workingHours = JSON.parse(dateObj.workinghours); //this is parsed array
      let insideWorkingHours = false;
      workingHours.forEach((elem) => {
        console.log(
          "CONFITIOOOOOOOOOON: ",
          Date.parse(`01/01/2011 ${hour}`) >=
            Date.parse(`01/01/2011 ${elem.start}`) &&
            Date.parse(`01/01/2011 ${hour}`) <
              Date.parse(`01/01/2011 ${elem.end}`)
        );
        if (
          Date.parse(`01/01/2011 ${hour}`) >=
            Date.parse(`01/01/2011 ${elem.start}`) &&
          Date.parse(`01/01/2011 ${hour}`) <
            Date.parse(`01/01/2011 ${elem.end}`)
        ) {
          console.log("INSIDE IFFF");
          insideWorkingHours = true;
        }
      });
      console.log("INSIDE WORKING HOURSSSSSSS: ", insideWorkingHours);

      if (insideWorkingHours) {
        console.log("INSIDEEE WORKING HOURSSSSSSS");
        let appointments = JSON.parse(dateObj.appointments);
        let emptyHour = true;
        if (appointments) {
          appointments.forEach((appointment) => {
            if (
              Date.parse(`01/01/2011 ${appointment.hour}`) ===
              Date.parse(`01/01/2011 ${hour}`)
            )
              emptyHour = false;
          });
        }

        if (emptyHour) {
          const appointmentToInsert = {
            hour: hour,
            userid: userid,
          };
          const appointmentToSend = {
            hour: hour,
            businessId: businessId,
            userid: userid,
            date: day,
          };
          if (!appointments) {
            appointments = [];
          }
          appointments.push(appointmentToInsert);
          const stringifiedAppointments = JSON.stringify(appointments);
          businessModel
            .insertAppointments(tableName, date, stringifiedAppointments)
            .then((day) => {
              //call hala's and salah's function, send the appointment(appointmentToInsert) as an argument
              loginHandler.updateAppointments(
                appointmentToSend,
                function (user) {
                  console.log(user);
                  res.status(201).json(user);
                  return;
                }
              );
            })
            .catch((err) => console.log(err));
        } else {
          res.status(400).json("not available");
        }
      } else {
        res.status(400).json("not available");
      }
    } else {
      res.status(400).json("not available");
    }
  });
};

module.exports = {
  makeAppointmentHandler,
};
