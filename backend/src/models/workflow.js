class Workflow {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.active = data.active;
    this.status = data.status || 'idle';
    this.lastExecutionTime = data.lastExecutionTime || null;
    this.lastExecutionStatus = data.lastExecutionStatus || null;
    this.executionCount = data.executionCount || 0;
    this.errorCount = data.errorCount || 0;
    this.averageExecutionTime = data.averageExecutionTime || null;
  }

  validate() {
    const errors = [];

    if (!this.id || typeof this.id !== 'string') {
      errors.push('id must be a non-empty string');
    }

    if (!this.name || this.name.length < 1 || this.name.length > 100) {
      errors.push('name must be between 1 and 100 characters');
    }

    if (typeof this.active !== 'boolean') {
      errors.push('active must be a boolean');
    }

    if (!['idle', 'running', 'error', 'disabled'].includes(this.status)) {
      errors.push('status must be one of: idle, running, error, disabled');
    }

    if (
      this.lastExecutionStatus &&
      !['success', 'error', 'cancelled', 'running'].includes(this.lastExecutionStatus)
    ) {
      errors.push('lastExecutionStatus must be one of: success, error, cancelled, running');
    }

    if (this.executionCount < 0 || this.errorCount < 0) {
      errors.push('executionCount and errorCount must be non-negative');
    }

    if (this.averageExecutionTime !== null && this.averageExecutionTime <= 0) {
      errors.push('averageExecutionTime must be positive or null');
    }

    return errors;
  }

  isValid() {
    return this.validate().length === 0;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      active: this.active,
      status: this.status,
      lastExecutionTime: this.lastExecutionTime,
      lastExecutionStatus: this.lastExecutionStatus,
      executionCount: this.executionCount,
      errorCount: this.errorCount,
      averageExecutionTime: this.averageExecutionTime,
    };
  }
}

module.exports = Workflow;
