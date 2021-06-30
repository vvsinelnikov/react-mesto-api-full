const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');
const Error401 = require('../errors/401');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'vv-secret-key');
  } catch (err) {
    next(new Error401('Необходима авторизация'));
  }
  res.status(200).send('ok');
  req.user = payload;
  next();
};
