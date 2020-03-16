import mongoose from 'mongoose';
import Issue from '../model/issue';

const STATUS_OPEN = 'open';
const STATUS_PENDING = 'pending';
const STATUS_CLOSE = 'close';

const isRecordValid = (body) => {
    return body.title;
};

const validStatusChange = (current, updated) => {
    if (current === STATUS_OPEN && updated === STATUS_CLOSE) {
        return false;
    }
    if (current === STATUS_PENDING && updated === STATUS_OPEN) {
        return false;
    }
    return current !== STATUS_CLOSE;
};

export const addRecord = async (record) => {
    if (isRecordValid(record)) {
        try {
            const issue = new Issue({
                title: record.title,
                description: record.description || '',
                status: record.status || 'open',
            });

            return await issue.save();
        } catch (err) {
            console.log(err);
        }
    }
};

export const getAllRecords = async () => {
    try {
        return await Issue.find();
    } catch (error) {
        return error;
    }
};

export const getRecord = async (id) => {
    if (id) {
        try {
            return await Issue.findById(id);
        } catch (error) {
            return error;
        }
    }
};

export const deleteRecord = async (id) => {
    if (id) {
        try {
            const issue = await Issue.findById(id);
            return await issue.remove();
        } catch (error) {
            return error;
        }
    }
};

export const updateRecord = async (id, updated) => {
    if (isRecordValid(updated)) {
        try {
            let currentIssue = await Issue.findById(id);

            currentIssue.title = updated.title || currentIssue.title;
            currentIssue.description = updated.description || currentIssue.description;
            currentIssue.status = (updated.status && validStatusChange(currentIssue.status, updated.status))
                ? updated.status
                : currentIssue.status;

            return await currentIssue.save();
        } catch (error) {
            return error;
        }
    }
};


export default { addRecord, getRecord, deleteRecord, updateRecord };
