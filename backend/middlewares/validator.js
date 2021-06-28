const { REGEX_LINK } = process.env;
const regexp_link = NODE_ENV === 'production' ? REGEX_LINK : /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=\[\]!\$&'()\*,;]*)/i;
const validator = require('validator');
const Error400 = require('../errors/400');

module.exports.validateCreateUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  if (!email) { throw new Error400('Электронная почта не заполнена'); }
  if (!validator.isEmail(email)) { throw new Error400('Электронная почта заполнена неверно'); }
  if (!password) { throw new Error400('Пароль не заполнен'); }
  if (name) {
    if (typeof name !== 'string' || name.length < 2 || name.length > 30) {
      throw new Error400('Имя заполнено неверно');
    }
  }
  if (about) {
    if (typeof about !== 'string' || about.length < 2 || about.length > 30) {
      throw new Error400('Описание заполнено неверно');
    }
  }
  if (avatar) {
    if (!avatar) { throw new Error400('Ссылка на аватар не заполнена'); }
    if (typeof avatar !== 'string' || !regexp_link.test(avatar)) { throw new Error400('Ссылка на аватар неверно заполнена'); }
  }
  next();
};

module.exports.validateUpdateProfile = (req, res, next) => {
  const { name, about } = req.body;
  if (!name && !about) { throw new Error400('Ничего не заполнено'); }
  if (name) {
    if (typeof name !== 'string' || name.length < 2 || name.length > 30) {
      throw new Error400('Имя заполнено неверно');
    }
  }
  if (about) {
    if (typeof about !== 'string' || about.length < 2 || about.length > 30) {
      throw new Error400('Описание заполнено неверно');
    }
  }
  next();
};

module.exports.validateUpdateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  if (!avatar) { throw new Error400('Ссылка на аватар не заполнена'); }
  if (typeof avatar !== 'string' || !regexp_link.test(avatar)) { throw new Error400('Ссылка на аватар неверно заполнена'); }
  next();
};

module.exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !validator.isEmail(email)) { throw new Error400('Электронная почта не заполнена или заполнена неверно'); }
  if (!password) { throw new Error400('Пароль не заполнен'); }
  next();
};

module.exports.validateCreateCard = (req, res, next) => {
  const { name, link } = req.body;
  if (!name) { throw new Error400('Название не заполнено'); }
  if (!link) { throw new Error400('Ссылка не заполнена'); }
  if (name) {
    if (typeof name !== 'string' || name.length < 2 || name.length > 30) {
      throw new Error400('Название заполнено неверно');
    }
  }
  if (link) {
    if (typeof link !== 'string' || !regexp_link.test(link)) {
      throw new Error400('Ссылка заполнена неверно');
    }
  }
  next();
};
