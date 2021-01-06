const businessModel = require("../model/businessModel");
const userHandler = require("../handlers/userHandler");
const { json } = require("body-parser");

//  we will get this  -> {day: "august/18", hour: "16:30", businessId:5}
const makeAppointmentHandler = (req, res) => {
  const { userid } = req;
  const { day, hour, businessId } = req.body;
  console.log("day is: ", day);
  console.log("hour is: ", hour);
  console.log("businessId is: ", businessId);

  const month = day.split("/")[0];
  const date = day.split("/")[1];
  const tableName = month + "_" + businessId;
  businessModel.getCalendarTable(tableName).then((days) => {
    const dateObj = days.filter((day) => day.daynum == date)[0];
    console.log("dataObj is: ", dateObj);
    if (dateObj.isworking) {
      const workingHours = JSON.parse(dateObj.workinghours); //this is parsed array
      let insideWorkingHours = false;
      workingHours.forEach((elem) => {
        //18:00   between 10:00-15:00
        if (
          Date.parse(`01/01/2011 ${hour}`) >=
            Date.parse(`01/01/2011 ${elem.start}`) &&
          Date.parse(`01/01/2011 ${hour}`) <
            Date.parse(`01/01/2011 ${elem.end}`)
        ) {
          insideWorkingHours = true;
        }
      });

      if (insideWorkingHours) {
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
            date: date,
            month: month,
          };
          if (!appointments) {
            appointments = [];
          }
          //localhost:4000/editbusinsess/54
          appointments.push(appointmentToInsert);
          const stringifiedAppointments = JSON.stringify(appointments);
          businessModel
            .insertAppointments(tableName, date, stringifiedAppointments)
            .then((day) => {
              //call hala's and salah's function, send the appointment(appointmentToInsert) as an argument
              userHandler.updateAppointments(
                appointmentToSend,
                function (user) {
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
// this function just update the hour in the same day ,dosnt chek the day itself
const updateAppointmentHandler = (req, res) => {
  const { userid } = req;
  const { day, hour, businessId, prevHour } = req.body;
  const month = day.split("/")[0]; // august
  const dayNum = day.split("/")[1]; // 1
  const tableName = month + "_" + businessId;
  businessModel.getCalendarTable(tableName).then((days) => {
    const wantedDay = days.filter((day) => day.daynum == dayNum)[0];
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
      const foundPrev = appointments.filter(
        (appointment) =>
          Date.parse(`01/01/2011 ${appointment.hour}`) ==
          Date.parse(`01/01/2011 ${prevHour}`)
      );

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

    if (wantedAppointment.length != 0) {
      if (wantedAppointment[0].userid == userid) {
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
