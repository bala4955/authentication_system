exports.check = (req, res) => {
  // logger.info("user route");
  res.status(200).send(process.env.API_WORKS_MESSAGE);
};
