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
module.exports = { addUser, getUserByPhone, getUserByEmail };
