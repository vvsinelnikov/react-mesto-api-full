class Error400 extends Error {
  constructor(message) {
    super(message || 'Некорректные данные');
    this.statusCode = 400;
  }
}

module.exports = Error400;
