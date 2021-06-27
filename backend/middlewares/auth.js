const { JWT_SECRET = 'vv-secret-key' } = process.env;

const jwt = require('jsonwebtoken');
const Error401 = require('../errors/401');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new Error401('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
