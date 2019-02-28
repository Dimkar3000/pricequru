module.exports = (req, res, next) => {
  if (req.query.format && req.query.format.toLowerCase() !== "json") {
    res.status(400).send("Only JSON format is supported.");
  }

  next();
};
