// eslint-disable-next-line no-unused-vars
const errorSender = (err, req, res, next) => {
  if (err.name === 'CastError') { return res.status(400).send({ message: `Некорректный ID (${err.message})` }); }
  if (err.name === 'ValidationError') { return res.status(400).send({ message: `Некорректно заполнены данные (${err.message})` }); }
  // eslint-disable-next-line no-param-reassign
  if (!err.statusCode) { err.statusCode = 500; }
  return res.status(err.statusCode).send({ message: err.message });
}

module.exports = errorSender;