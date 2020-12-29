const businessModel = require("../model/businessModel");
const userModel = require("../model/userModel");

/*
{
    businessId: ... ,
}
*/
const add = (req, res) => {
  const userid = req;
  const { businessId } = req.body;
  businessModel.getBusiness().then((businesses) => console.log(businesses));
};

const del = (req, res) => {};

module.exports = {
  add,
  del,
};
