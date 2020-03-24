import Issue from '../model/issue';
import IssueValidator from '../validator/issue-validator';

export const addRecord = async (record) => {
    if (IssueValidator.isRecordValid(record)) {
        const issue = new Issue({
            title: record.title,
            description: record.description || '',
            status: record.status || 'open',
        });

        return await issue.save();
    }
};

export const getAllRecords = async () => {
    return await Issue.find();
};

export const getRecord = async (id) => {
    return await Issue.findById(id);
};

export const deleteRecord = async (id) => {
    return Issue.findById(id).then(issue => issue.remove());
};

export const updateRecord = async (id, updated) => {
    if (IssueValidator.isRecordValid(updated)) {
        return Issue.findById(id)
            .then(currentIssue => {
                currentIssue.title = updated.title || currentIssue.title;
                currentIssue.description = updated.description || currentIssue.description;
                currentIssue.status = (updated.status && IssueValidator.validStatusChange(currentIssue.status, updated.status))
                    ? updated.status
                    : currentIssue.status;
                return currentIssue.save();
            });
    }
};


export default { addRecord, getRecord, deleteRecord, updateRecord };
