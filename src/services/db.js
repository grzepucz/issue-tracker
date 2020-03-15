import mongoose from 'mongoose';
import Issue from '../model/issue';

const STATUS_OPEN = 'open';
const STATUS_PENDING = 'pending';
const STATUS_CLOSE = 'close';

const connectDb = () => {
    mongoose.connect(process.env.DATABASE_URL || "mongodb://localhost/schibsted", { useNewUrlParser: true });
    return mongoose.connection
        .on('error', (error) => console.error(error))
        .once('open', () => console.log('connected to database'))
        .once('close', () => console.log('database closed'));
};

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
            let response = {};
            await connectDb()
                .then(async (db) => {
                    const issue = new Issue({
                        title: record.title,
                        description: record.description || '',
                        status: record.status || 'open',
                    });

                    response = await issue.save();
                    db.close();
                });
            return response;
        } catch (err) {
            console.log(err);
        }
    }
};

export const getAllRecords = async () => {
    try {
        let recordList = [];
        await connectDb().then(async db => {
            recordList = await Issue.find();
            db.close();
        });
        return recordList;
    } catch (error) {
        return error;
    }
};

export const getRecord = async (id) => {
    if (id) {
        try {
            let record = {};
            await connectDb().then(async db => {
                record = await Issue.findById(id);
                db.close();
            });
            return record;
        } catch (error) {
            return error;
        }
    }
};

export const deleteRecord = async (id) => {
    if (id) {
        try {
            await connectDb().then(async db => {
                const issue = await Issue.findById(id);
                await issue.remove();
                db.close();
            });
            return id;
        } catch (error) {
            return error;
        }
    }
};

export const updateRecord = async (id, updated) => {
    if (isRecordValid(updated)) {
        try {
            let record = {};
            await connectDb().then(async db => {
                let currentIssue = await Issue.findById(id);

                currentIssue.title = updated.title || currentIssue.title;
                currentIssue.description = updated.description || currentIssue.description;
                currentIssue.status = (updated.status && validStatusChange(currentIssue.status, updated.status))
                    ? updated.status
                    : currentIssue.status;

                record = await currentIssue.save();
                db.close();
            });
            return record;
        } catch (error) {
            return error;
        }
    }
};


export default { addRecord, getRecord, deleteRecord, updateRecord };
