const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    oauth_id: {
        type: String,
        required: true
    },
    finishedQuestions: {
        type: [String],
        required: true
    },
    savedQuestions: {
        type: [String],
        required: true
    },
});

module.exports = mongoose.model('User', userSchema);
