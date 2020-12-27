const db = require("../database/connection");

function addUser({ email, phone, firstname, lastname, pass, isBusinessOwner }) {
  return db.query(
    `INSERT INTO users (email,phone,firstname,lastname,pass,isBusinessOwner) VALUES ($1,$2,$3,$4,$5,$6)`,
    [email, phone, firstname, lastname, pass, isBusinessOwner]
  );
}

module.exports = { addUser };
