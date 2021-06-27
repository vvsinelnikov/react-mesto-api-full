const { REGEX_LINK = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=[\]!$&'()*,;]*)/i } = process.env;
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, createUser, updateProfile, getMyProfile, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(REGEX_LINK),
  }),
}), createUser);

router.get('/me', getMyProfile);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(REGEX_LINK),
  }),
}), updateAvatar);

router.get('/:userId', getUser);

module.exports = router;
