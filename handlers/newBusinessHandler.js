const businessModel = require("../model/businessModel");

const newBusinessHandler = (req, res) => {
  const businessObj = req.body;
  businessModel
    .newBusiness(businessObj)
    .then((business) => {
      return res.status(201).json(business);
    })
    .catch((err) => res.status(500).json(err));
};

module.exports = newBusinessHandler;
