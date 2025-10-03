class Execution {
  constructor(data) {
    this.id = data.id;
    this.workflowId = data.workflowId;
    this.status = data.status;
    this.startTime = data.startTime;
    this.endTime = data.endTime || null;
    this.duration = data.duration || null;
    this.mode = data.mode || 'manual';
    this.retryOf = data.retryOf || null;
    this.errorMessage = data.errorMessage || null;
  }

  validate() {
    const errors = [];

    if (!this.id || typeof this.id !== 'string') {
      errors.push('id must be a non-empty string');
    }

    if (!this.workflowId || typeof this.workflowId !== 'string') {
      errors.push('workflowId must be a non-empty string');
    }

    if (!['running', 'success', 'error', 'cancelled'].includes(this.status)) {
      errors.push('status must be one of: running, success, error, cancelled');
    }

    if (!this.startTime) {
      errors.push('startTime is required');
    }

    if (this.endTime && this.startTime) {
      const start = new Date(this.startTime);
      const end = new Date(this.endTime);
      if (end < start) {
        errors.push('endTime must be after startTime');
      }
    }

    if (this.duration !== null && this.duration <= 0) {
      errors.push('duration must be positive if execution completed');
    }

    return errors;
  }

  isValid() {
    return this.validate().length === 0;
  }

  toJSON() {
    return {
      id: this.id,
      workflowId: this.workflowId,
      status: this.status,
      startTime: this.startTime,
      endTime: this.endTime,
      duration: this.duration,
      mode: this.mode,
      retryOf: this.retryOf,
      errorMessage: this.errorMessage,
    };
  }
}

module.exports = Execution;
