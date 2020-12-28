const db = require('../database/connection');

function addUser({ email, phone, firstname, lastname, pass, isBusinessOwner }) {
  return db.query(
    `INSERT INTO users (email,phone,firstname,lastname,pass,isBusinessOwner) VALUES ($1,$2,$3,$4,$5,$6)`,
    [email, phone, firstname, lastname, pass, isBusinessOwner]
  );
}

function getUserByPhone(phone) {
  return db.query(`SELECT * FROM users WHERE phone=$1`, [phone]).then((res) => {
    if (!res.rows.length) throw new Error('No user with this phone number');
    return res.rows[0];
  });
}
function getUserByEmail(email) {
  return db.query(`SELECT * FROM users WHERE email=$1`, [email]).then((res) => {
    if (!res.rows.length) throw new Error('No user with this email');
    return res.rows[0];
  });
}

// checking if email or phone number already exists:
function checkValid(email, phone) {
  return db
    .query(`SELECT * FROM users WHERE email=$1 OR phone=$2`, [email, phone])
    .then((res) => {
      if (res.rows.length > 0) return false;
      return true;
    });
}

// adding appointments to the users' table:

function getAppointments(client_id) {
  // console.log('usermodel id: ', client_id);
  return db
    .query(`SELECT myAppointments FROM users WHERE id=$1`, [client_id])
    .then((client) => {
      if (!client.rows.length) {
        throw new Error('User not found');
      }
      return client.rows[0];
    });
}
function updateAppointments(appt, client_id) {
  return db.query(`UPDATE users SET myAppointments=$2 WHERE id=$1`, [
    client_id,
    appt,
  ]);
}
module.exports = {
  addUser,
  getUserByPhone,
  getUserByEmail,
  checkValid,
  getAppointments,
  updateAppointments,
};
