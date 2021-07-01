const regexp_link = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=\[\]!\$&'()\*,;]*)/i;
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
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
  params: Joi.objectId(),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.objectId(),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.objectId(),
}), dislikeCard);

module.exports = router;
