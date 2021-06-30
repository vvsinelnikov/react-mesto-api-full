const { NODE_ENV, JWT_SECRET, SALT_ROUNDS } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Error404 = require('../errors/404');
const Error409 = require('../errors/409');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => { next(err); });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) { throw new Error404('Пользователь не найден'); }
      return res.send(user);
    })
    .catch((err) => { next(err); });
};

module.exports.getMyProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) { throw new Error404('Пользователь не найден'); }
      return res.send(user);
    })
    .catch((err) => { next(err); });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => {
      if (!user) { throw new Error404('Пользователь не найден'); }
      return res.send(user);
    })
    .catch((err) => { next(err); });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) { throw new Error404('Пользователь не найден'); }
      return res.send(user);
    })
    .catch((err) => { next(err); });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  User.find({ email })
    .then((user) => { if (user.length > 0) { throw new Error409('Пользователь уже существует'); } })
    .then(() => {
      // return bcrypt.hash(password, NODE_ENV === 'production' ? SALT_ROUNDS : 8)
      return bcrypt.hash(password, 8)
    })
    .then((hash) => {
      return User.create({
        email, password: hash, name, about, avatar,
      })
    })
    .then((user) => {
      return res.send({
        id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      })
    })
    .catch((err) => { next(err); });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'vv-secret-key',
        { expiresIn: '7d' },
      );
      return token;
    })
    .then((token) => {
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        // sameSite: 'None',
        secure: true,
        httpOnly: true,
      }).end();
    })
    .catch((err) => { next(err); });
};

module.exports.logout = (req, res, next) => {
  // res.clearCookie('jwt').send({'ok': 'ok'});
  res.cookie('jwt', '', {
    expires: new Date(Date.now() + 50),
    httpOnly: true,
    // expires: Date.now(),
  }).send({'ok': 'ok'});
};