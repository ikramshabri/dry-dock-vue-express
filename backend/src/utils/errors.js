class HttpError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

class NotFoundError extends HttpError {
  constructor(message = 'Data tidak ditemukan') {
    super(404, message);
  }
}

class ValidationError extends HttpError {
  constructor(details) {
    super(422, 'Data tidak valid', details);
  }
}

module.exports = { HttpError, NotFoundError, ValidationError };
