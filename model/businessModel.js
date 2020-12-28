const db = require('../database/connection');

//getBusiness
const getBusiness = (name) => {
  return db.query('SELECT * FROM business').then((businesses) => {
    if (name) {
      const businessesArr = businesses.rows;
      const filteredArr = businessesArr.filter(
        (business) =>
          business.businessname.includes(name) ||
          business.businessaddress.includes(name)
      );
      return filteredArr;
    } else {
      return businesses.rows;
    }
  });
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
      'INSERT INTO business (businessname,ownerid,phone,businessaddress,geolocation) VALUES ($1,$2,$3,$4,$5) RETURNING *;',
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
  const tableName = month + '_' + businessId;
  db.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
    //Now in the following command we will create the table
    db.query(
      `CREATE TABLE ${tableName} (id SERIAL PRIMARY KEY,workinghours TEXT, isWorking Boolean, appointments VARCHAR(255), diff INTEGER)`
    )
      .then(() => {
        console.log('Table Created');
        initDays(days, tableName);
      })
      .catch((err) => console.log('Error: ', err));
  });
};

//initDays, this function sets the columns of the tableName(that is in the argument)
const initDays = (days, tableName) => {
  for (let i = 0; i < days.length; i++) {
    const stringifiedWorkingHours = JSON.stringify(days[i].workinghours);
    console.log('STRINGIFIEEED: ', stringifiedWorkingHours);
    db.query(
      `INSERT INTO ${tableName} (workinghours,isworking,diff) VALUES($1,$2,$3)`,
      [stringifiedWorkingHours, days[i].isworking, days[i].diff]
    ).then(() => console.log('Added'));
  }
};

// db.query("SELECT workinghours FROM august_40 WHERE id=1").then((object) => {
//   console.log("OBJEEEEEEEEEEEEEEECT: ", object.rows[0]);
// });

//editBusiness
/*const editBusiness = (businessId, businessId) => {
  const {
    businessname,
    ownerid,
    phone,
    businessaddress,
    geolocation,
    calendar,
  };
  db.query(
    `UPDATE business set businessname=$1,ownerid=$2,phone=$3,businessaddress=$4,geolocation=$5 WHERE id=$6 RETURNING *;`,
    [businessname, ownerid, phone, businessaddress, geolocation, businessId]
  )
  .then(business=>{
    if(calendar){
      updateCalendarTable(calendar,businessId);
    }
    return business.rows[0];
  });
};*/

const updateCalendarTable = (calendar, businessId) => {
  const { month, days } = calendar;
  const tableNameToUpdate = month + '_' + businessId;
  for (let i = 0; i < days.length; i++) {
    db.query(`INSERT INTO ${tableNameToUpdate} ()`);
  }
};

module.exports = {
  getBusiness,
  newBusiness,
};
