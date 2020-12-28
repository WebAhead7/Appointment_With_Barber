const model = require("../model/userModel");
const bcrypt = require("bcryptjs");

const addUser = (req, res, next) => {
  const { email, phone, firstname, lastname, pass, isBusinessOwner } = req.body;
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
          res.status(200).send(response);
        })
        .catch(next)
    );
};

module.exports = { addUser };
