import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
    },
});

module.exports = mongoose.model('issue', issueSchema);
