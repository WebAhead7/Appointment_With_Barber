const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const model = require("../model/userModel");

dotenv.config();
const SECRET = process.env.JWT_SECRET;

function verifyUser(req, res, next) {
  const token = req.headers.token;

  console.log("IN AUTH");
  console.log(" TOKEN IS: ", token);

  if (!token) {
    const error = new Error("Authorization token is required");
    error.status = 400;
    next(error);
  } else {
    try {
      // if verification fails JWT throws an error, hence the try/catch
      const tokenData = jwt.verify(token, SECRET);
      if (tokenData.phone) {
        model
          .getUserByPhone(tokenData.phone)
          .then((user) => {
            req.userid = user.id;
            // req.phone = user;
            // console.log(req.phone);
            // res.cookies = user;
            // console.log(res.cookies);
            next();
          })
          .catch((err) => {
            next(err);
          });
      } else if (tokenData.email) {
        model
          .getUserByEmail(tokenData.email)
          .then((user) => {
            req.userid = user.id;
            // req.phone = user;
            // console.log(req.phone);
            // res.cookies = user;
            // console.log(res.cookies);
            next();
          })
          .catch((err) => {
            next(err);
          });
      }
    } catch (error_we_dont_use) {
      // catch statements have to capture an error variable, even if you don't need it
      // we don't use the caught error, since we know it came from jwt.verify
      const error = new Error("Unauthorized - No token");
      error.status = 401;
      next(error);
    }
  }
}

module.exports = verifyUser;
