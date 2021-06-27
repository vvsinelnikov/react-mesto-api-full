class Error403 extends Error {
  constructor(message) {
    super(message || 'Некорректные данные');
    this.statusCode = 403;
  }
}

module.exports = Error403;
