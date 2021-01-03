const db = require("../database/connection");

function addUser({ email, phone, firstname, lastname, pass, isBusinessOwner }) {
  return db.query(
    `INSERT INTO users (email,phone,firstname,lastname,pass,isBusinessOwner) VALUES ($1,$2,$3,$4,$5,$6)`,
    [email, phone, firstname, lastname, pass, isBusinessOwner]
  );
}

function getUserByPhone(phone) {
  return db.query(`SELECT * FROM users WHERE phone=$1`, [phone]).then((res) => {
    if (!res.rows.length) throw new Error("No user with this phone number");
    return res.rows[0];
  });
}
function getUserByEmail(email) {
  return db.query(`SELECT * FROM users WHERE email=$1`, [email]).then((res) => {
    if (!res.rows.length) return { errorMsg: "No user with this email" };
    return res.rows[0];
  });
}

function getUserById(id) {
  return db.query(`SELECT * FROM users WHERE id=$1`, [id]).then((res) => {
    if (!res.rows.length) throw new Error("No user with this id");
    return res.rows[0];
  });
}

function updateUserPassword({ userId, pass }) {
  return db
    .query(
      `UPDATE users set pass=$2 WHERE id=$1 RETURNING 
    email,
    phone,
    firstname,
    lastname,
    isBusinessOwner,
    myAppointments;`,
      [userId, pass]
    )
    .then((user) => user.rows[0]);
}

function isBusinessOwner(id) {
  return db
    .query(`SELECT isBusinessOwner FROM users WHERE id=$1`, [id])
    .then((res) => {
      if (!res.rows.length) throw new Error("No user with this id");
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
        throw new Error("User not found");
      }
      return client.rows[0];
    });
}
function updateAppointments(appt, client_id) {
  return db
    .query(
      `UPDATE users SET myAppointments=$2 WHERE id=$1 RETURNING myappointments`,
      [client_id, appt]
    )
    .then((user) => user.rows[0]);
}

function updateFavorites(fav, client_id) {
  return db
    .query(
      `UPDATE users SET myFavorites=$2 WHERE id=$1 RETURNING myFavorites`,
      [client_id, fav]
    )
    .then((user) => user.rows[0]);
}

// function updating user info:
function updateUser({
  userId,
  email,
  phone,
  firstname,
  lastname,
  isBusinessOwner,
}) {
  return db
    .query(
      `UPDATE users set email=$2,phone=$3,firstname=$4,lastname=$5, isBusinessOwner=$6 WHERE id=$1 RETURNING 
      email,
      phone,
      firstname,
      lastname,
      isBusinessOwner,
      myAppointments;`,
      [userId, email, phone, firstname, lastname, isBusinessOwner]
    )
    .then((user) => user.rows[0]);
}

module.exports = {
  addUser,
  getUserByPhone,
  getUserByEmail,
  checkValid,
  getAppointments,
  updateAppointments,
  getUserById,
  updateUser,
  isBusinessOwner,
  updateFavorites,
  updateUserPassword,
};
