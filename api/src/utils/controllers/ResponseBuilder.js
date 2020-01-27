export default class ResponseBuilder {
  constructor() {
    this.statusCode = null;
    this.type = null;
    this.data = null;
    this.message = null;
  }

  setSuccess(statusCode, message, data) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.type = 'success';
  }

  setRedirection(statusCode, redirectUrl) {
    this.statusCode = statusCode;
    this.redirectUrl = redirectUrl;
    this.type = 'redirect';
  }

  setError(statusCode, message) {
    this.statusCode = statusCode;
    this.message = message;
    this.type = 'error';
  }

  send(res) {
    if (this.type === 'redirect') {
      return res.status(this.statusCode).redirect(this.redirectUrl);
    }

    const result = {
      status: this.type,
      message: this.message,
    };

    if (this.type === 'success') {
      result.data = this.data;
    }

    return res.status(this.statusCode).json(result);
  }
}
