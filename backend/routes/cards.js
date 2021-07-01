const regexp_link = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=\[\]!\$&'()\*,;]*)/i;
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
// const { validateCreateCard } = require('../middlewares/validator');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regexp_link),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  params: Joi.string().hex().min(24).max(24),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.string().hex().min(24).max(24),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.string().hex().min(24).max(24),
}), dislikeCard);

module.exports = router;
