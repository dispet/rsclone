module.exports = (status, success, message, data) => {
  // eslint-disable-next-line no-sequences
    this.status = status,
    this.success = success,
    this.message = message,
    this.data = data
    return this
}

