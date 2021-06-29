const { NODE_ENV } = process.env;
const regexp_link = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=\[\]!\$&'()\*,;]*)/i;
const mongoose = require('mongoose');
const user = require('./user');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: { // ссылка на изображение
    type: String,
    required: true,
    validate: {
      validator(v) {
        return regexp_link.test(v);
      },
      message: 'Ссылка введена неверно',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: user,
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: user,
    default: {},
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
