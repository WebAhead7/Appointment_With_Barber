const businessModel = require("../model/businessModel");

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
          if (!appointments) {
            appointments = [];
          }
          appointments.push(appointmentToInsert);
          const stringifiedAppointments = JSON.stringify(appointments);
          businessModel
            .insertAppointments(tableName, date, stringifiedAppointments)
            .then((day) => console.log("day inserted: ", day));
        }
      }
    }
  });
};

module.exports = {
  makeAppointmentHandler,
};
