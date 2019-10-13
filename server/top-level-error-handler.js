/**
 * NodeJS sends back all sorts of system information in it's default error message, which we do not like.
 * @param err
 * @param req
 * @param res
 */
module.exports = {
  topLevelErrorHandler: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke :-(");
    next();
  },
};
