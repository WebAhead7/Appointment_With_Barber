const businessModel = require("../model/businessModel");
const userModel = require("../model/userModel");
//getBusinessHandler
const getBusinessHandler = (req, res) => {
  const { name } = req.params;
  businessModel
    .getBusiness(name)
    .then((businesses) => {
      res.status(200).json(businesses);
    })
    .catch((err) => res.status(500).json(err));
};

// get all the busnieses by owner id
const getBusinessByOwnerId = (req, res, next) => {
  const ownerId = req.userid;
  console.log("ownerr idddd", ownerId);
  businessModel
    .getBusinessByOwnerId(ownerId)
    .then((businesses) => {
      res.status(200).json(businesses);
    })
    .catch((err) => res.status(500).json(err));
};

const getBusinessById = (req, res, next) => {
  const { id } = req.params;
  const obj = {
    firstname: "",
    lastname: "",
    phone: "",
    businessObj: {},
  };
  businessModel
    .getBusinessById(id)
    .then((business) => {
      obj.businessObj = business;
      console.log("OWNER IDDDD: ", business.ownerid);
      userModel
        .getUserById(business.ownerid)
        .then((user) => {
          console.log("USEEEEEER: ", user);
          console.log("useer firstnaaaame: ", user.firstname);
          obj.firstname = user.firstname;
          obj.lastname = user.lastname;
          obj.phone = user.phone;
          return res.status(200).json(obj);
        })
        .catch(next);
    })
    .catch(next);
};

const getCalendarByName = (req, res, next) => {
  const { name } = req.params;
  businessModel
    .getCalendarTable(name)
    .then((calendar) => {
      return res.status(200).json(calendar);
    })
    .catch(next);
};

module.exports = {
  getBusinessHandler,
  getBusinessByOwnerId,
  getBusinessById,
  getCalendarByName,
};
