const businessModel = require("../model/businessModel");

const editBusinessHandler = (req, res) => {
  const { id } = req.params;
  const businessObj = req.body;
  businessModel
    .editBusiness(id, businessObj)
    .then((business) => res.status(200).json(business))
    .catch((err) => res.status(500).json(err));
};

module.exports = editBusinessHandler;
