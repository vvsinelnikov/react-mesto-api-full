class Error409 extends Error {
  constructor(message) {
    super(message || 'Возник конфликт');
    this.statusCode = 409;
  }
}

module.exports = Error409;
