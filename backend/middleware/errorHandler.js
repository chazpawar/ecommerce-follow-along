const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!", details: err.message });
  };
  
  module.exports = errorHandler;