/* eslint-disable no-console */
const { REGEX_LINK = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=\[\]!\$&'()\*,;]*)/i } = process.env;
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Error400 = require('../errors/400');
const Error401 = require('../errors/401');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Некорректный адрес электронной почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    // required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    // required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: { // ссылка на изображение
    type: String,
    // required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return REGEX_LINK.test(v);
      },
      message: 'Ссылка введена неверно',
    },
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  if (!email) { return Promise.reject(new Error400('Не введена почта')); }
  if (!password) { return Promise.reject(new Error400('Не введен пароль')); }
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) { return Promise.reject(new Error401('Неправильные почта или пароль')); }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { return Promise.reject(new Error401('Неправильные почта или пароль')); }
          return user;
        });
    });
};

module.exports = mongoose.model('User', userSchema);
