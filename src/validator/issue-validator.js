import InvalidIssueProperty from '../errors/invalid-issue';

const STATUS_OPEN = 'open';
const STATUS_PENDING = 'pending';
const STATUS_CLOSE = 'close';
const EMPTY_TITLE = 'Passed title is empty';

export const isRecordValid = (body) => {
    if (body.title) {
        return true;
    }

    throw new InvalidIssueProperty(EMPTY_TITLE);
};

export const validStatusChange = (current, updated) => {
    if (current === STATUS_OPEN && updated === STATUS_CLOSE) {
        return false;
    }

    if (current === STATUS_PENDING && updated === STATUS_OPEN) {
        return false;
    }

    return current !== STATUS_CLOSE;
};

export default {isRecordValid, validStatusChange};
