const businessModel = require("../model/businessModel");

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
  const { ownerId } = req.params;
  businessModel
    .getBusinessByOwnerId(ownerId)
    .then((businesses) => {
      res.status(200).json(businesses);
    })
    .catch((err) => res.status(500).json(err));
};

module.exports = {
  getBusinessHandler,
  getBusinessByOwnerId,
};
