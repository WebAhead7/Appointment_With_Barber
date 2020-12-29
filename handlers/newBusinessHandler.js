const businessModel = require("../model/businessModel");
const userModel = require("../model/userModel");

const newBusinessHandler = (req, res, next) => {
  const { ownerid } = req.body;
  console.log("owneeeeeer i : ", ownerid);
  userModel
    .isBusinessOwner(ownerid)
    .then((bool) => {
      console.log("boooooool: ", bool);
      if (bool.isbusinessowner) {
        const businessObj = req.body;
        businessModel
          .newBusiness(businessObj)
          .then((business) => {
            return res.status(201).json(business);
          })
          .catch((err) => res.status(500).json(err));
      } else {
        res.status(401).json("you are not a business owner");
      }
    })
    .catch(next);
};

module.exports = newBusinessHandler;
