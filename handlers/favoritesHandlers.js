const businessModel = require("../model/businessModel");
const userModel = require("../model/userModel");

/*
{
    businessId: ... ,
}
*/
const add = (req, res, next) => {
  const userid = req.userid;
  const { businessId } = req.body;
  userModel
    .getUserById(userid)
    .then((user) => {
      let arr = [];
      if (user.myfavorites != null) {
        arr = JSON.parse(user.myfavorites);
      }
      let isAlreadyFav = false;
      arr.forEach((element) => {
        if (element == businessId) {
          isAlreadyFav = true;
        }
      });

      if (!isAlreadyFav) {
        arr.push(businessId);
      }

      userModel
        .updateFavorites(JSON.stringify(arr), userid)
        .then((user) => {
          console.log("favorites after updated :", user);
          res.status(200).json(user);
        })
        .catch(next);
    })
    .catch(next);
};

const del = (req, res, next) => {
  const userid = req.userid;
  const { businessId } = req.body;
  userModel
    .getUserById(userid)
    .then((user) => {
      let arr = [];
      if (user.myfavorites != null) {
        arr = JSON.parse(user.myfavorites);
      }
      console.log("USEEEER: ", user);
      console.log("userid: ", userid);

      arr = arr.filter((appt) => {
        console.log(appt, businessId);
        return appt != businessId;
      });
      console.log("ARR AFTER FILTER: ", arr);
      userModel
        .updateFavorites(JSON.stringify(arr), userid)
        .then((user) => {
          console.log("favorites after updated :", user);
          res.status(200).json(user);
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  add,
  del,
};
