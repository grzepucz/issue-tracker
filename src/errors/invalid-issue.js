const STATUS_CODE = 400;
const DEFAULT_MESSAGE = 'Invalid request. Please verify data.';

class InvalidIssueProperty extends Error {
    constructor(message) {
        super(message);

        this.status = STATUS_CODE;
        this.message = message || DEFAULT_MESSAGE;
        this.name = this.constructor.name;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

export default InvalidIssueProperty;
