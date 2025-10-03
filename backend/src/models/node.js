class Node {
  constructor(data) {
    this.name = data.name;
    this.type = data.type;
    this.executionStatus = data.executionStatus;
    this.startTime = data.startTime || null;
    this.endTime = data.endTime || null;
    this.executionTime = data.executionTime || null;
    this.inputData = data.inputData || null;
    this.outputData = data.outputData || null;
    this.errorDetails = data.errorDetails || null;
  }

  validate() {
    const errors = [];

    if (!this.name || typeof this.name !== 'string') {
      errors.push('name must be a non-empty string');
    }

    if (!this.type || typeof this.type !== 'string') {
      errors.push('type must be a non-empty string');
    }

    if (!['success', 'error', 'skipped', 'running'].includes(this.executionStatus)) {
      errors.push('executionStatus must be one of: success, error, skipped, running');
    }

    if (this.endTime && this.startTime) {
      const start = new Date(this.startTime);
      const end = new Date(this.endTime);
      if (end < start) {
        errors.push('endTime must be after startTime');
      }
    }

    if (this.executionTime !== null && this.executionTime <= 0) {
      errors.push('executionTime must be positive if node completed');
    }

    return errors;
  }

  isValid() {
    return this.validate().length === 0;
  }

  toJSON() {
    return {
      name: this.name,
      type: this.type,
      executionStatus: this.executionStatus,
      startTime: this.startTime,
      endTime: this.endTime,
      executionTime: this.executionTime,
      inputData: this.inputData,
      outputData: this.outputData,
      errorDetails: this.errorDetails,
    };
  }
}

module.exports = Node;
