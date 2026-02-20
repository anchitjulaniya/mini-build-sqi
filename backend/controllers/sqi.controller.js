const { computeSQI } = require("../services/sqi.service");

exports.compute = (req, res) => {
  const result = computeSQI(req.body);
  res.json(result);
};