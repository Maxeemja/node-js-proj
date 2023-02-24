class NodeCourseError extends Error {
  constructor(message) {
    super(message);
    this.status = 500;
  }
}

class InvalidRequestError extends NodeCourseError {
  constructor(message = 'Invalid request', status=400) {
    super(message);
    this.status = status;
  }
}

module.exports = {
  NodeCourseError,
  InvalidRequestError,
};
