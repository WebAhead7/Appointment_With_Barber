const model = require("../model/userModel");
const bcrypt = require("bcryptjs");

const addUser = (req, res, next) => {
  const obj = { msg: "" };
  const { email, phone, firstname, lastname, pass, isBusinessOwner } = req.body;
  model
    .checkValid(email, phone)
    .then((checked) => {
      if (!checked) {
        const error = new Error("email or phone already exists");
        obj.msg = "email or phone already exists";
        res.status(404).json(obj.msg);
      }
      if (checked === true) {
        bcrypt
          .genSalt(10)
          .then((salt) => bcrypt.hash(pass, salt))
          .then((hash) =>
            model
              .addUser({
                email,
                phone,
                firstname,
                lastname,
                pass: hash,
                isBusinessOwner,
              })
              .then(() => {
                const response = {
                  message: "you have successfully signed up",
                };
                res.status(200).json(response);
              })
              .catch(next)
          );
      }
    })
    .catch(next);
};

module.exports = { addUser };
