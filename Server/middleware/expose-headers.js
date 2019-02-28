module.exports = (req, res, next) => {
  res.set("Access-Control-Expose-Headers", "X-OBSERVATORY-AUTH");
  next();
};
