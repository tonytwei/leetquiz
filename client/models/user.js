const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    oauth_id: {
        type: String,
        required: true
    },
    questionCookie: {
      type: Map,
      of: {
        completed: Boolean,
        saved: Boolean
      }
    }
});

module.exports = mongoose.model('User', userSchema);
