const model = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const SECRET = process.env.JWT_SECRET;

function login(req, res, next) {
  const obj = {
    msg: "",
    access_token: "",
  };
  const { phone, pass } = req.body;
  model
    .getUserByPhone(phone)
    .then((dbUser) => bcrypt.compare(pass, dbUser.pass))
    .then((match) => {
      if (!match) {
        const error = new Error("Wrong Password - Unathorized");
        obj.msg = "Wrong Password - Unathorized";
        res.status(404).send(obj.msg);
        next(error);
      } else {
        const token = jwt.sign({ phone: phone }, SECRET);
        obj.msg = "Logged in";
        res.cookie("access_token", token);
        obj.access_token = token;
        res.status(200).send(obj);
      }
    })
    .catch(next);
}

module.exports = { login };
