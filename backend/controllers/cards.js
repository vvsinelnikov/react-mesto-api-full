const Card = require('../models/card');
const Error403 = require('../errors/403');
const Error404 = require('../errors/404');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => { res.send(cards); })
    .catch((err) => { next(err); });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => { res.send(card); })
    .catch((err) => { next(err); });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) { throw new Error404('Карточка не найдена'); }
      return card;
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) { throw new Error403('Можно удалять только свои карточки'); }
      return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((card) => { res.send(card); })
    .catch((err) => { next(err); });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true, runValidators: true })
    .then((card) => {
      if (!card) { throw new Error404('Карточка не найдена'); }
      return res.send(card);
    })
    .catch((err) => { next(err); });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true, runValidators: true })
    .then((card) => {
      if (!card) { throw new Error404('Карточка не найдена'); }
      return res.send(card);
    })
    .catch((err) => { next(err); });
};
