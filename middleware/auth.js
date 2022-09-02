const jwt = require('jsonwebtoken');
const auth = async (req, res, next) => {
  try {
    const token = req.headers['x-auth-token'];
    const decoded = await jwt.verify(token, process.env.SecretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = auth;
