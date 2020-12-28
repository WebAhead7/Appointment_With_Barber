const businessModel = require('../model/businessModel');

const newBusinessHandler = (req, res) => {
  console.log('businessHandler: ', req.userid);
  const businessObj = req.body;
  businessModel
    .newBusiness(businessObj)
    .then((business) => {
      return res.status(201).json(business);
    })
    .catch((err) => res.status(500).json(err));
};

module.exports = newBusinessHandler;
