const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exampleSchema = new Schema({
    input: {
        type: String,
        required: true
    },
    output: {
        type: String,
        required: true
    }
});

const questionPartSchema = new Schema({
    questionText: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    }
});

const questionSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    topics: {
        type: [String],
        required: true
    },
    examples: {
        type: [exampleSchema],
        required: false
    },
    constraints: {
        type: [String],
        required: false
    },
    questions: {
        type: [questionPartSchema],
        required: true
    }
});

module.exports = mongoose.model('Question', questionSchema);
