const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    googleID: {
        type: String,
        required: true
    },
    username: {
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
