const businessModel = require("../model/businessModel");
const userHandler = require("../handlers/userHandler");
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
          //localhost:4000/editbusinsess/54
          http: appointments.push(appointmentToInsert);
          const stringifiedAppointments = JSON.stringify(appointments);
          businessModel
            .insertAppointments(tableName, date, stringifiedAppointments)
            .then((day) => {
              //call hala's and salah's function, send the appointment(appointmentToInsert) as an argument
              userHandler.updateAppointments(
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

//update appintment
/*
{
	"day": "august/1",
	"hour": "10:00",
 "businessId":3,
	"prevHour":"10:00"
}
*/
const updateAppointmentHandler = (req, res) => {
  const { userid } = req;
  const { day, hour, businessId, prevHour } = req.body;
  const month = day.split("/")[0]; // august
  const dayNum = day.split("/")[1]; // 1
  const tableName = month + "_" + businessId;
  console.log("splitteeeed daynum: ", dayNum);
  businessModel.getCalendarTable(tableName).then((days) => {
    const wantedDay = days.filter((day) => day.daynum == dayNum)[0];
    console.log("WANTED DAAAAY: ", wantedDay);
    let appointments = JSON.parse(wantedDay.appointments);
    let insideWorkingHours = false;
    let validHour = true;
    let workingHoursArr = JSON.parse(wantedDay.workinghours);
    for (let i = 0; i < workingHoursArr.length; i++) {
      if (
        Date.parse(`01/01/2011 ${hour}`) >=
          Date.parse(`01/01/2011 ${workingHoursArr[i].start}`) &&
        Date.parse(`01/01/2011 ${hour}`) <
          Date.parse(`01/01/2011 ${workingHoursArr[i].end}`)
      ) {
        insideWorkingHours = true;
      }
    }
    if (insideWorkingHours) {
      console.log("INSIDEEE WORKIIING HOURS");
      const foundPrev = appointments.filter(
        (appointment) =>
          Date.parse(`01/01/2011 ${appointment.hour}`) ==
          Date.parse(`01/01/2011 ${prevHour}`)
      );
      console.log("found prev is :", foundPrev);
      console.log("found prev is :", foundPrev.length);
      if (foundPrev.length != 0) {
        if (foundPrev[0].userid == userid) {
          for (let i = 0; i < appointments.length; i++) {
            if (
              Date.parse(`01/01/2011 ${appointments[i].hour}`) ==
              Date.parse(`01/01/2011 ${hour}`)
            ) {
              validHour = false;
            }
          }
          if (validHour == true) {
            let filteredArray = appointments.filter(
              (appointment) => appointment.hour != prevHour
            );
            const newAppointment = {
              hour: hour,
              userid: userid,
            };
            filteredArray.push(newAppointment);
            businessModel
              .insertAppointments(
                tableName,
                dayNum,
                JSON.stringify(filteredArray)
              )
              .then((day) => {
                const appointmentToSend = {
                  hour: hour,
                  businessId: businessId,
                  userid: userid,
                  date: dayNum,
                  prevhour: prevHour,
                };
                userHandler.updateAppointments(
                  appointmentToSend,
                  function (user) {
                    console.log(user);
                    res.status(201).json(user);
                    return;
                  }
                );
              });
          } else {
            res.status(404).json("time already booked, choose different time");
          }
        } else {
          res
            .status(401)
            .json("you are not authorized to edit this appointment");
        }
      } else {
        res.status(404).json("There is no prev hours");
      }
    } else {
      res.status(404).json("not working in this hour");
    }
  });
};

/*
{
	"day": "august/1",
	"hour": "10:00",
 "businessId":3
}
*/
//deleteAppointment
const deleteAppointmentHandler = (req, res) => {
  const { userid } = req;
  const { day, hour, businessId } = req.body;
  const month = day.split("/")[0]; // august
  const dayNum = day.split("/")[1]; // 1
  const tableName = month + "_" + businessId;
  businessModel.getCalendarTable(tableName).then((days) => {
    const wantedDay = days.filter((day) => day.daynum == dayNum)[0];
    let appointments = JSON.parse(wantedDay.appointments);
    let wantedAppointment = appointments.filter(
      (appointment) =>
        Date.parse(`01/01/2011 ${appointment.hour}`) ==
        Date.parse(`01/01/2011 ${hour}`)
    );
    console.log("WANTED APPOINTMENT: ", wantedAppointment.length);
    console.log("Wuser id: ", wantedAppointment[0].userid);

    if (wantedAppointment.length != 0) {
      if (wantedAppointment[0].userid == userid) {
        console.log("you are authorized");
        const filteredAppointments = appointments.filter(
          (appointment) =>
            Date.parse(`01/01/2011 ${appointment.hour}`) !=
            Date.parse(`01/01/2011 ${hour}`)
        );
        businessModel
          .insertAppointments(
            tableName,
            dayNum,
            JSON.stringify(filteredAppointments)
          )
          .then((day) => {
            const appointmentToSend = {
              hour: hour,
              businessId: businessId,
              userid: userid,
              date: dayNum,
              isDeleted: true,
            };
            userHandler.updateAppointments(appointmentToSend, function (user) {
              console.log(user);
              res.status(201).json(user);
              return;
            });
          });
      } else {
        res
          .status(401)
          .json("you are not authorized to delete this appointment");
      }
    } else {
      res.status(404).json("no such appointment");
    }
  });
};

module.exports = {
  makeAppointmentHandler,
  updateAppointmentHandler,
  deleteAppointmentHandler,
};
