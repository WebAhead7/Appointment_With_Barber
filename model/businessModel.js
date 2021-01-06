const db = require("../database/connection");

//getBusiness by search
const getBusiness = (name) => {
  return db.query("SELECT * FROM business").then((businesses) => {
    if (name) {
      const businessesArr = businesses.rows;
      const filteredArr = businessesArr.filter(
        (business) =>
          business.businessname.toLowerCase().includes(name.toLowerCase()) ||
          business.businessaddress.toLowerCase().includes(name.toLowerCase())
      );
      return filteredArr;
    } else {
      return businesses.rows;
    }
  });
};

const getBusinessByOwnerId = (ownerid) => {
  return db
    .query("SELECT * FROM business WHERE ownerid=$1", [ownerid])
    .then((businesses) => businesses.rows);
};

//getBusinessById
const getBusinessById = (id) => {
  return db
    .query("SELECT * FROM business WHERE id=$1", [id])
    .then((businesses) => businesses.rows[0]);
};

//newBusiness
const newBusiness = ({
  businessname,
  ownerid,
  phone,
  businessaddress,
  geolocation,
  calendar,
}) => {
  return db
    .query(
      "INSERT INTO business (businessname,ownerid,phone,businessaddress,geolocation) VALUES ($1,$2,$3,$4,$5) RETURNING *;",
      [businessname, ownerid, phone, businessaddress, geolocation]
    )
    .then((business) => {
      if (calendar) {
        createCalendarTable(calendar, business.rows[0].id);
      }
      return business.rows[0];
    });
};

//createCalendarTable, this function creates a table for a specific month and buusiness id
const createCalendarTable = (calendar, businessId) => {
  const { month, days } = calendar;
  const tableName = month + "_" + businessId;
  db.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
    //Now in the following command we will create the table
    db.query(
      `CREATE TABLE ${tableName} (id SERIAL PRIMARY KEY,workinghours TEXT, isWorking Boolean, appointments TEXT, diff INTEGER,daynum INTEGER)`
    )
      .then(() => {
        initDays(days, tableName);
      })
      .catch((err) => {
        throw err;
      });
  });
};

//initDays, this function sets the columns of the tableName(that is in the argument)
const initDays = (days, tableName) => {
  for (let i = 0; i < days.length; i++) {
    const stringifiedWorkingHours = JSON.stringify(days[i].workinghours);
    /*var obj = JSON.parse('{"workinghours":' + days[i].workinghours + "}");
    const stringifiedWorkingHours = JSON.stringify(obj);*/

    db.query(
      `INSERT INTO ${tableName} (workinghours,isworking,diff,daynum) VALUES($1,$2,$3,$4)`,
      [stringifiedWorkingHours, days[i].isworking, days[i].diff, days[i].daynum]
    ).then(() => console.log("Added"));
  }
};

//editBusiness
const editBusiness = (businessId, businessObj) => {
  const {
    businessname,
    ownerid,
    phone,
    businessaddress,
    geolocation,
    calendar,
  } = businessObj;
  return db
    .query(
      `UPDATE business set businessname=$1,ownerid=$2,phone=$3,businessaddress=$4,geolocation=$5 WHERE id=$6 RETURNING *;`,
      [businessname, ownerid, phone, businessaddress, geolocation, businessId]
    )
    .then((business) => {
      if (calendar) {
        updateCalendarTable(calendar, businessId);
      }
      return business.rows[0];
    });
};

const updateCalendarTable = (calendar, businessId) => {
  const { month, days } = calendar;
  const tableNameToUpdate = month + "_" + businessId;
  getCalendarTable(tableNameToUpdate)
    .then((res) => {
      console.log("117: ", res);
      if (res.msg) throw Error(res);
      if (res.length > 0) {
        for (let i = 0; i < days.length; i++) {
          const stringifiedWorkingHours = JSON.stringify(days[i].workinghours);
          db.query(
            `UPDATE  ${tableNameToUpdate} SET workinghours=$1,isworking=$2,diff=$3 WHERE daynum=${days[i].daynum}`,
            [stringifiedWorkingHours, days[i].isworking, days[i].diff]
          ).then(() => console.log("Edited"));
        }
      }
    })
    .catch((err) => {
      console.log("line 128");
      createCalendarTable(calendar, businessId);
    });
};

//getCalendarTable
const getCalendarTable = (tableName) => {
  return db
    .query(`SELECT * FROM ${tableName}`)
    .then((tableData) => {
      return tableData.rows;
    })
    .catch((err) => {
      return { msg: "Calendar Does Not Exist" };
    });
};

//insertAppointment
const insertAppointments = (tableName, date, appointments) => {
  return db
    .query(
      `UPDATE ${tableName} SET appointments=$1 WHERE daynum=$2 RETURNING *`,
      [appointments, date]
    )
    .then((day) => day.rows[0]);
};

module.exports = {
  getBusiness,
  newBusiness,
  editBusiness,
  getCalendarTable,
  insertAppointments,
  getBusinessByOwnerId,
  getBusinessById,
};
