/* eslint-disable no-console */
require('dotenv').config();
const { NODE_ENV, PORT } = process.env;
const regexp_link = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=\[\]!\$&'()\*,;]*)/i;
const express = require('express');
const mongoose = require('mongoose');
const router = require('express').Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors, celebrate, Joi } = require('celebrate');
// const path = require('path'); для раздачи статики
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const Error404 = require('./errors/404');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// раздача статики
//app.use(express.static(path.join(__dirname, 'public')));

// разрешаем CORS
//app.options('/signin', cors())
//app.options('/signup', cors())
//app.options('*', cors())
//app.use(cors())
const allowedCors = [
  'http://mesto-vv.nomoredomains.monster',
  'https://mesto-vv.nomoredomains.monster',
  'http://api.mesto-vv.nomoredomains.monster',
  'https://api.mesto-vv.nomoredomains.monster',
];
app.use(function(req, res, next) {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) { res.header('Access-Control-Allow-Origin', origin); }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.send(origin);
  next();
});

// сбор логов
app.use(requestLogger);

// основные роуты
app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

// проверка восстановления сервера pm2
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// логин
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// регистрация
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regexp_link),
  }),
}), createUser);

// неопознанный маршрут
app.use('/*', router);

router.get('/*', (req, res, next) => {
  // console.log('(app router.get) 404: Ресурс не найден');
  next(new Error404('Ресурс не найден'));
});
router.post('/*', (req, res, next) => {
  // console.log('(app router.post) 404: Ресурс не найден');
  next(new Error404('Ресурс не найден'));
});

// *** Централизованная обработка ошибок ***
// логгирование ошибок
app.use(errorLogger);

// обработка ошибок celebrate
app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.name === 'CastError') { return res.status(400).send({ message: `Некорректный ID (${err.message})` }); }
  if (err.name === 'ValidationError') { return res.status(400).send({ message: `Некорректно заполнены данные (${err.message})` }); }
  // eslint-disable-next-line no-param-reassign
  if (!err.statusCode) { err.statusCode = 500; }
  return res.status(err.statusCode).send({ message: err.message });
});

app.listen(NODE_ENV === 'production' ? PORT : 3000, () => {
  console.log(`Hello. App listening on port ${NODE_ENV === 'production' ? PORT : 3000}`);
});
